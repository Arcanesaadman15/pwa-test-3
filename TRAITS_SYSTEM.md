# Testosterone Traits System

## Overview

The Traits system tracks 13 key testosterone-boosting habits and provides permanent scoring that increases as users complete related tasks. This creates long-term motivation and shows users their progress in areas that naturally boost testosterone.

## Core Features

### 1. Trait Definitions

13 major traits mapped to testosterone-boosting habits:

**Physical Traits:**
- `MovementVolume` - Daily steps and movement
- `StrengthTraining` - Resistance training and muscle building  
- `ExplosivePower` - HIIT, sprints, and plyometrics
- `MobilityFlexibility` - Yoga and mobility work
- `PostureBreathControl` - Confident posture and breathing

**Nutrition Traits:**
- `ProteinAdequacy` - Sufficient protein intake
- `Hydration` - Optimal water intake and timing

**Sleep Traits:**
- `SleepConsistency` - 7+ hours of quality sleep

**Recovery Traits:**
- `CircadianSunlight` - Morning sunlight exposure
- `ColdResilience` - Cold therapy and exposure
- `RecoveryHygiene` - Active recovery practices

**Mental Traits:**
- `StressResilience` - Mindfulness and stress management
- `ConfidenceDrive` - Confidence building and momentum

### 2. Scoring System

- **Range:** 0-100 points per trait
- **Permanent:** Scores never decay
- **Task-Based:** Points awarded for completing specific tasks
- **Consecutive Bonuses:** Extra points for streaks (where applicable)
- **Weekly Caps:** Prevent grinding, encourage consistency

### 3. Task → Trait Mapping

Each task completion awards points to relevant traits:
- `sleep_7h` → +8 SleepConsistency (+ streak bonus)
- `full_body_workout` → +10 StrengthTraining  
- `steps_10k` → +6 MovementVolume
- `mindfulness_10m` → +7 StressResilience
- etc.

### 4. Onboarding Integration

- **Baseline Scoring:** Initial trait scores calculated from quiz answers
- **Projections:** Shows potential improvement with recommended program
- **Motivation:** Users see their growth potential before starting

## Implementation

### Data Structure

```typescript
interface TraitDefinition {
  id: TraitId;
  title: string;
  description: string;
  category: 'Physical' | 'Nutrition' | 'Sleep' | 'Mental' | 'Recovery';
  icon: string;
  sources: Array<{ taskId: string; points: number; consecutiveBonus?: number }>;
  weeklyCap?: number;
}

interface UserTraitScores {
  [traitId: string]: number; // 0-100
}
```

### Key Files

- `client/src/types/traits.ts` - Type definitions
- `client/src/data/traitDefinitions.ts` - Trait configuration
- `client/src/lib/traitSystem.ts` - Core scoring logic
- `client/src/lib/traitInitializer.ts` - Onboarding integration
- `client/src/components/Skills/TraitsPage.tsx` - UI component
- `client/src/lib/storage.ts` - Persistence (localStorage)

### Integration Points

1. **Task Completion:** `taskEngine.ts` calls `traitSystem.applyTaskCompletion()`
2. **Onboarding:** `Onboarding.tsx` initializes traits from quiz answers
3. **Skills Navigation:** New "Traits" tab in Skills section
4. **Projections:** `InstantDiagnosis.tsx` shows potential improvements

## Usage

### Accessing Traits UI

1. Navigate to Skills section
2. Click "Traits" tab (🔥 icon)
3. View current scores, weekly gains, and projections

### Testing in Console

The following functions are available in browser console:

```javascript
// Run full system test
await testTraitSystem()

// Check current status  
await checkTraitStatus()

// Reset all data (for testing)
await resetTraitData()
```

### Customization

**Adding New Traits:**
1. Add trait ID to `TraitId` type
2. Add definition to `TRAIT_DEFINITIONS` array
3. Map task IDs to point values
4. Update onboarding initialization if needed

**Adjusting Scoring:**
- Modify `points` values in trait sources
- Adjust `weeklyCap` to prevent grinding
- Add `consecutiveBonus` for streak rewards

**UI Customization:**
- Update `TraitsPage.tsx` for layout changes
- Modify `InstantDiagnosis.tsx` for onboarding preview
- Customize category colors and icons

## Benefits

1. **Permanent Progress:** Unlike skills that reset with programs, traits provide lasting achievement
2. **Holistic View:** Shows progress across all testosterone-boosting areas
3. **Motivation:** Clear visualization of improvement and potential
4. **Onboarding Hook:** Projections create excitement for program benefits
5. **Retention:** Long-term tracking encourages continued engagement

## Analytics Events

The system tracks:
- `trait_gain` - When points are awarded
- `trait_milestone` - When significant scores are reached
- `onboarding_traits_initialized` - Baseline setup
- `traits_page_viewed` - UI engagement

This provides insights into which habits users are building and where they need more support.
