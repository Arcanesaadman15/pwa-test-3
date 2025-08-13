import { storage } from '@/lib/storage';
import { TRAIT_DEFINITIONS, getTraitById } from '@/data/traitDefinitions';
import { UserTraitScores, TraitProgress, TraitId } from '@/types/traits';

export class TraitSystem {
  private taskCompletions: Array<{ taskId: string; day: number; completedAt: Date; skipped?: boolean }> = [];

  constructor() {
    this.initialize();
  }

  private async initialize() {
    try {
      this.taskCompletions = await storage.getTaskCompletions();
    } catch (error) {
      console.error('Failed to initialize trait system:', error);
    }
  }

  /**
   * Apply trait score increases when a task is completed
   */
  async applyTaskCompletion(taskId: string, day: number): Promise<void> {
    try {
      await this.initialize(); // Ensure we have latest data
      
      const traits = await storage.getUserTraits();
      const nowWeek = this.getIsoWeek(new Date());
      let hasUpdates = false;

      for (const trait of TRAIT_DEFINITIONS) {
        const source = trait.sources.find(s => s.taskId === taskId);
        if (!source) continue;

        const currentScore = traits[trait.id] || 0;
        if (currentScore >= 100) continue; // Already maxed out

        let points = source.points;

        // Add consecutive bonus if applicable
        if (source.consecutiveBonus) {
          const consecutiveDays = this.getConsecutiveDaysForTask(taskId, day);
          if (consecutiveDays >= 3) { // Start bonus after 3 consecutive days
            const bonusMultiplier = Math.min(3, consecutiveDays - 2); // Cap at +3 bonus
            points += source.consecutiveBonus * bonusMultiplier;
          }
        }

        // Apply weekly cap if defined
        const weeklyKey = `${trait.id}::${nowWeek}`;
        const weeklyUsed = await storage.getTraitWeeklyPoints(weeklyKey);
        
        if (trait.weeklyCap) {
          const remaining = Math.max(0, trait.weeklyCap - weeklyUsed);
          points = Math.min(points, remaining);
        }

        if (points > 0) {
          // Apply the points
          const newScore = Math.min(100, Math.round(currentScore + points));
          traits[trait.id] = newScore;
          
          // Update weekly usage
          await storage.setTraitWeeklyPoints(weeklyKey, weeklyUsed + points);
          
          hasUpdates = true;
          
          console.log(`Trait ${trait.id}: ${currentScore} -> ${newScore} (+${points} from ${taskId})`);
        }
      }

      if (hasUpdates) {
        await storage.saveUserTraits(traits);
      }
    } catch (error) {
      console.error('Failed to apply task completion to traits:', error);
    }
  }

  /**
   * Get consecutive days count for a specific task ending on the given day
   */
  private getConsecutiveDaysForTask(taskId: string, endDay: number): number {
    const taskCompletions = this.taskCompletions
      .filter(c => c.taskId === taskId && !c.skipped)
      .map(c => c.day)
      .sort((a, b) => b - a); // Sort descending

    if (taskCompletions.length === 0 || taskCompletions[0] !== endDay) {
      return 1; // Current completion counts as 1
    }

    let consecutive = 1;
    for (let i = 1; i < taskCompletions.length; i++) {
      if (taskCompletions[i] === taskCompletions[i - 1] - 1) {
        consecutive++;
      } else {
        break;
      }
    }

    return consecutive;
  }

  /**
   * Get ISO week number for weekly caps
   */
  private getIsoWeek(date: Date): number {
    const target = new Date(date.valueOf());
    const dayNumber = (date.getUTCDay() + 6) % 7;
    target.setUTCDate(target.getUTCDate() - dayNumber + 3);
    const firstThursday = target.valueOf();
    target.setUTCMonth(0, 1);
    if (target.getUTCDay() !== 4) {
      target.setUTCMonth(0, 1 + ((4 - target.getUTCDay()) + 7) % 7);
    }
    return 1 + Math.ceil((firstThursday - target.valueOf()) / 604800000);
  }

  /**
   * Get current trait scores
   */
  async getTraitScores(): Promise<UserTraitScores> {
    return await storage.getUserTraits();
  }

  /**
   * Get trait progress with additional metrics
   */
  async getTraitProgress(): Promise<TraitProgress[]> {
    const traits = await storage.getUserTraits();
    const nowWeek = this.getIsoWeek(new Date());
    
    const progress: TraitProgress[] = [];
    
    for (const trait of TRAIT_DEFINITIONS) {
      const currentScore = traits[trait.id] || 0;
      const weeklyKey = `${trait.id}::${nowWeek}`;
      const weeklyGain = await storage.getTraitWeeklyPoints(weeklyKey);
      
      // Simple projection: current + potential weekly gain * 4 weeks
      const potentialWeeklyGain = trait.weeklyCap || 20;
      const projectedScore = Math.min(100, currentScore + (potentialWeeklyGain * 4));
      
      progress.push({
        traitId: trait.id as TraitId,
        currentScore,
        weeklyGain,
        projectedScore,
        lastUpdated: new Date()
      });
    }
    
    return progress;
  }

  /**
   * Get trait scores by category
   */
  async getTraitsByCategory(): Promise<Record<string, TraitProgress[]>> {
    const progress = await this.getTraitProgress();
    const byCategory: Record<string, TraitProgress[]> = {};
    
    for (const traitProgress of progress) {
      const trait = getTraitById(traitProgress.traitId);
      if (trait) {
        if (!byCategory[trait.category]) {
          byCategory[trait.category] = [];
        }
        byCategory[trait.category].push(traitProgress);
      }
    }
    
    return byCategory;
  }

  /**
   * Reset all trait scores (for testing or program changes)
   */
  async resetTraits(): Promise<void> {
    try {
      await storage.saveUserTraits({});
      await storage.saveTraitWeeklyUsage({});
    } catch (error) {
      console.error('Failed to reset traits:', error);
      throw error;
    }
  }

  /**
   * Get overall trait statistics
   */
  async getOverallStats(): Promise<{
    averageScore: number;
    totalTraits: number;
    traitsAbove50: number;
    traitsAbove75: number;
    weeklyActivity: number;
  }> {
    const traits = await storage.getUserTraits();
    const scores = Object.values(traits).filter(score => typeof score === 'number');
    
    const averageScore = scores.length > 0 ? scores.reduce((a, b) => a + b, 0) / scores.length : 0;
    const traitsAbove50 = scores.filter(score => score >= 50).length;
    const traitsAbove75 = scores.filter(score => score >= 75).length;
    
    // Calculate weekly activity (sum of all weekly gains)
    const nowWeek = this.getIsoWeek(new Date());
    const weeklyUsage = await storage.getTraitWeeklyUsage();
    const weeklyActivity = Object.keys(weeklyUsage)
      .filter(key => key.endsWith(`::${nowWeek}`))
      .reduce((sum, key) => sum + weeklyUsage[key], 0);
    
    return {
      averageScore: Math.round(averageScore),
      totalTraits: TRAIT_DEFINITIONS.length,
      traitsAbove50,
      traitsAbove75,
      weeklyActivity
    };
  }
}

// Global instance
export const traitSystem = new TraitSystem();
