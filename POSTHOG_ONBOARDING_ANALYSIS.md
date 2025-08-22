# PostHog Onboarding Funnel Analysis Guide

## Enhanced Tracking Events

Your onboarding now tracks these key events:

### Step Progression Events
- `onboarding_step_viewed` - When user sees each step
- `onboarding_step_completed` - When user completes each step  
- `onboarding_completed` - When entire onboarding is finished
- `onboarding_abandoned` - When user exits without completing

### Event Properties
Each event includes:
- `step` - Current step name (splash, problems, quiz, etc.)
- `step_index` - Numeric position (0-9)
- `progress` - Percentage complete (0-100%)
- `total_steps` - Total number of steps

## How to Analyze Drop-offs in PostHog

### 1. **Funnel Analysis** (Recommended)
**Go to: PostHog → Insights → New Insight → Funnel**

Create a funnel with these steps:
```
Step 1: onboarding_step_viewed (step = problems)
Step 2: onboarding_step_viewed (step = quiz) 
Step 3: onboarding_step_viewed (step = sliders)
Step 4: onboarding_step_viewed (step = commitment)
Step 5: onboarding_step_viewed (step = diagnosis)
Step 6: onboarding_step_viewed (step = roadmap)
Step 7: onboarding_step_viewed (step = social)
Step 8: onboarding_step_viewed (step = paywall)
Step 9: onboarding_completed
```

**What you'll see:**
- Exact drop-off percentages between each step
- Which step loses the most users
- Overall conversion rate from start to completion

### 2. **Step Completion Rate Analysis**
**Go to: PostHog → Insights → New Insight → Trend**

Track these metrics:
- `onboarding_step_viewed` (total views per step)
- `onboarding_step_completed` (total completions per step)

**Breakdown by:** `step` property

**Formula for completion rate:**
```
Completion Rate = (step_completed events) / (step_viewed events) × 100%
```

### 3. **Abandonment Hot Spots**
**Go to: PostHog → Insights → New Insight → Trend**

Track: `onboarding_abandoned`
**Breakdown by:** `abandoned_at_step`

This shows exactly where users quit most often.

### 4. **Time-to-Complete Analysis**
**Go to: PostHog → Insights → New Insight → Trend**

Track: `onboarding_completed`
**Show:** `completion_time_minutes` (average)

Helps identify if steps take too long.

## Example Queries

### Most Common Drop-off Points
```sql
SELECT 
  abandoned_at_step,
  COUNT(*) as abandonment_count,
  AVG(progress) as avg_progress_when_abandoned
FROM events 
WHERE event = 'onboarding_abandoned'
  AND timestamp >= NOW() - INTERVAL 7 DAY
GROUP BY abandoned_at_step
ORDER BY abandonment_count DESC
```

### Step-by-Step Conversion Rates
```sql
SELECT 
  step,
  COUNT(CASE WHEN event = 'onboarding_step_viewed' THEN 1 END) as views,
  COUNT(CASE WHEN event = 'onboarding_step_completed' THEN 1 END) as completions,
  ROUND(
    COUNT(CASE WHEN event = 'onboarding_step_completed' THEN 1 END) * 100.0 / 
    COUNT(CASE WHEN event = 'onboarding_step_viewed' THEN 1 END), 
    2
  ) as completion_rate_pct
FROM events 
WHERE event IN ('onboarding_step_viewed', 'onboarding_step_completed')
  AND timestamp >= NOW() - INTERVAL 7 DAY
GROUP BY step
ORDER BY step_index
```

## Key Metrics to Monitor

### ✅ **Overall Funnel Metrics**
- **Onboarding Start Rate**: Users who view step 1
- **Paywall Reach Rate**: Users who reach the paywall step  
- **Overall Completion Rate**: Users who complete entire onboarding
- **Purchase Conversion**: Users who complete AND subscribe

### ✅ **Step-Level Metrics**  
- **Step Drop-off Rate**: % who view but don't complete each step
- **Step Completion Time**: How long users spend on each step
- **Most Abandoned Steps**: Where users quit most often

### ✅ **User Segments**
- **Mobile vs Desktop**: Completion rates by device
- **Traffic Source**: Organic vs paid vs direct
- **User Demographics**: Age, location patterns

## Setting Up Alerts

**Go to: PostHog → Insights → [Your Funnel] → Subscriptions**

Set alerts for:
- Overall completion rate drops below X%
- Specific step drop-off exceeds Y%
- Daily abandonment count above Z

## Recommended Dashboard

Create a dashboard with:
1. **Onboarding Funnel** (main conversion flow)
2. **Step Completion Rates** (bar chart by step)
3. **Abandonment Heatmap** (where users quit)
4. **Daily Completion Trend** (time series)
5. **Average Completion Time** (single stat)

This gives you a complete view of onboarding performance at a glance!



