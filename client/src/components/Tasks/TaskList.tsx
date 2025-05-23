import { useState, useEffect } from "react";
import { Task } from "@/types";
import { useTaskEngine } from "@/hooks/useTaskEngine";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, ChevronRight, CheckCircle, XCircle, Clock, Lock, Play, Calendar } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface TaskCardProps {
  task: Task;
  status: 'active' | 'completed' | 'skipped';
  canInteract: boolean;
  completedAt?: Date;
  skippedAt?: Date;
  skipReason?: string;
  onComplete?: () => void;
  onSkip?: () => void;
}

function TaskCard({ task, status, canInteract, completedAt, skippedAt, skipReason, onComplete, onSkip }: TaskCardProps) {
  const getCategoryIcon = (category: string) => {
    const icons = {
      'Sleep': '🌙',
      'Movement': '🏃',
      'Nutrition': '🥗',
      'Recovery': '💆',
      'Mindfulness': '🧘',
      'Training': '💪',
      'Explosive Training': '⚡',
      'Breath & Tension': '🫁',
      'Mind': '🧠'
    };
    return icons[category as keyof typeof icons] || '📋';
  };

  const getDifficultyDots = (difficulty: number) => {
    return Array.from({ length: 3 }, (_, i) => (
      <div
        key={i}
        className={`w-2 h-2 rounded-full ${
          i < difficulty ? 'bg-red-500' : 'bg-gray-600'
        }`}
      />
    ));
  };

  return (
    <div className={`bg-gray-800 rounded-2xl p-5 border transition-all duration-200 ${
      status === 'completed' ? 'border-green-500/30 bg-green-900/20' :
      status === 'skipped' ? 'border-gray-600 bg-gray-700/50' :
      canInteract ? 'border-red-500/30 hover:border-red-400/50' : 'border-gray-600 opacity-60'
    }`}>
      <div className="flex items-start gap-4">
        {/* Category Icon */}
        <div className={`w-12 h-12 rounded-full flex items-center justify-center text-xl ${
          status === 'completed' ? 'bg-green-600' :
          status === 'skipped' ? 'bg-gray-600' :
          canInteract ? 'bg-red-600' : 'bg-gray-600'
        }`}>
          {getCategoryIcon(task.category)}
        </div>

        {/* Task Content */}
        <div className="flex-1">
          <h3 className={`font-bold text-lg mb-1 ${
            status === 'completed' ? 'text-green-400' :
            status === 'skipped' ? 'text-gray-400' : 'text-white'
          }`}>
            {task.title}
          </h3>
          <p className={`text-sm mb-3 ${
            status === 'completed' ? 'text-green-300' :
            status === 'skipped' ? 'text-gray-500' : 'text-gray-300'
          }`}>
            {task.subtitle}
          </p>

          {/* Difficulty Dots */}
          <div className="flex items-center gap-1 mb-4">
            {getDifficultyDots(task.difficulty)}
          </div>

          {/* Status Info */}
          {status === 'completed' && (
            <div className="text-xs text-green-400 mb-3">
              ✅ Task completed
            </div>
          )}

          {status === 'skipped' && (
            <div className="mb-3">
              <div className="text-xs text-gray-400 mb-2">
                ⏭️ Task skipped
              </div>
              <Button
                onClick={onComplete}
                className="bg-green-600 hover:bg-green-700 text-white text-xs py-1 px-3 rounded-lg"
              >
                <CheckCircle className="w-3 h-3 mr-1" />
                Mark as Done
              </Button>
            </div>
          )}

          {/* Action Buttons */}
          {status === 'active' && canInteract && (
            <div className="flex gap-2">
              <Button
                onClick={onComplete}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white font-medium py-2 rounded-xl"
              >
                <CheckCircle className="w-4 h-4 mr-1" />
                Done
              </Button>
              <Button
                onClick={onSkip}
                variant="outline"
                className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-700 py-2 rounded-xl"
              >
                <XCircle className="w-4 h-4 mr-1" />
                Skip
              </Button>
            </div>
          )}

          {status === 'active' && !canInteract && (
            <div className="bg-gray-700 rounded-lg p-2 text-center">
              <Lock className="w-4 h-4 text-gray-400 mx-auto mb-1" />
              <div className="text-xs text-gray-400">
                Complete previous days first
              </div>
            </div>
          )}
        </div>

        {/* Status Icon */}
        <div className="flex-shrink-0">
          {status === 'completed' && (
            <CheckCircle className="w-6 h-6 text-green-500" />
          )}
          {status === 'skipped' && (
            <XCircle className="w-6 h-6 text-gray-500" />
          )}
          {status === 'active' && canInteract && (
            <Play className="w-6 h-6 text-red-500" />
          )}
          {status === 'active' && !canInteract && (
            <Lock className="w-6 h-6 text-gray-500" />
          )}
        </div>
      </div>
    </div>
  );
}

export interface TaskListProps {
  onTaskComplete?: (taskId: string) => void;
  onTaskSkip?: (taskId: string) => void;
}

