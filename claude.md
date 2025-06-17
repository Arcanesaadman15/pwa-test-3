# PeakForge PWA - Claude Assistant Guide for Replit

## 🎯 Project Overview

**PeakForge** is a comprehensive wellness Progressive Web App (PWA) that gamifies health and fitness routines. It combines sleep optimization, movement tracking, nutrition guidance, recovery protocols, and mindfulness practices into a cohesive user experience with skill progression, achievements, and personalized task management.

### Core Features
- **Multi-step Onboarding Flow**: 10-step comprehensive user onboarding with problems assessment, quiz, sliders, commitment questions, diagnosis, and roadmap
- **Subscription Management**: LemonSqueezy integration for payment processing with Basic ($12.99), Pro ($24.99), and Lifetime ($99.99) plans
- **Authentication**: Supabase-based user authentication and profile management
- **Task Management**: Wellness activities across 5 categories (Sleep, Movement, Nutrition, Recovery, Mindfulness)
- **Skill Progression**: Gamified advancement system with experience points and achievements
- **PWA Features**: Offline support, install prompts, service worker for mobile-first experience

## 🏗️ Architecture Overview

### Frontend (Client)
- **Framework**: React 18 + TypeScript + Vite
- **UI**: Shadcn/ui with Radix UI primitives + Tailwind CSS
- **Routing**: Wouter for client-side navigation
- **State Management**: TanStack Query + React hooks
- **PWA**: Service worker with offline caching

### Backend (Server)
- **Runtime**: Node.js + Express.js + TypeScript
- **Database**: Supabase (PostgreSQL) for user data
- **Payments**: LemonSqueezy integration with webhooks
- **Local Storage**: Browser localStorage for task/progress data

### Deployment Structure
```
├── client/                    # React frontend
│   ├── src/
│   │   ├── components/       # UI components organized by feature
│   │   ├── pages/           # Route components
│   │   ├── contexts/        # Auth context
│   │   ├── hooks/           # Custom React hooks
│   │   ├── lib/             # Utilities and configs
│   │   └── utils/           # Helper functions
│   ├── .env.local          # Frontend environment variables
│   └── vite.config.ts      # Vite configuration
├── server/                  # Express backend
│   ├── src/
│   │   └── routes/         # API routes (LemonSqueezy webhooks)
│   ├── .env               # Backend environment variables
│   └── index.ts           # Server entry point
├── shared/                 # Shared TypeScript interfaces
└── package.json           # Root package.json for deployment
```

## 🔄 Application Flow

### 1. Authentication Flow (App.tsx)
The app follows a strict order:
1. **Authentication Check**: User must be signed in
2. **Onboarding Check**: If not `onboarding_complete`, show onboarding
3. **Subscription Check**: If not subscribed, show pricing page
4. **Main App**: Full access to wellness tasks and features

### 2. Onboarding Flow (10 Steps)
1. **Splash**: Welcome screen
2. **Problems**: User selects their wellness challenges
3. **Quiz**: 4 questions about current habits
4. **Sliders**: 3 metrics assessment (energy, stress, fitness)
5. **Commitment**: 4 questions about dedication level
6. **Diagnosis**: Analysis of user responses
7. **Roadmap**: Personalized program recommendation
8. **Authentication**: Sign up/sign in
9. **Paywall**: Subscription selection
10. **Welcome**: Completion and app access

### 3. Subscription Management
- **Plans**: 3 tiers (Basic, Pro, Lifetime) configured in LemonSqueezy
- **Payment Flow**: LemonSqueezy checkout → Webhook → Supabase subscription update
- **Access Control**: Subscription status gates main app features

## 🗄️ Database Schema (Supabase)

### Users Table
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT auth.uid(),
  name TEXT NOT NULL,
  email TEXT UNIQUE,
  program TEXT NOT NULL DEFAULT 'beginner',
  current_day INTEGER NOT NULL DEFAULT 1,
  current_streak INTEGER NOT NULL DEFAULT 0,
  longest_streak INTEGER NOT NULL DEFAULT 0,
  completed_days INTEGER NOT NULL DEFAULT 0,
  start_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  achievements INTEGER NOT NULL DEFAULT 0,
  level INTEGER NOT NULL DEFAULT 1,
  onboarding_complete BOOLEAN NOT NULL DEFAULT false,
  preferences JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);
```

### Subscription Plans Table
```sql
CREATE TABLE subscription_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  price INTEGER NOT NULL, -- Price in cents
  interval TEXT NOT NULL CHECK (interval IN ('month', 'year', 'lifetime')),
  features TEXT[] NOT NULL DEFAULT '{}',
  stripe_product_id TEXT,
  stripe_price_id TEXT,
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);
```

### User Subscriptions Table
```sql
CREATE TABLE user_subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  plan_id UUID NOT NULL REFERENCES subscription_plans(id),
  status TEXT NOT NULL CHECK (status IN ('active', 'canceled', 'past_due', 'trialing')),
  stripe_subscription_id TEXT,
  stripe_customer_id TEXT,
  current_period_start TIMESTAMP WITH TIME ZONE,
  current_period_end TIMESTAMP WITH TIME ZONE,
  cancel_at_period_end BOOLEAN NOT NULL DEFAULT false,
  trial_start TIMESTAMP WITH TIME ZONE,
  trial_end TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);
```

## 🚀 Replit Deployment Configuration

### Required Environment Variables

#### Client Environment (client/.env.local)
```env
# Supabase Configuration
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# LemonSqueezy Configuration
VITE_LEMONSQUEEZY_STORE_ID=your_store_id
VITE_LEMONSQUEEZY_API_KEY=your_lemonsqueezy_api_key

