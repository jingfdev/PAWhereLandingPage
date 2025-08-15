# Vercel Deployment Guide for PAWhere

This guide will walk you through deploying your PAWhere React landing page to Vercel, including database setup and environment configuration.

## Prerequisites

- GitHub account
- Vercel account (free tier available)
- Neon Database account (for PostgreSQL hosting)
- Your PAWhere project files

## Step 1: Prepare Your Project for Deployment

### 1.1 Update Package.json Scripts
Ensure your `package.json` has the correct build scripts:

```json
{
  "scripts": {
    "build": "vite build",
    "preview": "vite preview",
    "dev": "npm run dev"
  }
}
```

### 1.2 Create Vercel Configuration
Create a `vercel.json` file in your project root:

```json
{
  "version": 2,
  "builds": [
    {
      "src": "server/index.ts",
      "use": "@vercel/node"
    },
    {
      "src": "package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "dist"
      }
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "/server/index.ts"
    },
    {
      "src": "/(.*)",
      "dest": "/dist/$1"
    }
  ],
  "functions": {
    "server/index.ts": {
      "includeFiles": "dist/**"
    }
  }
}
```

### 1.3 Update Build Configuration
Modify your `vite.config.ts` to ensure proper building:

```typescript
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    emptyOutDir: true
  },
  // ... rest of your config
});
```

## Step 2: Set Up Database (Neon PostgreSQL)

### 2.1 Create Neon Database Account
1. Go to [Neon.tech](https://neon.tech)
2. Sign up for a free account
3. Create a new project
4. Choose a region close to your users
5. Note down your connection string

### 2.2 Configure Database Connection
Your connection string will look like:
```
postgresql://username:password@hostname/database?sslmode=require
```

### 2.3 Run Database Migrations
Before deployment, ensure your database schema is ready:

```bash
# Install dependencies
npm install

# Generate and run migrations
npx drizzle-kit generate:pg
npx drizzle-kit push:pg
```

## Step 3: Push Code to GitHub

### 3.1 Initialize Git Repository
```bash
git init
git add .
git commit -m "Initial commit - PAWhere landing page"
```

### 3.2 Create GitHub Repository
1. Go to [GitHub.com](https://github.com)
2. Click "New repository"
3. Name it `pawhere-landing-page`
4. Set it to Public or Private
5. Don't initialize with README (you already have files)
6. Click "Create repository"

### 3.3 Push to GitHub
```bash
git remote add origin https://github.com/yourusername/pawhere-landing-page.git
git branch -M main
git push -u origin main
```

## Step 4: Deploy to Vercel

### 4.1 Connect GitHub to Vercel
1. Go to [Vercel.com](https://vercel.com)
2. Sign up/Sign in with your GitHub account
3. Click "New Project"
4. Import your `pawhere-landing-page` repository

### 4.2 Configure Project Settings
1. **Framework Preset**: Vite
2. **Root Directory**: `./` (leave as default)
3. **Build Command**: `npm run build`
4. **Output Directory**: `dist`
5. **Install Command**: `npm install`

### 4.3 Environment Variables
Add these environment variables in Vercel:

```
DATABASE_URL=your_neon_database_connection_string
NODE_ENV=production
SESSION_SECRET=your_random_session_secret_here
```

To add environment variables:
1. Go to your project dashboard
2. Click "Settings" tab
3. Click "Environment Variables"
4. Add each variable with its value

### 4.4 Deploy
1. Click "Deploy"
2. Wait for the build process to complete
3. Your app will be live at `https://your-project-name.vercel.app`

## Step 5: Verify Deployment

### 5.1 Test Core Features
- [ ] Landing page loads correctly
- [ ] Product carousel works
- [ ] Mobile app mockup displays
- [ ] Registration modal opens
- [ ] VIP registration form submits
- [ ] Social media links work
- [ ] Responsive design on mobile

### 5.2 Test Database Connection
- [ ] Registration form saves data
- [ ] No database connection errors in logs

### 5.3 Check Performance
- [ ] Page loads quickly
- [ ] Images are optimized
- [ ] No console errors

## Step 6: Custom Domain (Optional)

### 6.1 Add Custom Domain
1. Go to your Vercel project dashboard
2. Click "Settings" → "Domains"
3. Add your custom domain (e.g., `pawhere.com`)
4. Follow DNS configuration instructions

### 6.2 Configure DNS
Add these records to your domain provider:
- Type: CNAME
- Name: www
- Value: cname.vercel-dns.com

- Type: A
- Name: @
- Value: 76.76.19.61

## Step 7: Continuous Deployment

### 7.1 Automatic Deployments
Vercel automatically deploys when you push to your main branch:

```bash
# Make changes to your code
git add .
git commit -m "Update landing page design"
git push origin main
```

### 7.2 Preview Deployments
- Feature branches get preview URLs
- Pull requests generate preview deployments
- Test changes before merging to main

## Troubleshooting

### Common Issues

**Build Fails**
- Check if all dependencies are in `package.json`
- Verify build script works locally: `npm run build`
- Check Vercel build logs for specific errors

**Database Connection Issues**
- Verify DATABASE_URL is correct
- Ensure Neon database is active
- Check if IP restrictions are configured

**404 Errors**
- Verify `vercel.json` routing configuration
- Check if build output is in correct directory
- Ensure SPA routing is configured

**Environment Variables Not Working**
- Check variable names match exactly
- Redeploy after adding new variables
- Use `VITE_` prefix for client-side variables

### Performance Optimization

**Image Optimization**
- Use WebP format for better compression
- Implement lazy loading for carousel images
- Consider using Vercel's Image Optimization

**Bundle Optimization**
- Analyze bundle size: `npm run build -- --analyze`
- Remove unused dependencies
- Implement code splitting for larger apps

## Support

- **Vercel Documentation**: [vercel.com/docs](https://vercel.com/docs)
- **Neon Documentation**: [neon.tech/docs](https://neon.tech/docs)
- **Vercel Community**: [github.com/vercel/vercel/discussions](https://github.com/vercel/vercel/discussions)

## Cost Considerations

### Vercel Pricing
- **Hobby Plan**: Free for personal projects
- **Pro Plan**: $20/month for commercial use
- **Enterprise**: Custom pricing

### Neon Database Pricing
- **Free Tier**: 0.5 GB storage, good for starting
- **Paid Plans**: Start at $19/month for production

---

**Deployment Checklist:**
- [ ] Code pushed to GitHub
- [ ] Database migrations run
- [ ] Environment variables configured
- [ ] Vercel project created and deployed
- [ ] Domain configured (if applicable)
- [ ] All features tested on production
- [ ] Performance optimized
