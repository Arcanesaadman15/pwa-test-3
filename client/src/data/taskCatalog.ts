import { Task } from "@/types";

export const TASK_CATALOG: Record<string, Task> = {
  "sleep_7h": {
    id: "sleep_7h",
    title: "Sleep ≥ 7 h",
    subtitle: "Lights out for healthy hormones",
    category: "Sleep",
    cover: "https://images.unsplash.com/photo-1571508601891-ca5e7a713859?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=300",
    durationMin: 0,
    difficulty: 1,
    repeat: "Everyday",
    whyItMatters: "The majority of your daily testosterone production happens while you sleep. Consistently getting less than 7 hours can slash your T levels by 10-15% or more. This is the single most important habit for hormonal health."
  },
  "steps_10k": {
    id: "steps_10k",
    title: "Walk 10 000 steps",
    subtitle: "Accumulate movement throughout the day",
    category: "Movement",
    cover: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=300",
    durationMin: 60,
    difficulty: 2,
    repeat: "Everyday",
    whyItMatters: "Regular, low-intensity movement like walking helps reduce body fat and lowers cortisol, the stress hormone that is a direct antagonist to testosterone. Think of it as clearing out the hormonal noise so your T can be heard loud and clear."
  },
  "brisk_walk_30m": {
    id: "brisk_walk_30m",
    title: "30 min Brisk Walk",
    subtitle: "Slight sweat, able to talk but not sing",
    category: "Movement",
    cover: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=300",
    durationMin: 30,
    difficulty: 2,
    repeat: "2–4× week",
    whyItMatters: "Regular, low-intensity movement like walking helps reduce body fat and lowers cortisol, the stress hormone that is a direct antagonist to testosterone. Think of it as clearing out the hormonal noise so your T can be heard loud and clear."
  },
  "protein_target": {
    id: "protein_target",
    title: "Hit Protein Target",
    subtitle: "≥ 1.6 g protein / kg body-weight",
    category: "Nutrition",
    cover: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=300",
    durationMin: 0,
    difficulty: 2,
    repeat: "Everyday",
    whyItMatters: "Your body can't build muscle—or the hormones that support it—out of thin air. Providing sufficient protein (the building blocks) is essential. It ensures your body can recover from workouts and that you're building, not breaking down, precious muscle tissue."
  },
  "sunlight_15min": {
    id: "sunlight_15min",
    title: "15 min Morning Sunlight",
    subtitle: "Expose eyes & skin before 10 am",
    category: "Recovery",
    cover: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=300",
    durationMin: 15,
    difficulty: 1,
    repeat: "Everyday",
    whyItMatters: "Morning sunlight exposure sets a strong circadian rhythm (your body clock). This leads to deeper, more restorative sleep at night, which is when your body does the crucial work of producing testosterone. It also directly boosts Vitamin D, a hormone-like vitamin essential for T production."
  },
  "full_body_workout": {
    id: "full_body_workout",
    title: "30 min Full-Body Workout",
    subtitle: "Squats, presses & pulls – 3 rounds",
    category: "Training",
    cover: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=300",
    durationMin: 30,
    difficulty: 3,
    repeat: "Mon / Wed / Fri",
    whyItMatters: "Compound exercises (squats, presses, pulls) that engage multiple large muscle groups are proven to trigger the biggest release of anabolic hormones, including testosterone, in the hours following your workout."
  },
  "heavy_leg_day": {
    id: "heavy_leg_day",
    title: "Heavy Leg Day",
    subtitle: "Squats or deads ≥ 75 % 1RM, 4–5 sets",
    category: "Training",
    cover: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=300",
    durationMin: 45,
    difficulty: 4,
    repeat: "1× week",
    whyItMatters: "This is the king of T-boosting workouts. Training the largest muscles in your body (glutes, quads, hamstrings) with heavy loads creates a massive hormonal stimulus, forcing your body to adapt by producing more testosterone to build and repair muscle."
  },
  "bw_strength_circuit": {
    id: "bw_strength_circuit",
    title: "Body-Weight Strength Circuit",
    subtitle: "Push-ups, rows, lunges, plank – 4 rounds",
    category: "Training",
    cover: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=300",
    durationMin: 20,
    difficulty: 3,
    repeat: "1–2× week",
    whyItMatters: "Bodyweight training builds a strong foundation and improves your strength-to-weight ratio. This type of functional strength is excellent for improving body composition (more muscle, less fat), which is critical for maintaining healthy T levels."
  },
  "hiit_sprints": {
    id: "hiit_sprints",
    title: "HIIT Sprints",
    subtitle: "8 × 20 s all-out / 40 s easy",
    category: "Explosive Training",
    cover: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=300",
    durationMin: 12,
    difficulty: 4,
    repeat: "1–2× week",
    whyItMatters: "Short, all-out sprints have been shown to significantly increase testosterone levels. This type of training also boosts growth hormone and improves insulin sensitivity, creating a powerful trifecta for a lean, strong physique."
  },
  "plyo_jump_set": {
    id: "plyo_jump_set",
    title: "Plyometric Jump Set",
    subtitle: "3 × 10 jump squats or burpees – max power",
    category: "Explosive Training",
    cover: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=300",
    durationMin: 10,
    difficulty: 4,
    repeat: "1× week",
    whyItMatters: "Explosive movements train your nervous system to be more efficient and powerful. This neural drive has a direct correlation with your ability to recruit muscle fibers during heavy lifts, leading to better workouts and a stronger hormonal response."
  },
  "loaded_carry": {
    id: "loaded_carry",
    title: "Loaded Carry",
    subtitle: "Farmer's walk 20–30 m × 4 sets",
    category: "Training",
    cover: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=300",
    durationMin: 10,
    difficulty: 4,
    repeat: "1× week",
    whyItMatters: "This is a primal movement that builds full-body functional strength, a powerful grip, and a rock-solid core. It places a unique metabolic stress on the body that promotes a favorable strength-and-hormone-building environment."
  },
  "chair_squats": {
    id: "chair_squats",
    title: "Chair Squats",
    subtitle: "2 × 10 sit-to-stand reps, slow tempo",
    category: "Movement",
    cover: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=300",
    durationMin: 5,
    difficulty: 1,
    repeat: "Everyday or as assigned",
    whyItMatters: "Even small acts of resistance like this begin to signal your muscles to grow. This process, especially in the large muscles of the legs, can help improve insulin sensitivity—a key factor in creating a favorable hormonal environment for testosterone."
  },
  "yoga_stretch_15m": {
    id: "yoga_stretch_15m",
    title: "15 min Yoga / Stretch",
    subtitle: "Gentle flow to lower stress hormones",
    category: "Recovery",
    cover: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=300",
    durationMin: 15,
    difficulty: 1,
    repeat: "2–3× week",
    whyItMatters: "Gentle stretching and yoga are proven to lower cortisol levels. Since cortisol and testosterone have an inverse relationship (when one is high, the other tends to be low), actively managing stress is a direct way to protect your T."
  },
  "breath_posture_5m": {
    id: "breath_posture_5m",
    title: "5 min Breathing & Posture Drill",
    subtitle: "Stand tall, 10 deep belly breaths",
    category: "Breath & Tension",
    cover: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=300",
    durationMin: 5,
    difficulty: 1,
    repeat: "Daily",
    whyItMatters: "Standing tall and breathing deeply from your diaphragm can immediately lower cortisol levels. Poor, hunched posture is a physical stressor on the body, and consciously correcting it helps shift your nervous system out of a chronic 'fight-or-flight' state."
  },
  "mindfulness_10m": {
    id: "mindfulness_10m",
    title: "10 min Mindfulness",
    subtitle: "Guided or silent, reduce cortisol",
    category: "Mind",
    cover: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=300",
    durationMin: 10,
    difficulty: 1,
    repeat: "3× week",
    whyItMatters: "Chronic mental stress is a primary enemy of healthy testosterone. Mindfulness meditation trains you to be less reactive to daily stressors, helping to keep cortisol levels low and creating a better hormonal environment for T to thrive."
  },
  "cold_shower_30s": {
    id: "cold_shower_30s",
    title: "30 s Cold-Finish Shower",
    subtitle: "Water ≤ 15 °C at the end",
    category: "Recovery",
    cover: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=300",
    durationMin: 1,
    difficulty: 2,
    repeat: "2–3× week",
    whyItMatters: "A blast of cold water can increase levels of luteinizing hormone (LH), the precursor hormone that signals your body to produce testosterone. It's also a powerful tool for building mental resilience and discipline."
  },
  "mobility_20min": {
    id: "mobility_20min",
    title: "20 min Mobility / Foam Roll",
    subtitle: "Hips, thoracic, calves – full reset",
    category: "Movement",
    cover: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=300",
    durationMin: 20,
    difficulty: 1,
    repeat: "1× week",
    whyItMatters: "Better mobility and reduced muscle soreness mean you can train harder and more consistently during your key workouts (heavy_leg_day, full_body_workout). High-quality training is one of the most powerful natural T-boosters available."
  },
  "plyo_jump_set_advanced": {
    id: "plyo_jump_set_advanced",
    title: "Advanced Plyo Circuit",
    subtitle: "Burpee broad-jumps 3 × 12, rest 90 s",
    category: "Explosive Training",
    cover: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=300",
    durationMin: 15,
    difficulty: 5,
    repeat: "Advanced only",
    whyItMatters: "Explosive movements train your nervous system to be more efficient and powerful. This neural drive has a direct correlation with your ability to recruit muscle fibers during heavy lifts, leading to better workouts and a stronger hormonal response."
  },
  "loaded_carry_long": {
    id: "loaded_carry_long",
    title: "Loaded Carry – Long",
    subtitle: "4 × 40 m walk with heavy implements",
    category: "Training",
    cover: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=300",
    durationMin: 15,
    difficulty: 5,
    repeat: "Advanced only",
    whyItMatters: "This is a primal movement that builds full-body functional strength, a powerful grip, and a rock-solid core. It places a unique metabolic stress on the body that promotes a favorable strength-and-hormone-building environment."
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