function TaskList({ onTaskComplete, onTaskSkip }: TaskListProps = {}) {
  const { taskEngine, unSkipTask } = useTaskEngine();
  const { toast } = useToast();
  const [tasks, setTasks] = useState<{
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
  } | null>(null);
  const [activeTab, setActiveTab] = useState<'todo' | 'done' | 'skipped'>('todo');
  const [loading, setLoading] = useState(true);

  const loadTasks = async () => {
    if (!taskEngine) return;
    
    try {
      setLoading(true);
      const taskData = await taskEngine.getCurrentDayTasks();
      setTasks(taskData);
      
      // Auto-switch to todo tab if there are active tasks
      if (taskData.active.length > 0) {
        setActiveTab('todo');
      } else if (taskData.completed.length > 0) {
        setActiveTab('done');
      } else if (taskData.skipped.length > 0) {
        setActiveTab('skipped');
      }
    } catch (error) {
      console.error('Failed to load tasks:', error);
      toast({
        title: "Error",
        description: "Failed to load tasks. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTasks();
  }, [taskEngine]);

  const handleComplete = async (taskId: string) => {
    if (!taskEngine) return;
    
    // Use passed handler if available, otherwise use default logic
    if (onTaskComplete) {
      onTaskComplete(taskId);
      // Still reload tasks to update UI
      await loadTasks();
      return;
    }
    
    try {
      const previousDay = taskEngine.getViewingDay();
      await taskEngine.completeTask(taskId);
      
      // Reload tasks first to get updated state
      await loadTasks();
      
      // Check if day advanced after completion
      const currentDay = taskEngine.getViewingDay();
      if (currentDay > previousDay) {
        // Day advanced! Switch to todo tab of new day
        setActiveTab('todo');
        toast({
          title: "🎉 Day Complete!",
          description: `Amazing! You've unlocked Day ${currentDay}. Keep the momentum going!`,
        });
      }
      // No toast for individual task completion
    } catch (error) {
      console.error('Failed to complete task:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to complete task",
        variant: "destructive"
      });
    }
  };

  const handleSkip = async (taskId: string) => {
    if (!taskEngine) return;
    
    // Use passed handler if available, otherwise use default logic
    if (onTaskSkip) {
      onTaskSkip(taskId);
      // Still reload tasks to update UI
      await loadTasks();
      return;
    }
    
    try {
      const previousDay = taskEngine.getViewingDay();
      await taskEngine.skipTask(taskId, "Skipped by user");
      
      // Reload tasks first to get updated state
      await loadTasks();
      
      // Check if day advanced after skipping
      const currentDay = taskEngine.getViewingDay();
      if (currentDay > previousDay) {
        // Day advanced! Switch to todo tab of new day
        setActiveTab('todo');
        toast({
          title: "🎉 Day Complete!",
          description: `You've finished all tasks for Day ${previousDay}. Welcome to Day ${currentDay}!`,
        });
      }
      // No toast for individual task skip
    } catch (error) {
      console.error('Failed to skip task:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to skip task",
        variant: "destructive"
      });
    }
  };

  const handleUnSkip = async (taskId: string) => {
    if (!unSkipTask) return;
    
    try {
      await unSkipTask(taskId);
      await loadTasks();
      toast({
        title: "🎉 Task Completed!",
        description: "Great job completing this task!",
      });
    } catch (error) {
      console.error('Failed to complete skipped task:', error);
      toast({
        title: "Error",
        description: "Failed to mark task as done",
        variant: "destructive"
      });
    }
  };

  const handleNavigatePrevious = async () => {
    if (!taskEngine) return;
    
    if (taskEngine.navigatePrevious()) {
      await loadTasks();
    }
  };

  const handleNavigateNext = async () => {
    if (!taskEngine) return;
    
    if (taskEngine.navigateNext()) {
      await loadTasks();
    }
  };

  const handleGoToToday = async () => {
    if (!taskEngine) return;
    
    if (taskEngine.goToToday()) {
      setActiveTab('todo');
      await loadTasks();
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-12 h-12 border-4 border-red-600 border-t-transparent rounded-full mx-auto mb-6"></div>
          <p className="text-gray-400 font-medium">Loading your program...</p>
        </div>
      </div>
    );
  }

  if (!tasks) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <p className="text-gray-400 text-lg">No tasks available</p>
      </div>
    );
  }

  const { dayInfo } = tasks;

  // Get current tab content
  const getCurrentTabTasks = () => {
    switch (activeTab) {
      case 'todo':
        return tasks.active;
      case 'done':
        return tasks.completed;
      case 'skipped':
        return tasks.skipped;
      default:
        return [];
    }
  };

  const currentTabTasks = getCurrentTabTasks();

  return (
    <div className="min-h-screen text-white pb-24" style={{ backgroundColor: '#111827' }}>
      {/* Compact Header with Day Navigation and Tabs */}
      <div className="bg-gradient-to-br from-red-900 via-red-800 to-orange-800 px-6 pt-16 pb-6">
        {/* Day Navigation */}
        <div className="flex items-center justify-center gap-6 mb-6">
          <Button
            variant="ghost"
            size="lg"
            onClick={handleNavigatePrevious}
            disabled={!taskEngine?.canNavigatePrevious()}
            className="text-white hover:bg-white/10 disabled:opacity-30"
          >
            <ChevronLeft className="w-6 h-6" />
          </Button>
          
          <div className="text-center">
            <h2 className="text-3xl font-bold text-white">
              Day {dayInfo.dayNumber} / 63
            </h2>
          </div>
          
          <Button
            variant="ghost"
            size="lg"
            onClick={handleNavigateNext}
            disabled={!taskEngine?.canNavigateNext()}
            className="text-white hover:bg-white/10 disabled:opacity-30"
          >
            <ChevronRight className="w-6 h-6" />
          </Button>
        </div>

        {/* Today Button - Show only when not on current active day */}
        {dayInfo.dayNumber !== taskEngine?.getActiveDay() && (
          <div className="flex justify-center mb-6">
            <Button
              onClick={handleGoToToday}
              className="bg-white/10 hover:bg-white/20 text-white border border-white/20 px-6 py-2 rounded-full text-sm font-medium"
            >
              <Calendar className="w-4 h-4 mr-2" />
              Go to Today (Day {taskEngine?.getActiveDay()})
            </Button>
          </div>
        )}

        {/* Tab Navigation */}
        <div className="flex bg-black/20 rounded-2xl p-1 max-w-md mx-auto">
          <button
            onClick={() => setActiveTab('todo')}
            className={`flex-1 py-3 px-4 rounded-xl font-medium transition-all ${
              activeTab === 'todo'
                ? 'bg-red-600 text-white'
                : 'text-gray-300 hover:text-white'
            }`}
          >
            To-do ({tasks.active.length})
          </button>
          <button
            onClick={() => setActiveTab('done')}
            className={`flex-1 py-3 px-4 rounded-xl font-medium transition-all ${
              activeTab === 'done'
                ? 'bg-red-600 text-white'
                : 'text-gray-300 hover:text-white'
            }`}
          >
            Done ({tasks.completed.length})
          </button>
          <button
            onClick={() => setActiveTab('skipped')}
            className={`flex-1 py-3 px-4 rounded-xl font-medium transition-all ${
              activeTab === 'skipped'
                ? 'bg-red-600 text-white'
                : 'text-gray-300 hover:text-white'
            }`}
          >
            Skipped ({tasks.skipped.length})
          </button>
        </div>
      </div>

      {/* Task Content */}
      <div className="px-6 py-6 space-y-4">
        {currentTabTasks.length > 0 ? (
          currentTabTasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              status={
                activeTab === 'todo' ? 'active' :
                activeTab === 'done' ? 'completed' : 'skipped'
              }
              canInteract={dayInfo.canInteract && activeTab === 'todo'}
              completedAt={activeTab === 'done' ? (task as any).completedAt : undefined}
              skippedAt={activeTab === 'skipped' ? (task as any).skippedAt : undefined}
              skipReason={activeTab === 'skipped' ? (task as any).skipReason : undefined}
              onComplete={() => activeTab === 'skipped' ? handleUnSkip(task.id) : handleComplete(task.id)}
              onSkip={() => handleSkip(task.id)}
            />
          ))
        ) : (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">
              {activeTab === 'todo' ? '📋' :
               activeTab === 'done' ? '✅' : '⏭️'}
            </div>
            <h3 className="text-xl font-bold text-gray-300 mb-2">
              {activeTab === 'todo' ? 'All tasks completed!' :
               activeTab === 'done' ? 'No completed tasks yet' :
               'No skipped tasks'}
            </h3>
            <p className="text-gray-500">
              {activeTab === 'todo' ? 'Great job finishing your day!' :
               activeTab === 'done' ? 'Complete some tasks to see them here' :
               'Focus on completing your tasks'}
            </p>
          </div>
        )}
      </div>

      {/* Status Indicators */}
      {dayInfo.canInteract && tasks.active.length === 0 && (
        <div className="px-6 pb-6">
          <div className="bg-green-800 border border-green-600 rounded-2xl p-4 text-center">
            <CheckCircle className="w-8 h-8 text-green-400 mx-auto mb-2" />
            <h3 className="font-bold text-green-300 mb-1">Day Complete!</h3>
            <p className="text-green-400 text-sm">
              Moving to next day automatically...
            </p>
          </div>
        </div>
      )}

      {!dayInfo.canInteract && (
        <div className="px-6 pb-6">
          <div className="bg-orange-900 border border-orange-600 rounded-2xl p-4 text-center">
            <Lock className="w-8 h-8 text-orange-400 mx-auto mb-2" />
            <h3 className="font-bold text-orange-300 mb-1">
              {dayInfo.dayNumber < (taskEngine?.getActiveDay() || 1) ? 'Past Day' : 
               dayInfo.isCurrentDay ? 'Current Day' : 'Future Day'}
            </h3>
            <p className="text-orange-400 text-sm">
              {dayInfo.dayNumber < (taskEngine?.getActiveDay() || 1)
                ? 'This day is in the past - view only'
                : dayInfo.isCurrentDay
                  ? 'Complete previous days to unlock tasks'
                  : 'Browse only - complete current day first'}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default TaskList;