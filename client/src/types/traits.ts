export type TraitId =
  | 'SleepConsistency'
  | 'MovementVolume'
  | 'StrengthTraining'
  | 'ExplosivePower'
  | 'MobilityFlexibility'
  | 'PostureBreathControl'
  | 'ProteinAdequacy'
  | 'Hydration'
  | 'CircadianSunlight'
  | 'ColdResilience'
  | 'RecoveryHygiene'
  | 'StressResilience'
  | 'ConfidenceDrive';

export interface TraitDefinition {
  id: TraitId;
  title: string;
  description: string;
  category: 'Physical' | 'Nutrition' | 'Sleep' | 'Mental' | 'Recovery';
  icon: string;
  // Task → points mapping
  sources: Array<{ 
    taskId: string; 
    points: number; 
    consecutiveBonus?: number; 
  }>;
  // Optional weekly cap to avoid grinding via one task
  weeklyCap?: number;
}

export interface UserTraitScores {
  // 0–100 integer rating per trait, permanent
  [traitId: string]: number;
}

export interface TraitProjection {
  current: number;
  projected: number; // current + expected gain over a program duration
}

export interface TraitWeeklyUsage {
  [key: string]: number; // "traitId::weekNumber" -> points used this week
}

export interface TraitProgress {
  id: TraitId;
  traitId?: TraitId; // for backward compatibility
  title: string;
  description: string;
  category: 'Physical' | 'Nutrition' | 'Sleep' | 'Mental' | 'Recovery';
  icon: string;
  currentScore: number;
  weeklyGain: number;
  projectedScore: number;
  lastUpdated?: Date;
}
