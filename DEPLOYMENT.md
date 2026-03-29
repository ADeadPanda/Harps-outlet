# Harp's Outlet - Deployment Guide

## Production Deployment Instructions

### Prerequisites
- Node.js 16+ installed
- npm or yarn package manager
- A hosting platform (Vercel, Netlify, GitHub Pages, or any Node.js hosting)

### Before Deployment

1. **Update Admin Password**
   - Edit `.env.production` and change the password from "ChangeThisPasswordForProduction" to a secure password
   - Keep `.env.local` only for local development
   - Never commit `.env.local` or `.env.production` to version control

2. **Verify Build**
   ```bash
   npm install
   npm run build
   npm run preview
   ```

### Build Output
The production build will be created in the `dist/` folder ready for deployment.

### Recommended Hosting Platforms

#### 1. **Vercel** (Recommended - Easiest)
- Free tier available
- Automatic deployments from GitHub
- Automatic HTTPS
- Zero configuration needed

Steps:
1. Push code to GitHub
2. Connect GitHub to Vercel
3. Set environment variables in Vercel dashboard:
   - `VITE_ADMIN_PASSWORD` = your secure password
4. Done! Automatic deployments on git push

#### 2. **Netlify**
- Free tier available
- Drag-and-drop deployment
- Similar to Vercel

Steps:
1. Run `npm run build` locally
2. Drag the `dist/` folder to Netlify
3. Or connect GitHub for automatic deployments
4. Set environment variables in site settings

#### 3. **GitHub Pages**
- Free static hosting
- Add to vite.config.js:
```javascript
export default defineConfig({
  base: '/repo-name/', // if repo is not a user/org site
  // ... rest of config
})
```
Then push `dist/` folder to `gh-pages` branch

### Environment Variables

**Development (.env.local)**
```
VITE_ADMIN_PASSWORD=HarpsOutlet2024Secure
```

**Production (.env.production)**
```
VITE_ADMIN_PASSWORD=YourSecureProductionPassword
```

### Features Deployed
✅ Product Gallery with category filtering
✅ Admin Dashboard with Login (password protected)
✅ Admin Password: Set in environment variables
✅ Product Management (Add/Delete)
✅ Contact & Business Hours Page
✅ Responsive Design
✅ Logo Display
✅ Example Products (auto-removed when first product added)
✅ Local Storage Database (no backend needed)

### Performance Optimizations
- ✅ Minified production builds
- ✅ Code splitting
- ✅ Image optimization recommendations
- ✅ Lightweight (~200KB gzipped)

### Site Structure
```
/                 → Gallery/Home page
/contact          → Contact & Business Hours
/admin            → Admin Dashboard (password protected)
/product/:id      → Individual Product Page
```

### Local Storage
- All data stored in browser's localStorage
- Data persists across sessions
- No database required
- Delete browser data to reset

### Security Notes
1. Change admin password in .env.production
2. Session timeout: 30 minutes
3. Automatic logout after timeout
4. Never commit .env files with real passwords
5. Use HTTPS for all production deployments

### Troubleshooting

**Logo not appearing:**
- Ensure `public/images/harps.png` is copied to hosting
- Check image path in deployed version

**Admin password not working:**
- Verify .env.production is set in hosting environment
- Restart build/deployment after env changes

**Products not saving:**
- Check browser localStorage isn't disabled
- Try incognito/private mode to test

### Support
For local development issues, ensure Node.js 16+ is installed.
For hosting-specific issues, consult your hosting provider's documentation.

---
Generated: March 28, 2026
Version: 1.0
