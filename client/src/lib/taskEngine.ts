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
        
        // CRITICAL FIX: Repair user data if it's incomplete
        await this.repairUserDataIfNeeded();
        
        // CRITICAL FIX: Always sync viewing day to current active day during initialization
        // This ensures we never show stale day content when switching tabs
        const calculatedActiveDay = this.getCurrentActiveDay();
        
        // Only update viewingDay if we're not in manual navigation mode
        if (!this.manualNavigation) {
          console.log(`TaskEngine: Syncing viewingDay from ${this.viewingDay} to ${calculatedActiveDay}`);
          this.viewingDay = calculatedActiveDay;
        }
      }
    } catch (error) {
      console.error('Failed to initialize task engine:', error);
    }
  }

  // CRITICAL FIX: Repair user data if it's incomplete or inconsistent
  private async repairUserDataIfNeeded(): Promise<void> {
    if (!this.user) return;
    
    let needsUpdate = false;
    const calculatedActiveDay = this.getCurrentActiveDay();
    
    // Fix missing or incorrect currentDay
    if (!this.user.currentDay || this.user.currentDay < 1) {
      console.log(`TaskEngine: Repairing user.currentDay from ${this.user.currentDay} to ${calculatedActiveDay}`);
      this.user.currentDay = calculatedActiveDay;
      needsUpdate = true;
    }
    
    // Fix other missing fields
    if (this.user.completedDays === undefined) {
      const completedDays = Math.max(0, calculatedActiveDay - 1);
      console.log(`TaskEngine: Setting missing user.completedDays to ${completedDays}`);
      this.user.completedDays = completedDays;
      needsUpdate = true;
    }
    
    if (this.user.currentStreak === undefined) {
      console.log('TaskEngine: Setting missing user.currentStreak to 0');
      this.user.currentStreak = 0;
      needsUpdate = true;
    }
    
    if (this.user.longestStreak === undefined) {
      console.log('TaskEngine: Setting missing user.longestStreak to 0');
      this.user.longestStreak = 0;
      needsUpdate = true;
    }
    
    if (needsUpdate) {
      console.log('TaskEngine: Saving repaired user data to localStorage');
      await storage.saveUser(this.user);
    }
  }

  // Calculate the current active day based on PRD logic
  private getCurrentActiveDay(): number {
    if (!this.user) {
      console.log('TaskEngine: getCurrentActiveDay() - no user, returning 1');
      return 1;
    }
    
    // CRITICAL FIX: Handle case where user.currentDay is undefined
    // This can happen if localStorage or Supabase data is incomplete
    if (this.user.currentDay && this.user.currentDay > 1) {
      // If user has a currentDay set and it's valid, use it as a starting point
      // but still validate against task completions for safety
      console.log(`TaskEngine: getCurrentActiveDay() - user.currentDay is ${this.user.currentDay}, validating against completions`);
    }
    
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
    
    console.log(`TaskEngine: getCurrentActiveDay() calculated ${activeDay} (user.currentDay: ${this.user?.currentDay}, taskCompletions: ${this.taskCompletions.length})`);
    
    // CRITICAL FIX: If there's a mismatch between user.currentDay and calculated activeDay,
    // trust the task completions (more reliable) but log the discrepancy
    if (this.user.currentDay && this.user.currentDay !== activeDay) {
      console.warn(`TaskEngine: Mismatch detected - user.currentDay: ${this.user.currentDay}, calculated activeDay: ${activeDay}. Using calculated value.`);
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

  // CRITICAL FIX: Add method to force sync viewing day with active day
  async syncToActiveDay(): Promise<void> {
    // CRITICAL: Always initialize before syncing to ensure we have current data
    await this.initialize();
    
    const activeDay = this.getCurrentActiveDay();
    console.log(`TaskEngine: syncToActiveDay() - viewingDay: ${this.viewingDay} -> ${activeDay}, manualNavigation: ${this.manualNavigation}, user: ${this.user ? 'exists' : 'null'}, taskCompletions: ${this.taskCompletions.length}`);
    this.viewingDay = activeDay;
    this.manualNavigation = false;
  }

  // CRITICAL FIX: Add method to check if user is viewing current day
  isViewingCurrentDay(): boolean {
    return this.viewingDay === this.getCurrentActiveDay() && !this.manualNavigation;
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
    
    // CRITICAL FIX: Auto-sync viewing day to active day BEFORE task completion
    // This ensures UI consistency between day display and task content
    if (this.viewingDay !== currentActiveDay && !this.manualNavigation) {
      this.viewingDay = currentActiveDay;
    }

    // Validate previous days are complete
    if (currentActiveDay > 1) {
      const previousDay = currentActiveDay - 1;
      const isPreviousDayComplete = this.isDayCompleted(previousDay);
      
      if (!isPreviousDayComplete) {
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
    const didAdvance = await this.checkDayAdvancement();
    
    // CRITICAL FIX: Ensure viewing day stays in sync after day advancement
    if (didAdvance) {
      this.viewingDay = this.getCurrentActiveDay();
      this.manualNavigation = false;
    }
    
    return true;
  }

  async skipTask(taskId: string, reason?: string): Promise<boolean> {
    await this.initialize();
    
    const currentActiveDay = this.getCurrentActiveDay();
    
    // CRITICAL FIX: Allow skipping on current active day regardless of viewing day
    // Auto-sync viewing day if user is on current active day
    if (!this.manualNavigation || this.viewingDay === currentActiveDay) {
      this.viewingDay = currentActiveDay;
      this.manualNavigation = false;
    } else if (this.viewingDay !== currentActiveDay) {
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
    const didAdvance = await this.checkDayAdvancement();
    
    // CRITICAL FIX: Ensure viewing day stays in sync after day advancement
    if (didAdvance) {
      this.viewingDay = this.getCurrentActiveDay();
      this.manualNavigation = false;
    }
    
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
          this.user.currentStreak = 0;
        } else {
          this.user.currentStreak = (this.user.currentStreak || 0) + 1;
          
          // Update longest streak if current streak is higher
          if (this.user.currentStreak > (this.user.longestStreak || 0)) {
            this.user.longestStreak = this.user.currentStreak;
          }
        }
        
        await storage.saveUser(this.user);
        await storage.setCurrentDay(newDay);
        
        // Check for streak milestone celebration
        if (!dayHasSkippedTasks && this.user.currentStreak > 0) {
          const streakCount = this.user.currentStreak;
          const isStreakMilestone = (
            streakCount === 3 || streakCount === 7 || streakCount === 14 || 
            streakCount === 21 || streakCount === 30 || (streakCount % 10 === 0 && streakCount > 30)
          );
          
          if (isStreakMilestone) {
            // Trigger celebration via custom event
            window.dispatchEvent(new CustomEvent('streakMilestone', { 
              detail: { streak: streakCount } 
            }));
          }
        }
      }
      
      // CRITICAL FIX: Auto-advance to next day and ensure viewing day stays in sync
      this.viewingDay = newDay;
      this.manualNavigation = false; // Reset manual navigation since we auto-advanced
      
      // Debug logging to help track day advancement
      console.log(`Day advancement: ${currentActiveDay} -> ${newDay}, viewing day synced to ${this.viewingDay}`);
      
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
    }
    
    // Reset viewing day to 1
    this.viewingDay = 1;
    await storage.setCurrentDay(1);
    
    // Re-initialize to ensure everything is loaded properly
    await this.initialize();
  }

  async resetProgress(): Promise<void> {
    this.taskCompletions = [];
    this.viewingDay = 1;
    this.manualNavigation = false;
    await storage.clearProgressData(); // Only clear progress, keep onboarding status
  }
}