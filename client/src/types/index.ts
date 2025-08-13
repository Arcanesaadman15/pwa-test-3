export interface Task {
  id: string;
  title: string;
  subtitle: string;
  category: 'Sleep' | 'Movement' | 'Nutrition' | 'Recovery' | 'Mindfulness' | 'Training' | 'Explosive Training' | 'Breath & Tension' | 'Mind';
  cover: string;
  durationMin: number;
  difficulty: number; // 1-5 scale
  repeat: string;
  whyItMatters?: string; // Optional explanation of testosterone benefits
}

export interface User {
  id: string;
  name: string;
  email?: string;
  program: 'beginner' | 'intermediate' | 'advanced';
  currentDay: number;
  currentStreak: number;
  longestStreak: number;
  completedDays: number;
  startDate: Date;
  achievements: number;
  level: number;
  onboardingComplete?: boolean;
  preferences?: UserPreferences;
}

export interface UserPreferences {
  morningPerson: boolean;
  outdoorActivities: boolean;
  socialActivities: boolean;
  highIntensity: boolean;
  timeCommitment: number;
  stressLevel: number;
  sleepQuality: number;
  activityLevel: string;
}

export interface DayProgress {
  currentDay: number;
  currentPhase: number;
  tasksCompleted: number;
  totalTasks: number;
  completionPercentage: number;
}

export interface TaskCompletion {
  taskId: string;
  day: number;
  completedAt: Date;
  skipped: boolean;
  skipReason?: string;
}

export interface UserSkills {
  sleep?: {
    level: number;
    progress: number;
    unlockedSkills: string[];
  };
  movement?: {
    level: number;
    progress: number;
    unlockedSkills: string[];
  };
  nutrition?: {
    level: number;
    progress: number;
    unlockedSkills: string[];
  };
  recovery?: {
    level: number;
    progress: number;
    unlockedSkills: string[];
  };
  mindfulness?: {
    level: number;
    progress: number;
    unlockedSkills: string[];
  };
}

export interface SkillDefinition {
  id: string;
  name: string;
  description: string;
  category: string;
  requiredTasks: number;
  unlockConditions: {
    tasksCompleted?: number;
    streakRequired?: number;
    categoryTasks?: { [category: string]: number };
  };
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: string;
  unlockConditions: {
    streak?: number;
    totalDays?: number;
    categoryTasks?: { [category: string]: number };
    skillsUnlocked?: number;
  };
}

export interface DayProgram {
  dayCode: number;
  dailyCore: string[];
  weekdayTasks: string[];
}

export interface OnboardingData {
  // Quick Quiz responses
  ageRange: string;
  sleepQuality: string;
  exerciseFrequency: string;
  primaryGoal: string;
  
  // Lifestyle Sliders
  waistCircumference: number;
  stressLevel: number;
  dailySteps: number;
  
  // Recommended program
  recommendedProgram: 'beginner' | 'intermediate' | 'advanced';
  
  // Completion status
  completedAt?: Date;
}

export interface ProgramType {
  id: 'beginner' | 'intermediate' | 'advanced';
  name: string;
  description: string;
  dailyTaskRange: string;
  targetAudience: string;
  duration: number; // days
}

// Re-export trait types for convenience
export type { TraitId, TraitDefinition, UserTraitScores, TraitProjection, TraitWeeklyUsage, TraitProgress } from './traits';
