export interface SkillDefinition {
  id: string;
  title: string;
  description: string;
  category: 'Physical' | 'Nutrition' | 'Sleep' | 'Mental' | 'Recovery';
  level: 1 | 2 | 3 | 4 | 5;
  requirements: SkillRequirement[];
  categoryColor: string;
  categoryIcon: string;
}

export interface SkillRequirement {
  taskId: string;
  count: number;
  consecutive?: boolean; // If true, requires consecutive days
}

export interface UnlockedSkill extends SkillDefinition {
  unlockedAt: Date;
  isRecentlyUnlocked?: boolean;
}

// Skill category configuration with lucide-react icons
export const SKILL_CATEGORIES = {
  Physical: { color: '#D13639', icon: 'Dumbbell', name: 'Physical' },
  Nutrition: { color: '#4BA651', icon: 'Apple', name: 'Nutrition' },
  Sleep: { color: '#3679D1', icon: 'Moon', name: 'Sleep' },
  Mental: { color: '#9B59B6', icon: 'Brain', name: 'Mental' },
  Recovery: { color: '#E67E22', icon: 'RotateCcw', name: 'Recovery' }
} as const;

// Complete skill definitions based on PRD
export const SKILL_DEFINITIONS: SkillDefinition[] = [
  // SLEEP CATEGORY SKILLS - Early unlocks for motivation
  {
    id: 'sleep_starter',
    title: 'Sleep Starter',
    description: 'Taking the first steps toward better sleep habits',
    category: 'Sleep',
    level: 1,
    requirements: [
      { taskId: 'sleep_7h', count: 3, consecutive: true }
    ],
    categoryColor: SKILL_CATEGORIES.Sleep.color,
    categoryIcon: SKILL_CATEGORIES.Sleep.icon
  },
  {
    id: 'week_one_warrior',
    title: 'Week One Warrior',
    description: 'Completed your first week of consistent sleep habits',
    category: 'Sleep',
    level: 1,
    requirements: [
      { taskId: 'sleep_7h', count: 7, consecutive: true }
    ],
    categoryColor: SKILL_CATEGORIES.Sleep.color,
    categoryIcon: SKILL_CATEGORIES.Sleep.icon
  },
  {
    id: 'sleep_champion',
    title: 'Sleep Champion',
    description: 'Achieved outstanding consistency in sleep habits',
    category: 'Sleep',
    level: 2,
    requirements: [
      { taskId: 'sleep_7h', count: 14, consecutive: true }
    ],
    categoryColor: SKILL_CATEGORIES.Sleep.color,
    categoryIcon: SKILL_CATEGORIES.Sleep.icon
  },

  // PHYSICAL CATEGORY SKILLS
  
  // Beginner Level (Level 1)
  {
    id: 'first_steps',
    title: 'First Steps',
    description: 'Started your movement journey with consistent walking',
    category: 'Physical',
    level: 1,
    requirements: [{ taskId: 'brisk_walk_30m', count: 3 }],
    categoryColor: SKILL_CATEGORIES.Physical.color,
    categoryIcon: SKILL_CATEGORIES.Physical.icon
  },
  {
    id: 'sunlight_seeker',
    title: 'Sunlight Seeker',
    description: 'Discovered the power of morning natural light',
    category: 'Physical',
    level: 1,
    requirements: [{ taskId: 'sunlight_15min', count: 5 }],
    categoryColor: SKILL_CATEGORIES.Physical.color,
    categoryIcon: SKILL_CATEGORIES.Physical.icon
  },
  {
    id: 'chair_squatter',
    title: 'Chair Squatter',
    description: 'Mastered the fundamentals of bodyweight strength',
    category: 'Physical',
    level: 1,
    requirements: [{ taskId: 'chair_squats', count: 3 }],
    categoryColor: SKILL_CATEGORIES.Physical.color,
    categoryIcon: SKILL_CATEGORIES.Physical.icon
  },
  {
    id: 'early_bird',
    title: 'Early Bird',
    description: 'Combined movement with natural sunlight exposure',
    category: 'Physical',
    level: 1,
    requirements: [
      { taskId: 'walk_30min', count: 3 },
      { taskId: 'morning_sun_15min', count: 2 }
    ],
    categoryColor: SKILL_CATEGORIES.Physical.color,
    categoryIcon: SKILL_CATEGORIES.Physical.icon
  },
  {
    id: 'step_seeker',
    title: 'Step Seeker',
    description: 'Achieved consistent daily step goals',
    category: 'Physical',
    level: 1,
    requirements: [{ taskId: 'steps_10k', count: 5 }],
    categoryColor: SKILL_CATEGORIES.Physical.color,
    categoryIcon: SKILL_CATEGORIES.Physical.icon
  },
  {
    id: 'yoga_novice',
    title: 'Yoga Novice',
    description: 'Embraced flexibility and mindful movement',
    category: 'Physical',
    level: 1,
    requirements: [{ taskId: 'yoga_stretch_15m', count: 3 }],
    categoryColor: SKILL_CATEGORIES.Physical.color,
    categoryIcon: SKILL_CATEGORIES.Physical.icon
  },
  {
    id: 'strength_foundation',
    title: 'Strength Foundation',
    description: 'Built your base with bodyweight exercises',
    category: 'Physical',
    level: 1,
    requirements: [
      { taskId: 'chair_squats', count: 5 },
      { taskId: 'full_body_workout', count: 2 }
    ],
    categoryColor: SKILL_CATEGORIES.Physical.color,
    categoryIcon: SKILL_CATEGORIES.Physical.icon
  },

  // MENTAL CATEGORY SKILLS - Early unlocks for motivation
  {
    id: 'mindful_beginner',
    title: 'Mindful Beginner',
    description: 'Started your journey into mindfulness practice',
    category: 'Mental',
    level: 1,
    requirements: [{ taskId: 'mindfulness_10m', count: 2 }],
    categoryColor: SKILL_CATEGORIES.Mental.color,
    categoryIcon: SKILL_CATEGORIES.Mental.icon
  },
  {
    id: 'breath_awareness',
    title: 'Breath Awareness',
    description: 'Developed focus through breathing and posture',
    category: 'Mental',
    level: 1,
    requirements: [{ taskId: 'breath_posture_5m', count: 3 }],
    categoryColor: SKILL_CATEGORIES.Mental.color,
    categoryIcon: SKILL_CATEGORIES.Mental.icon
  },
  {
    id: 'cold_exposure_starter',
    title: 'Cold Exposure Starter',
    description: 'Embraced the challenge of cold therapy',
    category: 'Mental',
    level: 1,
    requirements: [{ taskId: 'cold_shower_30s', count: 3 }],
    categoryColor: SKILL_CATEGORIES.Mental.color,
    categoryIcon: SKILL_CATEGORIES.Mental.icon
  },

  // NEW GAMIFIED SKILLS FOR ENGAGEMENT
  {
    id: 'power_breather',
    title: 'Power Breather',
    description: 'Mastered the art of confident breathing for instant energy',
    category: 'Mental',
    level: 1,
    requirements: [{ taskId: 'breathe_power_2m', count: 3 }],
    categoryColor: SKILL_CATEGORIES.Mental.color,
    categoryIcon: SKILL_CATEGORIES.Mental.icon
  },
  {
    id: 'ice_warrior_rookie',
    title: 'Ice Warrior Rookie',
    description: 'Took your first steps into cold exposure mastery',
    category: 'Recovery',
    level: 1,
    requirements: [{ taskId: 'cold_blast_15s', count: 3 }],
    categoryColor: SKILL_CATEGORIES.Recovery.color,
    categoryIcon: SKILL_CATEGORIES.Recovery.icon
  },
  {
    id: 'morning_champion',
    title: 'Morning Champion',
    description: 'Conquered mornings with triple wins and unstoppable momentum',
    category: 'Mental',
    level: 1,
    requirements: [{ taskId: 'morning_wins_3m', count: 5 }],
    categoryColor: SKILL_CATEGORIES.Mental.color,
    categoryIcon: SKILL_CATEGORIES.Mental.icon
  },
  {
    id: 'alpha_walker',
    title: 'Alpha Walker',
    description: 'Walk with confidence and command respect with every step',
    category: 'Physical',
    level: 1,
    requirements: [{ taskId: 'alpha_walk_10m', count: 5 }],
    categoryColor: SKILL_CATEGORIES.Physical.color,
    categoryIcon: SKILL_CATEGORIES.Physical.icon
  },
  {
    id: 'power_poser',
    title: 'Power Poser',
    description: 'Unlocked the science of confidence through body language',
    category: 'Mental',
    level: 1,
    requirements: [{ taskId: 'power_pose_1m', count: 3 }],
    categoryColor: SKILL_CATEGORIES.Mental.color,
    categoryIcon: SKILL_CATEGORIES.Mental.icon
  },
  {
    id: 'victory_crusher',
    title: 'Victory Crusher',
    description: 'Turn every squat into a celebration of strength',
    category: 'Physical',
    level: 1,
    requirements: [{ taskId: 'victory_squats', count: 5 }],
    categoryColor: SKILL_CATEGORIES.Physical.color,
    categoryIcon: SKILL_CATEGORIES.Physical.icon
  },
  {
    id: 'zen_master_novice',
    title: 'Zen Master Novice',
    description: 'Found peace in chaos with mindful moments',
    category: 'Mental',
    level: 1,
    requirements: [{ taskId: 'zen_minute', count: 7 }],
    categoryColor: SKILL_CATEGORIES.Mental.color,
    categoryIcon: SKILL_CATEGORIES.Mental.icon
  },
  {
    id: 'energy_alchemist',
    title: 'Energy Alchemist',
    description: 'Transform low energy into unstoppable momentum',
    category: 'Physical',
    level: 1,
    requirements: [{ taskId: 'energy_boost_combo', count: 5 }],
    categoryColor: SKILL_CATEGORIES.Physical.color,
    categoryIcon: SKILL_CATEGORIES.Physical.icon
  },
  {
    id: 'confidence_architect',
    title: 'Confidence Architect',
    description: 'Building unshakeable self-belief one affirmation at a time',
    category: 'Mental',
    level: 1,
    requirements: [{ taskId: 'confidence_check', count: 7 }],
    categoryColor: SKILL_CATEGORIES.Mental.color,
    categoryIcon: SKILL_CATEGORIES.Mental.icon
  },

  // ADVANCED VERSIONS OF GAMIFIED SKILLS
  {
    id: 'ice_warrior_veteran',
    title: 'Ice Warrior Veteran',
    description: 'Advanced cold exposure mastery - fear is just another temperature',
    category: 'Recovery',
    level: 2,
    requirements: [
      { taskId: 'cold_blast_15s', count: 15 },
      { taskId: 'cold_shower_30s', count: 10 }
    ],
    categoryColor: SKILL_CATEGORIES.Recovery.color,
    categoryIcon: SKILL_CATEGORIES.Recovery.icon
  },
  {
    id: 'morning_dominator',
    title: 'Morning Dominator',
    description: 'Own every morning with consistent victory routines',
    category: 'Mental',
    level: 2,
    requirements: [
      { taskId: 'morning_wins_3m', count: 14, consecutive: true }
    ],
    categoryColor: SKILL_CATEGORIES.Mental.color,
    categoryIcon: SKILL_CATEGORIES.Mental.icon
  },
  {
    id: 'confidence_titan',
    title: 'Confidence Titan',
    description: 'Radiate unshakeable confidence in every situation',
    category: 'Mental',
    level: 2,
    requirements: [
      { taskId: 'confidence_check', count: 21 },
      { taskId: 'power_pose_1m', count: 14 }
    ],
    categoryColor: SKILL_CATEGORIES.Mental.color,
    categoryIcon: SKILL_CATEGORIES.Mental.icon
  },
  {
    id: 'alpha_movement_master',
    title: 'Alpha Movement Master',
    description: 'Every step, squat, and stretch radiates power and purpose',
    category: 'Physical',
    level: 2,
    requirements: [
      { taskId: 'alpha_walk_10m', count: 14 },
      { taskId: 'victory_squats', count: 14 },
      { taskId: 'energy_boost_combo', count: 10 }
    ],
    categoryColor: SKILL_CATEGORIES.Physical.color,
    categoryIcon: SKILL_CATEGORIES.Physical.icon
  },
  {
    id: 'mental_fortress',
    title: 'Mental Fortress',
    description: 'Built an unbreakable mind through consistent mental training',
    category: 'Mental',
    level: 2,
    requirements: [
      { taskId: 'breathe_power_2m', count: 21 },
      { taskId: 'zen_minute', count: 21 }
    ],
    categoryColor: SKILL_CATEGORIES.Mental.color,
    categoryIcon: SKILL_CATEGORIES.Mental.icon
  },

  // WEEK 1 COMPLETION CELEBRATION SKILL
  {
    id: 'trial_week_legend',
    title: 'Trial Week Legend',
    description: 'Conquered the first week with multiple daily wins - you\'re unstoppable!',
    category: 'Mental',
    level: 1,
    requirements: [
      { taskId: 'morning_wins_3m', count: 4 },
      { taskId: 'cold_blast_15s', count: 3 },
      { taskId: 'power_pose_1m', count: 3 },
      { taskId: 'victory_squats', count: 3 },
      { taskId: 'confidence_check', count: 4 }
    ],
    categoryColor: SKILL_CATEGORIES.Mental.color,
    categoryIcon: SKILL_CATEGORIES.Mental.icon
  },

  // INTERMEDIATE PROGRAM SKILLS (Level 2)
  {
    id: 'intermediate_foundation',
    title: 'Intermediate Foundation',
    description: 'Successfully established all core intermediate habits',
    category: 'Physical',
    level: 2,
    requirements: [
      { taskId: 'sleep_7h', count: 7, consecutive: true },
      { taskId: 'steps_10k', count: 7, consecutive: true },
      { taskId: 'sunlight_15min', count: 7, consecutive: true },
      { taskId: 'protein_target', count: 7, consecutive: true }
    ],
    categoryColor: SKILL_CATEGORIES.Physical.color,
    categoryIcon: SKILL_CATEGORIES.Physical.icon
  },
  {
    id: 'strength_circuit_master',
    title: 'Strength Circuit Master',
    description: 'Mastered bodyweight strength circuit training',
    category: 'Physical',
    level: 2,
    requirements: [{ taskId: 'bw_strength_circuit', count: 5 }],
    categoryColor: SKILL_CATEGORIES.Physical.color,
    categoryIcon: SKILL_CATEGORIES.Physical.icon
  },
  {
    id: 'sprint_warrior',
    title: 'Sprint Warrior',
    description: 'Conquered high-intensity interval training',
    category: 'Physical',
    level: 2,
    requirements: [{ taskId: 'hiit_sprints', count: 4 }],
    categoryColor: SKILL_CATEGORIES.Physical.color,
    categoryIcon: SKILL_CATEGORIES.Physical.icon
  },
  {
    id: 'heavy_lifter',
    title: 'Heavy Lifter',
    description: 'Built impressive leg strength and power',
    category: 'Physical',
    level: 2,
    requirements: [{ taskId: 'heavy_leg_day', count: 5 }],
    categoryColor: SKILL_CATEGORIES.Physical.color,
    categoryIcon: SKILL_CATEGORIES.Physical.icon
  },
  {
    id: 'functional_athlete',
    title: 'Functional Athlete',
    description: 'Developed real-world strength through loaded carries',
    category: 'Physical',
    level: 2,
    requirements: [{ taskId: 'loaded_carry', count: 3 }],
    categoryColor: SKILL_CATEGORIES.Physical.color,
    categoryIcon: SKILL_CATEGORIES.Physical.icon
  },
  {
    id: 'cold_therapy_adept',
    title: 'Cold Therapy Adept',
    description: 'Embraced consistent cold exposure for resilience',
    category: 'Mental',
    level: 2,
    requirements: [{ taskId: 'cold_shower_30s', count: 7 }],
    categoryColor: SKILL_CATEGORIES.Mental.color,
    categoryIcon: SKILL_CATEGORIES.Mental.icon
  },

  // Intermediate Level (Level 2)
  {
    id: 'stretch_master',
    title: 'Stretch Master',
    description: 'Developed flexibility and mobility foundation',
    category: 'Physical',
    level: 2,
    requirements: [
      { taskId: 'yoga_stretch_15min', count: 5 },
      { taskId: 'mobility_20min', count: 2 }
    ],
    categoryColor: SKILL_CATEGORIES.Physical.color,
    categoryIcon: SKILL_CATEGORIES.Physical.icon
  },
  {
    id: 'strength_builder',
    title: 'Strength Builder',
    description: 'Built functional strength through consistent training',
    category: 'Physical',
    level: 2,
    requirements: [
      { taskId: 'bodyweight_circuit', count: 5 },
      { taskId: 'full_body_workout', count: 3 }
    ],
    categoryColor: SKILL_CATEGORIES.Physical.color,
    categoryIcon: SKILL_CATEGORIES.Physical.icon
  },
  {
    id: 'consistent_mover',
    title: 'Consistent Mover',
    description: 'Maintained regular movement patterns',
    category: 'Physical',
    level: 2,
    requirements: [
      { taskId: 'walk_10k_steps', count: 10 },
      { taskId: 'walk_30min', count: 5 }
    ],
    categoryColor: SKILL_CATEGORIES.Physical.color,
    categoryIcon: SKILL_CATEGORIES.Physical.icon
  },
  {
    id: 'leg_power',
    title: 'Leg Power',
    description: 'Developed lower body strength and endurance',
    category: 'Physical',
    level: 2,
    requirements: [
      { taskId: 'heavy_leg_day', count: 3 },
      { taskId: 'chair_squats', count: 10 }
    ],
    categoryColor: SKILL_CATEGORIES.Physical.color,
    categoryIcon: SKILL_CATEGORIES.Physical.icon
  },

  // ADVANCED PROGRAM SKILLS (Level 3-4)
  {
    id: 'advanced_foundation',
    title: 'Advanced Foundation',
    description: 'Mastered the ultimate wellness foundation',
    category: 'Physical',
    level: 3,
    requirements: [
      { taskId: 'sleep_7h', count: 14, consecutive: true },
      { taskId: 'steps_10k', count: 14, consecutive: true },
      { taskId: 'sunlight_15min', count: 14, consecutive: true },
      { taskId: 'protein_target', count: 14, consecutive: true }
    ],
    categoryColor: SKILL_CATEGORIES.Physical.color,
    categoryIcon: SKILL_CATEGORIES.Physical.icon
  },
  {
    id: 'explosive_power',
    title: 'Explosive Power',
    description: 'Mastered plyometric explosive movements',
    category: 'Physical',
    level: 3,
    requirements: [{ taskId: 'plyo_jump_set', count: 7 }],
    categoryColor: SKILL_CATEGORIES.Physical.color,
    categoryIcon: SKILL_CATEGORIES.Physical.icon
  },
  {
    id: 'elite_conditioning',
    title: 'Elite Conditioning',
    description: 'Achieved superior cardiovascular fitness through combined training',
    category: 'Physical',
    level: 3,
    requirements: [
      { taskId: 'hiit_sprints', count: 10 },
      { taskId: 'bw_strength_circuit', count: 8 }
    ],
    categoryColor: SKILL_CATEGORIES.Physical.color,
    categoryIcon: SKILL_CATEGORIES.Physical.icon
  },
  {
    id: 'multi_modal_athlete',
    title: 'Multi-Modal Athlete',
    description: 'Excelled across multiple training modalities in one day',
    category: 'Physical',
    level: 4,
    requirements: [
      { taskId: 'full_body_workout', count: 8 },
      { taskId: 'heavy_leg_day', count: 6 },
      { taskId: 'loaded_carry', count: 5 }
    ],
    categoryColor: SKILL_CATEGORIES.Physical.color,
    categoryIcon: SKILL_CATEGORIES.Physical.icon
  },
  {
    id: 'ice_warrior',
    title: 'Ice Warrior',
    description: 'Demonstrated exceptional mental toughness through cold therapy',
    category: 'Mental',
    level: 3,
    requirements: [{ taskId: 'cold_shower_30s', count: 14 }],
    categoryColor: SKILL_CATEGORIES.Mental.color,
    categoryIcon: SKILL_CATEGORIES.Mental.icon
  },
  {
    id: 'mind_body_master',
    title: 'Mind-Body Master',
    description: 'Integrated mindfulness with advanced physical training',
    category: 'Mental',
    level: 4,
    requirements: [
      { taskId: 'mindfulness_10m', count: 10 },
      { taskId: 'breath_posture_5m', count: 12 }
    ],
    categoryColor: SKILL_CATEGORIES.Mental.color,
    categoryIcon: SKILL_CATEGORIES.Mental.icon
  },

  // RECOVERY CATEGORY SKILLS for all programs
  {
    id: 'mobility_beginner',
    title: 'Mobility Beginner',
    description: 'Started building flexibility and joint health',
    category: 'Recovery',
    level: 1,
    requirements: [{ taskId: 'mobility_20min', count: 3 }],
    categoryColor: SKILL_CATEGORIES.Recovery.color,
    categoryIcon: SKILL_CATEGORIES.Recovery.icon
  },
  {
    id: 'recovery_specialist',
    title: 'Recovery Specialist',
    description: 'Mastered consistent mobility and recovery practices',
    category: 'Recovery',
    level: 2,
    requirements: [{ taskId: 'mobility_20min', count: 8 }],
    categoryColor: SKILL_CATEGORIES.Recovery.color,
    categoryIcon: SKILL_CATEGORIES.Recovery.icon
  },

  // Advanced Level (Level 3-4)
  {
    id: 'explosive_athlete',
    title: 'Explosive Athlete',
    description: 'Mastered high-intensity explosive movements',
    category: 'Physical',
    level: 3,
    requirements: [
      { taskId: 'plyo_jump_set', count: 5 },
      { taskId: 'hiit_sprints', count: 5 }
    ],
    categoryColor: SKILL_CATEGORIES.Physical.color,
    categoryIcon: SKILL_CATEGORIES.Physical.icon
  },
  {
    id: 'endurance_master',
    title: 'Endurance Master',
    description: 'Achieved exceptional cardiovascular fitness',
    category: 'Physical',
    level: 3,
    requirements: [
      { taskId: 'hiit_sprints', count: 7 },
      { taskId: 'steps_10k', count: 15 }
    ],
    categoryColor: SKILL_CATEGORIES.Physical.color,
    categoryIcon: SKILL_CATEGORIES.Physical.icon
  },
  {
    id: 'strength_titan',
    title: 'Strength Titan',
    description: 'Reached elite levels of functional strength',
    category: 'Physical',
    level: 4,
    requirements: [
      { taskId: 'heavy_leg_day', count: 7 },
      { taskId: 'loaded_carry', count: 5 },
      { taskId: 'full_body_workout', count: 10 }
    ],
    categoryColor: SKILL_CATEGORIES.Physical.color,
    categoryIcon: SKILL_CATEGORIES.Physical.icon
  },

  // Master Level (Level 5)
  {
    id: 'iron_warrior',
    title: 'Iron Warrior',
    description: 'Achieved mastery across all strength disciplines',
    category: 'Physical',
    level: 5,
    requirements: [
      { taskId: 'loaded_carry', count: 10 },
      { taskId: 'heavy_leg_day', count: 10 },
      { taskId: 'plyometric_jumps', count: 7 },
      { taskId: 'hiit_sprints', count: 7 }
    ],
    categoryColor: SKILL_CATEGORIES.Physical.color,
    categoryIcon: SKILL_CATEGORIES.Physical.icon
  },
  {
    id: 'ultimate_athlete',
    title: 'Ultimate Athlete',
    description: 'Reached the pinnacle of physical excellence',
    category: 'Physical',
    level: 5,
    requirements: [
      { taskId: 'plyometric_jumps', count: 20 },
      { taskId: 'hiit_sprints', count: 20 },
      { taskId: 'loaded_carry', count: 20 },
      { taskId: 'heavy_leg_day', count: 20 },
      { taskId: 'full_body_workout', count: 30 }
    ],
    categoryColor: SKILL_CATEGORIES.Physical.color,
    categoryIcon: SKILL_CATEGORIES.Physical.icon
  },

  // NUTRITION CATEGORY SKILLS
  {
    id: 'protein_rookie',
    title: 'Protein Rookie',
    description: 'Started focusing on protein intake',
    category: 'Nutrition',
    level: 1,
    requirements: [{ taskId: 'protein_target', count: 3 }],
    categoryColor: SKILL_CATEGORIES.Nutrition.color,
    categoryIcon: SKILL_CATEGORIES.Nutrition.icon
  },
  {
    id: 'daily_protein',
    title: 'Daily Protein',
    description: 'Established consistent protein habits',
    category: 'Nutrition',
    level: 2,
    requirements: [{ taskId: 'protein_target', count: 7 }],
    categoryColor: SKILL_CATEGORIES.Nutrition.color,
    categoryIcon: SKILL_CATEGORIES.Nutrition.icon
  },
  {
    id: 'protein_pro',
    title: 'Protein Pro',
    description: 'Mastered protein optimization',
    category: 'Nutrition',
    level: 3,
    requirements: [{ taskId: 'protein_target', count: 15 }],
    categoryColor: SKILL_CATEGORIES.Nutrition.color,
    categoryIcon: SKILL_CATEGORIES.Nutrition.icon
  },
  {
    id: 'meal_planner',
    title: 'Meal Planner',
    description: 'Developed advanced nutritional planning',
    category: 'Nutrition',
    level: 4,
    requirements: [{ taskId: 'protein_target', count: 25 }],
    categoryColor: SKILL_CATEGORIES.Nutrition.color,
    categoryIcon: SKILL_CATEGORIES.Nutrition.icon
  },
  {
    id: 'macronutrient_master',
    title: 'Macronutrient Master',
    description: 'Achieved nutritional precision',
    category: 'Nutrition',
    level: 4,
    requirements: [{ taskId: 'protein_target', count: 35 }],
    categoryColor: SKILL_CATEGORIES.Nutrition.color,
    categoryIcon: SKILL_CATEGORIES.Nutrition.icon
  },
  {
    id: 'elite_fueler',
    title: 'Elite Fueler',
    description: 'Reached the highest level of nutritional mastery',
    category: 'Nutrition',
    level: 5,
    requirements: [{ taskId: 'protein_target', count: 50 }],
    categoryColor: SKILL_CATEGORIES.Nutrition.color,
    categoryIcon: SKILL_CATEGORIES.Nutrition.icon
  },

  // SLEEP CATEGORY SKILLS
  {
    id: 'night_owl',
    title: 'Night Owl',
    description: 'Began prioritizing quality sleep',
    category: 'Sleep',
    level: 1,
    requirements: [{ taskId: 'sleep_7h', count: 3 }],
    categoryColor: SKILL_CATEGORIES.Sleep.color,
    categoryIcon: SKILL_CATEGORIES.Sleep.icon
  },
  {
    id: 'early_riser',
    title: 'Early Riser',
    description: 'Combined quality sleep with morning light exposure',
    category: 'Sleep',
    level: 1,
    requirements: [
      { taskId: 'sleep_7h', count: 3 },
      { taskId: 'morning_sun_15min', count: 3 }
    ],
    categoryColor: SKILL_CATEGORIES.Sleep.color,
    categoryIcon: SKILL_CATEGORIES.Sleep.icon
  },
  {
    id: 'consistent_sleeper',
    title: 'Consistent Sleeper',
    description: 'Achieved a full week of quality sleep',
    category: 'Sleep',
    level: 2,
    requirements: [{ taskId: 'sleep_7h', count: 7, consecutive: true }],
    categoryColor: SKILL_CATEGORIES.Sleep.color,
    categoryIcon: SKILL_CATEGORIES.Sleep.icon
  },
  {
    id: 'relaxation_expert',
    title: 'Relaxation Expert',
    description: 'Combined sleep optimization with mindfulness practice',
    category: 'Sleep',
    level: 3,
    requirements: [
      { taskId: 'sleep_7h', count: 10 },
      { taskId: 'mindfulness_10min', count: 5 }
    ],
    categoryColor: SKILL_CATEGORIES.Sleep.color,
    categoryIcon: SKILL_CATEGORIES.Sleep.icon
  },
  {
    id: 'deep_sleeper',
    title: 'Deep Sleeper',
    description: 'Enhanced sleep quality through cold therapy',
    category: 'Sleep',
    level: 3,
    requirements: [
      { taskId: 'sleep_7h', count: 14 },
      { taskId: 'cold_shower_30s', count: 7 }
    ],
    categoryColor: SKILL_CATEGORIES.Sleep.color,
    categoryIcon: SKILL_CATEGORIES.Sleep.icon
  },
  {
    id: 'recovery_master',
    title: 'Recovery Master',
    description: 'Achieved three weeks of consecutive quality sleep',
    category: 'Sleep',
    level: 4,
    requirements: [{ taskId: 'sleep_7h', count: 21, consecutive: true }],
    categoryColor: SKILL_CATEGORIES.Sleep.color,
    categoryIcon: SKILL_CATEGORIES.Sleep.icon
  },

  // MENTAL CATEGORY SKILLS
  {
    id: 'breath_beginner',
    title: 'Breath Beginner',
    description: 'Started practicing mindful breathing',
    category: 'Mental',
    level: 1,
    requirements: [{ taskId: 'breath_posture_5min', count: 3 }],
    categoryColor: SKILL_CATEGORIES.Mental.color,
    categoryIcon: SKILL_CATEGORIES.Mental.icon
  },
  {
    id: 'sunshine_seeker',
    title: 'Sunshine Seeker',
    description: 'Prioritized natural light for mental wellness',
    category: 'Mental',
    level: 1,
    requirements: [{ taskId: 'morning_sun_15min', count: 5 }],
    categoryColor: SKILL_CATEGORIES.Mental.color,
    categoryIcon: SKILL_CATEGORIES.Mental.icon
  },
  {
    id: 'mindfulness_adept',
    title: 'Mindfulness Adept',
    description: 'Developed a foundation in mindfulness practice',
    category: 'Mental',
    level: 2,
    requirements: [{ taskId: 'mindfulness_10min', count: 5 }],
    categoryColor: SKILL_CATEGORIES.Mental.color,
    categoryIcon: SKILL_CATEGORIES.Mental.icon
  },
  {
    id: 'posture_pro',
    title: 'Posture Pro',
    description: 'Mastered breath and posture awareness',
    category: 'Mental',
    level: 2,
    requirements: [{ taskId: 'breath_posture_5min', count: 7 }],
    categoryColor: SKILL_CATEGORIES.Mental.color,
    categoryIcon: SKILL_CATEGORIES.Mental.icon
  },
  {
    id: 'stress_manager',
    title: 'Stress Manager',
    description: 'Combined mindfulness with physical relaxation',
    category: 'Mental',
    level: 3,
    requirements: [
      { taskId: 'mindfulness_10min', count: 7 },
      { taskId: 'yoga_stretch_15min', count: 5 }
    ],
    categoryColor: SKILL_CATEGORIES.Mental.color,
    categoryIcon: SKILL_CATEGORIES.Mental.icon
  },
  {
    id: 'cold_warrior',
    title: 'Cold Warrior',
    description: 'Built mental resilience through cold exposure',
    category: 'Mental',
    level: 3,
    requirements: [{ taskId: 'cold_shower_30s', count: 7 }],
    categoryColor: SKILL_CATEGORIES.Mental.color,
    categoryIcon: SKILL_CATEGORIES.Mental.icon
  },
  {
    id: 'zen_master',
    title: 'Zen Master',
    description: 'Achieved advanced mental discipline and awareness',
    category: 'Mental',
    level: 5,
    requirements: [
      { taskId: 'mindfulness_10min', count: 15 },
      { taskId: 'cold_shower_30s', count: 10 },
      { taskId: 'breath_posture_5min', count: 15 }
    ],
    categoryColor: SKILL_CATEGORIES.Mental.color,
    categoryIcon: SKILL_CATEGORIES.Mental.icon
  },

  // RECOVERY CATEGORY SKILLS
  {
    id: 'restful_breaks',
    title: 'Restful Breaks',
    description: 'Started incorporating active recovery',
    category: 'Recovery',
    level: 1,
    requirements: [{ taskId: 'breath_posture_5min', count: 3 }],
    categoryColor: SKILL_CATEGORIES.Recovery.color,
    categoryIcon: SKILL_CATEGORIES.Recovery.icon
  },
  {
    id: 'stretch_novice',
    title: 'Stretch Novice',
    description: 'Began flexibility and mobility work',
    category: 'Recovery',
    level: 1,
    requirements: [{ taskId: 'yoga_stretch_15min', count: 3 }],
    categoryColor: SKILL_CATEGORIES.Recovery.color,
    categoryIcon: SKILL_CATEGORIES.Recovery.icon
  },
  {
    id: 'mobility_explorer',
    title: 'Mobility Explorer',
    description: 'Discovered the benefits of mobility training',
    category: 'Recovery',
    level: 1,
    requirements: [{ taskId: 'mobility_20min', count: 3 }],
    categoryColor: SKILL_CATEGORIES.Recovery.color,
    categoryIcon: SKILL_CATEGORIES.Recovery.icon
  },
  {
    id: 'cold_therapy_user',
    title: 'Cold Therapy User',
    description: 'Began using cold exposure for recovery',
    category: 'Recovery',
    level: 2,
    requirements: [{ taskId: 'cold_shower_30s', count: 5 }],
    categoryColor: SKILL_CATEGORIES.Recovery.color,
    categoryIcon: SKILL_CATEGORIES.Recovery.icon
  },
  {
    id: 'restoration_specialist',
    title: 'Restoration Specialist',
    description: 'Mastered multiple recovery modalities',
    category: 'Recovery',
    level: 4,
    requirements: [
      { taskId: 'cold_shower_30s', count: 7 },
      { taskId: 'mobility_20min', count: 5 },
      { taskId: 'yoga_stretch_15min', count: 7 }
    ],
    categoryColor: SKILL_CATEGORIES.Recovery.color,
    categoryIcon: SKILL_CATEGORIES.Recovery.icon
  },
  {
    id: 'rejuvenation_master',
    title: 'Rejuvenation Master',
    description: 'Achieved mastery in holistic recovery practices',
    category: 'Recovery',
    level: 5,
    requirements: [
      { taskId: 'cold_shower_30s', count: 10 },
      { taskId: 'mobility_20min', count: 7 },
      { taskId: 'morning_sun_15min', count: 15 },
      { taskId: 'mindfulness_10min', count: 10 }
    ],
    categoryColor: SKILL_CATEGORIES.Recovery.color,
    categoryIcon: SKILL_CATEGORIES.Recovery.icon
  },

  // PROGRAM COMPLETION ACHIEVEMENTS
  {
    id: 'beginner_graduate',
    title: 'Beginner Graduate',
    description: 'Mastered the fundamentals of wellness',
    category: 'Physical',
    level: 4,
    requirements: [
      { taskId: 'sleep_7h', count: 50 },
      { taskId: 'walk_10k_steps', count: 40 },
      { taskId: 'protein_target', count: 30 }
    ],
    categoryColor: SKILL_CATEGORIES.Physical.color,
    categoryIcon: SKILL_CATEGORIES.Physical.icon
  },
  {
    id: 'intermediate_graduate',
    title: 'Intermediate Graduate',
    description: 'Advanced beyond the basics with structured training',
    category: 'Physical',
    level: 4,
    requirements: [
      { taskId: 'sleep_7h', count: 60 },
      { taskId: 'walk_10k_steps', count: 50 },
      { taskId: 'protein_target', count: 40 },
      { taskId: 'full_body_workout', count: 20 }
    ],
    categoryColor: SKILL_CATEGORIES.Physical.color,
    categoryIcon: SKILL_CATEGORIES.Physical.icon
  },
  {
    id: 'advanced_graduate',
    title: 'Advanced Graduate',
    description: 'Reached elite levels across all wellness domains',
    category: 'Physical',
    level: 5,
    requirements: [
      { taskId: 'sleep_7h', count: 60 },
      { taskId: 'walk_10k_steps', count: 60 },
      { taskId: 'protein_target', count: 50 },
      { taskId: 'full_body_workout', count: 30 },
      { taskId: 'heavy_leg_day', count: 15 },
      { taskId: 'hiit_sprints', count: 15 }
    ],
    categoryColor: SKILL_CATEGORIES.Physical.color,
    categoryIcon: SKILL_CATEGORIES.Physical.icon
  },

  // RARE ACHIEVEMENT SKILLS
  {
    id: 'wellness_grandmaster',
    title: 'Wellness Grandmaster',
    description: 'Achieved excellence across all dimensions of health',
    category: 'Mental',
    level: 5,
    requirements: [
      { taskId: 'sleep_7h', count: 60 },
      { taskId: 'protein_target', count: 60 },
      { taskId: 'cold_shower_30s', count: 30 },
      { taskId: 'mindfulness_10min', count: 30 },
      { taskId: 'mobility_20min', count: 20 },
      { taskId: 'walk_10k_steps', count: 60 }
    ],
    categoryColor: SKILL_CATEGORIES.Mental.color,
    categoryIcon: SKILL_CATEGORIES.Mental.icon
  },
  {
    id: 'iron_resolve',
    title: 'Iron Resolve',
    description: 'Perfect completion - the ultimate achievement',
    category: 'Mental',
    level: 5,
    requirements: [
      { taskId: 'sleep_7h', count: 63 },
      { taskId: 'walk_10k_steps', count: 63 },
      { taskId: 'protein_target', count: 63 }
    ],
    categoryColor: SKILL_CATEGORIES.Mental.color,
    categoryIcon: SKILL_CATEGORIES.Mental.icon
  }
];

// Helper functions
export function getSkillsByCategory(category: string): SkillDefinition[] {
  return SKILL_DEFINITIONS.filter(skill => skill.category === category);
}

export function getSkillsByLevel(level: number): SkillDefinition[] {
  return SKILL_DEFINITIONS.filter(skill => skill.level === level);
}

export function getSkillById(id: string): SkillDefinition | undefined {
  return SKILL_DEFINITIONS.find(skill => skill.id === id);
}