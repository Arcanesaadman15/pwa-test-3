# 🍋 LemonSqueezy Integration Setup Guide

This guide will walk you through setting up LemonSqueezy payments for your PeakForge PWA.

## 📋 Prerequisites

- A LemonSqueezy account (sign up at https://lemonsqueezy.com)
- Your PeakForge PWA project set up with Supabase
- Basic understanding of webhooks

## 🚀 Step 1: LemonSqueezy Account Setup

### 1. Create a LemonSqueezy Account
1. Go to https://lemonsqueezy.com and sign up
2. Verify your email address
3. Create your first store (your account starts in Test mode by default)

### 2. Create Your Products
1. In your LemonSqueezy dashboard, go to "Products"
2. Click "New Product" and create subscription plans:
   - **Basic Plan**: $12.99/month
   - **Pro Plan**: $24.99/month (mark as popular)
   - **Lifetime Plan**: $99.99 one-time payment

3. For each product, create variants for different billing periods (monthly/yearly)
4. Note down the **Variant IDs** for each plan - you'll need these later

### 3. Generate API Keys
1. Go to Settings → API
2. Click "Create API Key"
3. Give it a name like "PeakForge Development"
4. Copy the API key (keep it secure!)
5. Note down your **Store ID** (visible in the store settings)

## 🔧 Step 2: Environment Configuration

### Client Environment (client/.env.local)
Update your `client/.env.local` file:

```env
# Supabase Configuration
VITE_SUPABASE_URL=https://vkczvtgtbzcqempgampj.supabase.co
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# LemonSqueezy Configuration
VITE_LEMONSQUEEZY_STORE_ID=your_store_id_here
VITE_LEMONSQUEEZY_API_KEY=your_api_key_here

# Your app URL for webhooks and redirects
VITE_APP_URL=http://localhost:3000
```

### Server Environment (server/.env)
Update your `server/.env` file:

```env
# Supabase Configuration
SUPABASE_URL=https://vkczvtgtbzcqempgampj.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here

# LemonSqueezy Configuration
LEMONSQUEEZY_API_KEY=your_api_key_here
LEMONSQUEEZY_STORE_ID=your_store_id_here
LEMONSQUEEZY_WEBHOOK_SECRET=your_webhook_secret_here

# Server Configuration
PORT=3000
NODE_ENV=development

# App URL for redirects
APP_URL=http://localhost:3000
```

## 🎯 Step 3: Update Subscription Plans

Update the variant IDs in `client/src/lib/lemonsqueezy.ts`:

```typescript
export const SUBSCRIPTION_PLANS: SubscriptionPlan[] = [
  {
    id: 'basic',
    name: 'Basic',
    description: 'Perfect for getting started with your wellness journey',
    price: 1299, // $12.99 in cents
    interval: 'month',
    variantId: 'YOUR_BASIC_VARIANT_ID', // Replace with actual LemonSqueezy variant ID
    features: [
      'Core wellness tasks',
      'Basic progress tracking',
      'Email support',
      'Mobile app access'
    ]
  },
  {
    id: 'pro',
    name: 'Pro',
    description: 'Advanced features for serious wellness enthusiasts',
    price: 2499, // $24.99 in cents
    interval: 'month',
    variantId: 'YOUR_PRO_VARIANT_ID', // Replace with actual LemonSqueezy variant ID
    popular: true,
    features: [
      'All Basic features',
      'Advanced analytics',
      'Custom programs',
      'Priority support',
      'Exclusive content',
      'Progress insights'
    ]
  },
  {
    id: 'lifetime',
    name: 'Lifetime',
    description: 'One-time payment for lifetime access',
    price: 9999, // $99.99 in cents
    interval: 'lifetime',
    variantId: 'YOUR_LIFETIME_VARIANT_ID', // Replace with actual LemonSqueezy variant ID
    features: [
      'All Pro features',
      'Lifetime updates',
      'VIP support',
      'Early access to new features',
      'Community access'
    ]
  }
];
```

## 🪝 Step 4: Webhook Setup

### 1. Set up ngrok for local testing
```bash
# Install ngrok if you haven't already
npm install -g ngrok

# In a new terminal, expose your local server
ngrok http 3000
```

### 2. Create Webhook in LemonSqueezy
1. In your LemonSqueezy dashboard, go to Settings → Webhooks
2. Click "Create Webhook"
3. Set the URL to: `https://your-ngrok-url.ngrok.io/api/lemonsqueezy/webhooks`
4. Set a secret (this becomes your `LEMONSQUEEZY_WEBHOOK_SECRET`)
5. Select these events:
   - `subscription_created`
   - `subscription_updated`
   - `subscription_cancelled`
   - `subscription_resumed`
   - `subscription_expired`
   - `subscription_paused`
   - `subscription_unpaused`

## 🗄️ Step 5: Database Setup

The following tables should already exist in your Supabase database:

### subscription_plans
```sql
CREATE TABLE IF NOT EXISTS subscription_plans (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  price INTEGER NOT NULL,
  interval TEXT NOT NULL,
  features TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);
```

### user_subscriptions
```sql
CREATE TABLE IF NOT EXISTS user_subscriptions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  plan_id UUID REFERENCES subscription_plans(id),
  status TEXT NOT NULL,
  stripe_subscription_id TEXT UNIQUE,
  stripe_customer_id TEXT,
  current_period_start TIMESTAMP WITH TIME ZONE,
  current_period_end TIMESTAMP WITH TIME ZONE,
  cancel_at_period_end BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);
```

## 🧪 Step 6: Testing

### 1. Test Checkout Flow
1. Start your development servers:
   ```bash
   # Terminal 1 - Client
   cd client && npm run dev
   
   # Terminal 2 - Server  
   cd server && npm run dev
   
   # Terminal 3 - ngrok
   ngrok http 3000
   ```

2. Navigate to your pricing page
3. Click on a subscription plan
4. Use LemonSqueezy test card numbers:
   - Visa: `4242 4242 4242 4242`
   - Mastercard: `5555 5555 5555 4444`
   - Any future expiry date (e.g., 12/35)
   - Any 3-digit CVC (e.g., 123)

### 2. Test Webhooks
1. Complete a test purchase
2. Check your server logs for webhook events
3. Verify subscription is created in Supabase
4. Test cancellation flow

## 🎉 Step 7: Going Live

### 1. Activate Your Store
1. In LemonSqueezy dashboard, click "Activate Store"
2. Complete identity verification
3. Add payout method (bank account or PayPal)
4. Wait for approval (1-2 business days)

### 2. Production Environment
1. Generate **live mode** API keys in LemonSqueezy
2. Copy products from test mode to live mode using "Copy to Live Mode"
3. Update environment variables with production values
4. Set up production webhook pointing to your live domain
5. Update variant IDs to live mode IDs

### 3. Production Checklist
- [ ] Live API keys configured
- [ ] Production webhook URL set
- [ ] All variant IDs updated to live mode
- [ ] SSL certificate on production domain
- [ ] Environment variables updated
- [ ] Test complete purchase flow on production

## 🔧 API Endpoints Created

Your server now includes these LemonSqueezy endpoints:

- `POST /api/lemonsqueezy/checkout` - Create checkout session
- `GET /api/lemonsqueezy/subscription/:userId` - Get user subscription
- `POST /api/lemonsqueezy/subscription/:subscriptionId/cancel` - Cancel subscription
- `POST /api/lemonsqueezy/webhooks` - Handle LemonSqueezy webhooks

## 🎨 UI Components Created

Your client now includes these subscription components:

- `PricingPlans` - Beautiful pricing plans display
- `SubscriptionManager` - Manage active subscriptions
- `SubscriptionSuccess` - Success page after purchase
- `SubscriptionCancel` - Cancellation/failure page

## 📞 Support

If you need help:
1. Check the [LemonSqueezy documentation](https://docs.lemonsqueezy.com)
2. Test in development mode first
3. Verify webhook signatures are working
4. Check server logs for detailed error messages

## 🛡️ Security Notes

- Never expose API keys in client-side code
- Always verify webhook signatures in production
- Use HTTPS for webhook endpoints
- Store sensitive data in environment variables
- Test thoroughly before going live

---

Your LemonSqueezy integration is now ready! 🎉 