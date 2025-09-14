-- RESET DATABASE FOR TESTING
-- This script safely deletes all user data from Supabase tables
-- Run these commands in your Supabase SQL editor

-- =============================================================================
-- WARNING: This will delete ALL user data - only use for testing!
-- =============================================================================

-- =============================================================================
-- 1. DELETE ALL USER DATA (in correct order to respect foreign keys)
-- =============================================================================

-- Delete user subscriptions first (has foreign key to users)
DELETE FROM user_subscriptions;

-- Delete all users
DELETE FROM users;

-- =============================================================================
-- 2. RESET AUTO-INCREMENT SEQUENCES (if any exist)
-- =============================================================================

-- Reset any sequences that might exist (usually not needed for UUID primary keys)
-- This ensures clean IDs for testing

-- =============================================================================
-- 3. VERIFY DELETION
-- =============================================================================

-- Check that all tables are empty
SELECT 'users' as table_name, COUNT(*) as record_count FROM users
UNION ALL
SELECT 'user_subscriptions' as table_name, COUNT(*) as record_count FROM user_subscriptions
UNION ALL  
SELECT 'subscription_plans' as table_name, COUNT(*) as record_count FROM subscription_plans;

-- =============================================================================
-- 4. OPTIONAL: KEEP SUBSCRIPTION PLANS FOR TESTING
-- =============================================================================

-- If you want to keep your subscription plans, comment out this section
-- Otherwise, uncomment to also delete subscription plans:

-- DELETE FROM subscription_plans;

-- =============================================================================
-- WHAT THIS SCRIPT DOES:
-- =============================================================================

-- ✅ Deletes all user profiles from users table
-- ✅ Deletes all user subscriptions from user_subscriptions table  
-- ✅ Preserves subscription_plans table (your pricing tiers)
-- ✅ Respects foreign key constraints (deletes in correct order)
-- ✅ Shows verification counts to confirm deletion

-- =============================================================================
-- AFTER RUNNING THIS SCRIPT:
-- =============================================================================

-- 1. All user accounts will be removed
-- 2. All subscription data will be cleared
-- 3. Authentication sessions will remain in auth.users (Supabase Auth)
-- 4. Your app will treat returning users as "new" users
-- 5. Perfect for testing the complete signup flow from scratch

-- =============================================================================
-- TO TEST AFTER RESET:
-- =============================================================================

-- 1. Clear browser localStorage/cookies
-- 2. Go to your app
-- 3. Sign up with Google (will create fresh profile)
-- 4. Test the complete onboarding → subscription flow
-- 5. Should see no HTTP 406 errors with optimized RLS policies!
