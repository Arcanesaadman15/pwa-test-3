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
    repeat: "Everyday"
  },
  "steps_10k": {
    id: "steps_10k",
    title: "Walk 10 000 steps",
    subtitle: "Accumulate movement throughout the day",
    category: "Movement",
    cover: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=300",
    durationMin: 60,
    difficulty: 2,
    repeat: "Everyday"
  },
  "brisk_walk_30m": {
    id: "brisk_walk_30m",
    title: "30 min Brisk Walk",
    subtitle: "Slight sweat, able to talk but not sing",
    category: "Movement",
    cover: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=300",
    durationMin: 30,
    difficulty: 2,
    repeat: "2–4× week"
  },
  "protein_target": {
    id: "protein_target",
    title: "Hit Protein Target",
    subtitle: "≥ 1.6 g protein / kg body-weight",
    category: "Nutrition",
    cover: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=300",
    durationMin: 0,
    difficulty: 2,
    repeat: "Everyday"
  },
  "sunlight_15min": {
    id: "sunlight_15min",
    title: "15 min Morning Sunlight",
    subtitle: "Expose eyes & skin before 10 am",
    category: "Recovery",
    cover: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=300",
    durationMin: 15,
    difficulty: 1,
    repeat: "Everyday"
  },
  "full_body_workout": {
    id: "full_body_workout",
    title: "30 min Full-Body Workout",
    subtitle: "Squats, presses & pulls – 3 rounds",
    category: "Training",
    cover: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=300",
    durationMin: 30,
    difficulty: 3,
    repeat: "Mon / Wed / Fri"
  },
  "heavy_leg_day": {
    id: "heavy_leg_day",
    title: "Heavy Leg Day",
    subtitle: "Squats or deads ≥ 75 % 1RM, 4–5 sets",
    category: "Training",
    cover: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=300",
    durationMin: 45,
    difficulty: 4,
    repeat: "1× week"
  },
  "bw_strength_circuit": {
    id: "bw_strength_circuit",
    title: "Body-Weight Strength Circuit",
    subtitle: "Push-ups, rows, lunges, plank – 4 rounds",
    category: "Training",
    cover: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=300",
    durationMin: 20,
    difficulty: 3,
    repeat: "1–2× week"
  },
  "hiit_sprints": {
    id: "hiit_sprints",
    title: "HIIT Sprints",
    subtitle: "8 × 20 s all-out / 40 s easy",
    category: "Explosive Training",
    cover: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=300",
    durationMin: 12,
    difficulty: 4,
    repeat: "1–2× week"
  },
  "plyo_jump_set": {
    id: "plyo_jump_set",
    title: "Plyometric Jump Set",
    subtitle: "3 × 10 jump squats or burpees – max power",
    category: "Explosive Training",
    cover: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=300",
    durationMin: 10,
    difficulty: 4,
    repeat: "1× week"
  },
  "loaded_carry": {
    id: "loaded_carry",
    title: "Loaded Carry",
    subtitle: "Farmer's walk 20–30 m × 4 sets",
    category: "Training",
    cover: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=300",
    durationMin: 10,
    difficulty: 4,
    repeat: "1× week"
  },
  "chair_squats": {
    id: "chair_squats",
    title: "Chair Squats",
    subtitle: "2 × 10 sit-to-stand reps, slow tempo",
    category: "Movement",
    cover: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=300",
    durationMin: 5,
    difficulty: 1,
    repeat: "Everyday or as assigned"
  },
  "yoga_stretch_15m": {
    id: "yoga_stretch_15m",
    title: "15 min Yoga / Stretch",
    subtitle: "Gentle flow to lower stress hormones",
    category: "Recovery",
    cover: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=300",
    durationMin: 15,
    difficulty: 1,
    repeat: "2–3× week"
  },
  "breath_posture_5m": {
    id: "breath_posture_5m",
    title: "5 min Breathing & Posture Drill",
    subtitle: "Stand tall, 10 deep belly breaths",
    category: "Breath & Tension",
    cover: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=300",
    durationMin: 5,
    difficulty: 1,
    repeat: "Daily"
  },
  "mindfulness_10m": {
    id: "mindfulness_10m",
    title: "10 min Mindfulness",
    subtitle: "Guided or silent, reduce cortisol",
    category: "Mind",
    cover: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=300",
    durationMin: 10,
    difficulty: 1,
    repeat: "3× week"
  },
  "cold_shower_30s": {
    id: "cold_shower_30s",
    title: "30 s Cold-Finish Shower",
    subtitle: "Water ≤ 15 °C at the end",
    category: "Recovery",
    cover: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=300",
    durationMin: 1,
    difficulty: 2,
    repeat: "2–3× week"
  },
  "mobility_20min": {
    id: "mobility_20min",
    title: "20 min Mobility / Foam Roll",
    subtitle: "Hips, thoracic, calves – full reset",
    category: "Movement",
    cover: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=300",
    durationMin: 20,
    difficulty: 1,
    repeat: "1× week"
  },
  "plyo_jump_set_advanced": {
    id: "plyo_jump_set_advanced",
    title: "Advanced Plyo Circuit",
    subtitle: "Burpee broad-jumps 3 × 12, rest 90 s",
    category: "Explosive Training",
    cover: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=300",
    durationMin: 15,
    difficulty: 5,
    repeat: "Advanced only"
  },
  "loaded_carry_long": {
    id: "loaded_carry_long",
    title: "Loaded Carry – Long",
    subtitle: "4 × 40 m walk with heavy implements",
    category: "Training",
    cover: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=300",
    durationMin: 15,
    difficulty: 5,
    repeat: "Advanced only"
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
