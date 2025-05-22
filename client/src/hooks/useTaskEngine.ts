import { useState, useEffect } from "react";
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

  const refreshTasks = () => {
    const tasks = taskEngine.getCurrentDayTasks();
    setCurrentDayTasks(tasks);
  };

  useEffect(() => {
    refreshTasks();
  }, []);

  const completeTask = async (taskId: string) => {
    await taskEngine.completeTask(taskId);
    refreshTasks();
  };

  const skipTask = async (taskId: string) => {
    await taskEngine.skipTask(taskId);
    refreshTasks();
  };

  const getDayProgress = () => {
    return taskEngine.getDayProgress();
  };

  const switchProgram = (program: 'beginner' | 'intermediate' | 'advanced') => {
    taskEngine.switchProgram(program);
    refreshTasks();
  };

  return {
    currentDayTasks,
    completeTask,
    skipTask,
    getDayProgress,
    switchProgram,
    refreshTasks
  };
}
