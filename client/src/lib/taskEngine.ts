import { Task, TaskCompletion, DayProgress, User } from "@/types";
import { TASK_CATALOG, getTask } from "@/data/taskCatalog";
import { BEGINNER_PROGRAM, getBeginnerDayTasks, getPhaseFromDay } from "@/data/beginnerProgram";
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
        this.viewingDay = this.getCurrentActiveDay();
      }
    } catch (error) {
      console.error('Failed to initialize task engine:', error);
    }
  }

  // Calculate the current active day based on PRD logic
  private getCurrentActiveDay(): number {
    if (!this.user) return 1;
    
    // Calendar days since program start
    const startDate = new Date(this.user.startDate);
    const today = new Date();
    const daysSinceStart = Math.floor((today.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    
    // Days with completed tasks
    const daysWithCompletions = new Set(this.taskCompletions.map(c => c.day)).size;
    
    // Use greater of calendar days or days with progress, capped at 63
    const effectiveDay = Math.min(Math.max(daysSinceStart, daysWithCompletions || 1), 63);
    
    // Validate sequential completion - find furthest valid day
    let validDay = 1;
    for (let day = 1; day <= effectiveDay; day++) {
      if (day === 1 || this.isDayCompleted(day - 1)) {
        validDay = day;
      } else {
        break;
      }
    }
    
    return validDay;
  }

  // Check if all tasks for a day are completed or skipped
  private isDayCompleted(day: number): boolean {
    const taskIds = this.getTaskIdsForDay(day);
    const dayCompletions = this.taskCompletions.filter(c => c.day === day);
    
    return taskIds.every(taskId => 
      dayCompletions.some(c => c.taskId === taskId)
    );
  }

  // Get the furthest unlocked day
  private getFurthestUnlockedDay(): number {
    let furthest = 1;
    for (let day = 1; day <= 63; day++) {
      if (day === 1 || this.isDayCompleted(day - 1)) {
        furthest = day;
      } else {
        break;
      }
    }
    return furthest;
  }

  // Navigation methods
  navigateToDay(day: number): boolean {
    const furthestUnlocked = this.getFurthestUnlockedDay();
    if (day < 1 || day > 63 || day > furthestUnlocked) {
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
    const furthestUnlocked = this.getFurthestUnlockedDay();
    if (this.viewingDay >= furthestUnlocked) return false;
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
    const furthestUnlocked = this.getFurthestUnlockedDay();
    return this.viewingDay < furthestUnlocked;
  }

  // Task interaction methods
  async completeTask(taskId: string): Promise<boolean> {
    await this.initialize();
    
    const currentActiveDay = this.getCurrentActiveDay();
    if (this.viewingDay !== currentActiveDay) {
      throw new Error("You can only complete tasks for your current active day");
    }

    // Validate previous days are complete
    if (currentActiveDay > 1 && !this.isDayCompleted(currentActiveDay - 1)) {
      throw new Error("You need to complete or skip all tasks from previous days first");
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

  // Check if current day is complete and advance if necessary
  private async checkDayAdvancement(): Promise<void> {
    const currentActiveDay = this.getCurrentActiveDay();
    
    // Only auto-advance if user is viewing the current active day
    if (!this.manualNavigation && this.viewingDay === currentActiveDay) {
      if (this.isDayCompleted(currentActiveDay) && currentActiveDay < 63) {
        // Advance to next day
        this.viewingDay = currentActiveDay + 1;
        
        // Update user's current day
        if (this.user) {
          this.user.currentDay = currentActiveDay + 1;
          await storage.saveUser(this.user);
        }
      }
    }
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
        // TODO: Implement intermediate program
        return getBeginnerDayTasks(day);
      case 'advanced':
        // TODO: Implement advanced program
        return getBeginnerDayTasks(day);
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
    this.currentProgram = program;
    if (this.user) {
      this.user.program = program;
      await storage.saveUser(this.user);
    }
  }

  async resetProgress(): Promise<void> {
    this.taskCompletions = [];
    this.viewingDay = 1;
    this.manualNavigation = false;
    await storage.clearAllData();
  }
}