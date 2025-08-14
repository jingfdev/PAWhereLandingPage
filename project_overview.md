# Overview

PAWhere is a React-based single-page landing website for a pet tracking device. The application serves as a product showcase and early user registration platform, featuring a hero section, product carousel, VIP tester registration, and social media integration. Built with modern web technologies, it provides a responsive and interactive experience for potential customers to learn about and sign up for early access to the PAWhere pet tracking device.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
The frontend is built using React with TypeScript in a single-page application (SPA) architecture. The application uses Vite as the build tool and development server, providing fast hot module replacement and optimized production builds. Component organization follows a modular structure with reusable UI components built on top of Radix UI primitives and styled with Tailwind CSS.

**Routing**: Uses Wouter for lightweight client-side routing, handling the main home page and 404 not found page.

**State Management**: Leverages React Query (TanStack Query) for server state management, providing caching, background updates, and optimistic updates for API interactions.

**UI Components**: Implements a comprehensive design system using shadcn/ui components, which are customizable React components built on Radix UI primitives. This provides accessible, unstyled components that are styled with Tailwind CSS.

**Styling**: Uses Tailwind CSS for utility-first styling with custom CSS variables for theming. The design system includes custom brand colors (Primary Yellow #f4a905, Primary Blue #10459b) and consistent spacing, typography, and component styling.

## Backend Architecture
The backend follows a REST API architecture built with Express.js and TypeScript. The server implements a simple in-memory storage system for development and testing purposes, with the capability to be extended to use PostgreSQL through Drizzle ORM.

**API Design**: RESTful endpoints for user registration management, including creation and retrieval of registration data with proper error handling and validation.

**Data Validation**: Uses Zod for runtime type checking and validation of incoming requests, ensuring data integrity and providing clear error messages.

**Storage Layer**: Implements an abstraction layer through the IStorage interface, allowing for easy switching between in-memory storage (development) and database storage (production) without changing business logic.

## Data Storage Solutions
The application is configured to use PostgreSQL as the primary database with Drizzle ORM for type-safe database interactions. The schema defines users and registrations tables with proper relationships and constraints.

**Database Schema**: 
- Users table with username/password authentication
- Registrations table for storing early access signups with email, optional phone, VIP status, and timestamps

**Migration Management**: Uses Drizzle Kit for database schema migrations and version control.

**Development Storage**: Implements in-memory storage for development and testing, mimicking the production database interface.

## Authentication and Authorization
Currently implements a basic foundation for user authentication with username/password storage in the database schema. The registration system doesn't require authentication, allowing anonymous users to sign up for early access.

**Session Management**: Configured to use connect-pg-simple for PostgreSQL session storage when authentication is fully implemented.

**Security**: Express server includes proper JSON parsing, URL encoding, and error handling middleware.

## External Dependencies

### Database Services
- **PostgreSQL**: Primary database for production, configured through Drizzle ORM
- **Neon Database**: Serverless PostgreSQL provider integration for cloud deployment

### UI and Styling
- **Radix UI**: Headless UI component library providing accessible primitives
- **Tailwind CSS**: Utility-first CSS framework for styling
- **shadcn/ui**: Pre-built component library built on Radix UI and Tailwind CSS
- **Lucide React**: Icon library for consistent iconography

### Development and Build Tools
- **Vite**: Build tool and development server with React plugin
- **TypeScript**: Type safety and development experience
- **ESBuild**: Fast bundling for production builds

### Form and Data Management
- **React Hook Form**: Form state management and validation
- **Zod**: Runtime type checking and schema validation
- **TanStack React Query**: Server state management and caching

### Asset Management
The application includes product images (photo1.png, photo2.png, photo3.png, feature.png) and mobile app mockups stored in the attached_assets directory for the product carousel showcase and mobile app demonstration.

### Social Media Integration
Links to external social media platforms:
- Facebook: https://www.facebook.com/profile.php?id=61565003537217
- Instagram: https://instagram.com/aerokiq25

### Database Management
Docker Compose setup for PostgreSQL database with the following configuration:
- Database name: `pawherelandingpage`
- Local development port: 5439
- PgAdmin interface: http://localhost:8081
- Credentials: pawhere/pawhere
- Data persistence through Docker volumes for team collaboration