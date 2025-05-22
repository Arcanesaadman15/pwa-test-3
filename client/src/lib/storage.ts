import { User, TaskCompletion, UserSkills, OnboardingData } from "@/types";

const STORAGE_KEYS = {
  USER: 'peakforge-user',
  TASK_COMPLETIONS: 'peakforge-task-completions',
  USER_SKILLS: 'peakforge-user-skills',
  ONBOARDING_COMPLETE: 'peakforge-onboarding-complete',
  ONBOARDING_DATA: 'peakforge-onboarding-data',
  CURRENT_DAY: 'peakforge-current-day',
  ACHIEVEMENTS: 'peakforge-achievements'
};

class Storage {
  async getUser(): Promise<User | null> {
    try {
      const userData = localStorage.getItem(STORAGE_KEYS.USER);
      if (!userData) return null;
      
      const user = JSON.parse(userData);
      // Convert date strings back to Date objects
      if (user.startDate) {
        user.startDate = new Date(user.startDate);
      }
      
      return user;
    } catch (error) {
      console.error('Failed to get user from storage:', error);
      return null;
    }
  }

  async saveUser(user: User): Promise<void> {
    try {
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
    } catch (error) {
      console.error('Failed to save user to storage:', error);
      throw error;
    }
  }

  async getOnboardingStatus(): Promise<boolean> {
    try {
      const status = localStorage.getItem(STORAGE_KEYS.ONBOARDING_COMPLETE);
      return status === 'true';
    } catch (error) {
      console.error('Failed to get onboarding status:', error);
      return false;
    }
  }

  async setOnboardingComplete(): Promise<void> {
    try {
      localStorage.setItem(STORAGE_KEYS.ONBOARDING_COMPLETE, 'true');
    } catch (error) {
      console.error('Failed to set onboarding complete:', error);
      throw error;
    }
  }

  async getOnboardingData(): Promise<OnboardingData | null> {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.ONBOARDING_DATA);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Failed to get onboarding data:', error);
      return null;
    }
  }

  async saveOnboardingData(data: OnboardingData): Promise<void> {
    try {
      localStorage.setItem(STORAGE_KEYS.ONBOARDING_DATA, JSON.stringify(data));
    } catch (error) {
      console.error('Failed to save onboarding data:', error);
      throw error;
    }
  }

  async getTaskCompletions(): Promise<TaskCompletion[]> {
    try {
      const completions = localStorage.getItem(STORAGE_KEYS.TASK_COMPLETIONS);
      if (!completions) return [];
      
      const parsedCompletions = JSON.parse(completions);
      // Convert date strings back to Date objects
      return parsedCompletions.map((completion: any) => ({
        ...completion,
        completedAt: new Date(completion.completedAt)
      }));
    } catch (error) {
      console.error('Failed to get task completions:', error);
      return [];
    }
  }

  async saveTaskCompletion(completion: TaskCompletion): Promise<void> {
    try {
      const completions = await this.getTaskCompletions();
      completions.push(completion);
      localStorage.setItem(STORAGE_KEYS.TASK_COMPLETIONS, JSON.stringify(completions));
    } catch (error) {
      console.error('Failed to save task completion:', error);
      throw error;
    }
  }

  async getUserSkills(): Promise<UserSkills> {
    try {
      const skills = localStorage.getItem(STORAGE_KEYS.USER_SKILLS);
      return skills ? JSON.parse(skills) : {};
    } catch (error) {
      console.error('Failed to get user skills:', error);
      return {};
    }
  }

  async saveUserSkills(skills: UserSkills): Promise<void> {
    try {
      localStorage.setItem(STORAGE_KEYS.USER_SKILLS, JSON.stringify(skills));
    } catch (error) {
      console.error('Failed to save user skills:', error);
      throw error;
    }
  }

  async getCurrentDay(): Promise<number> {
    try {
      const day = localStorage.getItem(STORAGE_KEYS.CURRENT_DAY);
      return day ? parseInt(day, 10) : 1;
    } catch (error) {
      console.error('Failed to get current day:', error);
      return 1;
    }
  }

  async setCurrentDay(day: number): Promise<void> {
    try {
      localStorage.setItem(STORAGE_KEYS.CURRENT_DAY, day.toString());
    } catch (error) {
      console.error('Failed to set current day:', error);
      throw error;
    }
  }

  async getAchievements(): Promise<string[]> {
    try {
      const achievements = localStorage.getItem(STORAGE_KEYS.ACHIEVEMENTS);
      return achievements ? JSON.parse(achievements) : [];
    } catch (error) {
      console.error('Failed to get achievements:', error);
      return [];
    }
  }

  async saveAchievement(achievementId: string): Promise<void> {
    try {
      const achievements = await this.getAchievements();
      if (!achievements.includes(achievementId)) {
        achievements.push(achievementId);
        localStorage.setItem(STORAGE_KEYS.ACHIEVEMENTS, JSON.stringify(achievements));
      }
    } catch (error) {
      console.error('Failed to save achievement:', error);
      throw error;
    }
  }

  async clearAllData(): Promise<void> {
    try {
      Object.values(STORAGE_KEYS).forEach(key => {
        localStorage.removeItem(key);
      });
    } catch (error) {
      console.error('Failed to clear storage data:', error);
      throw error;
    }
  }

  // Offline sync support
  async getPendingTaskCompletions(): Promise<TaskCompletion[]> {
    try {
      const pending = localStorage.getItem('peakforge-pending-sync');
      return pending ? JSON.parse(pending) : [];
    } catch (error) {
      console.error('Failed to get pending task completions:', error);
      return [];
    }
  }

  async addPendingTaskCompletion(completion: TaskCompletion): Promise<void> {
    try {
      const pending = await this.getPendingTaskCompletions();
      pending.push(completion);
      localStorage.setItem('peakforge-pending-sync', JSON.stringify(pending));
    } catch (error) {
      console.error('Failed to add pending task completion:', error);
      throw error;
    }
  }

  async clearPendingTaskCompletions(): Promise<void> {
    try {
      localStorage.removeItem('peakforge-pending-sync');
    } catch (error) {
      console.error('Failed to clear pending task completions:', error);
      throw error;
    }
  }
}

export const storage = new Storage();
