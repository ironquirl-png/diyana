# 📥 How to Download and Run ContentAI Locally in VS Code

## Option 1: Using Git (Recommended)

If your code is on GitHub/GitLab:

```bash
# Clone the repository
git clone <your-repo-url>
cd contentai-project

# Open in VS Code
code .
```

---

## Option 2: Download from Emergent Platform

Since you're on the Emergent platform, you can download the code:

### **Using Emergent CLI or Dashboard:**
1. Go to your Emergent dashboard
2. Navigate to your project
3. Look for "Download Code" or "Export Project" option
4. Download the ZIP file
5. Extract it to your local machine
6. Open the folder in VS Code

---

## Option 3: Manual File Copy

If you need to manually copy files, here's the complete structure:

### **Required Files and Folders:**

```
contentai-project/
│
├── backend/
│   ├── server.py
│   ├── requirements.txt
│   └── .env
│
├── frontend/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/
│   │   │   ├── ui/              # Shadcn components
│   │   │   └── ProtectedRoute.js
│   │   ├── context/
│   │   │   └── AuthContext.js
│   │   ├── lib/
│   │   │   └── api.js
│   │   ├── pages/
│   │   │   ├── Landing.js
│   │   │   ├── Login.js
│   │   │   ├── Signup.js
│   │   │   ├── Dashboard.js
│   │   │   ├── DashboardHome.js
│   │   │   ├── TextGenerator.js
│   │   │   ├── ImageGenerator.js
│   │   │   └── History.js
│   │   ├── App.js
│   │   ├── App.css
│   │   └── index.css
│   ├── package.json
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   └── .env
│
├── README.md
├── LOCAL_SETUP_GUIDE.md
├── start-local.sh         # For Mac/Linux
└── start-local.bat        # For Windows
```

---

## 🚀 Quick Setup After Download

### **1. Open in VS Code**
```bash
cd contentai-project
code .
```

### **2. Install Dependencies**

**Backend:**
```bash
cd backend
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# Mac/Linux:
source venv/bin/activate

pip install -r requirements.txt
```

**Frontend:**
```bash
cd frontend
yarn install
```

### **3. Configure Environment Variables**

**backend/.env:**
```env
MONGO_URL="mongodb://localhost:27017"
DB_NAME="contentai_db"
CORS_ORIGINS="*"
EMERGENT_LLM_KEY=sk-emergent-9FdD8Ab95061d3a4c7
JWT_SECRET=your-secret-key-change-in-production-12345678
```

**frontend/.env:**
```env
REACT_APP_BACKEND_URL=http://localhost:8001
```

### **4. Start MongoDB**

Make sure MongoDB is installed and running on your system.

**Windows:** Start MongoDB service
**Mac:** `brew services start mongodb-community`
**Linux:** `sudo systemctl start mongod`

### **5. Run the Application**

**Option A - Use Start Scripts:**

**Mac/Linux:**
```bash
./start-local.sh
```

**Windows:**
```bash
start-local.bat
```

**Option B - Manual Start (2 terminals):**

**Terminal 1 (Backend):**
```bash
cd backend
source venv/bin/activate  # Windows: venv\Scripts\activate
uvicorn server:app --host 0.0.0.0 --port 8001 --reload
```

**Terminal 2 (Frontend):**
```bash
cd frontend
yarn start
```

### **6. Access the App**
- Frontend: http://localhost:3000
- Backend API: http://localhost:8001
- API Docs: http://localhost:8001/docs

---

## 🎯 VS Code Workspace Setup

### **Recommended VS Code Extensions:**
1. **Python** by Microsoft
2. **Pylance** by Microsoft
3. **ESLint** by Microsoft
4. **Prettier - Code formatter**
5. **Tailwind CSS IntelliSense**
6. **ES7+ React/Redux snippets**

### **Create VS Code Workspace:**

Save this as `contentai.code-workspace`:

```json
{
  "folders": [
    {
      "path": "backend",
      "name": "Backend (Python/FastAPI)"
    },
    {
      "path": "frontend",
      "name": "Frontend (React)"
    }
  ],
  "settings": {
    "python.defaultInterpreterPath": "backend/venv/bin/python",
    "python.linting.enabled": true,
    "python.linting.pylintEnabled": true,
    "editor.formatOnSave": true,
    "editor.codeActionsOnSave": {
      "source.fixAll.eslint": true
    }
  }
}
```

Then open: `File > Open Workspace from File > contentai.code-workspace`

---

## 🐛 Common Issues

### **"Module not found" errors:**
- Backend: Make sure virtual environment is activated
- Frontend: Delete `node_modules` and run `yarn install`

### **MongoDB connection failed:**
- Verify MongoDB is running: `mongod --version`
- Check MongoDB service status
- Try MongoDB Compass to test connection

### **Port already in use:**
- Kill process on port 8001: `lsof -ti:8001 | xargs kill -9`
- Kill process on port 3000: `lsof -ti:3000 | xargs kill -9`

### **CORS errors:**
- Check `REACT_APP_BACKEND_URL` in frontend/.env
- Verify backend is running on port 8001

---

## 📞 Need Help?

1. Check [LOCAL_SETUP_GUIDE.md](LOCAL_SETUP_GUIDE.md) for detailed instructions
2. Check [README.md](README.md) for project overview
3. View backend API docs at http://localhost:8001/docs when running

---

## ✅ Verify Everything Works

1. **Backend health check:**
   ```bash
   curl http://localhost:8001/api/health
   ```
   Should return: `{"status":"ok"}`

2. **Open frontend:** http://localhost:3000
3. **Sign up** for a new account
4. **Generate** some text/images
5. **Check history** - verify content is saved

---

**You're all set! Happy coding! 🚀**
