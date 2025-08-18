# PAWhere Landing Page

A modern, responsive React.js landing page for PAWhere - an innovative IoT pet tracking device. Features real-time GPS tracking demonstration, user registration system, product showcase, and team database management.

![PAWhere Logo](./attached_assets/PAWhere_logo.png)

## 🚀 Features

- **Modern Hero Section** with animated gradients and floating elements
- **Product Carousel** showcasing PAWhere device in multiple colors
- **Mobile App Mockup** demonstrating real-time pet tracking with Bella the Border Collie
- **VIP Registration System** with early access signup
- **Pet Parent Testimonials** with trust indicators
- **Responsive Design** optimized for all devices
- **PostgreSQL Database** with Docker support for team collaboration

## 📋 Requirements

### System Requirements
- **Node.js** 18.0.0 or higher
- **npm** 8.0.0 or higher
- **Docker** (optional, for database)
- **Git** for version control

### Browser Support
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## 🛠️ Installation

### 1. Clone the Repository
```bash
git clone <your-repository-url>
cd pawhere-landing-page
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Setup
Create a `.env` file in the root directory:
```env
# Database Configuration (Optional - uses in-memory storage by default)
DATABASE_URL=postgresql://pawhere:pawhere@localhost:5439/pawherelandingpage
PGHOST=localhost
PGPORT=5439
PGDATABASE=pawherelandingpage
PGUSER=pawhere
PGPASSWORD=pawhere

# Development Settings
NODE_ENV=development
PORT=3000
```

## 🚀 Quick Start

### Development Mode
```bash
npm run dev
```
The application will be available at `http://localhost:5000`

### Production Build
```bash
npm run build
npm start
```

## 🐳 Database Setup (Optional)

The application works with in-memory storage by default. For persistent data and team collaboration:

### Using Docker (Recommended)
```bash
# Start PostgreSQL database
docker-compose up -d

# Stop database
docker-compose down
```

### Database Access
- **PgAdmin Interface**: http://localhost:8081
- **Credentials**: pawhere@gmail.com / pawhere
- **Database Port**: 5439

For detailed database setup instructions, see [DATABASE_SETUP.md](DATABASE_SETUP.md)

## 📁 Project Structure

```
pawhere-landing-page/
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Page components
│   │   ├── hooks/          # Custom React hooks
│   │   └── lib/            # Utility functions
│   └── index.html
├── server/                 # Backend Express.js API
│   ├── index.ts           # Server entry point
│   ├── routes.ts          # API endpoints
│   └── storage.ts         # Data storage interface
├── shared/                # Shared TypeScript schemas
├── attached_assets/       # Product images and mockups
├── docker-compose.yml     # Database configuration
└── README.md
```

## 🎨 Customization

### Brand Colors
Update colors in `client/src/index.css`:
```css
:root {
  --primary-blue: #10459b;
  --primary-yellow: #f4a905;
}
```

### Product Images
Replace images in `attached_assets/` directory:
- `photo1.png`, `photo2.png`, `photo3.png` - Product carousel
- `feature.png` - Feature showcase
- `mobileTracking.png` - Mobile app mockup

## 🚀 Deployment Options

### Option 1: Replit Deployments (Easiest)
1. Open your project in Replit
2. Click the **Deploy** button
3. Choose **Autoscale Deployment**
4. Set build command: `npm run build`
5. Set run command: `npm run dev`
6. Click **Deploy**

Your app will be live at `https://your-project-name.replit.app`

### Option 2: Vercel (Free & Fast)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

### Option 3: Netlify
1. Build the project: `npm run build`
2. Drag and drop the `dist` folder to [Netlify Drop](https://app.netlify.com/drop)
3. Your site is live!

### Option 4: GitHub Pages
```bash
# Install gh-pages
npm install --save-dev gh-pages

# Add to package.json scripts:
"deploy": "gh-pages -d dist"

# Deploy
npm run build
npm run deploy
```

## 🔧 Development Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
npm run type-check   # TypeScript type checking
```

## 🧪 Testing

### User Registration Flow
1. Visit the landing page
2. Click "Join VIP List" button
3. Fill out the registration form
4. Submit and verify success message

### Mobile App Showcase
1. Scroll to "Track Your Pet in Real-Time" section
2. Verify mobile phone mockup displays correctly
3. Check hover animations and feature cards

## 🐛 Troubleshooting

### Common Issues

**Port 5000 already in use**
```bash
# Kill process using port 5000
npx kill-port 5000

# Or change port in package.json
"dev": "NODE_ENV=development tsx server/index.ts --port 3000"
```

**Database connection issues**
```bash
# Check Docker containers
docker ps

# Restart database
docker-compose restart postgres
```

**Build failures**
```bash
# Clear node modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

## 📊 Performance Optimization

- **Image Optimization**: All product images are optimized for web
- **Code Splitting**: Automatic with Vite bundler
- **Lazy Loading**: Images load progressively
- **Caching**: Browser caching enabled for static assets

## 🔒 Security

- **Input Validation**: All form inputs validated with Zod schemas
- **SQL Injection Protection**: Parameterized queries with Drizzle ORM
- **Environment Variables**: Sensitive data stored in `.env` files
- **CORS Configuration**: Proper cross-origin resource sharing setup

## 📈 Analytics & Monitoring

To add analytics:
1. Add Google Analytics ID to environment variables
2. Install analytics package: `npm install @vercel/analytics`
3. Import and configure in `client/src/main.tsx`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-feature`
3. Commit changes: `git commit -am 'Add new feature'`
4. Push to branch: `git push origin feature/new-feature`
5. Submit a Pull Request

## 📄 License

This project is licensed under PAWhere. Build with love for pet parents. 🐾💕

## 👥 Team

- **Development**: React.js, TypeScript, Express.js
- **Design**: Tailwind CSS, Modern UI/UX
- **Database**: PostgreSQL with Drizzle ORM
- **Deployment**: Replit, Vercel, Netlify compatible

## 📞 Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the [troubleshooting section](#🐛-troubleshooting)

---

**Built with ❤️ for pet parents everywhere**

*Keep your furry friends safe with PAWhere - because every pet deserves to come home.*