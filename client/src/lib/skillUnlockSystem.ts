import { SKILL_DEFINITIONS, SkillDefinition, UnlockedSkill, SkillRequirement } from '@/data/skillDefinitions';
import { TaskCompletion } from '@/types';
import { storage } from '@/lib/storage';

export interface SkillProgress {
  skillId: string;
  progress: { [taskId: string]: number };
  consecutiveProgress: { [taskId: string]: number };
  isUnlocked: boolean;
  unlockedAt?: Date;
}

export interface SkillUnlockResult {
  newlyUnlocked: UnlockedSkill[];
  allUnlocked: UnlockedSkill[];
}

export class SkillUnlockSystem {
  private skillProgress: Map<string, SkillProgress> = new Map();
  private unlockedSkills: Set<string> = new Set();
  private taskCompletions: TaskCompletion[] = [];

  constructor() {
    this.initialize();
  }

  private async initialize() {
    await this.loadSkillProgress();
    await this.loadTaskCompletions();
  }

  private async loadSkillProgress() {
    const savedProgress = await storage.getUserSkills();
    
    // Initialize progress for all skills
    SKILL_DEFINITIONS.forEach(skill => {
      const categoryKey = skill.category.toLowerCase() as keyof typeof savedProgress;
      const existing = savedProgress[categoryKey];
      const isUnlocked = existing?.unlockedSkills?.includes(skill.id) || false;
      
      if (isUnlocked) {
        this.unlockedSkills.add(skill.id);
      }

      this.skillProgress.set(skill.id, {
        skillId: skill.id,
        progress: {},
        consecutiveProgress: {},
        isUnlocked,
        unlockedAt: isUnlocked ? new Date() : undefined
      });
    });
  }

  private async loadTaskCompletions() {
    this.taskCompletions = await storage.getTaskCompletions();
  }

  /**
   * Check for newly unlocked skills after a task completion
   */
  async checkForNewUnlocks(): Promise<SkillUnlockResult> {
    await this.loadTaskCompletions(); // Refresh latest completions
    
    const newlyUnlocked: UnlockedSkill[] = [];
    
    for (const skill of SKILL_DEFINITIONS) {
      if (this.unlockedSkills.has(skill.id)) {
        continue; // Already unlocked
      }

      if (await this.isSkillUnlocked(skill)) {
        const unlockedSkill = await this.unlockSkill(skill);
        newlyUnlocked.push(unlockedSkill);
      }
    }

    const allUnlocked = await this.getAllUnlockedSkills();
    
    return {
      newlyUnlocked,
      allUnlocked
    };
  }

  private async isSkillUnlocked(skill: SkillDefinition): Promise<boolean> {
    for (const requirement of skill.requirements) {
      if (!(await this.isRequirementMet(requirement))) {
        return false;
      }
    }
    return true;
  }

  private async isRequirementMet(requirement: SkillRequirement): Promise<boolean> {
    if (requirement.consecutive) {
      return this.getConsecutiveCompletions(requirement.taskId) >= requirement.count;
    } else {
      return this.getTotalCompletions(requirement.taskId) >= requirement.count;
    }
  }

  private getTotalCompletions(taskId: string): number {
    return this.taskCompletions.filter(
      completion => completion.taskId === taskId && !completion.skipped
    ).length;
  }

  private getConsecutiveCompletions(taskId: string): number {
    // Sort completions by day
    const completions = this.taskCompletions
      .filter(completion => completion.taskId === taskId && !completion.skipped)
      .sort((a, b) => a.day - b.day);

    if (completions.length === 0) return 0;

    let maxConsecutive = 1;
    let currentConsecutive = 1;

    for (let i = 1; i < completions.length; i++) {
      if (completions[i].day === completions[i - 1].day + 1) {
        currentConsecutive++;
        maxConsecutive = Math.max(maxConsecutive, currentConsecutive);
      } else {
        currentConsecutive = 1;
      }
    }

    return maxConsecutive;
  }

  private async unlockSkill(skill: SkillDefinition): Promise<UnlockedSkill> {
    const unlockedAt = new Date();
    
    // Mark as unlocked
    this.unlockedSkills.add(skill.id);
    
    // Update progress
    const progress = this.skillProgress.get(skill.id)!;
    progress.isUnlocked = true;
    progress.unlockedAt = unlockedAt;

    // Save to storage
    await this.saveSkillUnlock(skill.id, skill.category);

    const unlockedSkill: UnlockedSkill = {
      ...skill,
      unlockedAt,
      isRecentlyUnlocked: true
    };

          // Skill unlocked
    
    return unlockedSkill;
  }

