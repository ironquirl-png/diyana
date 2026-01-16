# 🎨 ContentAI - AI-Powered Content Creation Platform

Revolutionize your content creation with AI-powered text and image generation.

## ✨ Features

- 📝 **AI Text Generation** - Create blogs, articles, and social media posts using GPT-5.2
- 🖼️ **AI Image Generation** - Generate stunning visuals with OpenAI GPT Image 1
- 👤 **User Authentication** - Secure JWT-based authentication
- 📚 **Content History** - Save and manage all your generated content
- 💾 **Export Functionality** - Download as PDF, TXT, or PNG
- 🎨 **Modern UI** - Beautiful, colorful design with smooth animations

## 🚀 Quick Start

### Prerequisites
- Node.js (v18+)
- Python (v3.11+)
- MongoDB
- Yarn package manager

### Installation

1. **Clone/Download the project**

2. **Backend Setup:**
```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
```

3. **Configure backend/.env:**
```env
MONGO_URL="mongodb://localhost:27017"
DB_NAME="contentai_db"
CORS_ORIGINS="*"
EMERGENT_LLM_KEY=sk-emergent-9FdD8Ab95061d3a4c7
JWT_SECRET=your-secret-key-change-in-production-12345678
```

4. **Start Backend:**
```bash
uvicorn server:app --host 0.0.0.0 --port 8001 --reload
```

5. **Frontend Setup (new terminal):**
```bash
cd frontend
yarn install
```

6. **Configure frontend/.env:**
```env
REACT_APP_BACKEND_URL=http://localhost:8001
```

7. **Start Frontend:**
```bash
yarn start
```

8. **Open browser:** `http://localhost:3000`

## 📖 Full Documentation

See [LOCAL_SETUP_GUIDE.md](LOCAL_SETUP_GUIDE.md) for detailed setup instructions.

## 🛠️ Tech Stack

**Frontend:**
- React 19
- Tailwind CSS
- Framer Motion
- Shadcn/UI Components
- Axios

**Backend:**
- FastAPI
- MongoDB (Motor)
- JWT Authentication
- OpenAI GPT-5.2 (via Emergent Integrations)
- OpenAI GPT Image 1

## 🎯 Usage

1. **Sign Up/Login** - Create an account or login
2. **Generate Text** - Choose content style (blog/article/social) and enter prompt
3. **Generate Images** - Describe your image and wait 30-60 seconds
4. **View History** - Access all your generated content
5. **Export** - Download as PDF, TXT, or PNG

## 🌐 Deployment

### Frontend (Netlify)
- Build: `yarn build`
- Deploy: Connect GitHub repo to Netlify
- Environment: Set `REACT_APP_BACKEND_URL` to production backend

### Backend (Heroku/Railway/Render)
- Deploy FastAPI app
- Set environment variables
- Update frontend with production backend URL

## 📝 API Endpoints

- `POST /api/auth/signup` - Create account
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Get current user
- `POST /api/generate/text` - Generate text content
- `POST /api/generate/image` - Generate image
- `GET /api/contents` - Get content history
- `DELETE /api/contents/{id}` - Delete content

## 🔑 Environment Variables

See [LOCAL_SETUP_GUIDE.md](LOCAL_SETUP_GUIDE.md) for full list of required environment variables.

## 📄 License

MIT License - Feel free to use for personal or commercial projects.

## 🤝 Support

For issues or questions, please refer to the setup guide or create an issue.

---

**Built with ❤️ using Emergent AI Platform**