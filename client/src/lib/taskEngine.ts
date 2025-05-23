import { Task, TaskCompletion, DayProgress, User } from "@/types";
import { TASK_CATALOG, getTask } from "@/data/taskCatalog";
import { BEGINNER_PROGRAM, getBeginnerDayTasks, getPhaseFromDay } from "@/data/beginnerProgram";
import { getIntermediateDayTasks } from "@/data/intermediateProgram";
import { getAdvancedDayTasks } from "@/data/advancedProgram";
import { storage } from "./storage";

export class TaskEngine {
  private viewingDay: number = 1;
  private currentProgram: 'beginner' | 'intermediate' | 'advanced' = 'beginner';
  private taskCompletions: TaskCompletion[] = [];
  private user: User | null = null;
  private manualNavigation: boolean = false;

  constructor() {
    this.initialize();
  }

  private async initialize() {
    try {
      this.user = await storage.getUser();
      this.taskCompletions = await storage.getTaskCompletions();
      
      if (this.user) {
        this.currentProgram = this.user.program;
        // Only set viewing day on first initialization, not every time
        if (this.viewingDay === 1) {
          this.viewingDay = this.getCurrentActiveDay();
        }
      }
    } catch (error) {
      console.error('Failed to initialize task engine:', error);
    }
  }

  // Calculate the current active day based on PRD logic
  private getCurrentActiveDay(): number {
    if (!this.user) return 1;
    
    // Find the furthest day that can be unlocked based on sequential completion
    let activeDay = 1;
    
    // Check each day sequentially
    for (let day = 1; day <= 63; day++) {
      if (day === 1) {
        // Day 1 is always unlocked
        activeDay = day;
      } else if (this.isDayCompleted(day - 1)) {
        // If previous day is complete, this day becomes active
        activeDay = day;
      } else {
        // Previous day not complete, so this is as far as we can go
        break;
      }
    }
    
    return activeDay;
  }

  // Check if all tasks for a day are completed or skipped
  private isDayCompleted(day: number): boolean {
    const taskIds = this.getTaskIdsForDay(day);
    const dayCompletions = this.taskCompletions.filter(c => c.day === day);
    
    return taskIds.every(taskId => 
      dayCompletions.some(c => c.taskId === taskId)
    );
  }

  // Get the furthest unlocked day (same as current active day)
  private getFurthestUnlockedDay(): number {
    return this.getCurrentActiveDay();
  }

  // Navigation methods
  navigateToDay(day: number): boolean {
    // Allow browsing any day from 1 to 63
    if (day < 1 || day > 63) {
      return false;
    }
    
    this.viewingDay = day;
    this.manualNavigation = (day !== this.getCurrentActiveDay());
    return true;
  }

  navigatePrevious(): boolean {
    if (this.viewingDay <= 1) return false;
    return this.navigateToDay(this.viewingDay - 1);
  }

  navigateNext(): boolean {
    if (this.viewingDay >= 63) return false;
    return this.navigateToDay(this.viewingDay + 1);
  }

  goToToday(): boolean {
    this.manualNavigation = false;
    const activeDay = this.getCurrentActiveDay();
    return this.navigateToDay(activeDay);
  }

  canNavigatePrevious(): boolean {
    return this.viewingDay > 1;
  }

  canNavigateNext(): boolean {
    return this.viewingDay < 63;
  }

  // Task interaction methods
  async completeTask(taskId: string): Promise<boolean> {
    await this.initialize();
    
    const currentActiveDay = this.getCurrentActiveDay();
    console.log(`🔥 [TASK ENGINE] completeTask called - Task: ${taskId}, Active Day: ${currentActiveDay}, Viewing Day: ${this.viewingDay}`);
    
    if (this.viewingDay !== currentActiveDay) {
      console.error(`❌ [TASK ENGINE] Day mismatch - viewing ${this.viewingDay} but active is ${currentActiveDay}`);
      throw new Error("You can only complete tasks for your current active day");
    }

    // Validate previous days are complete
    if (currentActiveDay > 1) {
      const previousDay = currentActiveDay - 1;
      const isPreviousDayComplete = this.isDayCompleted(previousDay);
      console.log(`🔥 [TASK ENGINE] Checking Day ${previousDay} completion: ${isPreviousDayComplete}`);
      
      if (!isPreviousDayComplete) {
        console.error(`❌ [TASK ENGINE] Day ${previousDay} is not complete - cannot proceed with Day ${currentActiveDay}`);
        const previousDayTasks = this.getTaskIdsForDay(previousDay);
        const previousDayCompletions = this.taskCompletions.filter(c => c.day === previousDay);
        console.log(`🔥 [TASK ENGINE] Day ${previousDay} tasks:`, previousDayTasks);
        console.log(`🔥 [TASK ENGINE] Day ${previousDay} completions:`, previousDayCompletions);
        throw new Error("You need to complete or skip all tasks from previous days first");
      }
    }

    // Remove any existing completion/skip for this task on this day
    this.taskCompletions = this.taskCompletions.filter(c => 
      !(c.taskId === taskId && c.day === currentActiveDay)
    );

    // Add completion
    const completion: TaskCompletion = {
      taskId,
      day: currentActiveDay,
      completedAt: new Date(),
      skipped: false
    };

    this.taskCompletions.push(completion);
    await storage.saveTaskCompletion(completion);
    
    // Check for day advancement
    await this.checkDayAdvancement();
    
    return true;
  }

