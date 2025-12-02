# Deployment Guide - Option A (Hybrid Architecture)

## 🏗️ Architecture Overview

```
Frontend (Static Files) → Vercel (app.tasu.ai)
Backend (PHP API)       → Current Hosting (api.tasu.ai)
```

This hybrid approach gives you:
- ✅ Fast global CDN for frontend (Vercel)
- ✅ Keep existing PHP backend (no rewrite needed)
- ✅ Easy to migrate API later if desired

---

## 📋 Prerequisites

- [x] GitHub repository set up
- [ ] Vercel account created
- [ ] DNS access to tasu.ai domain
- [ ] Tinybird ingest token
- [ ] Current hosting with PHP support (for API)

---

## 🚀 Step 1: Deploy Frontend to Vercel

### 1.1 Connect Repository

1. Go to [vercel.com](https://vercel.com)
2. Click "Add New Project"
3. Import your GitHub repository: `jlasne/tasu`
4. Select the repository

### 1.2 Configure Project

**Framework Preset:** Other  
**Root Directory:** `./` (use root)  
**Build Command:** Leave empty (static site)  
**Output Directory:** Leave empty  
**Install Command:** Leave empty

### 1.3 Set Environment Variables

In Vercel dashboard → Settings → Environment Variables, add:

```
VITE_FIREBASE_API_KEY = AIzaSyCYQ3ykQFErSje5yqIyrjMLglfPcPYMrfA
VITE_FIREBASE_AUTH_DOMAIN = tasu-44e26.firebaseapp.com
VITE_FIREBASE_PROJECT_ID = tasu-44e26
VITE_FIREBASE_STORAGE_BUCKET = tasu-44e26.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID = 645411072706
VITE_FIREBASE_APP_ID = 1:645411072706:web:ee2547ba4080f6ea70295b

VITE_TINYBIRD_INGEST_TOKEN = [GET FROM TINYBIRD DASHBOARD]
VITE_TINYBIRD_API_HOST = https://api.eu-west-1.aws.tinybird.co

VITE_API_BASE_URL = https://api.tasu.ai
```

**How to get Tinybird Token:**
1. Login to [Tinybird](https://www.tinybird.co/)
2. Go to Tokens section
3. Create new token with Events API write permissions
4. Copy the token value

### 1.4 Deploy

Click **"Deploy"**

Vercel will:
- Pull your code from GitHub
- Deploy static files (`/app`, `/sdk`, `/assets`, `/config`)
- Give you a preview URL like `tasu-xxx.vercel.app`

---

## 🌐 Step 2: Configure DNS

### 2.1 Frontend Domain (app.tasu.ai)

In your DNS provider (e.g., Cloudflare, Namecheap):

**Add CNAME Record:**
```
Type: CNAME
Name: app
Value: cname.vercel-dns.com
TTL: Auto
```

### 2.2 API Subdomain (api.tasu.ai)

**Add A Record:**
```
Type: A
Name: api
Value: [YOUR CURRENT HOSTING IP ADDRESS]
TTL: Auto
```

**How to find your hosting IP:**
- Contact your hosting provider
- Or run: `ping your-current-domain.com` 

### 2.3 Verify in Vercel

1. Go to Vercel dashboard → Project Settings → Domains
2. Add domain: `app.tasu.ai`
3. Vercel will verify DNS (may take a few minutes)
4. SSL certificate will auto-provision

---

## 🔧 Step 3: Configure PHP Backend for CORS

Your PHP API must allow requests from Vercel frontend.

### 3.1 Update api/config.php

**Add these lines at the TOP of the file (after `<?php`):**

```php
<?php
// CORS Headers - Allow Vercel frontend
header('Access-Control-Allow-Origin: https://app.tasu.ai');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Access-Control-Allow-Credentials: true');

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Rest of config.php...
```

### 3.2 Upload Modified Files

Upload the updated `api/config.php` to your hosting at `api.tasu.ai`

**Test CORS:**
```bash
curl -I -X OPTIONS https://api.tasu.ai/analytics.php \
  -H "Origin: https://app.tasu.ai" \
  -H "Access-Control-Request-Method: POST"
```

Should see: `Access-Control-Allow-Origin: https://app.tasu.ai`

---

## 📁 Step 4: Upload API Files to Hosting

Upload these directories to your hosting (at subdomain `api.tasu.ai`):

```
/api/               →  api.tasu.ai/
├── analytics.php
├── auth.php
├── config.php      ← Updated with CORS
├── db.php
├── ingest.php
└── register.php
```

**Important:** Do NOT upload `/app`, `/sdk`, `/config` - those are on Vercel.

---

## ✅ Step 5: Verify Deployment

### 5.1 Test Frontend

Visit: `https://app.tasu.ai`

**Should See:**
- ✅ Landing page/login page loads
- ✅ Can sign up / log in with Firebase
- ✅ Dashboard loads after login

### 5.2 Test API Connection

Open browser console (F12) and check Network tab:

**Should See:**
- ✅ Requests to `https://api.tasu.ai/register.php` succeed
- ✅ Requests to `https://api.tasu.ai/analytics.php` succeed
- ✅ No CORS errors

### 5.3 Test SDK

1. Log into dashboard at `https://app.tasu.ai`
2. Go to Integration page
3. Copy the embed code
4. **Verify it shows:** `<script src="https://app.tasu.ai/sdk/tasu-sdk.js"></script>`
5. Paste on a test website
6. Click a button on test site
7. Check dashboard for new event

---

## 🐛 Troubleshooting

### Issue: CORS Error

**Error:** `Access-Control-Allow-Origin header missing`

**Fix:**
1. Verify CORS headers in `api/config.php`
2. Clear browser cache
3. Check that `api.tasu.ai` points to correct server

### Issue: Firebase Config Not Found

**Error:** `Failed to fetch firebase-config.js`

**Fix:**
1. Verify `config/firebase-config.js` exists in repository
2. Check Vercel environment variables are set
3. Redeploy on Vercel

### Issue: API 404 Not Found

**Error:** `https://api.tasu.ai/register.php 404`

**Fix:**
1. Verify API files uploaded to hosting
2. Check DNS for `api.tasu.ai` points to hosting IP
3. Wait for DNS propagation (up to 48 hours)

---

## 🔒 Security Checklist

- [x] Firebase config in environment variables (not hardcoded)
- [x] PHP backend has CORS allowing only `app.tasu.ai`
- [x] API tokens not exposed in frontend code
- [x] HTTPS enabled on both domains
- [x] `config.php` and `.env` files in `.gitignore`

---

## 🚀 Go Live!

Once all tests pass:

1. ✅ Frontend live at `https://app.tasu.ai`
2. ✅ API responding at `https://api.tasu.ai`
3. ✅ SDK accessible at `https://app.tasu.ai/sdk/tasu-sdk.js`
4. ✅ Users can sign up, log in, view analytics
5. ✅ Events tracked from customer websites

**You're live! 🎉**

---

## 📊 Next Steps (Optional)

### Monitor Performance
- Vercel Analytics (free tier)
- Tinybird query performance

### Add Features
- Stripe billing integration
- Email notifications
- More analytics pipes

### Migrate API to Vercel (Later)
When ready, convert PHP → Node.js serverless functions for fully unified deployment.

---

## 📞 Support

**Issues?**
- Check Vercel deployment logs
- Review browser console errors
- Test API endpoints directly with curl

**Questions:** Contact @jeremylasne on X/Twitter
