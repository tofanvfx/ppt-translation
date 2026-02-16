# Deployment Guide

This guide walks you through deploying the v2_translate application to GitHub, Vercel (frontend), and Render (backend).

## Prerequisites

- GitHub account
- Vercel account (sign up at [vercel.com](https://vercel.com))
- Render account (sign up at [render.com](https://render.com))
- Git installed on your computer

## Step 1: Push to GitHub

### 1.1 Initialize Git Repository
```bash
cd "C:\Users\Aveti Learning\Desktop\v2_translate"
git init
git add .
git commit -m "Initial commit: PPTX translator application"
```

### 1.2 Create GitHub Repository
1. Go to [github.com](https://github.com) and log in
2. Click the "+" icon in the top right corner
3. Select "New repository"
4. Name it `v2-translate` (or any name you prefer)
5. Choose Public or Private
6. **Do NOT** initialize with README, .gitignore, or license
7. Click "Create repository"

### 1.3 Push Code
```bash
git remote add origin https://github.com/YOUR-USERNAME/v2-translate.git
git branch -M main
git push -u origin main
```

## Step 2: Deploy Backend to Render

### 2.1 Create Web Service
1. Go to [render.com](https://render.com) and log in
2. Click "New +" and select "Web Service"
3. Connect your GitHub account if not already connected
4. Select your `v2-translate` repository

### 2.2 Configure Service
- **Name**: `v2-translate-backend` (or your choice)
- **Region**: Select closest to your users
- **Branch**: `main`
- **Root Directory**: `backend`
- **Runtime**: `Python 3`
- **Build Command**: `pip install -r requirements.txt`
- **Start Command**: `uvicorn main:app --host 0.0.0.0 --port $PORT`

### 2.3 Environment Variables (Optional)
No environment variables are required for basic operation.

### 2.4 Deploy
1. Click "Create Web Service"
2. Wait for deployment to complete (usually 2-5 minutes)
3. **Copy your backend URL** (e.g., `https://v2-translate-backend.onrender.com`)

## Step 3: Deploy Frontend to Vercel

### 3.1 Import Repository
1. Go to [vercel.com](https://vercel.com) and log in
2. Click "Add New..." → "Project"
3. Import your `v2-translate` repository
4. Select the repository and click "Import"

### 3.2 Configure Project
- **Framework Preset**: Vite (should auto-detect)
- **Root Directory**: `frontend`
- **Build Command**: `npm run build` (auto-detected)
- **Output Directory**: `dist` (auto-detected)

### 3.3 Add Environment Variable
1. In the "Environment Variables" section, add:
   - **Key**: `VITE_API_URL`
   - **Value**: Your Render backend URL (from Step 2.4, e.g., `https://v2-translate-backend.onrender.com`)
2. Make sure it applies to: Production, Preview, and Development

### 3.4 Deploy
1. Click "Deploy"
2. Wait for deployment to complete (usually 1-2 minutes)
3. You'll get a URL like `https://v2-translate.vercel.app`

## Step 4: Verify Deployment

### 4.1 Test the Application
1. Visit your Vercel URL
2. Upload a test PPTX, DOCX, or PDF file
3. Select a target language
4. Click "Translate Now"
5. Verify the translated file downloads correctly

### 4.2 Check Backend Logs (if issues occur)
1. Go to your Render dashboard
2. Select your backend service
3. Click "Logs" tab to view any errors

### 4.3 Check Frontend Logs (if issues occur)
1. Open browser developer tools (F12)
2. Check Console and Network tabs for errors

## Step 5: Update Environment Variables (If Needed)

### Update Vercel Environment Variable
If you need to change the backend URL:
1. Go to your Vercel project
2. Click "Settings" → "Environment Variables"
3. Update `VITE_API_URL`
4. Redeploy from the "Deployments" tab

## Troubleshooting

### CORS Errors
- The backend is configured to allow all origins
- If you still see CORS errors, check the backend logs

### File Upload Fails
- Check that the backend is running (visit backend URL + `/docs` for API documentation)
- Verify the `VITE_API_URL` environment variable in Vercel

### Build Fails
- Check that all dependencies are listed in `package.json` (frontend) and `requirements.txt` (backend)
- Review build logs in Vercel/Render for specific errors

## Important Notes

- **Render Free Tier**: Services may spin down after inactivity. First request after inactivity may take 30-60 seconds.
- **File Size Limits**: Render and Vercel have request size limits (typically 10-50 MB).
- **Automatic Cleanup**: Uploaded files are automatically deleted after translation.

## URLs Summary

After deployment, you'll have:
- **Frontend**: `https://your-project.vercel.app`
- **Backend**: `https://your-backend.onrender.com`
- **GitHub**: `https://github.com/your-username/v2-translate`

## Next Steps

- Set up custom domain in Vercel (optional)
- Enable automatic deployments from GitHub
- Monitor application performance
- Add analytics (optional)
