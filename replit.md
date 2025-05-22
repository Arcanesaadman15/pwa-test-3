# PeakForge Wellness Application

## Overview

PeakForge is a comprehensive wellness application that gamifies health and fitness routines through a structured program system. The app combines sleep optimization, movement tracking, nutrition guidance, recovery protocols, and mindfulness practices into a cohesive user experience with skill progression, achievements, and personalized task management.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **UI Components**: Shadcn/ui with Radix UI primitives
- **Styling**: Tailwind CSS with CSS custom properties for theming
- **Routing**: Wouter for client-side navigation
- **State Management**: TanStack Query for server state, React hooks for local state
- **Build Tool**: Vite with custom configuration for development and production

### Backend Architecture
- **Runtime**: Node.js with Express.js
- **Language**: TypeScript with ES modules
- **Database**: PostgreSQL with Drizzle ORM
- **Database Provider**: Neon Database (serverless PostgreSQL)
- **Development Mode**: In-memory storage for rapid prototyping
- **Session Management**: PostgreSQL-backed sessions with connect-pg-simple

### Progressive Web App Features
- **PWA Support**: Service worker registration and install prompts
- **Offline Capability**: Built-in caching strategies
- **Mobile-First Design**: Responsive layout optimized for mobile devices

## Key Components

### Task Management System
- **Task Catalog**: Centralized registry of wellness activities across multiple categories
- **Program Engine**: Beginner, intermediate, and advanced program tracks
- **Progress Tracking**: Day-by-day completion monitoring with streak calculations
- **Task Categories**: Sleep, Movement, Nutrition, Recovery, Mindfulness

### Skill Tree System
- **Category-Based Skills**: Five wellness categories with progressive unlocks
- **Experience Points**: Task completion drives skill progression
- **Achievement System**: Milestone-based rewards and recognition
- **User Level Progression**: Overall user advancement through consistent engagement

### User Onboarding
- **Progressive Disclosure**: Multi-step onboarding to gather preferences
- **Personalization**: Activity level, stress assessment, and goal setting
- **Program Assignment**: Automatic program recommendation based on user profile

### Data Storage
- **User Profiles**: Personal information, preferences, and progress metrics
- **Task Completions**: Historical record of completed and skipped activities
- **Skill Progression**: Category-specific advancement tracking
- **Achievements**: Earned rewards and milestone completions

## Data Flow

### Client-Side Flow
1. User interactions trigger React component updates
2. TanStack Query manages API calls and caching
3. Local storage provides persistence for offline scenarios
4. Custom hooks encapsulate business logic (task engine, skill system, user progress)

### Server-Side Flow
1. Express routes handle API requests with proper error handling
2. Drizzle ORM manages database operations with type safety
3. PostgreSQL stores persistent user data and progress
4. Development mode uses in-memory storage for rapid iteration

### Real-Time Updates
- Task completion immediately updates progress calculations
- Skill unlocks trigger notification modals
- Achievement earning provides instant feedback
- Streak calculations update daily progress metrics

## External Dependencies

### UI and Styling
- **Radix UI**: Accessible component primitives
- **Tailwind CSS**: Utility-first styling framework
- **Lucide React**: Consistent icon library
- **Embla Carousel**: Touch-friendly carousel components

### Data Management
- **Drizzle ORM**: Type-safe database operations
- **Drizzle-Zod**: Schema validation integration
- **TanStack Query**: Powerful data fetching and caching
- **Zod**: Runtime type validation

### Development Tools
- **Vite**: Fast development server and build tool
- **TypeScript**: Static type checking across the stack
- **ESBuild**: Production bundling for server code
- **Replit Integration**: Development environment optimization

## Deployment Strategy

### Production Build
- **Client**: Vite builds optimized React bundle to `dist/public`
- **Server**: ESBuild compiles TypeScript server to `dist/index.js`
- **Assets**: Static assets served from build output directory

### Environment Configuration
- **Development**: Hot reload with Vite middleware integration
- **Production**: Served static files with Express fallback routing
- **Database**: Environment-based connection string configuration

### Replit Deployment
- **Auto-scaling**: Configured for Replit's autoscale deployment target
- **Port Configuration**: External port 80 mapped to internal port 5000
- **Process Management**: NPM scripts handle development and production modes

### Database Migration
- **Schema Management**: Drizzle Kit handles database schema evolution
- **Migration Files**: Generated migration scripts in `/migrations` directory
- **Environment Setup**: Automatic database provisioning validation

The application follows a modular architecture that separates concerns between user interface, business logic, and data persistence while maintaining type safety throughout the stack. The gamification elements are deeply integrated into the core user experience, encouraging consistent engagement through progressive skill unlocks and achievement systems.