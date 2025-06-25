import { UserSkills, SkillDefinition, TaskCompletion } from "@/types";
import { storage } from "./storage";

export class SkillSystem {
  private userSkills: UserSkills = {};
  private taskCompletions: TaskCompletion[] = [];

  constructor() {
    this.initialize();
  }

  private async initialize() {
    try {
      this.userSkills = await storage.getUserSkills();
      this.taskCompletions = await storage.getTaskCompletions();
    } catch (error) {
      console.error('Failed to initialize skill system:', error);
    }
  }

  async getUserSkills(): Promise<UserSkills> {
    await this.initialize();
    return this.userSkills;
  }

  async checkSkillUnlocks(): Promise<any[]> {
    await this.initialize();
    
    const newSkills: any[] = [];
    
    // Check sleep skills
    const sleepUnlocks = await this.checkCategorySkills('sleep');
    newSkills.push(...sleepUnlocks);
    
    // Check movement skills
    const movementUnlocks = await this.checkCategorySkills('movement');
    newSkills.push(...movementUnlocks);
    
    // Check nutrition skills
    const nutritionUnlocks = await this.checkCategorySkills('nutrition');
    newSkills.push(...nutritionUnlocks);
    
    // Check recovery skills
    const recoveryUnlocks = await this.checkCategorySkills('recovery');
    newSkills.push(...recoveryUnlocks);
    
    // Check mindfulness skills
    const mindfulnessUnlocks = await this.checkCategorySkills('mindfulness');
    newSkills.push(...mindfulnessUnlocks);

    if (newSkills.length > 0) {
      await storage.saveUserSkills(this.userSkills);
    }

    return newSkills;
  }

  private async checkCategorySkills(category: string): Promise<any[]> {
    const categorySkills = this.getSkillDefinitions(category);
    const newSkills: any[] = [];
    
    if (!this.userSkills[category as keyof UserSkills]) {
      this.userSkills[category as keyof UserSkills] = {
        level: 0,
        progress: 0,
        unlockedSkills: []
      };
    }

    const userCategorySkills = this.userSkills[category as keyof UserSkills]!;
    const categoryTaskCompletions = this.getCategoryTaskCompletions(category);

    for (const skill of categorySkills) {
      if (!userCategorySkills.unlockedSkills.includes(skill.id)) {
        if (this.isSkillUnlockConditionMet(skill, categoryTaskCompletions)) {
          userCategorySkills.unlockedSkills.push(skill.id);
          userCategorySkills.level += 1;
          userCategorySkills.progress = Math.min(100, userCategorySkills.progress + 25);
          
          newSkills.push({
            id: skill.id,
            title: skill.name,
            description: skill.description,
            category: category,
            categoryName: this.getCategoryDisplayName(category),
            categoryIcon: this.getCategoryIcon(category),
            level: userCategorySkills.level
          });
        }
      }
    }

    return newSkills;
  }

  private getSkillDefinitions(category: string): SkillDefinition[] {
    const skillDefinitions: { [key: string]: SkillDefinition[] } = {
      sleep: [
        {
          id: 'sleep_schedule',
          name: 'Sleep Schedule Master',
          description: 'Consistently complete sleep tasks',
          category: 'sleep',
          requiredTasks: 7,
          unlockConditions: { categoryTasks: { Sleep: 7 } }
        },
        {
          id: 'seven_hour_habit',
          name: '7+ Hour Habit',
          description: 'Maintain 7+ hours of sleep consistently',
          category: 'sleep',
          requiredTasks: 14,
          unlockConditions: { categoryTasks: { Sleep: 14 } }
        },
        {
          id: 'sleep_optimizer',
          name: 'Sleep Optimizer',
          description: 'Advanced sleep habit mastery',
          category: 'sleep',
          requiredTasks: 30,
          unlockConditions: { categoryTasks: { Sleep: 30 } }
        }
      ],
      movement: [
        {
          id: 'daily_walker',
          name: 'Daily Walker',
          description: 'Complete basic movement tasks',
          category: 'movement',
          requiredTasks: 5,
          unlockConditions: { categoryTasks: { Movement: 5 } }
        },
        {
          id: 'fitness_novice',
          name: 'Fitness Novice',
          description: 'Regular exercise participation',
          category: 'movement',
          requiredTasks: 15,
          unlockConditions: { categoryTasks: { Movement: 15, Training: 3 } }
        },
        {
          id: 'strength_builder',
          name: 'Strength Builder',
          description: 'Consistent strength training',
          category: 'movement',
          requiredTasks: 30,
          unlockConditions: { categoryTasks: { Training: 10 } }
        }
      ],
      nutrition: [
        {
          id: 'protein_pro',
          name: 'Protein Pro',
          description: 'Consistent protein target achievement',
          category: 'nutrition',
          requiredTasks: 10,
          unlockConditions: { categoryTasks: { Nutrition: 10 } }
        },
        {
          id: 'macro_master',
          name: 'Macro Master',
          description: 'Advanced nutrition tracking',
          category: 'nutrition',
          requiredTasks: 25,
          unlockConditions: { categoryTasks: { Nutrition: 25 } }
        },
        {
          id: 'nutrition_guru',
          name: 'Nutrition Guru',
          description: 'Complete nutrition mastery',
          category: 'nutrition',
          requiredTasks: 50,
          unlockConditions: { categoryTasks: { Nutrition: 50 } }
        }
      ],
      recovery: [
        {
          id: 'sun_seeker',
          name: 'Sun Seeker',
          description: 'Regular morning sunlight exposure',
          category: 'recovery',
          requiredTasks: 7,
          unlockConditions: { categoryTasks: { Recovery: 7 } }
        },
        {
          id: 'stress_buster',
          name: 'Stress Buster',
          description: 'Active stress management',
          category: 'recovery',
          requiredTasks: 20,
          unlockConditions: { categoryTasks: { Recovery: 20 } }
        },
        {
          id: 'recovery_expert',
          name: 'Recovery Expert',
          description: 'Master of recovery techniques',
          category: 'recovery',
          requiredTasks: 40,
          unlockConditions: { categoryTasks: { Recovery: 40 } }
        }
      ],
      mindfulness: [
        {
          id: 'breathing_basics',
          name: 'Breathing Basics',
          description: 'Foundation breathing practices',
          category: 'mindfulness',
          requiredTasks: 5,
          unlockConditions: { categoryTasks: { Mind: 5, 'Breath & Tension': 3 } }
        },
        {
          id: 'meditation_master',
          name: 'Meditation Master',
          description: 'Regular meditation practice',
          category: 'mindfulness',
          requiredTasks: 15,
          unlockConditions: { categoryTasks: { Mind: 15 } }
        },
        {
          id: 'mindful_warrior',
          name: 'Mindful Warrior',
          description: 'Advanced mindfulness mastery',
          category: 'mindfulness',
          requiredTasks: 30,
          unlockConditions: { categoryTasks: { Mind: 30 } }
        }
      ]
    };

    return skillDefinitions[category] || [];
  }