  async skipTask(taskId: string, reason?: string): Promise<boolean> {
    await this.initialize();
    
    const currentActiveDay = this.getCurrentActiveDay();
    if (this.viewingDay !== currentActiveDay) {
      throw new Error("You can only skip tasks for your current active day");
    }

    // Validate previous days are complete
    if (currentActiveDay > 1 && !this.isDayCompleted(currentActiveDay - 1)) {
      throw new Error("You need to complete or skip all tasks from previous days first");
    }

    // Remove any existing completion/skip for this task on this day
    this.taskCompletions = this.taskCompletions.filter(c => 
      !(c.taskId === taskId && c.day === currentActiveDay)
    );

    // Add skip
    const completion: TaskCompletion = {
      taskId,
      day: currentActiveDay,
      completedAt: new Date(),
      skipped: true,
      skipReason: reason
    };

    this.taskCompletions.push(completion);
    await storage.saveTaskCompletion(completion);
    
    // Check for day advancement
    await this.checkDayAdvancement();
    
    return true;
  }

  // New method to allow changing skipped tasks to completed
  async unSkipTask(taskId: string): Promise<boolean> {
    await this.initialize();
    
    // Allow changing skipped tasks from any day (not just current)
    const targetDay = this.viewingDay;
    
    // Remove existing skip entry
    this.taskCompletions = this.taskCompletions.filter(c => 
      !(c.taskId === taskId && c.day === targetDay)
    );

    // Add completion
    const completion: TaskCompletion = {
      taskId,
      day: targetDay,
      completedAt: new Date(),
      skipped: false
    };

    this.taskCompletions.push(completion);
    await storage.saveTaskCompletion(completion);
    
    // Check for day advancement only if we're on current active day
    if (targetDay === this.getCurrentActiveDay()) {
      await this.checkDayAdvancement();
    }
    
    return true;
  }

  // Check if current day is complete and advance if necessary
  private async checkDayAdvancement(): Promise<boolean> {
    const currentActiveDay = this.getCurrentActiveDay();
    
    // If current day is completed and there's a next day, advance automatically
    if (this.isDayCompleted(currentActiveDay) && currentActiveDay < 63) {
      const newDay = currentActiveDay + 1;
      
      // Calculate streak for the completed day
      const dayHasSkippedTasks = this.hasDaySkippedTasks(currentActiveDay);
      
      // Update user's current day and streak
      if (this.user) {
        this.user.currentDay = newDay;
        this.user.completedDays = (this.user.completedDays || 0) + 1;
        
        // Update streak: reset if any tasks were skipped, otherwise increment
        if (dayHasSkippedTasks) {
          console.log(`🔄 Day ${currentActiveDay} had skipped tasks - resetting streak`);
          this.user.currentStreak = 0;
        } else {
          console.log(`✅ Day ${currentActiveDay} completed with no skips - incrementing streak`);
          this.user.currentStreak = (this.user.currentStreak || 0) + 1;
          
          // Update longest streak if current streak is higher
          if (this.user.currentStreak > (this.user.longestStreak || 0)) {
            this.user.longestStreak = this.user.currentStreak;
          }
        }
        
        await storage.saveUser(this.user);
        await storage.setCurrentDay(newDay);
        
        console.log(`📊 Streak update: Current=${this.user.currentStreak}, Longest=${this.user.longestStreak}`);
      }
      
      // Auto-advance to next day and navigate user there
      this.viewingDay = newDay;
      this.manualNavigation = false; // Reset manual navigation since we auto-advanced
      
      return true; // Signal that advancement happened
    }
    
    return false; // No advancement
  }

