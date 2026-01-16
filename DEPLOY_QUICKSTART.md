# Netlify Deployment Quick Start

## 🎯 Quick Deploy Steps

### 1. Deploy Backend to Render (5 minutes)

1. Go to https://render.com and sign up
2. Click **"New +"** → **"Web Service"**
3. Connect GitHub or upload project
4. Settings:
   - **Name:** `contentai-backend`
   - **Root Directory:** `backend`
   - **Build Command:** `pip install -r requirements.txt`
   - **Start Command:** `uvicorn server:app --host 0.0.0.0 --port 8001`
5. Add Environment Variables:
   ```
   MONGO_URL=mongodb+srv://user:pass@cluster.mongodb.net/
   DB_NAME=contentai_db
   CORS_ORIGINS=*
   EMERGENT_LLM_KEY=sk-emergent-9FdD8Ab95061d3a4c7
   JWT_SECRET=change-this-secret-key-123
   ```
6. Click **"Create Web Service"**
7. **Copy the URL** (e.g., `https://contentai-backend.onrender.com`)

### 2. Deploy Frontend to Netlify (3 minutes)

1. Go to https://netlify.com and sign up
2. Click **"Add new site"** → **"Import from Git"**
3. Connect GitHub and select repository
4. Settings:
   - **Base directory:** `frontend`
   - **Build command:** `yarn build`
   - **Publish directory:** `frontend/build`
5. Add Environment Variable:
   - **Key:** `REACT_APP_BACKEND_URL`
   - **Value:** `https://contentai-backend.onrender.com` (your backend URL)
6. Click **"Deploy site"**

### 3. Update Backend CORS

Go back to Render → Environment → Update:
```
CORS_ORIGINS=https://your-app-name.netlify.app
```

### 4. Test!

Visit your Netlify URL and test all features!

---

## 📋 Checklist

- [ ] MongoDB Atlas cluster created
- [ ] Backend deployed to Render
- [ ] Backend URL copied
- [ ] Frontend deployed to Netlify
- [ ] Environment variables configured
- [ ] CORS updated with Netlify URL
- [ ] Tested signup/login
- [ ] Tested text generation
- [ ] Tested image generation

**Done! Your app is live! 🚀**

For detailed instructions, see [NETLIFY_DEPLOYMENT.md](NETLIFY_DEPLOYMENT.md)