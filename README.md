# PeakForge PWA

A progressive web app for wellness and fitness tracking with Supabase authentication.

## Features

- **Authentication**: User sign-up and sign-in with Supabase
- **Subscription Management**: Track user subscriptions and plans
- **Local Data**: Tasks, skills, and progress stored locally on device
- **PWA Features**: Offline support, install prompts, service worker

## Supabase Setup

### 1. Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Get your project URL and anon key from Settings > API

### 2. Environment Variables

Create a `.env.local` file in the client directory:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. Database Tables

Create these tables in your Supabase database:

#### Users Table
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

-- Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Policy for users to access their own data
CREATE POLICY "Users can view own profile" ON users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON users
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON users
  FOR INSERT WITH CHECK (auth.uid() = id);
```

#### Subscription Plans Table
```sql
CREATE TABLE subscription_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  price INTEGER NOT NULL, -- Price in cents
  interval TEXT NOT NULL CHECK (interval IN ('month', 'year', 'lifetime')),
  features TEXT[] NOT NULL DEFAULT '{}',
  stripe_product_id TEXT,
  stripe_price_id TEXT,
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE subscription_plans ENABLE ROW LEVEL SECURITY;

-- Policy for public read access to active plans
CREATE POLICY "Anyone can view active plans" ON subscription_plans
  FOR SELECT USING (active = true);
```

#### User Subscriptions Table
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

-- Enable RLS
ALTER TABLE user_subscriptions ENABLE ROW LEVEL SECURITY;

-- Policy for users to access their own subscriptions
CREATE POLICY "Users can view own subscriptions" ON user_subscriptions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own subscriptions" ON user_subscriptions
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own subscriptions" ON user_subscriptions
  FOR INSERT WITH CHECK (auth.uid() = user_id);
```

### 4. Auth Configuration

In your Supabase project settings:

1. **Authentication > Settings**: Configure email templates and settings
2. **Authentication > Providers**: Enable email provider
3. **Authentication > URL Configuration**: Add your domain for redirects

## Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

## Data Architecture

- **Authentication & User Profiles**: Stored in Supabase
- **Subscription Management**: Stored in Supabase
- **Tasks & Progress**: Stored locally using localStorage
- **Skills & Achievements**: Stored locally using localStorage

This hybrid approach provides the benefits of cloud authentication while keeping the core app functionality available offline.

## Local Data Storage

The app uses localStorage for:
- Daily task completions
- Skill progression
- Achievement unlocks
- User progress and streaks

This data remains on the device and doesn't sync to the cloud, ensuring privacy and offline functionality. 