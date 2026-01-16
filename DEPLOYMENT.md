# Vercel Deployment Guide

## Quick Deploy (Frontend Only - Recommended)

This deploys just the React frontend to Vercel. The backend can be added later.

### Step 1: Push to GitHub

```bash
cd /workspaces/Todo
git add .
git commit -m "Ready for Vercel deployment"
git push origin main
```

### Step 2: Create Vercel Account

1. Go to https://vercel.com/signup
2. Choose "Continue with GitHub"
3. Authorize and sign in

### Step 3: Import Project

1. Click "Add New" → "Project"
2. Import the `Todo` repository
3. **Root Directory**: Leave blank (Vercel will auto-detect)
4. Click "Deploy"

**That's it!** Your frontend will be live in ~2-3 minutes.

---

## Deploy With Backend (Full Stack)

Once you want to add the backend:

### Step 1: Add Backend Environment Variables

Go to Vercel Dashboard → Your Project → Settings → Environment Variables

Add these (update with real values when ready):

```
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
EMAIL_FROM=your-email@gmail.com
FRONTEND_URL=https://your-vercel-domain.vercel.app
```

### Step 2: Update vercel.json

Replace `vercel.json` with the full-stack version:

```json
{
  "version": 2,
  "builds": [
    {
      "src": "frontend/package.json",
      "use": "@vercel/static-build",
      "config": { "distDir": "dist" }
    },
    {
      "src": "backend/src/index.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    { "src": "/api/(.*)", "dest": "backend/src/index.js" },
    { "src": "/(.*)", "dest": "frontend/dist/$1" }
  ]
}
```

### Step 3: Deploy

```bash
git add vercel.json
git commit -m "Add backend to Vercel deployment"
git push origin main
```

Vercel will auto-deploy when it detects the push.

---

## Environment Variables Reference

| Variable | Example | Source |
|----------|---------|--------|
| `SUPABASE_URL` | `https://xyz123.supabase.co` | Supabase Settings > API |
| `SUPABASE_ANON_KEY` | `eyJhbGc...` | Supabase Settings > API |
| `EMAIL_HOST` | `smtp.gmail.com` | Your email provider |
| `EMAIL_PORT` | `587` | Usually 587 for Gmail |
| `EMAIL_USER` | `your-email@gmail.com` | Your email |
| `EMAIL_PASS` | `xxxx xxxx xxxx xxxx` | [Gmail App Password](https://support.google.com/accounts/answer/185833) |
| `EMAIL_FROM` | `your-email@gmail.com` | Your email |

---

## Troubleshooting

### Build fails: "Cannot find module"

Run locally first:
```bash
cd backend && npm install
cd ../frontend && npm install
```

### Frontend deploys but API calls fail

API won't work until:
1. Backend environment variables are set
2. vercel.json is updated for full-stack
3. Code is pushed to GitHub

### Want to test backend locally?

```bash
# Terminal 1
cd backend
npm install
npm run dev

# Terminal 2
cd frontend
npm install
npm run dev
```

Visit `http://localhost:5173`
