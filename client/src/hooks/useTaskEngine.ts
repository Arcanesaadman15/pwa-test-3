import { useState, useEffect, useCallback } from "react";
import { TaskEngine } from "@/lib/taskEngine";
import { Task } from "@/types";

export function useTaskEngine() {
  const [taskEngine] = useState(() => new TaskEngine());
  const [currentDayTasks, setCurrentDayTasks] = useState<{
    active: Task[];
    completed: Array<Task & { completedAt: Date }>;
    skipped: Array<Task & { skippedAt: Date }>;
  }>({
    active: [],
    completed: [],
    skipped: []
  });
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const refreshTasks = useCallback(async () => {
    const tasks = await taskEngine.getCurrentDayTasks();
    setCurrentDayTasks(tasks);
  }, [taskEngine]);

  // Force refresh when refreshTrigger changes
  useEffect(() => {
    refreshTasks();
  }, [refreshTasks, refreshTrigger]);

  const triggerRefresh = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  const completeTask = async (taskId: string) => {
    await taskEngine.completeTask(taskId);
    // CRITICAL FIX: Immediate refresh to sync day advancement and UI state
    await refreshTasks();
    // Additional refresh after short delay to ensure UI is fully updated
    setTimeout(async () => {
      await refreshTasks();
      setRefreshTrigger(prev => prev + 1);
    }, 100);
  };

  const skipTask = async (taskId: string) => {
    await taskEngine.skipTask(taskId);
    // CRITICAL FIX: Immediate refresh to sync day advancement and UI state
    await refreshTasks();
    // Additional refresh after short delay to ensure UI is fully updated
    setTimeout(async () => {
      await refreshTasks();
      setRefreshTrigger(prev => prev + 1);
    }, 100);
  };

  const getDayProgress = () => {
    return taskEngine.getDayProgress();
  };

  const switchProgram = async (program: 'beginner' | 'intermediate' | 'advanced') => {
    await taskEngine.switchProgram(program);
    // Force complete refresh after program switch
    await refreshTasks();
    triggerRefresh();
  };

  const unSkipTask = async (taskId: string) => {
    await taskEngine.unSkipTask(taskId);
    await refreshTasks();
    triggerRefresh();
  };

  return {
    taskEngine,
    currentDayTasks,
    completeTask,
    skipTask,
    unSkipTask,
    getDayProgress,
    switchProgram,
    refreshTasks,
    triggerRefresh
  };
}