  private hasDaySkippedTasks(day: number): boolean {
    return this.taskCompletions.some(completion => 
      completion.day === day && completion.skipped === true
    );
  }

  // Get tasks for viewing day with proper three-panel organization
  async getTasksForDay(day?: number): Promise<{
    active: Task[];
    completed: Array<Task & { completedAt: Date }>;
    skipped: Array<Task & { skippedAt: Date; skipReason?: string }>;
    dayInfo: {
      dayNumber: number;
      isCurrentDay: boolean;
      isUnlocked: boolean;
      canInteract: boolean;
      completionStatus: 'incomplete' | 'completed';
      phase: number;
    };
  }> {
    await this.initialize();
    
    const targetDay = day || this.viewingDay;
    const currentActiveDay = this.getCurrentActiveDay();
    const furthestUnlocked = this.getFurthestUnlockedDay();
    
    const taskIds = this.getTaskIdsForDay(targetDay);
    const tasks = taskIds.map(id => getTask(id)).filter(Boolean) as Task[];
    
    const dayCompletions = this.taskCompletions.filter(c => c.day === targetDay);
    
    const active: Task[] = [];
    const completed: Array<Task & { completedAt: Date }> = [];
    const skipped: Array<Task & { skippedAt: Date; skipReason?: string }> = [];
    
    tasks.forEach(task => {
      const completion = dayCompletions.find(c => c.taskId === task.id);
      
      if (!completion) {
        active.push(task);
      } else if (completion.skipped) {
        skipped.push({
          ...task,
          skippedAt: completion.completedAt,
          skipReason: completion.skipReason
        });
      } else {
        completed.push({
          ...task,
          completedAt: completion.completedAt
        });
      }
    });

    return {
      active,
      completed,
      skipped,
      dayInfo: {
        dayNumber: targetDay,
        isCurrentDay: targetDay === currentActiveDay,
        isUnlocked: targetDay <= furthestUnlocked,
        canInteract: targetDay === currentActiveDay,
        completionStatus: this.isDayCompleted(targetDay) ? 'completed' : 'incomplete',
        phase: getPhaseFromDay(targetDay)
      }
    };
  }

  // Get current viewing day tasks (for compatibility)
  async getCurrentDayTasks() {
    return this.getTasksForDay(this.viewingDay);
  }

  private getTaskIdsForDay(day: number): string[] {
    switch (this.currentProgram) {
      case 'beginner':
        return getBeginnerDayTasks(day);
      case 'intermediate':
        return getIntermediateDayTasks(day);
      case 'advanced':
        return getAdvancedDayTasks(day);
      default:
        return [];
    }
  }

  getDayProgress(): DayProgress {
    const taskIds = this.getTaskIdsForDay(this.viewingDay);
    const dayCompletions = this.taskCompletions.filter(c => c.day === this.viewingDay);
    
    const totalTasks = taskIds.length;
    const completedTasks = dayCompletions.length;
    
    return {
      currentDay: this.viewingDay,
      currentPhase: getPhaseFromDay(this.viewingDay),
      tasksCompleted: completedTasks,
      totalTasks,
      completionPercentage: totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0
    };
  }

  getViewingDay(): number {
    return this.viewingDay;
  }

  getActiveDay(): number {
    return this.getCurrentActiveDay();
  }

  isManualNavigation(): boolean {
    return this.manualNavigation;
  }

  async switchProgram(program: 'beginner' | 'intermediate' | 'advanced'): Promise<void> {
    console.log(`🔄 Starting program switch from ${this.currentProgram} to ${program}`);
    
    // Reset all progress when switching programs
    await this.resetProgress();
    
    // Update current program
    this.currentProgram = program;
    
    // Update user program and reset to day 1
    if (this.user) {
      this.user.program = program;
      this.user.currentDay = 1;
      this.user.completedDays = 0;
      this.user.currentStreak = 0;
      await storage.saveUser(this.user);
      console.log(`✅ User updated: program=${this.user.program}, day=${this.user.currentDay}`);
    }
    
    // Reset viewing day to 1
    this.viewingDay = 1;
    await storage.setCurrentDay(1);
    
    // Re-initialize to ensure everything is loaded properly
    await this.initialize();
    
    console.log(`🎯 Program switch complete - now on ${this.currentProgram} program, viewing day ${this.viewingDay}`);
  }

  async resetProgress(): Promise<void> {
    this.taskCompletions = [];
    this.viewingDay = 1;
    this.manualNavigation = false;
    await storage.clearProgressData(); // Only clear progress, keep onboarding status
  }
}