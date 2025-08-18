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
The application will be available at `http://localhost:3000`

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

### Option: Vercel (Free & Fast)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
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

### Common Issues

**Port 3000 already in use**
```bash
# Kill process using port 3000
npx kill-port 3000

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

## 📈 Analytics & Monitoring

To add analytics:
1. Add Google Analytics ID to environment variables
2. Install analytics package: `npm install @vercel/analytics`
3. Import and configure in `client/src/main.tsx`

## 📄 License

This project is licensed under PAWhere. Build with love for pet parents. 🐾💕

**Built with ❤️ for pet parents everywhere**

*Keep your furry friends safe with PAWhere - because every pet deserves to come home.*