import { storage } from '@/lib/storage';
import { traitSystem } from '@/lib/traitSystem';
import { traitsFromOnboarding, calculateTraitProjections } from '@/lib/traitInitializer';
import { OnboardingData } from '@/types';

/**
 * Test utility to validate the traits system is working correctly
 */
export async function testTraitSystem() {
  console.log('🧪 Testing Trait System...');

  try {
    // 1. Test trait initialization from onboarding data
    const mockOnboardingData: Partial<OnboardingData> = {
      ageRange: '25-34',
      sleepQuality: '4-5',
      exerciseFrequency: 'weekly',
      primaryGoal: 'strength',
      waistCircumference: 34,
      stressLevel: 6,
      dailySteps: 7000,
      recommendedProgram: 'intermediate'
    };

    console.log('📊 Mock onboarding data:', mockOnboardingData);

    // Initialize traits from onboarding
    const initialTraits = traitsFromOnboarding(mockOnboardingData);
    console.log('🎯 Initial trait scores:', initialTraits);

    // Save to storage
    await storage.saveUserTraits(initialTraits);
    console.log('💾 Saved traits to storage');

    // 2. Test trait projections
    const projections = calculateTraitProjections(initialTraits, 'intermediate', 8);
    console.log('📈 Trait projections (8 weeks):', projections);

    // 3. Test trait system methods
    const traitScores = await traitSystem.getTraitScores();
    console.log('📋 Retrieved trait scores:', traitScores);

    const traitProgress = await traitSystem.getTraitProgress();
    console.log('📊 Trait progress:', traitProgress);

    const overallStats = await traitSystem.getOverallStats();
    console.log('📈 Overall stats:', overallStats);

    // 4. Test task completion affecting traits
    console.log('🏃‍♂️ Testing task completion impacts...');
    
    // Simulate completing a sleep task
    await traitSystem.applyTaskCompletion('sleep_7h', 1);
    console.log('✅ Applied sleep_7h completion for day 1');

    // Simulate completing a strength task
    await traitSystem.applyTaskCompletion('full_body_workout', 1);
    console.log('✅ Applied full_body_workout completion for day 1');

    // Check updated scores
    const updatedScores = await traitSystem.getTraitScores();
    console.log('📊 Updated trait scores after task completions:', updatedScores);

    // 5. Test weekly usage tracking
    const weeklyUsage = await storage.getTraitWeeklyUsage();
    console.log('📅 Weekly usage tracking:', weeklyUsage);

    console.log('✅ All trait system tests passed!');
    return true;

  } catch (error) {
    console.error('❌ Trait system test failed:', error);
    return false;
  }
}

/**
 * Reset trait data for testing
 */
export async function resetTraitData() {
  try {
    await traitSystem.resetTraits();
    console.log('🔄 Trait data reset successfully');
  } catch (error) {
    console.error('❌ Failed to reset trait data:', error);
  }
}

/**
 * Quick trait status check
 */
export async function checkTraitStatus() {
  try {
    const traits = await traitSystem.getTraitScores();
    const stats = await traitSystem.getOverallStats();
    
    console.log('📊 Current Trait Status:');
    console.log('- Average Score:', stats.averageScore);
    console.log('- Traits Above 50:', stats.traitsAbove50);
    console.log('- Traits Above 75:', stats.traitsAbove75);
    console.log('- Weekly Activity:', stats.weeklyActivity);
    console.log('- Total Traits:', Object.keys(traits).length);
    
    return { traits, stats };
  } catch (error) {
    console.error('❌ Failed to check trait status:', error);
    return null;
  }
}
