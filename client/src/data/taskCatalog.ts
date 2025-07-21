import { Task } from "@/types";

export const TASK_CATALOG: Record<string, Task> = {
  "sleep_7h": {
    id: "sleep_7h",
    title: "Get 7+ Hours of Deep Sleep",
    subtitle: "Support Natural Energy and Recovery",
    category: "Sleep",
    cover: "https://images.unsplash.com/photo-1571508601891-ca5e7a713859?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=300",
    durationMin: 0,
    difficulty: 1,
    repeat: "Everyday",
    whyItMatters: "Quality sleep is your body's prime time for recovery and energy restoration. Studies show 7+ hours nightly supports optimal wellness, while sleep deprivation can significantly impact energy and mood. Build this foundation for peak vitality."
  },
  "steps_10k": {
    id: "steps_10k",
    title: "Hit 10,000 Steps",
    subtitle: "Fuel Your Day with Natural Movement",
    category: "Movement",
    cover: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=300",
    durationMin: 60,
    difficulty: 2,
    repeat: "Everyday",
    whyItMatters: "Daily steps combat sedentary living that drains energy. This consistent activity burns fat, builds lean muscle, and reduces stress - creating the perfect conditions for sustained energy and better mood."
  },
  "brisk_walk_30m": {
    id: "brisk_walk_30m",
    title: "30-Minute Power Walk",
    subtitle: "Get Moving at an Energy-Boosting Pace",
    category: "Movement",
    cover: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=300",
    durationMin: 30,
    difficulty: 2,
    repeat: "2–4× week",
    whyItMatters: "Brisk walking ignites fat-burning while keeping stress hormones in check. This moderate cardio builds cardiovascular health and maintains healthy stress levels for optimal energy and well-being."
  },
  "protein_target": {
    id: "protein_target",
    title: "Crush Your Protein Goal",
    subtitle: "1.6g+ Per Kg Bodyweight for Muscle and Energy",
    category: "Nutrition",
    cover: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=300",
    durationMin: 0,
    difficulty: 2,
    repeat: "Everyday",
    whyItMatters: "Protein supplies the raw materials for muscle building and recovery. Hitting this target preserves lean mass, boosts metabolism, and supports sustained energy levels - essential for strength and vitality."
  },
  "sunlight_15min": {
    id: "sunlight_15min",
    title: "15 Minutes of Morning Sun",
    subtitle: "Support Natural Energy with Morning Light",
    category: "Recovery",
    cover: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=300",
    durationMin: 15,
    difficulty: 1,
    repeat: "Everyday",
    whyItMatters: "Early sunlight syncs your circadian rhythm and supports natural vitamin D production. This simple habit enhances sleep quality and natural energy patterns, giving you an edge in daily performance."
  },
  "full_body_workout": {
    id: "full_body_workout",
    title: "30-Minute Full-Body Strength Session",
    subtitle: "Squats, Presses, Pulls - 3 Intense Rounds",
    category: "Training",
    cover: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=300",
    durationMin: 30,
    difficulty: 3,
    repeat: "Mon / Wed / Fri",
    whyItMatters: "Full-body compound lifts create comprehensive muscle engagement by working multiple muscle groups. This efficient workout builds real strength while supporting natural energy production for peak performance."
  },
  "heavy_leg_day": {
    id: "heavy_leg_day",
    title: "Heavy Leg Domination",
    subtitle: "Squats/Deads at 75%+ 1RM, 4-5 Sets",
    category: "Training",
    cover: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=300",
    durationMin: 45,
    difficulty: 4,
    repeat: "1× week",
    whyItMatters: "Working your largest muscles with heavy loads builds incredible strength. This powerhouse session develops unbreakable lower body strength and supports overall energy and vitality."
  },
  "bw_strength_circuit": {
    id: "bw_strength_circuit",
    title: "Bodyweight Power Circuit",
    subtitle: "Push-Ups, Rows, Lunges, Planks - 4 Rounds",
    category: "Training",
    cover: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=300",
    durationMin: 20,
    difficulty: 3,
    repeat: "1–2× week",
    whyItMatters: "Bodyweight circuits forge functional strength and burn fat - both key for sustained energy. Build a lean, capable physique that naturally supports better energy and confidence."
  },
  "hiit_sprints": {
    id: "hiit_sprints",
    title: "HIIT Sprint Assault",
    subtitle: "8x20s All-Out Sprints with 40s Recovery",
    category: "Explosive Training",
    cover: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=300",
    durationMin: 12,
    difficulty: 4,
    repeat: "1–2× week",
    whyItMatters: "HIIT torches fat and supports natural energy production. This intense protocol enhances insulin sensitivity and builds explosive power for peak performance."
  },
  "plyo_jump_set": {
    id: "plyo_jump_set",
    title: "Explosive Jump Protocol",
    subtitle: "3x10 Max-Power Jump Squats or Burpees",
    category: "Explosive Training",
    cover: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=300",
    durationMin: 10,
    difficulty: 4,
    repeat: "1× week",
    whyItMatters: "Plyometrics build explosive power and fast-twitch muscle fibers that support athletic performance. Enhance your physical capabilities and energy levels with this dynamic training."
  },
  "loaded_carry": {
    id: "loaded_carry",
    title: "Loaded Carry Challenge",
    subtitle: "Farmer's Walk 20-30m x4 Sets",
    category: "Training",
    cover: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=300",
    durationMin: 10,
    difficulty: 4,
    repeat: "1× week",
    whyItMatters: "Loaded carries build grip strength, core stability, and full-body power - all while supporting natural energy through metabolic conditioning and comprehensive muscle activation."
  },
  "chair_squats": {
    id: "chair_squats",
    title: "Chair Squat Builder",
    subtitle: "2x10 Controlled Sit-to-Stand Reps",
    category: "Movement",
    cover: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=300",
    durationMin: 5,
    difficulty: 1,
    repeat: "Everyday or as assigned",
    whyItMatters: "Fundamental lower body work maintains muscle mass and insulin sensitivity - crucial for steady energy levels and metabolic health."
  },
  "yoga_stretch_15m": {
    id: "yoga_stretch_15m",
    title: "15-Minute Recovery Flow",
    subtitle: "Gentle Yoga to Crush Stress and Rebuild",
    category: "Recovery",
    cover: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=300",
    durationMin: 15,
    difficulty: 1,
    repeat: "2–3× week",
    whyItMatters: "Yoga reduces stress while improving flexibility and recovery. Lower stress levels create space for natural energy to flourish, enhancing overall vitality and well-being."
  },
  "breath_posture_5m": {
    id: "breath_posture_5m",
    title: "5-Minute Power Posture Breath",
    subtitle: "Stand Tall with 10 Deep Belly Breaths",
    category: "Breath & Tension",
    cover: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=300",
    durationMin: 5,
    difficulty: 1,
    repeat: "Daily",
    whyItMatters: "Proper posture and breathing activate relaxation responses, reducing stress and supporting natural energy. Own your presence and confident edge."
  },
  "mindfulness_10m": {
    id: "mindfulness_10m",
    title: "10-Minute Mind Mastery",
    subtitle: "Guided Focus to Conquer Cortisol",
    category: "Mind",
    cover: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=300",
    durationMin: 10,
    difficulty: 1,
    repeat: "3× week",
    whyItMatters: "Mindfulness builds stress resilience, reducing cortisol that drains energy. Forge mental toughness for sustained vitality and focus."
  },
  "cold_shower_30s": {
    id: "cold_shower_30s",
    title: "30-Second Ice Shower Finish",
    subtitle: "End Hot with Cold Water Below 15°C",
    category: "Recovery",
    cover: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=300",
    durationMin: 1,
    difficulty: 2,
    repeat: "2–3× week",
    whyItMatters: "Cold exposure supports natural energy systems while building unbreakable mental grit and accelerating recovery processes."
  },
  "mobility_20min": {
    id: "mobility_20min",
    title: "20-Minute Mobility Reset",
    subtitle: "Hips, Spine, Calves - Full Body Tune-Up",
    category: "Movement",
    cover: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=300",
    durationMin: 20,
    difficulty: 1,
    repeat: "1× week",
    whyItMatters: "Enhanced mobility allows heavier, more effective training sessions that maximize energy response while preventing injuries."
  },
  "plyo_jump_set_advanced": {
    id: "plyo_jump_set_advanced",
    title: "Elite Plyometric Circuit",
    subtitle: "3x12 Burpee Broad Jumps with 90s Rest",
    category: "Explosive Training",
    cover: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=300",
    durationMin: 15,
    difficulty: 5,
    repeat: "Advanced only",
    whyItMatters: "Advanced plyos build elite power and coordination, supporting superior energy adaptations for peak athletic performance and vitality."
  },
  "loaded_carry_long": {
    id: "loaded_carry_long",
    title: "Extended Loaded Carry",
    subtitle: "4x40m Heavy Walk Challenge",
    category: "Training",
    cover: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=300",
    durationMin: 15,
    difficulty: 5,
    repeat: "Advanced only",
    whyItMatters: "Long carries forge mental toughness and full-body strength, creating significant metabolic conditioning for advanced energy optimization."
  },
  "breathe_power_2m": {
    id: "breathe_power_2m",
    title: "2-Minute Power Breath",
    subtitle: "10 Deep Breaths - Chest Out, Dominate Your Space",
    category: "Mind",
    cover: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=300",
    durationMin: 2,
    difficulty: 1,
    repeat: "Daily",
    whyItMatters: "Power breathing enhances confidence and reduces stress hormones, creating an optimal state for natural energy and peak performance."
  },
  "cold_blast_15s": {
    id: "cold_blast_15s",
    title: "15-Second Ice Blast",
    subtitle: "Finish Shower with Maximum Cold",
    category: "Recovery",
    cover: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=300",
    durationMin: 1,
    difficulty: 1,
    repeat: "Daily starter",
    whyItMatters: "Quick cold exposure builds resilience and supports natural energy while sharpening focus - your daily edge for vitality and alertness."
  },
  "morning_wins_3m": {
    id: "morning_wins_3m",
    title: "3 Quick Morning Victories",
    subtitle: "Bed Made + 10 Push-Ups + Water Down",
    category: "Mind",
    cover: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=300",
    durationMin: 3,
    difficulty: 1,
    repeat: "Daily",
    whyItMatters: "Stacking morning wins builds unstoppable momentum and confidence, setting an energized tone for the entire day."
  },
  "alpha_walk_10m": {
    id: "alpha_walk_10m",
    title: "10-Minute Alpha Stride",
    subtitle: "Walk Tall, Shoulders Back - Own Every Step",
    category: "Movement",
    cover: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=300",
    durationMin: 10,
    difficulty: 1,
    repeat: "Daily",
    whyItMatters: "Confident movement supports natural energy while providing light cardio - double win for vitality and presence."
  },
  "power_pose_1m": {
    id: "power_pose_1m",
    title: "1-Minute Dominance Pose",
    subtitle: "Hands on Hips, Chest Out - Become Unstoppable",
    category: "Mind",
    cover: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=300",
    durationMin: 1,
    difficulty: 1,
    repeat: "Before tough situations",
    whyItMatters: "Power posing can enhance confidence and reduce stress in minutes, priming you for success in high-stakes situations."
  },
  "victory_squats": {
    id: "victory_squats",
    title: "Victory Squat Ritual",
    subtitle: "3x5 Squats with Celebration",
    category: "Training",
    cover: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=300",
    durationMin: 5,
    difficulty: 1,
    repeat: "Daily",
    whyItMatters: "These quick squats signal strength to your body, maintaining muscle tone and energy while building winning habits."
  },
  "zen_minute": {
    id: "zen_minute",
    title: "Zen Focus Minute",
    subtitle: "60 Seconds of Pure, Eyes-Closed Concentration",
    category: "Mind",
    cover: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=300",
    durationMin: 1,
    difficulty: 1,
    repeat: "When stressed",
    whyItMatters: "Quick zen breaks reduce stress hormones, preserving your energy and sharpening mental clarity."
  },
  "energy_boost_combo": {
    id: "energy_boost_combo",
    title: "Instant Energy Surge",
    subtitle: "20 Jumping Jacks + Cold Face Splash",
    category: "Movement",
    cover: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=300",
    durationMin: 2,
    difficulty: 1,
    repeat: "When energy dips",
    whyItMatters: "This combo spikes natural energy and alertness, supporting daily movement that maintains healthy vitality levels."
  },
  "protein_power_snack": {
    id: "protein_power_snack",
    title: "Protein Power Boost",
    subtitle: "Yogurt + Nuts or Quick Shake",
    category: "Nutrition",
    cover: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=300",
    durationMin: 5,
    difficulty: 1,
    repeat: "When hungry",
    whyItMatters: "Strategic protein keeps blood sugar stable and supplies energy-building amino acids, fueling muscle development and vitality all day."
  },
  "confidence_check": {
    id: "confidence_check",
    title: "Daily Confidence Builder",
    subtitle: "Mirror Time: 3 Positive Affirmations",
    category: "Mind",
    cover: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=300",
    durationMin: 1,
    difficulty: 1,
    repeat: "Morning & evening",
    whyItMatters: "Positive self-talk builds unbreakable confidence, reducing stress that drains energy and enhancing overall drive."
  },
  "morning_hydration": {
    id: "morning_hydration",
    title: "Morning Hydration Surge",
    subtitle: "Down 2 Large Glasses Upon Waking",
    category: "Nutrition",
    cover: "https://images.unsplash.com/photo-1544145945-f90425340c7e?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=300",
    durationMin: 2,
    difficulty: 1,
    repeat: "Daily",
    whyItMatters: "Kickstart metabolism and natural energy after overnight dehydration. Proper morning hydration significantly supports vitality and mental clarity."
  },
  "daily_water_goal": {
    id: "daily_water_goal",
    title: "Daily Hydration Mastery",
    subtitle: "Conquer 8 Glasses (2L) Throughout the Day",
    category: "Nutrition", 
    cover: "https://images.unsplash.com/photo-1544145945-f90425340c7e?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=300",
    durationMin: 5,
    difficulty: 2,
    repeat: "Daily",
    whyItMatters: "Optimal hydration is crucial for natural energy and peak performance. Even mild dehydration can significantly impact energy levels and focus."
  },
  "pre_workout_hydration": {
    id: "pre_workout_hydration", 
    title: "Pre-Workout Hydration Edge",
    subtitle: "1-2 Glasses 30 Minutes Before Training",
    category: "Nutrition",
    cover: "https://images.unsplash.com/photo-1544145945-f90425340c7e?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=300",
    durationMin: 2,
    difficulty: 1,
    repeat: "Before workouts",
    whyItMatters: "Prime your body for maximum performance and recovery. Well-hydrated training significantly boosts strength and enhances energy response."
  },
  "hydration_tracking": {
    id: "hydration_tracking",
    title: "Elite Hydration Tracking", 
    subtitle: "Monitor Intake and Urine Color All Day",
    category: "Nutrition",
    cover: "https://images.unsplash.com/photo-1544145945-f90425340c7e?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=300",
    durationMin: 5,
    difficulty: 3,
    repeat: "Daily",
    whyItMatters: "Precision hydration optimizes sleep, training, and recovery - all key drivers of vitality. Master this for elite energy and performance."
  }
};

export function getTask(taskId: string): Task | undefined {
  return TASK_CATALOG[taskId];
}

export function getAllTasks(): Task[] {
  return Object.values(TASK_CATALOG);
}

export function getTasksByCategory(category: string): Task[] {
  return Object.values(TASK_CATALOG).filter(task => task.category === category);
}
