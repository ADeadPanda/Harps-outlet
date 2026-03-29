# Harp's Outlet - Appliance Store Platform

A modern, responsive e-commerce platform for managing and displaying home appliances. Built with React, Vite, and Tailwind CSS.

## Features

### 🛍️ Customer Facing
- **Product Gallery** with responsive grid layout
- **Category Filtering** - Filter by appliance type with live product counts
- **Product Details** - Individual product pages with full information
- **Contact Page** - Location map, business hours, and contact information
- **Example Products** - Sample appliances on first load (auto-removed when user adds products)
- **Responsive Design** - Works perfect on mobile, tablet, and desktop

### 🔐 Admin Features
- **Secure Login** - Password-protected admin dashboard
- **Product Management** - Add products with images, categories, and details
- **Quick Delete** - Remove products with confirmation
- **Product Categories** - Organize by appliance type
- **Session Timeout** - Auto-logout after 30 minutes for security
- **Category Badges** - Visual display of product categories

### 🏢 Business Information
- Google Maps embedded location
- Business hours display
- Contact information
- Professional branding with logo

## Tech Stack

- **Frontend**: React 18.2
- **Build Tool**: Vite
- **Styling**: Tailwind CSS + Custom CSS
- **Routing**: React Router DOM
- **Storage**: Browser localStorage (no backend needed)
- **Icons & Components**: Radix UI, Lucide Icons

## Installation

### Local Development

```bash
# Clone or download the project
cd harps-outlet

# Install dependencies
npm install

# Start development server
npm run dev

# Open browser to http://localhost:5173
```

### Build for Production

```bash
# Create optimized production build
npm run build

# Preview production build locally
npm run preview
```

## Environment Variables

Create `.env.local` for development:
```
VITE_ADMIN_PASSWORD=HarpsOutlet2024Secure
```

Create `.env.production` for production:
```
VITE_ADMIN_PASSWORD=YourSecureProductionPassword
```

## Admin Access

- **URL**: `/admin`
- **Password**: Set via environment variables
- **Default (dev)**: `HarpsOutlet2024Secure`
- **Session Duration**: 30 minutes

## Data Management

All product data is stored in browser localStorage:
- No database required
- Data syncs across browser tabs
- Persists across sessions
- Easily exportable/importable

## Deployment

See `DEPLOYMENT.md` for detailed hosting instructions.

### Quick Deploy to Vercel

```bash
# 1. Push to GitHub
git push origin main

# 2. Connect to Vercel:
# - Go to vercel.com
# - Click "New Project"
# - Select your GitHub repo
# - Add environment variable: VITE_ADMIN_PASSWORD
# - Deploy!
```

### Quick Deploy to Netlify

```bash
# 1. Build locally
npm run build

# 2. Drag dist/ folder to Netlify
# Or connect GitHub for automatic deployments
```

## Project Structure

```
src/
├── pages/
│   ├── Gallery.jsx          # Main product listing
│   ├── Admin.jsx            # Admin dashboard
│   ├── ProductDetail.jsx    # Product page
│   ├── Contact.jsx          # Contact & map
│   └── Upload.jsx           # Unused
├── components/              # UI components
├── lib/
│   ├── localDB.js          # Local storage layer
│   ├── exampleProducts.js  # Sample data
│   └── utils.js            # Utilities
├── images/                 # Static images
├── App.jsx                 # Main app
├── index.css              # Global styles
└── main.jsx               # Entry point

public/
├── images/
│   └── harps.png          # Logo

```

## Key Files

- `vite.config.js` - Build configuration
- `jsconfig.json` - JavaScript path aliases
- `tailwind.config.js` - Tailwind theme
- `package.json` - Dependencies & scripts
- `.env.local` - Local dev environment
- `.env.production` - Production environment
- `DEPLOYMENT.md` - Hosting guide

## Features Overview

### Gallery Page
- Dynamic product grid
- Real-time category filtering
- Hide empty categories
- Product badges with categories
- Example products auto-removal

### Admin Dashboard
- Password-protected access
- Add products with images
- Select from 10 appliance categories
- Manage inventory
- Delete products
- Auto-logout after 30 minutes

### Product Details
- Full product information
- Category display
- Image viewing
- Navigation controls
- Quick back to gallery

### Contact Page
- Google Maps location
- Business hours
- Contact information
- Professional layout

## Security Features

- ✅ Password-protected admin area
- ✅ Environment variables for secrets
- ✅ Session timeout (30 minutes)
- ✅ Secure password storage
- ✅ Production vs development env separation

## Performance

- Lightweight (~200KB gzipped)
- Fast development with Vite
- Optimized production build
- Responsive images
- Efficient re-renders

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers

## Customization

### Change Admin Password
Edit `.env.local` or `.env.production`

### Add Appliance Categories
Edit `APPLIANCE_CATEGORIES` in `src/pages/Admin.jsx` and `src/pages/Gallery.jsx`

### Customize Logo
Replace `public/images/harps.png` with your logo

### Change Colors/Theme
Edit `tailwind.config.js` or `src/index.css`

### Modify Example Products
Edit `src/lib/exampleProducts.js`

## Troubleshooting

**Build fails:**
```bash
rm -rf node_modules package-lock.json
npm install
npm run build
```

**Logo missing after deploy:**
- Ensure `public/` folder is included in deployment
- Check image path: `/images/harps.png`

**Admin password not working:**
- Check `.env` file is properly set
- Restart development server
- For production: redeploy after env changes

**Products not saving:**
- Ensure browser allows localStorage
- Check browser console for errors
- Try incognito/private mode

## License

Proprietary - Harp's Outlet

## Support

For deployment help, see `DEPLOYMENT.md`

---

**Version**: 1.0  
**Last Updated**: March 28, 2026  
**Status**: Production Ready ✅
