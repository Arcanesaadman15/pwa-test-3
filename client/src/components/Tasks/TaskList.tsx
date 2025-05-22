import { useState, useEffect } from "react";
import { Task } from "@/types";
import { useTaskEngine } from "@/hooks/useTaskEngine";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ChevronLeft, ChevronRight, Calendar, CheckCircle, XCircle, Clock, Lock, Home } from "lucide-react";
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
  const getCategoryColor = (category: string) => {
    const colors = {
      'Sleep': 'bg-purple-100 text-purple-800',
      'Movement': 'bg-green-100 text-green-800',
      'Nutrition': 'bg-orange-100 text-orange-800',
      'Recovery': 'bg-blue-100 text-blue-800',
      'Mindfulness': 'bg-pink-100 text-pink-800',
      'Training': 'bg-red-100 text-red-800',
      'Explosive Training': 'bg-yellow-100 text-yellow-800',
      'Breath & Tension': 'bg-indigo-100 text-indigo-800',
      'Mind': 'bg-teal-100 text-teal-800'
    };
    return colors[category as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getDifficultyDots = (difficulty: number) => {
    return Array.from({ length: 3 }, (_, i) => (
      <div
        key={i}
        className={`w-2 h-2 rounded-full ${
          i < difficulty ? 'bg-orange-500' : 'bg-gray-300'
        }`}
      />
    ));
  };

  return (
    <div className={`bg-white rounded-xl p-4 shadow-sm border-2 transition-all ${
      status === 'completed' ? 'border-green-200 bg-green-50' :
      status === 'skipped' ? 'border-gray-200 bg-gray-50' :
      canInteract ? 'border-blue-200 hover:border-blue-300' : 'border-gray-200 opacity-60'
    }`}>
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h3 className={`font-semibold text-lg mb-1 ${
            status === 'completed' ? 'text-green-800' :
            status === 'skipped' ? 'text-gray-600' : 'text-gray-800'
          }`}>
            {task.title}
          </h3>
          <p className={`text-sm mb-2 ${
            status === 'completed' ? 'text-green-600' :
            status === 'skipped' ? 'text-gray-500' : 'text-gray-600'
          }`}>
            {task.subtitle}
          </p>
        </div>
        
        {status === 'completed' && (
          <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0" />
        )}
        {status === 'skipped' && (
          <XCircle className="w-6 h-6 text-gray-400 flex-shrink-0" />
        )}
        {!canInteract && status === 'active' && (
          <Lock className="w-6 h-6 text-gray-400 flex-shrink-0" />
        )}
      </div>

      <div className="flex items-center gap-2 mb-3">
        <Badge className={getCategoryColor(task.category)}>
          {task.category}
        </Badge>
        <div className="flex items-center gap-1 text-gray-500">
          <Clock className="w-4 h-4" />
          <span className="text-sm">{task.durationMin}min</span>
        </div>
        <div className="flex items-center gap-1">
          {getDifficultyDots(task.difficulty)}
        </div>
      </div>

      {status === 'completed' && completedAt && (
        <div className="text-sm text-green-600 mb-2">
          ✅ Completed at {completedAt.toLocaleTimeString()}
        </div>
      )}

      {status === 'skipped' && skippedAt && (
        <div className="text-sm text-gray-500 mb-2">
          ⏭️ Skipped at {skippedAt.toLocaleTimeString()}
          {skipReason && <div className="text-xs mt-1">Reason: {skipReason}</div>}
        </div>
      )}

      {status === 'active' && canInteract && (
        <div className="flex gap-2 mt-3">
          <Button
            onClick={onComplete}
            className="flex-1 bg-green-600 hover:bg-green-700 text-white"
          >
            Complete
          </Button>
          <Button
            onClick={onSkip}
            variant="outline"
            className="flex-1 border-gray-300 text-gray-600 hover:bg-gray-50"
          >
            Skip
          </Button>
        </div>
      )}

      {status === 'active' && !canInteract && (
        <div className="text-sm text-gray-500 mt-2 text-center">
          🔒 Complete previous days to unlock
        </div>
      )}
    </div>
  );
}

export function TaskList() {
  const { taskEngine } = useTaskEngine();
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
  const [progress, setProgress] = useState({ completed: 0, total: 0, percentage: 0 });
  const [loading, setLoading] = useState(true);

  const loadTasks = async () => {
    if (!taskEngine) return;
    
    try {
      setLoading(true);
      const taskData = await taskEngine.getCurrentDayTasks();
      setTasks(taskData);
      
      const total = taskData.active.length + taskData.completed.length + taskData.skipped.length;
      const completed = taskData.completed.length + taskData.skipped.length;
      const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
      
      setProgress({ completed, total, percentage });
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
    
    try {
      await taskEngine.completeTask(taskId);
      await loadTasks(); // Reload to get updated state
      toast({
        title: "Task Completed! 🎉",
        description: "Great job! Keep up the momentum.",
      });
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
    
    try {
      await taskEngine.skipTask(taskId, "Skipped by user");
      await loadTasks(); // Reload to get updated state
      toast({
        title: "Task Skipped",
        description: "No worries! You can focus on other tasks today.",
      });
    } catch (error) {
      console.error('Failed to skip task:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to skip task",
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
      await loadTasks();
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your tasks...</p>
        </div>
      </div>
    );
  }

  if (!tasks) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">No tasks available</p>
      </div>
    );
  }

  const { dayInfo } = tasks;

  return (
    <div className="space-y-6">
      {/* Day Navigation Header */}
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              Day {dayInfo.dayNumber} / 63
            </h1>
            <p className="text-gray-600">
              Beginner Program • Phase {dayInfo.phase}
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleNavigatePrevious}
              disabled={!taskEngine?.canNavigatePrevious()}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            
            {!dayInfo.isCurrentDay && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleGoToToday}
              >
                <Home className="w-4 h-4 mr-1" />
                Today
              </Button>
            )}
            
            <Button
              variant="outline"
              size="sm"
              onClick={handleNavigateNext}
              disabled={!taskEngine?.canNavigateNext()}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">
              {progress.completed} of {progress.total} tasks completed
            </span>
            <span className="font-medium text-gray-800">
              {progress.percentage}%
            </span>
          </div>
          <Progress value={progress.percentage} className="h-2" />
        </div>

        {/* Day Status Indicators */}
        <div className="flex items-center gap-4 mt-4">
          {dayInfo.isCurrentDay && (
            <Badge className="bg-blue-100 text-blue-800">
              📅 Current Day
            </Badge>
          )}
          {dayInfo.completionStatus === 'completed' && (
            <Badge className="bg-green-100 text-green-800">
              ✅ Completed
            </Badge>
          )}
          {!dayInfo.canInteract && (
            <Badge className="bg-gray-100 text-gray-600">
              🔒 View Only
            </Badge>
          )}
        </div>
      </div>

      {/* Three-Panel Task Layout */}
      <div className="space-y-6">
        {/* Active Tasks Panel */}
        {tasks.active.length > 0 && (
          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              📋 To Do ({tasks.active.length})
            </h2>
            <div className="grid gap-4">
              {tasks.active.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  status="active"
                  canInteract={dayInfo.canInteract}
                  onComplete={() => handleComplete(task.id)}
                  onSkip={() => handleSkip(task.id)}
                />
              ))}
            </div>
          </div>
        )}

        {/* Completed Tasks Panel */}
        {tasks.completed.length > 0 && (
          <div>
            <h2 className="text-xl font-semibold text-green-800 mb-4">
              ✅ Completed ({tasks.completed.length})
            </h2>
            <div className="grid gap-4">
              {tasks.completed.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  status="completed"
                  canInteract={false}
                  completedAt={task.completedAt}
                />
              ))}
            </div>
          </div>
        )}

        {/* Skipped Tasks Panel */}
        {tasks.skipped.length > 0 && (
          <div>
            <h2 className="text-xl font-semibold text-gray-600 mb-4">
              ⏭️ Skipped ({tasks.skipped.length})
            </h2>
            <div className="grid gap-4">
              {tasks.skipped.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  status="skipped"
                  canInteract={false}
                  skippedAt={task.skippedAt}
                  skipReason={task.skipReason}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Empty State */}
      {tasks.active.length === 0 && tasks.completed.length === 0 && tasks.skipped.length === 0 && (
        <div className="text-center py-12">
          <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-600 mb-2">
            No Tasks Available
          </h3>
          <p className="text-gray-500">
            There are no tasks assigned for this day.
          </p>
        </div>
      )}
    </div>
  );
}