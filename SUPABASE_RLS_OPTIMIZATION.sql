-- SUPABASE RLS POLICY OPTIMIZATION
-- This script optimizes RLS policies to resolve HTTP 406 errors and improve performance
-- Run these commands in your Supabase SQL editor

-- =============================================================================
-- 1. DROP EXISTING POLICIES (if they exist)
-- =============================================================================

-- Users table policies
DROP POLICY IF EXISTS "Users can view own profile" ON users;
DROP POLICY IF EXISTS "Users can update own profile" ON users;
DROP POLICY IF EXISTS "Users can insert own profile" ON users;

-- User subscriptions table policies  
DROP POLICY IF EXISTS "Users can view own subscriptions" ON user_subscriptions;
DROP POLICY IF EXISTS "Users can update own subscriptions" ON user_subscriptions;
DROP POLICY IF EXISTS "Users can insert own subscriptions" ON user_subscriptions;

-- =============================================================================
-- 2. CREATE OPTIMIZED RLS POLICIES
-- =============================================================================

-- USERS TABLE POLICIES
-- Using (select auth.uid()) instead of auth.uid() for better performance
-- This prevents re-evaluation of auth.uid() for each row

CREATE POLICY "Users can view own profile" ON users
  FOR SELECT USING (id = (select auth.uid()));

CREATE POLICY "Users can update own profile" ON users
  FOR UPDATE USING (id = (select auth.uid()));

CREATE POLICY "Users can insert own profile" ON users
  FOR INSERT WITH CHECK (id = (select auth.uid()));

-- USER SUBSCRIPTIONS TABLE POLICIES
CREATE POLICY "Users can view own subscriptions" ON user_subscriptions
  FOR SELECT USING (user_id = (select auth.uid()));

CREATE POLICY "Users can update own subscriptions" ON user_subscriptions
  FOR UPDATE USING (user_id = (select auth.uid()));

CREATE POLICY "Users can insert own subscriptions" ON user_subscriptions
  FOR INSERT WITH CHECK (user_id = (select auth.uid()));

-- =============================================================================
-- 3. ADD MISSING INDEXES FOR PERFORMANCE
-- =============================================================================

-- Index on user_subscriptions.user_id for faster lookups
CREATE INDEX IF NOT EXISTS idx_user_subscriptions_user_id 
ON user_subscriptions(user_id);

-- Index on user_subscriptions.plan_id for faster joins
CREATE INDEX IF NOT EXISTS idx_user_subscriptions_plan_id 
ON user_subscriptions(plan_id);

-- Index on user_subscriptions.status for filtering active subscriptions
CREATE INDEX IF NOT EXISTS idx_user_subscriptions_status 
ON user_subscriptions(status);

-- Composite index for common query patterns
CREATE INDEX IF NOT EXISTS idx_user_subscriptions_user_status 
ON user_subscriptions(user_id, status);

-- =============================================================================
-- 4. VERIFY RLS IS ENABLED
-- =============================================================================

-- Ensure RLS is enabled on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscription_plans ENABLE ROW LEVEL SECURITY;

-- =============================================================================
-- 5. TEST QUERIES (Optional - for verification)
-- =============================================================================

-- Test that policies work correctly
-- Replace 'your-user-id' with an actual user ID for testing

-- This should work for authenticated users:
-- SELECT * FROM users WHERE id = 'your-user-id';

-- This should return subscriptions for the authenticated user:
-- SELECT us.*, sp.name, sp.price, sp.interval 
-- FROM user_subscriptions us
-- JOIN subscription_plans sp ON us.plan_id = sp.id
-- WHERE us.user_id = 'your-user-id' AND us.status = 'active';

-- =============================================================================
-- SUMMARY OF OPTIMIZATIONS
-- =============================================================================

-- 1. ✅ Replaced auth.uid() with (select auth.uid()) for better performance
-- 2. ✅ Added proper WITH CHECK clauses for INSERT policies
-- 3. ✅ Added database indexes for faster queries
-- 4. ✅ Ensured RLS is properly enabled on all tables
-- 5. ✅ These changes should resolve HTTP 406 errors and improve query speed

-- Expected impact:
-- - Query times reduced from 15+ seconds to <100ms
-- - HTTP 406 errors eliminated
-- - Better user experience with faster loading
