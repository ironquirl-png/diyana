from fastapi import FastAPI, APIRouter, HTTPException, Depends, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict, EmailStr
from typing import List, Optional
import uuid
from datetime import datetime, timezone, timedelta
import jwt
import bcrypt
from emergentintegrations.llm.chat import LlmChat, UserMessage
from emergentintegrations.llm.openai.image_generation import OpenAIImageGeneration
import base64
import asyncio

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# JWT Config
JWT_SECRET = os.environ.get('JWT_SECRET', 'your-secret-key')
JWT_ALGORITHM = "HS256"
JWT_EXPIRATION_HOURS = 24

# LLM Config
EMERGENT_LLM_KEY = os.environ.get('EMERGENT_LLM_KEY')

# Create the main app
app = FastAPI()
api_router = APIRouter(prefix="/api")
security = HTTPBearer()

# Models
class User(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    email: EmailStr
    password_hash: str
    name: str
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class UserCreate(BaseModel):
    email: EmailStr
    password: str
    name: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserResponse(BaseModel):
    id: str
    email: str
    name: str
    created_at: datetime

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse

class Content(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    content_type: str  # "text" or "image"
    prompt: str
    result: str  # text content or base64 image
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class ContentCreate(BaseModel):
    prompt: str
    content_type: str

class TextGenerationRequest(BaseModel):
    prompt: str
    content_style: Optional[str] = "blog"  # blog, article, social

class ImageGenerationRequest(BaseModel):
    prompt: str

# Auth Helper Functions
def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

def verify_password(password: str, password_hash: str) -> bool:
    return bcrypt.checkpw(password.encode('utf-8'), password_hash.encode('utf-8'))

def create_access_token(user_id: str, email: str) -> str:
    payload = {
        "user_id": user_id,
        "email": email,
        "exp": datetime.now(timezone.utc) + timedelta(hours=JWT_EXPIRATION_HOURS)
    }
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)

async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)) -> dict:
    try:
        token = credentials.credentials
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        return payload
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token has expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")

# Auth Routes
@api_router.post("/auth/signup", response_model=TokenResponse)
async def signup(user_data: UserCreate):
    # Check if user exists
    existing_user = await db.users.find_one({"email": user_data.email}, {"_id": 0})
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    # Create user
    password_hash = hash_password(user_data.password)
    user = User(
        email=user_data.email,
        password_hash=password_hash,
        name=user_data.name
    )
    
    user_dict = user.model_dump()
    user_dict['created_at'] = user_dict['created_at'].isoformat()
    
    await db.users.insert_one(user_dict)
    
    # Create token
    token = create_access_token(user.id, user.email)
    
    user_response = UserResponse(
        id=user.id,
        email=user.email,
        name=user.name,
        created_at=user.created_at
    )
    
    return TokenResponse(access_token=token, user=user_response)

@api_router.post("/auth/login", response_model=TokenResponse)
async def login(login_data: UserLogin):
    user = await db.users.find_one({"email": login_data.email}, {"_id": 0})
    if not user:
        raise HTTPException(status_code=401, detail="Invalid email or password")
    
    if not verify_password(login_data.password, user['password_hash']):
        raise HTTPException(status_code=401, detail="Invalid email or password")
    
    # Create token
    token = create_access_token(user['id'], user['email'])
    
    if isinstance(user['created_at'], str):
        user['created_at'] = datetime.fromisoformat(user['created_at'])
    
    user_response = UserResponse(
        id=user['id'],
        email=user['email'],
        name=user['name'],
        created_at=user['created_at']
    )
    
    return TokenResponse(access_token=token, user=user_response)

@api_router.get("/auth/me", response_model=UserResponse)
async def get_me(current_user: dict = Depends(get_current_user)):
    user = await db.users.find_one({"id": current_user['user_id']}, {"_id": 0})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    if isinstance(user['created_at'], str):
        user['created_at'] = datetime.fromisoformat(user['created_at'])
    
    return UserResponse(
        id=user['id'],
        email=user['email'],
        name=user['name'],
        created_at=user['created_at']
    )

