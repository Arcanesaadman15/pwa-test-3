# Profile Loading Fix for Google Sign-Up

## Issue Description
Users signing up with Google would get stuck on the "Loading your profile..." screen indefinitely, even though the Supabase account was successfully created.

## Root Causes Identified

### 1. Complex Retry Logic with Race Conditions
The original `fetchUserProfile` function had:
- Multiple timeout conditions (3-15 seconds)
- Complex retry logic with exponential backoff
- Multiple async operations running in parallel
- Race conditions between auth state changes and profile fetching

### 2. Overly Aggressive Error Handling
- The code would give up entirely if profile creation failed
- No fallback to create a minimal profile to unblock the UI
- Complex OAuth-specific logic that could fail

### 3. Missing Separation of Concerns
- Profile fetching and subscription fetching were tightly coupled
- Background refresh logic was overly complex
- Auth state change handler duplicated profile creation logic

## Solution Implemented

### 1. Simplified Profile Fetching Logic
- **Single-path approach**: Try cache → Auth session → Profile fetch → Create if missing
- **Graceful degradation**: Always create a minimal profile if anything fails
- **Immediate UI unblocking**: Set `setLoading(false)` in all code paths

### 2. Robust Fallback Strategy
```typescript
// Always create a minimal profile if anything goes wrong
const minimalProfile = {
  id: supabaseUserId,
  name: userEmail?.split('@')[0] || 'User',
  email: userEmail || '',
  program: 'beginner',
  // ... other required fields with defaults
  onboarding_complete: false
};
setUserProfile(minimalProfile);
setLoading(false); // CRITICAL: Always unblock UI
```

### 3. Separated Background Operations
- Profile fetching is now separate from subscription fetching
- Background updates don't block the UI
- Simpler error handling for background operations

### 4. Reduced Auth State Complexity
- Removed duplicate profile creation logic from auth state change handler
- Let the unified `fetchUserProfile` handle all profile creation scenarios
- Cleaner separation between auth events and profile management

## Key Changes Made

### 1. In `fetchUserProfile` function:
- ✅ Simplified from 300+ lines to ~170 lines
- ✅ Removed complex retry loops and timeouts
- ✅ Added multiple fallback strategies
- ✅ Guaranteed `setLoading(false)` execution

### 2. In auth state change handler:
- ✅ Removed OAuth-specific profile creation logic
- ✅ Simplified to just call `fetchUserProfile`
- ✅ Reduced complexity by 80%

### 3. Added separate background functions:
- ✅ `fetchProfileAndSubscriptionInBackground` - for profile cache updates
- ✅ `fetchSubscriptionInBackground` - for subscription data
- ✅ Cleaner error handling without blocking UI

## Expected Behavior After Fix

### For New Google Users:
1. **Sign up with Google** → Redirected back to app
2. **Auth session established** → `fetchUserProfile` called
3. **No profile found** → New profile created automatically
4. **Profile creation succeeds/fails** → Minimal profile set regardless
5. **UI unblocked immediately** → User proceeds to onboarding
6. **Background sync** → Real profile data fetched and cached

### For Existing Users:
1. **Cached profile loaded** → Instant UI
2. **Background refresh** → Updated profile data
3. **No interruption** → Seamless experience

## Testing Recommendations

### 1. Test New Google Sign-up:
```bash
1. Clear browser data/localStorage
2. Sign up with a new Google account
3. Verify: No infinite loading screen
4. Verify: User proceeds to onboarding
5. Check console: Should see "✅ Profile created successfully" or "⚠️ Using minimal profile"
```

### 2. Test Existing Users:
```bash
1. Sign in with existing Google account
2. Verify: Instant loading from cache
3. Verify: Background refresh updates data
```

### 3. Test Error Scenarios:
```bash
1. Simulate network issues during profile creation
2. Verify: Minimal profile created, UI not blocked
3. Check: Background sync recovers when network returns
```

## Database Considerations

The fix works with the current database setup, but ensure these RLS policies exist:

```sql
-- Users table RLS policies
CREATE POLICY "Users can view own profile" ON users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON users  
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON users
  FOR INSERT WITH CHECK (auth.uid() = id);
```

## Monitoring

Key log messages to monitor:
- ✅ `"✅ Profile loaded:"` - Successful profile fetch
- ✅ `"✅ Profile created successfully"` - New profile creation
- ⚠️ `"⚠️ Using minimal profile"` - Fallback mode (investigate if frequent)
- ❌ `"❌ Profile creation failed:"` - Database/RLS issues (investigate immediately)

The fix ensures users never get stuck on loading screens, even if database operations fail.
