# 🚀 LemonSqueezy Quick Start Guide

Your PeakForge app currently has **placeholder** LemonSqueezy configuration. Here's how to get it working quickly:

## 🎯 Immediate Issues to Fix

### 1. **Store ID Problem**
- **Current**: `12345` (placeholder)
- **Need**: Your actual LemonSqueezy store ID

### 2. **Variant IDs Problem**
- **Current**: `123456`, `123457`, `123458` (placeholders)
- **Need**: Real variant IDs from your LemonSqueezy products

### 3. **Server Environment**
- The server environment variables may need updating

## 🔧 Quick Fix (5 minutes)

### Option A: Use Test Mode (Recommended for Development)

1. **Sign up for LemonSqueezy** (free): https://lemonsqueezy.com
2. **Get your credentials**:
   - Go to Settings → API
   - Copy your **Store ID** (looks like: `12345`)
   - Generate an **API Key**

3. **Update environment files**:

**client/.env.local:**
```env
VITE_LEMONSQUEEZY_STORE_ID=YOUR_ACTUAL_STORE_ID
VITE_LEMONSQUEEZY_API_KEY=YOUR_ACTUAL_API_KEY
```

**server/.env:**
```env
LEMONSQUEEZY_API_KEY=YOUR_ACTUAL_API_KEY
LEMONSQUEEZY_STORE_ID=YOUR_ACTUAL_STORE_ID
```

4. **Create test products** in LemonSqueezy:
   - Basic Plan: $12.99/month
   - Pro Plan: $24.99/month  
   - Lifetime: $99.99 one-time

5. **Update variant IDs** in `client/src/lib/lemonsqueezy.ts`:
```typescript
variantId: 'YOUR_BASIC_VARIANT_ID',    // Replace 123456
variantId: 'YOUR_PRO_VARIANT_ID',      // Replace 123457
variantId: 'YOUR_LIFETIME_VARIANT_ID', // Replace 123458
```

### Option B: Mock Mode (For Immediate Testing)

If you want to test the UI without setting up LemonSqueezy:

**client/src/lib/lemonsqueezy.ts** - Add this at the top of `LemonSqueezyService.createCheckout()`:

```typescript
// TEMPORARY: Mock checkout for testing
if (process.env.NODE_ENV === 'development') {
  console.log('MOCK: Would create checkout for:', options);
  return { 
    checkoutUrl: 'https://example.com/mock-checkout',
    error: undefined 
  };
}
```

## 🧪 Test Your Setup

1. **Start your development servers**:
```bash
# Terminal 1
cd client && npm run dev

# Terminal 2  
cd server && npm run dev
```

2. **Visit the setup page**: http://localhost:5173/lemonsqueezy-setup

3. **Test the pricing page**: http://localhost:5173/pricing

## 🚨 Current Status Check

Run this in your browser console on the pricing page:

```javascript
// Check configuration
console.log('LemonSqueezy Config:', {
  storeId: import.meta.env.VITE_LEMONSQUEEZY_STORE_ID,
  hasApiKey: !!import.meta.env.VITE_LEMONSQUEEZY_API_KEY,
  apiKeyStart: import.meta.env.VITE_LEMONSQUEEZY_API_KEY?.substring(0, 10)
});
```

## 📞 Need Help?

- **Setup page**: Visit `/lemonsqueezy-setup` in your app
- **Full guide**: Check `LEMONSQUEEZY_SETUP.md`
- **Console errors**: Check browser dev tools for detailed error messages

---

**TL;DR**: Replace the placeholder values in your `.env` files with real LemonSqueezy credentials, then restart your dev servers! 🎉 