  private getCategoryTaskCompletions(category: string): TaskCompletion[] {
    const categoryMap: { [key: string]: string[] } = {
      sleep: ['Sleep'],
      movement: ['Movement', 'Training', 'Explosive Training'],
      nutrition: ['Nutrition'],
      recovery: ['Recovery'],
      mindfulness: ['Mind', 'Breath & Tension', 'Mindfulness']
    };

    const categories = categoryMap[category] || [];
    
    return this.taskCompletions.filter(completion => {
      // This would need to be enhanced to check the actual task category
      // For now, we'll use a simple heuristic based on task ID
      const taskId = completion.taskId;
      
      if (categories.includes('Sleep') && taskId.includes('sleep')) return true;
      if (categories.includes('Movement') && (taskId.includes('walk') || taskId.includes('steps') || taskId.includes('mobility') || taskId.includes('chair'))) return true;
      if (categories.includes('Training') && (taskId.includes('workout') || taskId.includes('leg') || taskId.includes('strength') || taskId.includes('carry'))) return true;
      if (categories.includes('Explosive Training') && (taskId.includes('hiit') || taskId.includes('plyo') || taskId.includes('sprints'))) return true;
      if (categories.includes('Nutrition') && taskId.includes('protein')) return true;
      if (categories.includes('Recovery') && (taskId.includes('sunlight') || taskId.includes('yoga') || taskId.includes('cold'))) return true;
      if (categories.includes('Mind') && taskId.includes('mindfulness')) return true;
      if (categories.includes('Breath & Tension') && taskId.includes('breath')) return true;
      
      return false;
    });
  }

  private isSkillUnlockConditionMet(skill: SkillDefinition, categoryCompletions: TaskCompletion[]): boolean {
    const { unlockConditions } = skill;
    
    if (unlockConditions.tasksCompleted && categoryCompletions.filter(c => !c.skipped).length < unlockConditions.tasksCompleted) {
      return false;
    }

    if (unlockConditions.categoryTasks) {
      for (const [category, requiredCount] of Object.entries(unlockConditions.categoryTasks)) {
        const categoryCount = categoryCompletions.filter(c => !c.skipped).length;
        if (categoryCount < requiredCount) {
          return false;
        }
      }
    }

    return true;
  }

  private getCategoryDisplayName(category: string): string {
    const displayNames: { [key: string]: string } = {
      sleep: 'Sleep Mastery',
      movement: 'Movement Flow',
      nutrition: 'Nutrition Wisdom',
      recovery: 'Recovery Arts',
      mindfulness: 'Mental Clarity'
    };
    
    return displayNames[category] || category;
  }

  private getCategoryIcon(category: string): string {
    const icons: { [key: string]: string } = {
      sleep: 'Moon',
      movement: 'Dumbbell',
      nutrition: 'Apple',
      recovery: 'RotateCcw',
      mindfulness: 'Brain'
    };
    
    return icons[category] || 'Star';
  }

  async unlockSkill(skillId: string, category: string): Promise<void> {
    try {
      if (!this.userSkills[category as keyof UserSkills]) {
        this.userSkills[category as keyof UserSkills] = {
          level: 0,
          progress: 0,
          unlockedSkills: []
        };
      }

      const userCategorySkills = this.userSkills[category as keyof UserSkills]!;
      
      if (!userCategorySkills.unlockedSkills.includes(skillId)) {
        userCategorySkills.unlockedSkills.push(skillId);
        userCategorySkills.level += 1;
        userCategorySkills.progress = Math.min(100, userCategorySkills.progress + 25);
        
        await storage.saveUserSkills(this.userSkills);
      }
    } catch (error) {
      console.error('Failed to unlock skill:', error);
      throw error;
    }
  }

  async resetSkills(): Promise<void> {
    try {
      this.userSkills = {};
      await storage.saveUserSkills(this.userSkills);
    } catch (error) {
      console.error('Failed to reset skills:', error);
      throw error;
    }
  }
}
