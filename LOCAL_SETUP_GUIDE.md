# ContentAI - Local Development Setup Guide

## 📋 Prerequisites

1. **Node.js** (v18+) - https://nodejs.org/
2. **Python** (v3.11+) - https://www.python.org/
3. **MongoDB** - https://www.mongodb.com/try/download/community
4. **VS Code** - https://code.visualstudio.com/
5. **Yarn** - `npm install -g yarn`

---

## 📁 Project Structure

```
contentai-project/
├── backend/                 # Python FastAPI backend
│   ├── server.py           # Main server file
│   ├── requirements.txt    # Python dependencies
│   └── .env               # Environment variables
├── frontend/               # React frontend
│   ├── src/
│   │   ├── App.js
│   │   ├── pages/
│   │   ├── components/
│   │   ├── context/
│   │   └── lib/
│   ├── package.json
│   └── .env               # Frontend environment variables
└── README.md
```

---

## 🚀 Setup Steps

### **Step 1: Backend Setup**

1. **Open Terminal in VS Code** (Ctrl+` or Cmd+`)

2. **Navigate to backend folder:**
   ```bash
   cd backend
   ```

3. **Create Python virtual environment:**
   ```bash
   python -m venv venv
   ```

4. **Activate virtual environment:**
   - **Windows:**
     ```bash
     venv\Scripts\activate
     ```
   - **Mac/Linux:**
     ```bash
     source venv/bin/activate
     ```

5. **Install Python dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

6. **Configure backend/.env file:**
   ```env
   MONGO_URL="mongodb://localhost:27017"
   DB_NAME="contentai_db"
   CORS_ORIGINS="*"
   EMERGENT_LLM_KEY=sk-emergent-9FdD8Ab95061d3a4c7
   JWT_SECRET=your-secret-key-change-in-production-12345678
   ```

7. **Start MongoDB:**
   - **Windows:** Start MongoDB service from Services
   - **Mac:** `brew services start mongodb-community`
   - **Linux:** `sudo systemctl start mongod`
   - **Or use MongoDB Atlas** (cloud) and update MONGO_URL

8. **Run backend server:**
   ```bash
   uvicorn server:app --host 0.0.0.0 --port 8001 --reload
   ```

   Backend will be available at: `http://localhost:8001`

---

### **Step 2: Frontend Setup**

1. **Open a NEW terminal** in VS Code (keep backend running)

2. **Navigate to frontend folder:**
   ```bash
   cd frontend
   ```

3. **Install Node dependencies:**
   ```bash
   yarn install
   ```

4. **Configure frontend/.env file:**
   ```env
   REACT_APP_BACKEND_URL=http://localhost:8001
   ```

5. **Start frontend development server:**
   ```bash
   yarn start
   ```

   Frontend will open automatically at: `http://localhost:3000`

---

## ✅ Verify Installation

1. **Backend health check:**
   ```bash
   curl http://localhost:8001/api/health
   ```
   Should return: `{"status":"ok"}`

2. **Frontend:** Open browser to `http://localhost:3000`

---

## 🎯 Development Workflow

### **Running Both Servers**

You'll need **2 terminal windows** in VS Code:

**Terminal 1 - Backend:**
```bash
cd backend
source venv/bin/activate  # or venv\Scripts\activate on Windows
uvicorn server:app --host 0.0.0.0 --port 8001 --reload
```

**Terminal 2 - Frontend:**
```bash
cd frontend
yarn start
```

### **VS Code Extensions (Recommended)**

- **Python** by Microsoft
- **Pylance** by Microsoft
- **ESLint** by Microsoft
- **Prettier** - Code formatter
- **ES7+ React/Redux/React-Native snippets**
- **Tailwind CSS IntelliSense**

---

## 🐛 Troubleshooting

### **MongoDB Connection Issues**
- Ensure MongoDB is running: `mongod --version`
- Check connection string in `backend/.env`
- Try MongoDB Compass to verify connection

### **Port Already in Use**
- Backend (8001): Kill process using `lsof -ti:8001 | xargs kill -9`
- Frontend (3000): Kill process using `lsof -ti:3000 | xargs kill -9`

### **Module Not Found Errors**
- Backend: Reinstall packages `pip install -r requirements.txt`
- Frontend: Delete `node_modules` and run `yarn install`

### **CORS Errors**
- Verify `REACT_APP_BACKEND_URL` in `frontend/.env`
- Check `CORS_ORIGINS` in `backend/.env`

---

## 📝 Environment Variables Summary

### **backend/.env**
```env
MONGO_URL="mongodb://localhost:27017"
DB_NAME="contentai_db"
CORS_ORIGINS="*"
EMERGENT_LLM_KEY=sk-emergent-9FdD8Ab95061d3a4c7
JWT_SECRET=your-secret-key-change-in-production-12345678
```

### **frontend/.env**
```env
REACT_APP_BACKEND_URL=http://localhost:8001
```

---

## 🌐 For Production/Netlify Deployment

### **Frontend (Netlify)**
1. Build command: `yarn build`
2. Publish directory: `build`
3. Add environment variable: `REACT_APP_BACKEND_URL` pointing to your production backend

### **Backend (Any hosting)**
- Deploy FastAPI backend to Heroku, Railway, Render, or DigitalOcean
- Update frontend `.env` with production backend URL

---

## 🎉 You're All Set!

- Frontend: http://localhost:3000
- Backend API: http://localhost:8001/api
- API Docs: http://localhost:8001/docs (FastAPI auto-generated)

Happy coding! 🚀
