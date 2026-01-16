# 🚀 Deploy ContentAI to Netlify - Complete Guide

## Overview

**Important:** Netlify hosts **frontend only** (static React apps). You'll need to:
1. Deploy **Frontend** → Netlify
2. Deploy **Backend** → Render/Railway/Heroku (separate service)

---

## Part 1: Prepare Your Backend (Deploy First!)

### Option A: Deploy Backend to Render (Recommended - Free Tier)

1. **Go to [Render.com](https://render.com)** and sign up

2. **Click "New +" → "Web Service"**

3. **Connect your GitHub repository** (or deploy from this project)

4. **Configure:**
   - **Name:** `contentai-backend`
   - **Region:** Choose closest to your users
   - **Branch:** `main`
   - **Root Directory:** `backend`
   - **Runtime:** `Python 3`
   - **Build Command:** 
     ```bash
     pip install -r requirements.txt
     ```
   - **Start Command:**
     ```bash
     uvicorn server:app --host 0.0.0.0 --port 8001
     ```

5. **Add Environment Variables:**
   ```
   MONGO_URL=mongodb+srv://your-mongodb-atlas-url
   DB_NAME=contentai_db
   CORS_ORIGINS=https://your-netlify-app.netlify.app
   EMERGENT_LLM_KEY=sk-emergent-9FdD8Ab95061d3a4c7
   JWT_SECRET=your-secure-random-secret-key-here
   ```

6. **For MongoDB:**
   - Use **MongoDB Atlas** (free tier): https://www.mongodb.com/cloud/atlas
   - Create cluster → Get connection string
   - Replace `<password>` and add to `MONGO_URL`

7. **Click "Create Web Service"**

8. **Copy your backend URL:** (e.g., `https://contentai-backend.onrender.com`)

---

### Option B: Deploy Backend to Railway

1. Go to [Railway.app](https://railway.app)
2. Click "Start a New Project"
3. Select "Deploy from GitHub repo"
4. Select your repository
5. Add environment variables (same as above)
6. Railway will auto-detect Python and deploy
7. Copy your backend URL

---

### Option C: Deploy Backend to Heroku

1. Install Heroku CLI: https://devcenter.heroku.com/articles/heroku-cli
2. Login: `heroku login`
3. Create app: `heroku create contentai-backend`
4. Add buildpack: `heroku buildpacks:set heroku/python`
5. Set env vars: `heroku config:set MONGO_URL=...`
6. Deploy: `git push heroku main`

---

## Part 2: Deploy Frontend to Netlify

### Step 1: Prepare Your Frontend

Create a `netlify.toml` file in your **frontend** folder:

```toml
[build]
  command = "yarn build"
  publish = "build"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

### Step 2: Update Environment Variables

Update `frontend/.env` with your **production backend URL**:

```env
REACT_APP_BACKEND_URL=https://your-backend-url.onrender.com
```

**⚠️ Important:** Remove `/api` from the URL - it will be added automatically in the code.

### Step 3: Deploy to Netlify

#### Method A: Deploy via Netlify Dashboard (Easiest)

1. **Go to [Netlify.com](https://netlify.com)** and sign up

2. **Click "Add new site" → "Deploy manually"**

3. **Build your frontend locally:**
   ```bash
   cd frontend
   yarn build
   ```

4. **Drag and drop the `build` folder** into Netlify

5. **Configure Environment Variables:**
   - Go to Site Settings → Environment Variables
   - Add: `REACT_APP_BACKEND_URL` = `https://your-backend-url.onrender.com`

6. **Redeploy** to apply environment variables

7. **Done!** Your app is live at `https://your-app.netlify.app`

---

#### Method B: Deploy via GitHub (Recommended for Continuous Deployment)

1. **Push your code to GitHub** (if not already)

2. **Go to [Netlify.com](https://netlify.com)** → "Add new site" → "Import from Git"

3. **Connect to GitHub** and select your repository

4. **Configure build settings:**
   - **Base directory:** `frontend`
   - **Build command:** `yarn build`
   - **Publish directory:** `frontend/build`

5. **Add Environment Variable:**
   - Click "Show advanced" → "New variable"
   - **Key:** `REACT_APP_BACKEND_URL`
   - **Value:** `https://your-backend-url.onrender.com`

6. **Click "Deploy site"**

7. **Auto-deployment enabled:** Every push to GitHub will auto-deploy!

---

#### Method C: Deploy via Netlify CLI

1. **Install Netlify CLI:**
   ```bash
   npm install -g netlify-cli
   ```

2. **Login:**
   ```bash
   netlify login
   ```

3. **Navigate to frontend and build:**
   ```bash
   cd frontend
   yarn build
   ```

4. **Deploy:**
   ```bash
   netlify deploy --prod
   ```

5. **Follow prompts and select the `build` folder**

---

## Part 3: Configure Custom Domain (Optional)

1. **Buy a domain** (e.g., from Namecheap, GoDaddy)

2. **In Netlify:**
   - Go to Domain Settings
   - Click "Add custom domain"
   - Enter your domain (e.g., `contentai.com`)

3. **Update DNS records** at your domain registrar:
   ```
   Type: A
   Name: @
   Value: 75.2.60.5 (Netlify's IP)
   
   Type: CNAME
   Name: www
   Value: your-app.netlify.app
   ```

4. **Enable HTTPS:** Netlify provides free SSL certificates

---

## Part 4: Update Backend CORS

After deploying, update your backend `CORS_ORIGINS`:

**On Render/Railway/Heroku:**
```env
CORS_ORIGINS=https://your-app.netlify.app,https://www.your-custom-domain.com
```

This allows your frontend to communicate with the backend.

---

## Part 5: Testing Deployment

1. **Visit your Netlify URL:** `https://your-app.netlify.app`

2. **Test features:**
   - Sign up for an account
   - Generate text content
   - Generate an image (wait 30-60 seconds)
   - Check history
   - Test exports

3. **Check browser console** (F12) for any errors

4. **Test backend directly:**
   ```bash
   curl https://your-backend-url.onrender.com/api/health
   ```
   Should return: `{"status":"ok"}`

---

## 🐛 Common Deployment Issues

### Issue: "Failed to fetch" or CORS errors

**Solution:**
- Check `REACT_APP_BACKEND_URL` in Netlify environment variables
- Verify backend `CORS_ORIGINS` includes your Netlify URL
- Ensure backend is running (visit backend URL directly)

### Issue: Routes return 404

**Solution:**
- Ensure `netlify.toml` has the redirect rule
- Or add in Netlify dashboard: `/* → /index.html (200)`

### Issue: Environment variables not working

**Solution:**
- Redeploy after adding variables in Netlify
- Ensure variable names start with `REACT_APP_`
- Clear Netlify cache and redeploy

### Issue: Build fails on Netlify

**Solution:**
- Check Node.js version (should be v18+)
- Add `.nvmrc` file in frontend folder:
  ```
  18
  ```
- Check build logs for specific errors

### Issue: Image generation timeout

**Solution:**
- This is normal - images take 30-60 seconds
- Ensure backend has sufficient resources (upgrade plan if needed)
- Check backend logs for errors

---

## 📊 Monitoring & Logs

### Netlify Logs:
- Go to Deploys → Click on deployment → View logs

### Backend Logs (Render):
- Go to your service → Logs tab
- Monitor for errors or crashes

---

## 💰 Cost Breakdown

### Free Tier (Perfect for Testing):
- **Netlify:** Free (100GB bandwidth/month)
- **Render:** Free (750 hours/month, sleeps after 15 min inactivity)
- **MongoDB Atlas:** Free (512MB storage)

### Paid Tier (For Production):
- **Netlify Pro:** $19/month (more bandwidth, better performance)
- **Render Starter:** $7/month (always-on, better resources)
- **MongoDB Atlas M10:** $0.08/hour (~$57/month)

---

## 🚀 Deployment Checklist

- [ ] Backend deployed and accessible
- [ ] MongoDB Atlas configured
- [ ] Backend environment variables set
- [ ] Backend CORS configured with Netlify URL
- [ ] Frontend built successfully (`yarn build`)
- [ ] Frontend environment variable set (`REACT_APP_BACKEND_URL`)
- [ ] Frontend deployed to Netlify
- [ ] Test signup/login
- [ ] Test text generation
- [ ] Test image generation
- [ ] Test history and exports
- [ ] Custom domain configured (optional)
- [ ] SSL certificate active

---

## 📞 Need Help?

- **Netlify Docs:** https://docs.netlify.com
- **Render Docs:** https://render.com/docs
- **MongoDB Atlas:** https://www.mongodb.com/docs/atlas/

---

**Your app is production-ready! 🎉**

**Live URLs:**
- Frontend: `https://your-app.netlify.app`
- Backend: `https://your-backend.onrender.com`
- API Docs: `https://your-backend.onrender.com/docs`
