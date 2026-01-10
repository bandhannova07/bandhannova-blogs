# Vercel Deployment Guide - BandhanNova Blogs

## 📋 Prerequisites

Before deploying to Vercel, make sure you have:

1. ✅ GitHub repository with all code pushed
2. ✅ Supabase project created and configured
3. ✅ OpenRouter API key
4. ✅ All environment variables ready

---

## 🚀 Step-by-Step Deployment

### Step 1: Connect to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Sign in with your GitHub account
3. Click **"Add New Project"**
4. Select your repository: `bandhannova07/bandhannova-blogs`
5. Click **"Import"**

### Step 2: Configure Project Settings

**Framework Preset:** Next.js (auto-detected)

**Build Settings:**
- Build Command: `npm run build` (default)
- Output Directory: `.next` (default)
- Install Command: `npm install` (default)

**Root Directory:** `./` (leave as default)

### Step 3: Add Environment Variables

Click **"Environment Variables"** and add the following:

#### Required Variables:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
OPENROUTER_API_KEY=your_openrouter_api_key
OPENROUTER_MODEL=xiaomi/mimo-v2-flash:free
NEXT_PUBLIC_SITE_URL=https://your-vercel-domain.vercel.app
```

#### Optional Variables (for admin auth):

```
ADMIN_EMAIL=arthur.b@blinders.org
ADMIN_PASSWORD=lbd700
ADMIN_PASSKEY=12032011
```

**Important:** 
- Add these to **Production**, **Preview**, and **Development** environments
- Click "Add" after each variable

### Step 4: Deploy

1. Click **"Deploy"**
2. Wait for build to complete (2-3 minutes)
3. Once deployed, you'll get a URL like: `https://bandhannova-blogs.vercel.app`

---

## 🔧 Post-Deployment Configuration

### Update Supabase Settings

1. Go to your Supabase project dashboard
2. Navigate to **Settings** → **API**
3. Add your Vercel domain to **Site URL**:
   ```
   https://your-vercel-domain.vercel.app
   ```

4. Add to **Redirect URLs**:
   ```
   https://your-vercel-domain.vercel.app/admin
   https://your-vercel-domain.vercel.app/admin/login
   ```

### Update Environment Variable

Go back to Vercel:
1. Click **Settings** → **Environment Variables**
2. Update `NEXT_PUBLIC_SITE_URL` with your actual Vercel URL
3. Click **"Save"**
4. Redeploy (Deployments → Click ⋯ → Redeploy)

---

## ✅ Verification Checklist

After deployment, test these:

- [ ] Homepage loads correctly
- [ ] Light/Dark mode toggle works
- [ ] Blog posts display from Supabase
- [ ] Individual blog pages work
- [ ] Admin login page accessible
- [ ] Admin panel authentication works
- [ ] AI blog generation works
- [ ] Image upload and cropping works
- [ ] Blog publishing to database works
- [ ] Search and filters work
- [ ] Responsive design on mobile

---

## 🔄 Continuous Deployment

Vercel automatically deploys when you push to GitHub:

1. Make changes locally
2. Commit: `git add . && git commit -m "your message"`
3. Push: `git push origin main`
4. Vercel auto-deploys in 2-3 minutes

---

## 🐛 Troubleshooting

### Build Fails

**Error:** "Module not found"
- **Solution:** Check `package.json` dependencies
- Run `npm install` locally first

**Error:** "Environment variable missing"
- **Solution:** Add all required env vars in Vercel settings

### Runtime Errors

**Error:** "Cannot connect to Supabase"
- **Solution:** Verify Supabase URL and keys
- Check Supabase project is active

**Error:** "Images not loading"
- **Solution:** Check `next.config.ts` image domains
- Verify Supabase storage bucket is public

**Error:** "Admin login not working"
- **Solution:** Check admin credentials in env vars
- Clear browser cache and cookies

### Performance Issues

**Slow page loads:**
- Enable Vercel Analytics
- Check Supabase query performance
- Optimize images

---

## 📊 Monitoring

### Vercel Dashboard

Monitor your deployment:
- **Analytics:** View traffic and performance
- **Logs:** Check runtime errors
- **Deployments:** See deployment history

### Supabase Dashboard

Monitor your database:
- **Database:** Check query performance
- **Storage:** Monitor storage usage
- **Logs:** View API requests

---

## 🔐 Security Best Practices

1. **Never commit `.env.local`** to GitHub
2. **Use environment variables** for all secrets
3. **Enable Vercel password protection** for preview deployments (optional)
4. **Set up Supabase RLS** (Row Level Security) properly
5. **Use HTTPS only** (Vercel provides this by default)

---

## 🎯 Custom Domain (Optional)

To use your own domain:

1. Go to Vercel project → **Settings** → **Domains**
2. Add your domain (e.g., `blogs.bandhannova.in`)
3. Update DNS records as instructed by Vercel
4. Wait for DNS propagation (5-30 minutes)
5. Update `NEXT_PUBLIC_SITE_URL` in environment variables

---

## 📝 Important Notes

- **First deployment** may take 3-5 minutes
- **Subsequent deployments** take 1-2 minutes
- **Preview deployments** created for every PR
- **Production deployment** only from main branch
- **Free tier** includes:
  - Unlimited deployments
  - 100GB bandwidth/month
  - Automatic HTTPS
  - Global CDN

---

## 🆘 Need Help?

- **Vercel Docs:** https://vercel.com/docs
- **Supabase Docs:** https://supabase.com/docs
- **Next.js Docs:** https://nextjs.org/docs

---

**Deployment Date:** January 2026  
**Platform:** Vercel  
**Framework:** Next.js 16.1.1  
**Database:** Supabase

---

✨ **Your blog is now live on Vercel!** ✨
