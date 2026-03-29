# Quick Start - Deploy Online

## 🚀 Deploy in 5 Minutes

### Option 1: Deploy to Vercel (Easiest)

**Step 1: Prepare Your Repository**
```bash
# Navigate to the project
cd "c:\Users\Dead\Desktop\Harps outlet"

# Ensure .env.local and .env.production are in .gitignore
# (They should be - these files are never committed)

# Initialize git (if not already done)
git init
git add .
git commit -m "Initial commit"

# Create GitHub repository and push
# (Instructions on github.com)
```

**Step 2: Deploy to Vercel**
1. Go to https://vercel.com
2. Click "Sign Up" and create account (or login)
3. Click "New Project"
4. Select "Import Git Repository"
5. Paste your GitHub repository URL
6. Click "Import"
7. In the "Environment Variables" section, add:
   - Key: `VITE_ADMIN_PASSWORD`
   - Value: `YourSecurePasswordHere`
8. Click "Deploy"
9. Wait ~2 minutes... ✨ Done!

Your site will be live at: `your-project.vercel.app`

---

### Option 2: Deploy to Netlify

**Step 1: Create Production Build**
```bash
npm install
npm run build
```

**Step 2: Deploy**
1. Go to https://netlify.com
2. Sign up or login
3. Drag & drop the `dist/` folder to Netlify
4. OR connect GitHub for automatic deployments:
   - Click "New site from Git"
   - Select your GitHub repo
   - Click "Deploy"
5. Go to site settings and add environment variable:
   - Key: `VITE_ADMIN_PASSWORD`
   - Value: `YourSecurePasswordHere`

Your site will be live at: `your-project.netlify.app`

---

### Option 3: Deploy to Any Host (Manual)

**Step 1: Build Locally**
```bash
npm install
npm run build
```

**Step 2: Upload**
- Upload the `dist/` folder contents to your web host
- Set environment variable: `VITE_ADMIN_PASSWORD`
- Configure your host for SPA routing (all routes → index.html)

---

## ✅ Verify Deployment

After deployment:
1. Visit your live URL
2. Check that the logo appears
3. View the gallery
4. Test category filtering
5. Visit `/admin` and login with your password
6. Test adding a product
7. Verify it appears in gallery

---

## 🔐 Admin Password

**Change Password Before Going Live:**

For Vercel/Netlify:
1. Update environment variable in hosting dashboard
2. Redeploy

For manual hosting:
1. Update `VITE_ADMIN_PASSWORD` in your host's environment settings

---

## 📋 Checklist Before Going Live

- [ ] GitHub account created
- [ ] Repository pushed to GitHub
- [ ] Vercel/Netlify account created
- [ ] Admin password changed to something secure
- [ ] Tested gallery loads
- [ ] Tested admin login
- [ ] Tested product add/delete
- [ ] Mobile responsiveness verified
- [ ] All images display correctly
- [ ] No console errors in browser DevTools

---

## Important Notes

### .env.local (Local Development)
```
VITE_ADMIN_PASSWORD=HarpsOutlet2024Secure
```
This should NEVER be committed to git

### .env.production (Production)
```
VITE_ADMIN_PASSWORD=YourSecurePasswordHere
```
This should NEVER be committed to git

Always set the production password in your hosting dashboard environment variables.

---

## Custom Domain

### For Vercel:
1. Go to your Vercel project
2. Settings → Domains
3. Add your domain (e.g., harpsoutlet.com)
4. Follow DNS setup instructions

### For Netlify:
1. Go to site settings
2. Domain management
3. Add custom domain
4. Follow DNS setup instructions

---

## Troubleshooting

**Site shows 404 after deployment:**
- Ensure your host is configured for SPA (Single Page App)
- Configure routing: all paths → /index.html

**Admin password not working after deployment:**
- Verify environment variable is set in hosting dashboard
- Redeploy after changing environment variable

**Logo missing:**
- Check that `/public/images/harps.png` is in your files
- Most hosts include the `public` folder automatically

**Products not saving:**
- Check browser has localStorage enabled
- Try in incognito/private mode

---

## Support

For detailed information, see:
- `README.md` - Full documentation
- `DEPLOYMENT.md` - Detailed deployment guide
- `DEPLOYMENT_CHECKLIST.md` - Pre-deployment checklist

---

## You're Done! 🎉

Your Harp's Outlet store is now live online!

**Next Steps:**
1. Add your first product (examples will auto-remove)
2. Customize categories as needed
3. Monitor your store
4. Update admin password periodically
5. Keep backups of your data

**Questions?**
Refer to the DEPLOYMENT.md file for detailed information.
