# 🚀 Vercel Deployment Guide

## 📋 Deployment Steps

### 1. Install Vercel CLI
```bash
npm i -g vercel
```

### 2. Login to Vercel
```bash
vercel login
```

### 3. Deploy from Project Root
```bash
cd Nutech
vercel
```

### 4. Environment Variables
Set these in Vercel dashboard or CLI:
- `MONGODB_URI` - Your MongoDB connection string

### 5. Production URL
Your app will be available at: `https://your-app.vercel.app`

---

## 🔧 Configuration Files Added

### `vercel.json`
- Frontend: React build deployment
- Backend: Node.js serverless functions
- API routing: `/api/*` → backend
- Static routing: `/*` → frontend

### Package Updates
- Added `vercel-build` scripts
- Configured for Vercel deployment

---

## 📱 Mobile Access on Vercel

Once deployed, the app works on mobile at:
`https://your-app.vercel.app`

Features available:
- ✅ QR scanning (HTTPS required for camera)
- ✅ Mobile responsive design
- ✅ PWA installable
- ✅ Touch interactions

---

## 🗄️ MongoDB Setup

### Option 1: MongoDB Atlas (Recommended)
1. Create free account: https://www.mongodb.com/atlas
2. Create cluster
3. Get connection string
4. Add to Vercel environment variables

### Option 2: Local MongoDB
Not available on Vercel (serverless)

---

## 🚀 Quick Deploy Commands

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel --prod

# Link to existing project
vercel link

# Redeploy after changes
vercel --prod
```

---

## 🔍 Troubleshooting

### Build Errors
- Check `vercel.json` syntax
- Verify package.json scripts
- Ensure MongoDB URI is set

### API Errors
- Check environment variables
- Verify MongoDB connection
- Check API routes in `vercel.json`

### Mobile Issues
- Ensure HTTPS (automatic on Vercel)
- Test camera permissions
- Check responsive design

---

**Ready for Vercel deployment!** 🎯
