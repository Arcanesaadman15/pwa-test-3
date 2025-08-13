import { OnboardingData } from '@/types';
import { UserTraitScores, TraitProjection } from '@/types/traits';
import { TRAIT_DEFINITIONS } from '@/data/traitDefinitions';

/**
 * Initialize trait scores based on onboarding questionnaire responses
 */
export function traitsFromOnboarding(data: Partial<OnboardingData>): UserTraitScores {
  const traits: UserTraitScores = {};

  // Sleep Consistency - based on sleep quality
  const sleepQualityMap: Record<string, number> = {
    '0-1': 85,  // Excellent sleep
    '2-3': 70,  // Good sleep
    '4-5': 55,  // Fair sleep
    '6-7': 35   // Poor sleep
  };
  traits.SleepConsistency = sleepQualityMap[data.sleepQuality || '4-5'] ?? 55;

  // Movement Volume - based on daily steps
  const dailySteps = data.dailySteps || 5000;
  if (dailySteps <= 3000) {
    traits.MovementVolume = 25;
  } else if (dailySteps <= 5000) {
    traits.MovementVolume = 40;
  } else if (dailySteps <= 7000) {
    traits.MovementVolume = 60;
  } else if (dailySteps <= 10000) {
    traits.MovementVolume = 75;
  } else {
    traits.MovementVolume = 85;
  }

  // Strength Training - based on exercise frequency
  const exerciseFrequencyMap: Record<string, number> = {
    'daily': 85,
    'weekly': 65,
    'monthly': 40,
    'rarely': 25
  };
  traits.StrengthTraining = exerciseFrequencyMap[data.exerciseFrequency || 'monthly'] ?? 40;

  // Stress Resilience - inverted from stress level (1-10 scale)
  const stressLevel = data.stressLevel || 5;
  traits.StressResilience = Math.max(10, 100 - (stressLevel * 9));

  // Waist circumference affects multiple traits
  const waistCircumference = data.waistCircumference || 36;
  let bodyCompositionModifier = 0;
  if (waistCircumference <= 32) {
    bodyCompositionModifier = 15;
  } else if (waistCircumference <= 36) {
    bodyCompositionModifier = 5;
  } else if (waistCircumference <= 40) {
    bodyCompositionModifier = -5;
  } else {
    bodyCompositionModifier = -15;
  }

  // Age affects baseline testosterone potential
  let ageModifier = 0;
  if (data.ageRange === "18-24") ageModifier = 10;
  else if (data.ageRange === "25-34") ageModifier = 5;
  else if (data.ageRange === "35-44") ageModifier = 0;
  else if (data.ageRange === "45-54") ageModifier = -5;
  else if (data.ageRange === "55+") ageModifier = -10;

  // Primary goal affects confidence and drive
  let goalModifier = 0;
  if (data.primaryGoal === "confidence") goalModifier = 10;
  else if (data.primaryGoal === "strength") goalModifier = 5;
  else if (data.primaryGoal === "energy") goalModifier = 5;

  // Initialize remaining traits with reasonable baselines
  traits.ExplosivePower = Math.max(20, 35 + bodyCompositionModifier + ageModifier);
  traits.MobilityFlexibility = 45;
  traits.PostureBreathControl = Math.max(25, 40 + (traits.StressResilience > 60 ? 10 : 0));
  
  traits.ProteinAdequacy = 45;
  traits.Hydration = 45;
  
  traits.CircadianSunlight = 40;
  traits.ColdResilience = 35; // Most people start low here
  traits.RecoveryHygiene = Math.max(30, 40 + (traits.StressResilience > 60 ? 10 : -10));
  
  traits.ConfidenceDrive = Math.max(25, 50 + goalModifier + (bodyCompositionModifier / 2));

  // Apply age modifier to physical traits
  ['MovementVolume', 'StrengthTraining', 'ExplosivePower'].forEach(traitId => {
    if (traits[traitId] !== undefined) {
      traits[traitId] = Math.max(20, traits[traitId] + ageModifier);
    }
  });

  // Ensure all scores are within 20-85 range for new users (room to grow and improve)
  Object.keys(traits).forEach(traitId => {
    traits[traitId] = Math.max(20, Math.min(85, traits[traitId]));
  });

  return traits;
}

/**
 * Calculate projected trait scores based on recommended program
 */
export function calculateTraitProjections(
  currentTraits: UserTraitScores, 
  recommendedProgram: 'beginner' | 'intermediate' | 'advanced',
  timeHorizon: number = 8 // weeks
): Record<string, TraitProjection> {
  const projections: Record<string, TraitProjection> = {};

  // Program-specific weekly gain estimates
  const programMultipliers = {
    beginner: 1.0,
    intermediate: 1.3,
    advanced: 1.6
  };

  const multiplier = programMultipliers[recommendedProgram];

  TRAIT_DEFINITIONS.forEach(trait => {
    const current = currentTraits[trait.id] || 0;
    
    // Estimate weekly gain based on trait weekly cap and program intensity
    const maxWeeklyGain = trait.weeklyCap || 30;
    const estimatedWeeklyGain = Math.round(maxWeeklyGain * 0.7 * multiplier); // 70% efficiency
    
    // Calculate projection with diminishing returns as score approaches 100
    const remainingPotential = 100 - current;
    const totalGain = Math.min(
      remainingPotential,
      estimatedWeeklyGain * timeHorizon * (remainingPotential / 100)
    );
    
    const projected = Math.min(100, Math.round(current + totalGain));

    projections[trait.id] = {
      current,
      projected
    };
  });

  return projections;
}

/**
 * Get trait categories with average scores for overview
 */
export function getTraitCategoryOverview(traits: UserTraitScores): Record<string, {
  average: number;
  traits: Array<{ id: string; title: string; score: number }>;
}> {
  const categories: Record<string, any> = {};

  TRAIT_DEFINITIONS.forEach(trait => {
    const category = trait.category;
    if (!categories[category]) {
      categories[category] = {
        traits: [],
        total: 0,
        count: 0
      };
    }

    const score = traits[trait.id] || 0;
    categories[category].traits.push({
      id: trait.id,
      title: trait.title,
      score
    });
    categories[category].total += score;
    categories[category].count++;
  });

  // Calculate averages
  Object.keys(categories).forEach(category => {
    categories[category].average = Math.round(
      categories[category].total / categories[category].count
    );
    delete categories[category].total;
    delete categories[category].count;
  });

  return categories;
}
