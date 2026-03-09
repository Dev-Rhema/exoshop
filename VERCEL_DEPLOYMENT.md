# Vercel Serverless Deployment Guide

## Step 1: Push to GitHub
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/exoshop
git push -u origin main
```

## Step 2: Deploy to Vercel
1. Go to [vercel.com](https://vercel.com)
2. Click **"New Project"**
3. Select **"Import Git Repository"**
4. Find and select your GitHub repo (exoshop)
5. Click **"Import"**

## Step 3: Set Environment Variables
In Vercel project settings, add these under **Settings → Environment Variables**:

```
PAYSTACK_SECRET_KEY = sk_test_f70c6fe7b1f2ce32d5a371233cbcca2276693bfa
RESEND_API_KEY = re_DdGN3u5k_2p7KmSYow1b38RgTBiwHyf7o
EMAIL_USER = noreply@exodigital.com
FRONTEND_URL = https://your-vercel-domain.vercel.app
```

## Step 4: Deploy
Click **"Deploy"** - Vercel will build and deploy automatically!

## Step 5: Get Your Domain
After deployment, Vercel will give you a URL like: `https://exoshop-abc123.vercel.app`

Copy this URL and update your local `.env`:
```
VITE_API_URL=https://exoshop-abc123.vercel.app
```

## Step 6: Verify Everything Works
1. Frontend at: `https://exoshop-abc123.vercel.app`
2. API endpoint at: `https://exoshop-abc123.vercel.app/api/verify-payment`
3. Test a payment!

## Step 7: Custom Domain (Optional)
1. In Vercel, go to **Settings → Domains**
2. Add your domain (e.g., `exodigital.com`)
3. Follow DNS instructions from your domain provider
4. Update environment variables to use your custom domain

## Serverless Benefits
✅ No server to maintain
✅ Auto-scales with traffic
✅ Pay only for what you use
✅ Automatic deployments on git push
✅ Built-in SSL/HTTPS
