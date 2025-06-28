# 🧪 LemonSqueezy Quick Test Guide

Your payment integration should now work! Here's how to test it:

## 🔍 Step 1: Test Configuration

Visit this URL to check if your environment variables are working:
```
https://peakforge.club/api/lemonsqueezy/test
```

**Expected Response:**
```json
{
  "status": "LemonSqueezy Configuration Test",
  "configured": true,
  "webhookReady": true,
  "config": {
    "hasApiKey": true,
    "hasStoreId": true,
    "hasWebhookSecret": true,
    "storeId": "YOUR_STORE_ID",
    "apiKeyPrefix": "lemon_12...",
    "webhookSecretPrefix": "whsec_ab..."
  },
  "notes": {
    "payment": "✅ Ready for payments",
    "webhooks": "✅ Webhooks secured"
  }
}
```

## 🚨 If Test Fails

### Problem: `"configured": false`

**Solution:** Your Vercel environment variables aren't set properly.

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click on your `pwa-test-3` project
3. Go to **Settings** → **Environment Variables**
4. Add these variables:
   - `VITE_LEMONSQUEEZY_STORE_ID` = Your LemonSqueezy Store ID
   - `VITE_LEMONSQUEEZY_API_KEY` = Your LemonSqueezy API Key
   - `LEMONSQUEEZY_WEBHOOK_SECRET` = Your LemonSqueezy Webhook Secret (optional for testing)
5. **Redeploy** your app (go to Deployments → click "..." → Redeploy)

### Problem: Invalid Store/API Key

**Get Your Credentials:**
1. Go to [LemonSqueezy Dashboard](https://app.lemonsqueezy.com)
2. **Store ID:** Settings → Store → Store ID (6-digit number)
3. **API Key:** Settings → API → Create new API key

## ✅ Step 2: Test Payment Flow

1. **Go through onboarding** in your app
2. **Click "Subscribe" on pricing page**
3. **Should redirect to LemonSqueezy checkout**

## 🧪 Step 3: Mock Mode (If LemonSqueezy Not Ready)

If you want to test the UI flow without LemonSqueezy:

1. Add this to your Vercel environment variables:
   ```
   VITE_LEMONSQUEEZY_MOCK_MODE=true
   ```
2. Redeploy
3. Payment buttons will now redirect to success page instead of real checkout

## 🎯 Current Configuration

Your app is currently set up with:
- **Store ID:** Uses your `VITE_LEMONSQUEEZY_STORE_ID`
- **Variant ID:** `821326` (Pro plan at $15.99/month)
- **Test Mode:** Automatically enabled in development

## 🔧 Troubleshooting

### Error: "Store ID not configured"
- Environment variable `VITE_LEMONSQUEEZY_STORE_ID` missing
- Check Vercel dashboard environment variables

### Error: "API Key not configured"  
- Environment variable `VITE_LEMONSQUEEZY_API_KEY` missing
- Generate new API key in LemonSqueezy dashboard

### Error: "Invalid variant ID"
- Variant `821326` doesn't exist in your store
- Create a product in LemonSqueezy and update the variant ID

### Payment button does nothing
- Check browser console for errors
- Test the `/api/lemonsqueezy/test` endpoint first

### Webhooks not working (optional for basic testing)
- Missing `LEMONSQUEEZY_WEBHOOK_SECRET` environment variable
- **To set up webhooks:**
  1. Go to LemonSqueezy Dashboard → Settings → Webhooks
  2. Create new webhook pointing to: `https://peakforge.club/api/lemonsqueezy/webhooks`
  3. Select all `subscription_*` and `order_*` events
  4. Add your `LEMONSQUEEZY_WEBHOOK_SECRET` to the webhook settings
  5. This will now update user subscription status in your app's database whenever it changes

## 🎉 Success!

When working, you'll see:
1. ✅ Configuration test returns `"configured": true`
2. ✅ Payment buttons redirect to LemonSqueezy checkout
3. ✅ After payment, user is redirected back to your app
4. ✅ User gets access to premium features

## 📞 Need Help?

1. **Check Vercel function logs** in your dashboard
2. **Browser console** for client-side errors  
3. **Test endpoint** at `/api/lemonsqueezy/test` to debug config

The integration is now properly configured for Vercel's environment variable system! 🚀 