  private async saveSkillUnlock(skillId: string, category: string) {
    const currentSkills = await storage.getUserSkills();
    const categoryKey = category.toLowerCase() as keyof typeof currentSkills;
    
    if (!currentSkills[categoryKey]) {
      currentSkills[categoryKey] = {
        level: 1,
        progress: 0,
        unlockedSkills: []
      };
    }

    if (!currentSkills[categoryKey]!.unlockedSkills.includes(skillId)) {
      currentSkills[categoryKey]!.unlockedSkills.push(skillId);
    }

    await storage.saveUserSkills(currentSkills);
  }

  async getAllUnlockedSkills(): Promise<UnlockedSkill[]> {
    const unlockedSkills: UnlockedSkill[] = [];
    
    for (const skillId of Array.from(this.unlockedSkills)) {
      const skill = SKILL_DEFINITIONS.find(s => s.id === skillId);
      const progress = this.skillProgress.get(skillId);
      
      if (skill && progress?.unlockedAt) {
        unlockedSkills.push({
          ...skill,
          unlockedAt: progress.unlockedAt,
          isRecentlyUnlocked: false
        });
      }
    }

    return unlockedSkills.sort((a, b) => b.unlockedAt.getTime() - a.unlockedAt.getTime());
  }

  async getSkillsByCategory(category: string): Promise<{
    unlocked: UnlockedSkill[];
    total: number;
  }> {
    const categorySkills = SKILL_DEFINITIONS.filter(skill => skill.category === category);
    const unlockedInCategory = await this.getAllUnlockedSkills();
    
    return {
      unlocked: unlockedInCategory.filter(skill => skill.category === category),
      total: categorySkills.length
    };
  }

  async getSkillProgress(skillId: string): Promise<{
    skill: SkillDefinition;
    isUnlocked: boolean;
    requirements: Array<{
      taskId: string;
      required: number;
      current: number;
      consecutive: boolean;
      completed: boolean;
    }>;
  } | null> {
    const skill = SKILL_DEFINITIONS.find(s => s.id === skillId);
    if (!skill) return null;

    const isUnlocked = this.unlockedSkills.has(skillId);
    
    const requirements = skill.requirements.map(req => ({
      taskId: req.taskId,
      required: req.count,
      current: req.consecutive 
        ? this.getConsecutiveCompletions(req.taskId)
        : this.getTotalCompletions(req.taskId),
      consecutive: req.consecutive || false,
      completed: req.consecutive
        ? this.getConsecutiveCompletions(req.taskId) >= req.count
        : this.getTotalCompletions(req.taskId) >= req.count
    }));

    return {
      skill,
      isUnlocked,
      requirements
    };
  }

  async getOverallProgress(): Promise<{
    totalSkills: number;
    unlockedSkills: number;
    byCategory: Record<string, { unlocked: number; total: number }>;
    byLevel: Record<number, { unlocked: number; total: number }>;
  }> {
    const allUnlocked = await this.getAllUnlockedSkills();
    
    const byCategory: Record<string, { unlocked: number; total: number }> = {};
    const byLevel: Record<number, { unlocked: number; total: number }> = {};

    // Initialize counters
    ['Physical', 'Nutrition', 'Sleep', 'Mental', 'Recovery'].forEach(category => {
      byCategory[category] = { unlocked: 0, total: 0 };
    });

    [1, 2, 3, 4, 5].forEach(level => {
      byLevel[level] = { unlocked: 0, total: 0 };
    });

    // Count all skills
    SKILL_DEFINITIONS.forEach(skill => {
      byCategory[skill.category].total++;
      byLevel[skill.level].total++;
    });

    // Count unlocked skills
    allUnlocked.forEach(skill => {
      byCategory[skill.category].unlocked++;
      byLevel[skill.level].unlocked++;
    });

    return {
      totalSkills: SKILL_DEFINITIONS.length,
      unlockedSkills: allUnlocked.length,
      byCategory,
      byLevel
    };
  }

  /**
   * Reset skill progress when changing programs (but keep unlocked skills)
   * As per PRD: "Already unlocked skills are NEVER reset when changing programs"
   */
  async resetProgressKeepSkills(): Promise<void> {
    // Only reset task completion tracking, keep all unlocked skills
    this.taskCompletions = [];
    
    // Re-initialize progress tracking but preserve unlocked status
    SKILL_DEFINITIONS.forEach(skill => {
      const progress = this.skillProgress.get(skill.id);
      if (progress) {
        progress.progress = {};
        progress.consecutiveProgress = {};
        // Keep isUnlocked and unlockedAt unchanged
      }
    });

    // Skill progress reset while preserving unlocked skills
  }
}

// Global instance
export const skillUnlockSystem = new SkillUnlockSystem();