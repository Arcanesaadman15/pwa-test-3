import { Task } from "@/types";

export const TASK_CATALOG: Record<string, Task> = {
  "sleep_7h": {
    id: "sleep_7h",
    title: "Get 7+ Hours of Deep Sleep",
    subtitle: "Prime Your Body for Maximum Testosterone Production",
    category: "Sleep",
    cover: "https://images.unsplash.com/photo-1571508601891-ca5e7a713859?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=300",
    durationMin: 0,
    difficulty: 1,
    repeat: "Everyday",
    whyItMatters: "Quality sleep is your body's prime time for testosterone production. Studies show 7+ hours nightly optimizes hormone levels, while sleep deprivation can slash testosterone by 10-15%. Build this foundation for peak male vitality."
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
    whyItMatters: "Daily steps combat sedentary living that tanks testosterone. This consistent activity torches fat, builds lean muscle, and crushes cortisol - creating the perfect storm for elevated T levels and unbreakable energy."
  },
  "brisk_walk_30m": {
    id: "brisk_walk_30m",
    title: "30-Minute Power Walk",
    subtitle: "Get Moving at a Testosterone-Boosting Pace",
    category: "Movement",
    cover: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=300",
    durationMin: 30,
    difficulty: 2,
    repeat: "2–4× week",
    whyItMatters: "Brisk walking ignites fat-burning while keeping stress hormones in check. This moderate cardio builds cardiovascular health and maintains the ideal cortisol-testosterone ratio for optimal male hormone production."
  },
  "protein_target": {
    id: "protein_target",
    title: "Crush Your Protein Goal",
    subtitle: "1.6g+ Per Kg Bodyweight for Muscle and T",
    category: "Nutrition",
    cover: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=300",
    durationMin: 0,
    difficulty: 2,
    repeat: "Everyday",
    whyItMatters: "Protein supplies the raw materials for testosterone synthesis and muscle building. Hitting this target preserves lean mass, boosts metabolism, and directly supports higher T levels - essential for masculine strength and vitality."
  },
  "sunlight_15min": {
    id: "sunlight_15min",
    title: "15 Minutes of Morning Sun",
    subtitle: "Charge Your Hormones with Natural Light",
    category: "Recovery",
    cover: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=300",
    durationMin: 15,
    difficulty: 1,
    repeat: "Everyday",
    whyItMatters: "Early sunlight syncs your circadian rhythm, spiking vitamin D and testosterone production. This simple habit enhances sleep quality and hormone balance, giving you an edge in energy and performance."
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
    whyItMatters: "Full-body compound lifts trigger massive testosterone release by engaging multiple muscle groups. This efficient workout builds real strength while optimizing your hormonal response for peak gains."
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
    whyItMatters: "Hammering your largest muscles with heavy loads is proven to skyrocket testosterone. This powerhouse session builds unbreakable lower body strength and drives systemic hormone optimization."
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
    whyItMatters: "Bodyweight circuits forge functional strength and shred fat - both key for elevating testosterone. Build a lean, capable physique that naturally produces more T."
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
    whyItMatters: "HIIT torches fat and boosts growth hormone while elevating testosterone. This intense protocol enhances insulin sensitivity and builds explosive power for alpha performance."
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
    whyItMatters: "Plyometrics build explosive power and fast-twitch muscle fibers that support higher testosterone. Enhance your athletic edge and hormonal profile with this dynamic training."
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
    whyItMatters: "Loaded carries build grip strength, core stability, and full-body power - all while triggering testosterone release through metabolic stress and muscle activation."
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
    whyItMatters: "Fundamental lower body work maintains muscle mass and insulin sensitivity - crucial for steady testosterone production and metabolic health."
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
    whyItMatters: "Yoga slashes cortisol while improving flexibility and recovery. Lower stress hormones create space for testosterone to thrive, enhancing overall male vitality."
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
    whyItMatters: "Proper posture and breathing activate relaxation responses, dropping cortisol and supporting testosterone. Own your presence and hormonal edge."
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
    whyItMatters: "Mindfulness builds stress resilience, lowering cortisol that suppresses testosterone. Forge mental toughness for sustained hormone optimization."
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
    whyItMatters: "Cold exposure boosts luteinizing hormone, signaling testosterone production while building unbreakable mental grit and accelerating recovery."
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
    whyItMatters: "Enhanced mobility allows heavier, more effective training sessions that maximize testosterone response while preventing injuries."
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
    whyItMatters: "Advanced plyos build elite power and coordination, triggering superior hormonal adaptations for peak athletic performance and testosterone."
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
    whyItMatters: "Long carries forge mental toughness and full-body strength, creating massive metabolic stress for advanced testosterone optimization."
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
    whyItMatters: "Power breathing enhances confidence and drops stress hormones, creating an optimal state for testosterone production and peak performance."
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
    whyItMatters: "Quick cold hits build resilience and hormone production while sharpening focus - your daily edge for masculine vitality."
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
    whyItMatters: "Stacking morning wins builds unstoppable momentum and confidence, setting a high-testosterone tone for the entire day."
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
    whyItMatters: "Confident movement elevates testosterone while providing light cardio - double win for hormone health and presence."
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
    whyItMatters: "Power posing can boost testosterone and drop cortisol in minutes, priming you for victory in high-stakes situations."
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
    whyItMatters: "These quick squats signal strength to your body, maintaining muscle and testosterone while building winning habits."
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
    whyItMatters: "Quick zen breaks crush stress hormones, protecting your testosterone and sharpening mental clarity."
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
    whyItMatters: "This combo spikes natural energy and alertness, supporting daily movement that maintains healthy testosterone levels."
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
    whyItMatters: "Strategic protein keeps blood sugar stable and supplies T-building aminos, fueling muscle and hormone health all day."
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
    whyItMatters: "Positive self-talk builds unbreakable confidence, reducing stress that kills testosterone and enhancing overall drive."
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
    whyItMatters: "Kickstart metabolism and hormone production after overnight dehydration. Proper morning hydration can boost testosterone by up to 15%."
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
    whyItMatters: "Optimal hydration is crucial for testosterone synthesis and peak performance. Even mild dehydration can drop T levels by 10-15%."
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
    whyItMatters: "Prime your body for maximum performance and recovery. Well-hydrated training boosts strength by 15-20% and enhances T response."
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
    whyItMatters: "Precision hydration optimizes sleep, training, and recovery - all key drivers of testosterone. Master this for elite hormone health."
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