# AI Generation Routes
@api_router.post("/generate/text")
async def generate_text(request: TextGenerationRequest, current_user: dict = Depends(get_current_user)):
    try:
        # Create system message based on content style
        style_prompts = {
            "blog": "You are a creative blog writer. Write engaging, informative blog posts with a conversational tone.",
            "article": "You are a professional article writer. Write well-researched, formal articles with clear structure.",
            "social": "You are a social media content creator. Write catchy, concise posts optimized for social media platforms."
        }
        
        system_message = style_prompts.get(request.content_style, style_prompts["blog"])
        
        # Initialize LLM Chat
        chat = LlmChat(
            api_key=EMERGENT_LLM_KEY,
            session_id=f"text_gen_{current_user['user_id']}_{uuid.uuid4()}",
            system_message=system_message
        )
        chat.with_model("openai", "gpt-5.2")
        
        # Generate text
        user_message = UserMessage(text=request.prompt)
        response = await chat.send_message(user_message)
        
        # Save to database
        content = Content(
            user_id=current_user['user_id'],
            content_type="text",
            prompt=request.prompt,
            result=response
        )
        
        content_dict = content.model_dump()
        content_dict['created_at'] = content_dict['created_at'].isoformat()
        
        await db.contents.insert_one(content_dict)
        
        return {
            "id": content.id,
            "content": response,
            "prompt": request.prompt,
            "created_at": content.created_at.isoformat()
        }
        
    except Exception as e:
        logging.error(f"Text generation error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to generate text: {str(e)}")

@api_router.post("/generate/image")
async def generate_image(request: ImageGenerationRequest, current_user: dict = Depends(get_current_user)):
    try:
        # Initialize image generator
        image_gen = OpenAIImageGeneration(api_key=EMERGENT_LLM_KEY)
        
        # Generate image
        images = await image_gen.generate_images(
            prompt=request.prompt,
            model="gpt-image-1",
            number_of_images=1
        )
        
        if not images or len(images) == 0:
            raise HTTPException(status_code=500, detail="No image was generated")
        
        # Convert to base64
        image_base64 = base64.b64encode(images[0]).decode('utf-8')
        
        # Save to database
        content = Content(
            user_id=current_user['user_id'],
            content_type="image",
            prompt=request.prompt,
            result=image_base64
        )
        
        content_dict = content.model_dump()
        content_dict['created_at'] = content_dict['created_at'].isoformat()
        
        await db.contents.insert_one(content_dict)
        
        return {
            "id": content.id,
            "image_base64": image_base64,
            "prompt": request.prompt,
            "created_at": content.created_at.isoformat()
        }
        
    except Exception as e:
        logging.error(f"Image generation error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to generate image: {str(e)}")

# Content History Routes
@api_router.get("/contents")
async def get_contents(current_user: dict = Depends(get_current_user), content_type: Optional[str] = None):
    query = {"user_id": current_user['user_id']}
    if content_type:
        query["content_type"] = content_type
    
    contents = await db.contents.find(query, {"_id": 0}).sort("created_at", -1).to_list(100)
    
    for content in contents:
        if isinstance(content['created_at'], str):
            content['created_at'] = datetime.fromisoformat(content['created_at'])
    
    return contents

@api_router.get("/contents/{content_id}")
async def get_content(content_id: str, current_user: dict = Depends(get_current_user)):
    content = await db.contents.find_one({"id": content_id, "user_id": current_user['user_id']}, {"_id": 0})
    
    if not content:
        raise HTTPException(status_code=404, detail="Content not found")
    
    if isinstance(content['created_at'], str):
        content['created_at'] = datetime.fromisoformat(content['created_at'])
    
    return content

@api_router.delete("/contents/{content_id}")
async def delete_content(content_id: str, current_user: dict = Depends(get_current_user)):
    result = await db.contents.delete_one({"id": content_id, "user_id": current_user['user_id']})
    
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Content not found")
    
    return {"message": "Content deleted successfully"}

# Health check
@api_router.get("/health")
async def health():
    return {"status": "ok"}

# Include router
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
