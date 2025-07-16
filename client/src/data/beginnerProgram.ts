import { DayProgram } from "@/types";

export const BEGINNER_PROGRAM: DayProgram[] = [
  // WEEK 1 - MAXIMUM HOOK & ENGAGEMENT (Free Trial Week)
  // Day 1: Triple Win Start - Easy dopamine hits to build momentum
  { 
    dayCode: 1, 
    dailyCore: ["sleep_7h", "morning_wins_3m"], 
    weekdayTasks: ["breathe_power_2m", "confidence_check"] 
  },
  
  // Day 2: Power & Posture + Hydration Foundation
  { 
    dayCode: 2, 
    dailyCore: ["sleep_7h", "sunlight_15min"], 
    weekdayTasks: ["morning_hydration", "alpha_walk_10m", "power_pose_1m", "victory_squats"] 
  },
  
  // Day 3: Mental Toughness Introduction - First cold exposure + hydration
  { 
    dayCode: 3, 
    dailyCore: ["sleep_7h", "morning_wins_3m"], 
    weekdayTasks: ["morning_hydration", "cold_blast_15s", "zen_minute", "energy_boost_combo"] 
  },
  
  // Day 4: Strength Signals - Body responds to movement + hydration
  { 
    dayCode: 4, 
    dailyCore: ["sleep_7h", "sunlight_15min"], 
    weekdayTasks: ["morning_hydration", "victory_squats", "alpha_walk_10m", "breathe_power_2m"] 
  },
  
  // Day 5: Mind-Body Power - Combining all elements + hydration
  { 
    dayCode: 5, 
    dailyCore: ["sleep_7h", "protein_power_snack"], 
    weekdayTasks: ["morning_hydration", "cold_blast_15s", "power_pose_1m", "confidence_check"] 
  },
  
  // Day 6: Active Recovery - Feel the energy building + hydration
  { 
    dayCode: 6, 
    dailyCore: ["sleep_7h", "sunlight_15min"], 
    weekdayTasks: ["morning_hydration", "alpha_walk_10m", "zen_minute", "energy_boost_combo"] 
  },
  
  // Day 7: Week 1 Victory Lap - Celebrate all progress + hydration
  { 
    dayCode: 7, 
    dailyCore: ["sleep_7h", "morning_wins_3m"], 
    weekdayTasks: ["morning_hydration", "victory_squats", "cold_blast_15s", "confidence_check", "breathe_power_2m"] 
  },

  // WEEK 2 - Building Momentum (Post-trial hook) + Daily Hydration Goals
  { dayCode: 8, dailyCore: ["sleep_7h", "sunlight_15min"], weekdayTasks: ["daily_water_goal", "brisk_walk_30m", "cold_blast_15s", "power_pose_1m"] },
  { dayCode: 9, dailyCore: ["sleep_7h", "protein_power_snack"], weekdayTasks: ["daily_water_goal", "victory_squats", "zen_minute", "confidence_check"] },
  { dayCode: 10, dailyCore: ["sleep_7h", "protein_target"], weekdayTasks: ["daily_water_goal", "alpha_walk_10m", "power_pose_1m", "breathe_power_2m"] },
  { dayCode: 11, dailyCore: ["sleep_7h", "sunlight_15min"], weekdayTasks: ["daily_water_goal", "brisk_walk_30m", "breathe_power_2m", "energy_boost_combo"] },
  { dayCode: 12, dailyCore: ["sleep_7h", "morning_wins_3m"], weekdayTasks: ["daily_water_goal", "cold_blast_15s", "confidence_check"] },
  { dayCode: 13, dailyCore: ["sleep_7h", "sunlight_15min", "protein_target"], weekdayTasks: ["daily_water_goal", "yoga_stretch_15m", "victory_squats", "zen_minute"] },
  { dayCode: 14, dailyCore: ["sleep_7h"], weekdayTasks: ["daily_water_goal", "energy_boost_combo", "zen_minute", "alpha_walk_10m"] },

  // WEEK 3 - Strength Building with gamification + Pre-workout hydration
  { dayCode: 15, dailyCore: ["sleep_7h", "sunlight_15min"], weekdayTasks: ["daily_water_goal", "steps_10k", "cold_shower_30s", "power_pose_1m"] },
  { dayCode: 16, dailyCore: ["sleep_7h", "steps_10k"], weekdayTasks: ["daily_water_goal", "pre_workout_hydration", "chair_squats", "mindfulness_10m", "confidence_check"] },
  { dayCode: 17, dailyCore: ["sleep_7h", "sunlight_15min"], weekdayTasks: ["daily_water_goal", "protein_target", "power_pose_1m", "victory_squats"] },
  { dayCode: 18, dailyCore: ["sleep_7h", "morning_wins_3m"], weekdayTasks: ["daily_water_goal", "steps_10k", "breathe_power_2m", "zen_minute"] },
  { dayCode: 19, dailyCore: ["sleep_7h", "sunlight_15min"], weekdayTasks: ["daily_water_goal", "cold_shower_30s", "alpha_walk_10m"] },
  { dayCode: 20, dailyCore: ["sleep_7h", "steps_10k"], weekdayTasks: ["daily_water_goal", "pre_workout_hydration", "yoga_stretch_15m", "chair_squats", "energy_boost_combo"] },
  { dayCode: 21, dailyCore: ["sleep_7h", "sunlight_15min"], weekdayTasks: ["daily_water_goal", "confidence_check", "power_pose_1m"] },

  // WEEK 4 - Structured Training Introduction with mental training + consistent hydration
  { dayCode: 22, dailyCore: ["sleep_7h", "steps_10k", "sunlight_15min"], weekdayTasks: ["daily_water_goal", "mindfulness_10m", "cold_blast_15s"] },
  { dayCode: 23, dailyCore: ["sleep_7h", "steps_10k"], weekdayTasks: ["daily_water_goal", "pre_workout_hydration", "chair_squats", "cold_shower_30s", "breathe_power_2m"] },
  { dayCode: 24, dailyCore: ["sleep_7h", "sunlight_15min", "protein_target"], weekdayTasks: ["daily_water_goal", "victory_squats", "zen_minute"] },
  { dayCode: 25, dailyCore: ["sleep_7h", "steps_10k", "morning_wins_3m"], weekdayTasks: ["daily_water_goal", "pre_workout_hydration", "chair_squats", "power_pose_1m"] },
  { dayCode: 26, dailyCore: ["sleep_7h", "sunlight_15min"], weekdayTasks: ["daily_water_goal", "alpha_walk_10m", "confidence_check"] },
  { dayCode: 27, dailyCore: ["sleep_7h", "steps_10k", "protein_target"], weekdayTasks: ["daily_water_goal", "pre_workout_hydration", "yoga_stretch_15m", "energy_boost_combo"] },
  { dayCode: 28, dailyCore: ["sleep_7h", "sunlight_15min"], weekdayTasks: ["daily_water_goal", "breath_posture_5m", "cold_blast_15s"] },

  // WEEK 5 - Full Body Training with consistent gamified elements + optimized hydration
  { dayCode: 29, dailyCore: ["sleep_7h", "steps_10k", "sunlight_15min", "protein_target"], weekdayTasks: ["daily_water_goal", "breathe_power_2m"] },
  { dayCode: 30, dailyCore: ["sleep_7h", "steps_10k"], weekdayTasks: ["daily_water_goal", "pre_workout_hydration", "full_body_workout", "power_pose_1m", "confidence_check"] },
  { dayCode: 31, dailyCore: ["sleep_7h", "sunlight_15min"], weekdayTasks: ["daily_water_goal", "mindfulness_10m", "zen_minute", "alpha_walk_10m"] },
  { dayCode: 32, dailyCore: ["sleep_7h", "steps_10k", "morning_wins_3m"], weekdayTasks: ["daily_water_goal", "pre_workout_hydration", "chair_squats", "cold_blast_15s"] },
  { dayCode: 33, dailyCore: ["sleep_7h", "sunlight_15min"], weekdayTasks: ["daily_water_goal", "victory_squats", "energy_boost_combo"] },
  { dayCode: 34, dailyCore: ["sleep_7h", "steps_10k", "protein_target"], weekdayTasks: ["daily_water_goal", "pre_workout_hydration", "full_body_workout", "breathe_power_2m"] },
  { dayCode: 35, dailyCore: ["sleep_7h", "sunlight_15min"], weekdayTasks: ["daily_water_goal", "mobility_20min", "confidence_check"] },

  // WEEK 6 - Advanced Recovery with mental resilience + hydration optimization
  { dayCode: 36, dailyCore: ["sleep_7h", "steps_10k", "sunlight_15min", "protein_target"], weekdayTasks: ["daily_water_goal", "chair_squats", "power_pose_1m"] },
  { dayCode: 37, dailyCore: ["sleep_7h", "steps_10k"], weekdayTasks: ["daily_water_goal", "pre_workout_hydration", "full_body_workout", "cold_shower_30s", "zen_minute"] },
  { dayCode: 38, dailyCore: ["sleep_7h", "sunlight_15min", "morning_wins_3m"], weekdayTasks: ["daily_water_goal", "mindfulness_10m", "alpha_walk_10m"] },
  { dayCode: 39, dailyCore: ["sleep_7h", "steps_10k"], weekdayTasks: ["daily_water_goal", "pre_workout_hydration", "chair_squats", "confidence_check", "breathe_power_2m"] },
  { dayCode: 40, dailyCore: ["sleep_7h", "sunlight_15min", "protein_target"], weekdayTasks: ["daily_water_goal", "cold_shower_30s", "victory_squats"] },
  { dayCode: 41, dailyCore: ["sleep_7h", "steps_10k"], weekdayTasks: ["daily_water_goal", "pre_workout_hydration", "full_body_workout", "energy_boost_combo"] },
  { dayCode: 42, dailyCore: ["sleep_7h", "sunlight_15min"], weekdayTasks: ["daily_water_goal", "mobility_20min", "power_pose_1m"] },

  // WEEK 7 - Power Development with advanced mental training + advanced hydration
  { dayCode: 43, dailyCore: ["sleep_7h", "steps_10k", "sunlight_15min", "protein_target"], weekdayTasks: ["daily_water_goal", "chair_squats", "cold_blast_15s"] },
  { dayCode: 44, dailyCore: ["sleep_7h", "steps_10k", "morning_wins_3m"], weekdayTasks: ["daily_water_goal", "pre_workout_hydration", "full_body_workout", "breathe_power_2m"] },
  { dayCode: 45, dailyCore: ["sleep_7h", "sunlight_15min"], weekdayTasks: ["daily_water_goal", "pre_workout_hydration", "heavy_leg_day", "zen_minute", "confidence_check"] },
  { dayCode: 46, dailyCore: ["sleep_7h", "steps_10k"], weekdayTasks: ["daily_water_goal", "cold_shower_30s", "alpha_walk_10m", "power_pose_1m"] },
  { dayCode: 47, dailyCore: ["sleep_7h", "sunlight_15min", "protein_target"], weekdayTasks: ["daily_water_goal", "victory_squats", "energy_boost_combo"] },
  { dayCode: 48, dailyCore: ["sleep_7h", "steps_10k"], weekdayTasks: ["daily_water_goal", "pre_workout_hydration", "full_body_workout", "breathe_power_2m"] },
  { dayCode: 49, dailyCore: ["sleep_7h", "sunlight_15min"], weekdayTasks: ["daily_water_goal", "mindfulness_10m", "confidence_check"] },

  // WEEK 8 - High Intensity with sustained mental training + hydration mastery
  { dayCode: 50, dailyCore: ["sleep_7h", "steps_10k", "sunlight_15min", "protein_target"], weekdayTasks: ["daily_water_goal", "chair_squats", "cold_blast_15s"] },
  { dayCode: 51, dailyCore: ["sleep_7h", "steps_10k", "morning_wins_3m"], weekdayTasks: ["daily_water_goal", "pre_workout_hydration", "full_body_workout", "power_pose_1m"] },
  { dayCode: 52, dailyCore: ["sleep_7h", "sunlight_15min"], weekdayTasks: ["daily_water_goal", "pre_workout_hydration", "hiit_sprints", "zen_minute", "alpha_walk_10m"] },
  { dayCode: 53, dailyCore: ["sleep_7h", "steps_10k"], weekdayTasks: ["daily_water_goal", "cold_shower_30s", "breathe_power_2m", "confidence_check"] },
  { dayCode: 54, dailyCore: ["sleep_7h", "sunlight_15min", "protein_target"], weekdayTasks: ["daily_water_goal", "pre_workout_hydration", "heavy_leg_day", "victory_squats"] },
  { dayCode: 55, dailyCore: ["sleep_7h", "steps_10k"], weekdayTasks: ["daily_water_goal", "pre_workout_hydration", "full_body_workout", "energy_boost_combo"] },
  { dayCode: 56, dailyCore: ["sleep_7h", "sunlight_15min"], weekdayTasks: ["daily_water_goal", "mobility_20min", "power_pose_1m"] },

  // WEEK 9 - Peak Performance with mastery of mental skills + complete hydration mastery
  { dayCode: 57, dailyCore: ["sleep_7h", "steps_10k", "sunlight_15min", "protein_target"], weekdayTasks: ["hydration_tracking", "cold_shower_30s", "breathe_power_2m"] },
  { dayCode: 58, dailyCore: ["sleep_7h", "steps_10k", "morning_wins_3m"], weekdayTasks: ["hydration_tracking", "pre_workout_hydration", "full_body_workout", "chair_squats", "zen_minute"] },
  { dayCode: 59, dailyCore: ["sleep_7h", "sunlight_15min"], weekdayTasks: ["hydration_tracking", "pre_workout_hydration", "hiit_sprints", "alpha_walk_10m", "confidence_check"] },
  { dayCode: 60, dailyCore: ["sleep_7h", "steps_10k"], weekdayTasks: ["hydration_tracking", "pre_workout_hydration", "heavy_leg_day", "power_pose_1m", "victory_squats"] },
  { dayCode: 61, dailyCore: ["sleep_7h", "sunlight_15min", "protein_target"], weekdayTasks: ["hydration_tracking", "mindfulness_10m", "energy_boost_combo"] },
  { dayCode: 62, dailyCore: ["sleep_7h", "steps_10k"], weekdayTasks: ["hydration_tracking", "pre_workout_hydration", "full_body_workout", "cold_blast_15s"] },
  { dayCode: 63, dailyCore: ["sleep_7h", "sunlight_15min"], weekdayTasks: ["hydration_tracking", "mobility_20min", "confidence_check", "breathe_power_2m"] }
];

// Helper function to get tasks for a specific day
export function getBeginnerDayTasks(day: number): string[] {
  const dayProgram = BEGINNER_PROGRAM.find(p => p.dayCode === day);
  if (!dayProgram) return [];
  
  return [...dayProgram.dailyCore, ...dayProgram.weekdayTasks];
}

// Helper function to get current phase based on day
export function getPhaseFromDay(day: number): number {
  if (day <= 21) return 1;
  if (day <= 42) return 2;
  return 3;
}
