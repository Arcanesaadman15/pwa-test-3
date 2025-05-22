import { Task, TaskCompletion, DayProgress, User } from "@/types";
import { TASK_CATALOG, getTask } from "@/data/taskCatalog";
import { BEGINNER_PROGRAM, getBeginnerDayTasks, getPhaseFromDay } from "@/data/beginnerProgram";
import { storage } from "./storage";

export class TaskEngine {
  private currentDay: number = 1;
  private currentProgram: 'beginner' | 'intermediate' | 'advanced' = 'beginner';
  private taskCompletions: TaskCompletion[] = [];
  private user: User | null = null;

  constructor() {
    this.initialize();
  }

  private async initialize() {
    try {
      this.user = await storage.getUser();
      this.currentDay = await storage.getCurrentDay();
      this.taskCompletions = await storage.getTaskCompletions();
      
      if (this.user) {
        this.currentProgram = this.user.program;
        this.currentDay = this.user.currentDay;
      }
    } catch (error) {
      console.error('Failed to initialize task engine:', error);
    }
  }

  async getCurrentDayTasks() {
    await this.initialize();
    
    const taskIds = this.getTaskIdsForDay(this.currentDay);
    const tasks = taskIds.map(id => getTask(id)).filter(Boolean) as Task[];
    
    const completedTaskIds = this.getCompletedTaskIdsForDay(this.currentDay);
    const skippedTaskIds = this.getSkippedTaskIdsForDay(this.currentDay);
    
    const active = tasks.filter(task => 
      !completedTaskIds.includes(task.id) && !skippedTaskIds.includes(task.id)
    );
    
    const completed = tasks
      .filter(task => completedTaskIds.includes(task.id))
      .map(task => {
        const completion = this.taskCompletions.find(c => 
          c.taskId === task.id && c.day === this.currentDay && !c.skipped
        );
        return {
          ...task,
          completedAt: completion?.completedAt || new Date()
        };
      });
    
    const skipped = tasks
      .filter(task => skippedTaskIds.includes(task.id))
      .map(task => {
        const completion = this.taskCompletions.find(c => 
          c.taskId === task.id && c.day === this.currentDay && c.skipped
        );
        return {
          ...task,
          skippedAt: completion?.completedAt || new Date()
        };
      });

    return { active, completed, skipped };
  }

  private getTaskIdsForDay(day: number): string[] {
    switch (this.currentProgram) {
      case 'beginner':
        return getBeginnerDayTasks(day);
      case 'intermediate':
        // TODO: Implement intermediate program
        return getBeginnerDayTasks(day);
      case 'advanced':
        // TODO: Implement advanced program
        return getBeginnerDayTasks(day);
      default:
        return [];
    }
  }

  private getCompletedTaskIdsForDay(day: number): string[] {
    return this.taskCompletions
      .filter(completion => completion.day === day && !completion.skipped)
      .map(completion => completion.taskId);
  }

  private getSkippedTaskIdsForDay(day: number): string[] {
    return this.taskCompletions
      .filter(completion => completion.day === day && completion.skipped)
      .map(completion => completion.taskId);
  }

  async completeTask(taskId: string): Promise<void> {
    try {
      const completion: TaskCompletion = {
        taskId,
        day: this.currentDay,
        completedAt: new Date(),
        skipped: false
      };

      await storage.saveTaskCompletion(completion);
      this.taskCompletions.push(completion);

      // Update user progress
      await this.updateUserProgress();

      // Check if offline, add to pending sync
      if (!navigator.onLine) {
        await storage.addPendingTaskCompletion(completion);
      }
    } catch (error) {
      console.error('Failed to complete task:', error);
      throw error;
    }
  }

  async skipTask(taskId: string, reason?: string): Promise<void> {
    try {
      const completion: TaskCompletion = {
        taskId,
        day: this.currentDay,
        completedAt: new Date(),
        skipped: true,
        skipReason: reason
      };

      await storage.saveTaskCompletion(completion);
      this.taskCompletions.push(completion);
    } catch (error) {
      console.error('Failed to skip task:', error);
      throw error;
    }
  }

  getDayProgress(): DayProgress {
    const taskIds = this.getTaskIdsForDay(this.currentDay);
    const completedIds = this.getCompletedTaskIdsForDay(this.currentDay);
    
    return {
      currentDay: this.currentDay,
      currentPhase: getPhaseFromDay(this.currentDay),
      tasksCompleted: completedIds.length,
      totalTasks: taskIds.length,
      completionPercentage: taskIds.length > 0 ? Math.round((completedIds.length / taskIds.length) * 100) : 0
    };
  }

  async switchProgram(program: 'beginner' | 'intermediate' | 'advanced'): Promise<void> {
    try {
      this.currentProgram = program;
      
      if (this.user) {
        this.user.program = program;
        await storage.saveUser(this.user);
      }
    } catch (error) {
      console.error('Failed to switch program:', error);
      throw error;
    }
  }

  async advanceDay(): Promise<boolean> {
    if (this.currentDay >= 63) return false;
    
    try {
      this.currentDay += 1;
      await storage.setCurrentDay(this.currentDay);
      
      if (this.user) {
        this.user.currentDay = this.currentDay;
        await storage.saveUser(this.user);
      }
      
      return true;
    } catch (error) {
      console.error('Failed to advance day:', error);
      return false;
    }
  }

  private async updateUserProgress(): Promise<void> {
    if (!this.user) return;

    try {
      const completedToday = this.getCompletedTaskIdsForDay(this.currentDay);
      const totalToday = this.getTaskIdsForDay(this.currentDay);
      
      // Check if day is complete
      if (completedToday.length === totalToday.length && totalToday.length > 0) {
        this.user.completedDays += 1;
        this.user.currentStreak += 1;
        
        if (this.user.currentStreak > this.user.longestStreak) {
          this.user.longestStreak = this.user.currentStreak;
        }
      }

      await storage.saveUser(this.user);
    } catch (error) {
      console.error('Failed to update user progress:', error);
    }
  }

  getStreakInfo() {
    return {
      currentStreak: this.user?.currentStreak || 0,
      longestStreak: this.user?.longestStreak || 0
    };
  }

  getCompletionStats() {
    const totalPossibleTasks = this.currentDay * 3; // Rough estimate
    const totalCompletedTasks = this.taskCompletions.filter(c => !c.skipped).length;
    
    return {
      totalCompleted: totalCompletedTasks,
      successRate: totalPossibleTasks > 0 ? Math.round((totalCompletedTasks / totalPossibleTasks) * 100) : 0,
      completedDays: this.user?.completedDays || 0
    };
  }

  async resetProgress(): Promise<void> {
    try {
      this.currentDay = 1;
      this.taskCompletions = [];
      
      if (this.user) {
        this.user.currentDay = 1;
        this.user.currentStreak = 0;
        this.user.completedDays = 0;
        await storage.saveUser(this.user);
      }
      
      await storage.setCurrentDay(1);
      // Note: This doesn't clear task completions as they might be needed for analytics
    } catch (error) {
      console.error('Failed to reset progress:', error);
      throw error;
    }
  }
}
