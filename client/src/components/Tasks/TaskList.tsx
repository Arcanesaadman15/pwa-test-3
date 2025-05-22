import { useState, useEffect } from "react";
import { Task } from "@/types";
import { useTaskEngine } from "@/hooks/useTaskEngine";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ChevronLeft, ChevronRight, Calendar, CheckCircle, XCircle, Clock, Lock, Home, Play } from "lucide-react";
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
      'Sleep': 'bg-purple-100 text-purple-800 border-purple-200',
      'Movement': 'bg-green-100 text-green-800 border-green-200',
      'Nutrition': 'bg-orange-100 text-orange-800 border-orange-200',
      'Recovery': 'bg-blue-100 text-blue-800 border-blue-200',
      'Mindfulness': 'bg-pink-100 text-pink-800 border-pink-200',
      'Training': 'bg-red-100 text-red-800 border-red-200',
      'Explosive Training': 'bg-yellow-100 text-yellow-800 border-yellow-200',
      'Breath & Tension': 'bg-indigo-100 text-indigo-800 border-indigo-200',
      'Mind': 'bg-teal-100 text-teal-800 border-teal-200'
    };
    return colors[category as keyof typeof colors] || 'bg-gray-100 text-gray-800 border-gray-200';
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
    <div className={`relative bg-white rounded-xl p-5 shadow-sm border-l-4 transition-all duration-200 ${
      status === 'completed' ? 'border-l-green-500 bg-green-50/30' :
      status === 'skipped' ? 'border-l-gray-400 bg-gray-50/30' :
      canInteract ? 'border-l-blue-500 hover:shadow-md hover:scale-[1.02]' : 'border-l-gray-300 opacity-60'
    }`}>
      {/* Status Icon */}
      <div className="absolute top-4 right-4">
        {status === 'completed' && (
          <div className="bg-green-500 rounded-full p-1">
            <CheckCircle className="w-5 h-5 text-white" />
          </div>
        )}
        {status === 'skipped' && (
          <div className="bg-gray-400 rounded-full p-1">
            <XCircle className="w-5 h-5 text-white" />
          </div>
        )}
        {!canInteract && status === 'active' && (
          <div className="bg-gray-300 rounded-full p-1">
            <Lock className="w-5 h-5 text-white" />
          </div>
        )}
        {canInteract && status === 'active' && (
          <div className="bg-blue-500 rounded-full p-1">
            <Play className="w-5 h-5 text-white" />
          </div>
        )}
      </div>

      {/* Task Content */}
      <div className="pr-12">
        <h3 className={`font-bold text-lg mb-2 ${
          status === 'completed' ? 'text-green-800' :
          status === 'skipped' ? 'text-gray-600' : 'text-gray-900'
        }`}>
          {task.title}
        </h3>
        <p className={`text-sm mb-4 leading-relaxed ${
          status === 'completed' ? 'text-green-700' :
          status === 'skipped' ? 'text-gray-500' : 'text-gray-600'
        }`}>
          {task.subtitle}
        </p>

        {/* Task Metadata */}
        <div className="flex items-center gap-3 mb-4">
          <Badge className={`${getCategoryColor(task.category)} border font-medium`}>
            {task.category}
          </Badge>
          <div className="flex items-center gap-1 text-gray-600 bg-gray-100 px-2 py-1 rounded-full">
            <Clock className="w-3 h-3" />
            <span className="text-xs font-medium">{task.durationMin}min</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-xs text-gray-500 mr-1">Difficulty:</span>
            {getDifficultyDots(task.difficulty)}
          </div>
        </div>

        {/* Status Information */}
        {status === 'completed' && completedAt && (
          <div className="bg-green-100 border border-green-200 rounded-lg p-3 mb-4">
            <div className="flex items-center gap-2 text-green-700">
              <CheckCircle className="w-4 h-4" />
              <span className="font-medium text-sm">Completed at {completedAt.toLocaleTimeString()}</span>
            </div>
          </div>
        )}

        {status === 'skipped' && skippedAt && (
          <div className="bg-gray-100 border border-gray-200 rounded-lg p-3 mb-4">
            <div className="flex items-center gap-2 text-gray-600">
              <XCircle className="w-4 h-4" />
              <span className="font-medium text-sm">Skipped at {skippedAt.toLocaleTimeString()}</span>
            </div>
            {skipReason && (
              <div className="text-xs text-gray-500 mt-1">Reason: {skipReason}</div>
            )}
          </div>
        )}

        {/* Action Buttons */}
        {status === 'active' && canInteract && (
          <div className="flex gap-3">
            <Button
              onClick={onComplete}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white font-medium py-3 rounded-xl shadow-sm transition-all duration-200 hover:shadow-md"
            >
              <CheckCircle className="w-4 h-4 mr-2" />
              Complete Task
            </Button>
            <Button
              onClick={onSkip}
              variant="outline"
              className="flex-1 border-2 border-gray-300 text-gray-700 hover:bg-gray-50 font-medium py-3 rounded-xl transition-all duration-200"
            >
              <XCircle className="w-4 h-4 mr-2" />
              Skip
            </Button>
          </div>
        )}

        {status === 'active' && !canInteract && (
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 text-center">
            <Lock className="w-5 h-5 text-orange-600 mx-auto mb-2" />
            <div className="text-sm text-orange-700 font-medium">
              Complete all tasks from previous days to unlock
            </div>
          </div>
        )}
      </div>
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
  const [loading, setLoading] = useState(true);

  const loadTasks = async () => {
    if (!taskEngine) return;
    
    try {
      setLoading(true);
      const taskData = await taskEngine.getCurrentDayTasks();
      setTasks(taskData);
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
      await loadTasks();
      toast({
        title: "🎉 Task Completed!",
        description: "Excellent work! You're building great habits.",
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
      await loadTasks();
      toast({
        title: "Task Skipped",
        description: "No problem! Focus on what works for you today.",
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
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-6"></div>
            <p className="text-gray-600 font-medium">Loading your wellness journey...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!tasks) {
    return (
      <div className="p-6 text-center py-12">
        <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-600 text-lg">No tasks available</p>
      </div>
    );
  }

  const { dayInfo } = tasks;
  const totalTasks = tasks.active.length + tasks.completed.length + tasks.skipped.length;
  const completedTasksCount = tasks.completed.length + tasks.skipped.length;
  const progressPercentage = totalTasks > 0 ? Math.round((completedTasksCount / totalTasks) * 100) : 0;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with Navigation */}
      <div className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="max-w-4xl mx-auto p-6">
          {/* Day Title and Navigation */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Day {dayInfo.dayNumber}
                <span className="text-gray-500 font-normal"> / 63</span>
              </h1>
              <p className="text-gray-600 mt-1">
                Beginner Program • Phase {dayInfo.phase}
              </p>
            </div>
            
            {/* Navigation Controls */}
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="lg"
                onClick={handleNavigatePrevious}
                disabled={!taskEngine?.canNavigatePrevious()}
                className="border-2 hover:bg-gray-50"
              >
                <ChevronLeft className="w-5 h-5" />
              </Button>
              
              {!dayInfo.isCurrentDay && (
                <Button
                  variant="outline"
                  size="lg"
                  onClick={handleGoToToday}
                  className="border-2 hover:bg-blue-50 text-blue-600 border-blue-200"
                >
                  <Home className="w-4 h-4 mr-2" />
                  Today
                </Button>
              )}
              
              <Button
                variant="outline"
                size="lg"
                onClick={handleNavigateNext}
                disabled={!taskEngine?.canNavigateNext()}
                className="border-2 hover:bg-gray-50"
              >
                <ChevronRight className="w-5 h-5" />
              </Button>
            </div>
          </div>

          {/* Progress Section */}
          <div className="bg-gray-50 rounded-xl p-4 mb-4">
            <div className="flex justify-between items-center mb-3">
              <span className="text-gray-700 font-medium">
                {completedTasksCount} of {totalTasks} tasks completed
              </span>
              <span className="text-2xl font-bold text-gray-900">
                {progressPercentage}%
              </span>
            </div>
            <Progress value={progressPercentage} className="h-3 bg-gray-200" />
          </div>

          {/* Status Badges */}
          <div className="flex items-center gap-3">
            {dayInfo.isCurrentDay && (
              <Badge className="bg-blue-100 text-blue-800 border-blue-200 px-3 py-1">
                📅 Current Day
              </Badge>
            )}
            {dayInfo.completionStatus === 'completed' && (
              <Badge className="bg-green-100 text-green-800 border-green-200 px-3 py-1">
                ✅ Day Complete
              </Badge>
            )}
            {!dayInfo.canInteract && (
              <Badge className="bg-orange-100 text-orange-800 border-orange-200 px-3 py-1">
                🔒 View Only
              </Badge>
            )}
          </div>
        </div>
      </div>

      {/* Task Content */}
      <div className="max-w-4xl mx-auto p-6 space-y-8">
        {/* Active Tasks Section */}
        {tasks.active.length > 0 && (
          <section>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-2 h-8 bg-blue-500 rounded-full"></div>
              <h2 className="text-2xl font-bold text-gray-900">
                To Do
              </h2>
              <Badge className="bg-blue-100 text-blue-800 px-3 py-1">
                {tasks.active.length} tasks
              </Badge>
            </div>
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
          </section>
        )}

        {/* Completed Tasks Section */}
        {tasks.completed.length > 0 && (
          <section>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-2 h-8 bg-green-500 rounded-full"></div>
              <h2 className="text-2xl font-bold text-gray-900">
                Completed
              </h2>
              <Badge className="bg-green-100 text-green-800 px-3 py-1">
                {tasks.completed.length} tasks
              </Badge>
            </div>
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
          </section>
        )}

        {/* Skipped Tasks Section */}
        {tasks.skipped.length > 0 && (
          <section>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-2 h-8 bg-gray-400 rounded-full"></div>
              <h2 className="text-2xl font-bold text-gray-900">
                Skipped
              </h2>
              <Badge className="bg-gray-100 text-gray-700 px-3 py-1">
                {tasks.skipped.length} tasks
              </Badge>
            </div>
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
          </section>
        )}

        {/* Empty State */}
        {totalTasks === 0 && (
          <div className="text-center py-16">
            <Calendar className="w-20 h-20 text-gray-400 mx-auto mb-6" />
            <h3 className="text-2xl font-bold text-gray-600 mb-2">
              No Tasks Today
            </h3>
            <p className="text-gray-500 text-lg">
              Enjoy your rest day or check back tomorrow!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}