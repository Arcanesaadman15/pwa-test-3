import { TraitDefinition } from '@/types/traits';

export const TRAIT_DEFINITIONS: TraitDefinition[] = [
  {
    id: 'SleepConsistency',
    title: 'Sleep Consistency',
    description: 'Quality 7+ hour sleep with regular timing for optimal testosterone production and recovery.',
    category: 'Sleep',
    icon: 'Moon',
    sources: [{ taskId: 'sleep_7h', points: 8, consecutiveBonus: 2 }],
    weeklyCap: 56 // 8 points * 7 days
  },
  {
    id: 'MovementVolume',
    title: 'Movement Volume',
    description: 'Daily steps and consistent movement to boost metabolism and energy.',
    category: 'Physical',
    icon: 'Footprints',
    sources: [
      { taskId: 'steps_10k', points: 6, consecutiveBonus: 1 },
      { taskId: 'brisk_walk_30m', points: 5 },
      { taskId: 'alpha_walk_10m', points: 3 },
      { taskId: 'energy_boost_combo', points: 2 }
    ],
    weeklyCap: 50
  },
  {
    id: 'StrengthTraining',
    title: 'Strength Training',
    description: 'Resistance training to build muscle mass and naturally boost testosterone.',
    category: 'Physical',
    icon: 'Dumbbell',
    sources: [
      { taskId: 'full_body_workout', points: 10 },
      { taskId: 'heavy_leg_day', points: 12 },
      { taskId: 'bw_strength_circuit', points: 8 },
      { taskId: 'victory_squats', points: 3 },
      { taskId: 'chair_squats', points: 2 },
      { taskId: 'loaded_carry', points: 9 },
      { taskId: 'loaded_carry_long', points: 11 }
    ],
    weeklyCap: 60
  },
  {
    id: 'ExplosivePower',
    title: 'Explosive Power',
    description: 'High-intensity training for maximum hormonal response and athletic performance.',
    category: 'Physical',
    icon: 'Zap',
    sources: [
      { taskId: 'hiit_sprints', points: 12 },
      { taskId: 'plyo_jump_set', points: 10 },
      { taskId: 'plyo_jump_set_advanced', points: 15 }
    ],
    weeklyCap: 45
  },
  {
    id: 'MobilityFlexibility',
    title: 'Mobility & Flexibility',
    description: 'Flexibility and mobility work to reduce stress and improve movement quality.',
    category: 'Physical',
    icon: 'RotateCcw',
    sources: [
      { taskId: 'yoga_stretch_15m', points: 6 },
      { taskId: 'mobility_20min', points: 8 }
    ],
    weeklyCap: 35
  },
  {
    id: 'PostureBreathControl',
    title: 'Posture & Breath Control',
    description: 'Confident posture and breathing techniques for stress reduction and presence.',
    category: 'Physical',
    icon: 'Wind',
    sources: [
      { taskId: 'breath_posture_5m', points: 4, consecutiveBonus: 1 },
      { taskId: 'breathe_power_2m', points: 3, consecutiveBonus: 1 }
    ],
    weeklyCap: 40
  },
  {
    id: 'ProteinAdequacy',
    title: 'Protein Adequacy',
    description: 'Sufficient protein intake for muscle building and metabolic health.',
    category: 'Nutrition',
    icon: 'Apple',
    sources: [
      { taskId: 'protein_target', points: 7, consecutiveBonus: 1 },
      { taskId: 'protein_power_snack', points: 3 }
    ],
    weeklyCap: 55
  },
  {
    id: 'Hydration',
    title: 'Hydration',
    description: 'Optimal hydration for performance, energy, and metabolic function.',
    category: 'Nutrition',
    icon: 'Droplets',
    sources: [
      { taskId: 'morning_hydration', points: 3, consecutiveBonus: 1 },
      { taskId: 'daily_water_goal', points: 5, consecutiveBonus: 1 },
      { taskId: 'pre_workout_hydration', points: 2 },
      { taskId: 'hydration_tracking', points: 4 }
    ],
    weeklyCap: 45
  },
  {
    id: 'CircadianSunlight',
    title: 'Circadian Sunlight',
    description: 'Morning sunlight exposure for optimal circadian rhythm and vitamin D.',
    category: 'Recovery',
    icon: 'Sun',
    sources: [
      { taskId: 'sunlight_15min', points: 6, consecutiveBonus: 2 }
    ],
    weeklyCap: 56 // 8 points * 7 days with bonus
  },
  {
    id: 'ColdResilience',
    title: 'Cold Resilience',
    description: 'Cold exposure for hormonal benefits, stress resilience, and mental toughness.',
    category: 'Recovery',
    icon: 'Snowflake',
    sources: [
      { taskId: 'cold_blast_15s', points: 4, consecutiveBonus: 1 },
      { taskId: 'cold_shower_30s', points: 6, consecutiveBonus: 1 }
    ],
    weeklyCap: 45
  },
  {
    id: 'RecoveryHygiene',
    title: 'Recovery Hygiene',
    description: 'Active recovery practices for stress management and physical restoration.',
    category: 'Recovery',
    icon: 'Leaf',
    sources: [
      { taskId: 'yoga_stretch_15m', points: 5 }, // Shared with mobility
      { taskId: 'cold_shower_30s', points: 3 } // Partial overlap with cold resilience
    ],
    weeklyCap: 35
  },
  {
    id: 'StressResilience',
    title: 'Stress Resilience',
    description: 'Mindfulness and stress management for optimal cortisol levels.',
    category: 'Mental',
    icon: 'Brain',
    sources: [
      { taskId: 'mindfulness_10m', points: 7, consecutiveBonus: 1 },
      { taskId: 'zen_minute', points: 3 }
    ],
    weeklyCap: 40
  },
  {
    id: 'ConfidenceDrive',
    title: 'Confidence & Drive',
    description: 'Building unshakeable confidence and daily momentum for peak performance.',
    category: 'Mental',
    icon: 'Target',
    sources: [
      { taskId: 'morning_wins_3m', points: 5, consecutiveBonus: 1 },
      { taskId: 'power_pose_1m', points: 4 },
      { taskId: 'confidence_check', points: 3, consecutiveBonus: 1 }
    ],
    weeklyCap: 45
  }
];

// Helper function to get trait by ID
export function getTraitById(id: string): TraitDefinition | undefined {
  return TRAIT_DEFINITIONS.find(trait => trait.id === id);
}

// Helper function to get traits by category
export function getTraitsByCategory(category: string): TraitDefinition[] {
  return TRAIT_DEFINITIONS.filter(trait => trait.category === category);
}

// Helper function to get all trait categories
export function getTraitCategories(): string[] {
  return [...new Set(TRAIT_DEFINITIONS.map(trait => trait.category))];
}