# Replit App URL (IMPORTANT: Update for Replit hosting)
VITE_APP_URL=https://your-repl-name.your-username.repl.co
```

#### Server Environment (server/.env)
```env
# Supabase Configuration
SUPABASE_URL=your_supabase_project_url
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# LemonSqueezy Configuration
LEMONSQUEEZY_API_KEY=your_lemonsqueezy_api_key
LEMONSQUEEZY_STORE_ID=your_store_id
LEMONSQUEEZY_WEBHOOK_SECRET=your_webhook_secret

# Server Configuration
PORT=3000
NODE_ENV=production

# Replit App URL (IMPORTANT: Update for Replit hosting)
APP_URL=https://your-repl-name.your-username.repl.co
```

### Changes Required for Replit Hosting

#### 1. URL Configuration
**CRITICAL**: Update all localhost URLs to your Replit URL:
- Replace `http://localhost:3000` with `https://your-repl-name.your-username.repl.co`
- Update both `VITE_APP_URL` and `APP_URL` environment variables

#### 2. LemonSqueezy Webhook URL
Update webhook endpoint in LemonSqueezy dashboard:
- From: `http://localhost:3000/api/lemonsqueezy/webhooks`
- To: `https://your-repl-name.your-username.repl.co/api/lemonsqueezy/webhooks`

#### 3. Supabase Auth Configuration
In Supabase dashboard → Authentication → URL Configuration:
- Add your Replit URL to allowed redirect URLs
- Update site URL to your Replit domain

#### 4. CORS Configuration
The server already includes flexible CORS headers, but verify Replit domain is allowed.

### Replit Deployment Steps

1. **Fork/Import Repository** to Replit
2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Set Environment Variables** in Replit Secrets:
   - All variables from client/.env.local and server/.env
   - Update URLs to match Replit domain

4. **Build and Start**:
   ```bash
   npm run build  # Build both client and server
   npm start      # Start production server
   ```

5. **Configure External Services**:
   - Update LemonSqueezy webhook URL
   - Update Supabase auth redirect URLs
   - Test payment flow end-to-end

## 🧩 Key Components & Features

### Authentication (AuthContext.tsx)
- Supabase authentication with email/password
- Profile creation with `onboarding_complete: false` for new users
- Session management and user state

### Onboarding Flow
- **Components**: Located in `client/src/components/Onboarding/`
- **Progress Tracking**: 10 steps with navigation controls
- **Data Collection**: User preferences, assessment results, program assignment
- **Issue Resolution**: Fixed bounds checking in CommitmentQuestions component

### Payment Integration
- **LemonSqueezy Setup**: Store ID and API key configuration
- **Webhook Handling**: Server endpoint at `/api/lemonsqueezy/webhooks`
- **Subscription Plans**: Basic, Pro, Lifetime with variant IDs
- **Access Control**: Subscription status gates main app features

### Task Management
- **Local Storage**: Tasks and progress stored in browser
- **Categories**: Sleep, Movement, Nutrition, Recovery, Mindfulness
- **Skill System**: Experience points and level progression
- **Achievement System**: Milestone-based rewards

### PWA Features
- **Service Worker**: Offline caching and install prompts
- **Install Banner**: Custom install UI for mobile devices
- **Update Notifications**: Automatic update detection

## 🔧 Development Utilities

### Reset Functions (Available Globally)
- `resetOnboarding()`: Clear localStorage onboarding data only
- `resetOnboardingAndAuth()`: Clear localStorage + sign out from Supabase
- `testLemonSqueezy()`: Test payment integration

### Debug Features
- Extensive console logging for auth flow debugging
- Component state visibility in App.tsx
- Error boundaries and validation

## 🚨 Known Issues & Solutions

### 1. Onboarding Bypass
**Issue**: Existing users skip onboarding
**Solution**: App checks onboarding status before authentication

### 2. CommitmentQuestions Crash
**Issue**: Array bounds error on question navigation
**Solution**: Added `safeCurrentQuestion` with bounds checking

### 3. Auto-completion Bug
**Issue**: Users auto-marked as onboarding complete during signup
**Solution**: AuthContext sets `onboarding_complete: false` for new profiles

## 📱 Mobile Support

### PWA Installation
- Custom install prompts for iOS and Android
- Service worker registration for offline capability
- Mobile-first responsive design

### Network Access
- CORS configured for local network testing
- Mobile device testing on local network IPs
- Optimized for mobile performance

## 🔒 Security Considerations

### Environment Variables
- Separate client/server environment files
- API keys properly secured in Replit Secrets
- No sensitive data in client-side code

### Database Security
- Row Level Security (RLS) enabled on all tables
- User-specific data access policies
- Service role key for server operations only

### Payment Security
- LemonSqueezy handles all payment processing
- Webhook signature verification
- No payment data stored locally

## 📋 Deployment Checklist for Replit

- [ ] Update all environment variables with Replit URL
- [ ] Configure LemonSqueezy webhook endpoint
- [ ] Update Supabase auth redirect URLs
- [ ] Test payment flow end-to-end
- [ ] Verify PWA install prompts work
- [ ] Test onboarding flow completely
- [ ] Confirm subscription access control
- [ ] Validate mobile responsiveness
- [ ] Check offline functionality
- [ ] Test reset functions work properly

This PWA is production-ready with proper error handling, authentication flow, payment integration, and mobile optimization. The main consideration for Replit deployment is updating all URL references from localhost to the Replit domain. 