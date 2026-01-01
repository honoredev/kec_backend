# Render Deployment Guide

## Prerequisites
- GitHub repository with your code
- Render account (free tier available)

## Deployment Steps

### 1. Push to GitHub
```bash
git add .
git commit -m "Prepare for Render deployment"
git push origin main
```

### 2. Create New Web Service on Render
1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Configure the service:
   - **Name**: kec-backend
   - **Environment**: Node
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`

### 3. Environment Variables
Add these in Render dashboard under "Environment":
```
NODE_ENV=production
DATABASE_URL=your_supabase_database_url
DIRECT_URL=your_supabase_direct_url
CLOUDINARY_CLOUD_NAME=dlgcdhhon
CLOUDINARY_API_KEY=377454149942816
CLOUDINARY_API_SECRET=HMDfUrQ64d5eSjwC1k7Jwa09Pa0
```

### 4. Update CORS Origins
After deployment, update the CORS origins in server.js with your actual frontend domain.

### 5. Database Migration
Your database is already set up with Supabase, so no additional migration needed.

## Important Notes
- Free tier has limitations (750 hours/month)
- Service sleeps after 15 minutes of inactivity
- First request after sleep may be slow (cold start)
- SSL is automatically provided

## Health Check
Your API will be available at: `https://your-service-name.onrender.com`
Health check endpoint: `https://your-service-name.onrender.com/health`