import { useState, useEffect } from "react";
import { Task } from "@/types";
import { useTaskEngine } from "@/hooks/useTaskEngine";
import { useOffline } from "@/hooks/useOffline";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PullToRefresh } from "@/components/ui/pull-to-refresh";
import { 
  ChevronLeft, 
  ChevronRight, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Lock, 
  Play, 
  Calendar, 
  Wifi, 
  WifiOff,
  Target,
  Flame,
  Moon,
  Activity,
  Apple,
  RotateCcw,
  Brain,
  Dumbbell,
  Zap,
  Wind,
  Clipboard,
  PartyPopper,
  SkipForward,
  Info,
  X
} from "lucide-react";
import { Icon, getCategoryIcon } from "@/lib/iconUtils";
import { useToast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";

interface TaskCardProps {
  task: Task;
  status: 'active' | 'completed' | 'skipped';
  canInteract: boolean;
  completedAt?: Date;
  skippedAt?: Date;
  skipReason?: string;
  onComplete?: () => void;
  onSkip?: () => void;
  index?: number;
}

function TaskCard({ task, status, canInteract, completedAt, skippedAt, skipReason, onComplete, onSkip, index = 0 }: TaskCardProps) {
  const [showWhyItMatters, setShowWhyItMatters] = useState(false);

  const getCategoryColor = (category: string) => {
    const colors = {
      'Sleep': '#8B5CF6',
      'Movement': '#10B981',
      'Nutrition': '#F59E0B',
      'Recovery': '#3B82F6',
      'Mindfulness': '#EC4899',
      'Training': '#EF4444',
      'Explosive Training': '#F97316',
      'Breath & Tension': '#06B6D4',
      'Mind': '#6366F1'
    };
    return colors[category as keyof typeof colors] || '#6B7280';
  };

  const getDifficultyColor = (difficulty: number) => {
    if (difficulty >= 3) return '#EF4444'; // Red for hard
    if (difficulty >= 2) return '#F59E0B'; // Orange for medium
    return '#10B981'; // Green for easy
  };

  return (
    <motion.div 
      className={`bg-white rounded-2xl p-4 shadow-sm border transition-all duration-200 ${
        status === 'completed' ? 'border-green-200 bg-green-50' :
        status === 'skipped' ? 'border-gray-200 bg-gray-50' :
        canInteract ? 'border-gray-200 hover:border-gray-300 hover:shadow-md' : 
        'border-gray-100 opacity-60'
      }`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
    >
      <div className="flex items-start gap-3">
        {/* Category Icon */}
        <div 
          className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl ${
            status === 'completed' ? 'bg-green-100' :
            status === 'skipped' ? 'bg-gray-100' :
            canInteract ? 'bg-blue-50' : 'bg-gray-100'
          }`}
          style={{
            backgroundColor: canInteract && status !== 'completed' && status !== 'skipped' 
              ? `${getCategoryColor(task.category)}15` 
              : undefined
          }}
        >
          <Icon 
            name={getCategoryIcon(task.category)} 
            className="w-6 h-6" 
            color={
              canInteract && status !== 'completed' && status !== 'skipped' 
                ? getCategoryColor(task.category) 
                : status === 'completed' ? '#059669' 
                : '#6B7280'
            }
          />
        </div>

        {/* Task Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between mb-2">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h3 className={`font-semibold text-lg leading-tight ${
                  status === 'completed' ? 'text-green-700' :
                  status === 'skipped' ? 'text-gray-500' : 'text-gray-900'
                }`}>
                  {task.title}
                </h3>
                {task.whyItMatters && (
                  <div className="flex items-center gap-1">
                    {/* T+ Badge and info button combined for larger touch target */}
                    <button
                      onClick={() => setShowWhyItMatters(!showWhyItMatters)}
                      className={`flex items-center gap-1.5 px-2 py-1 rounded-lg transition-all duration-200 active:scale-95 ${
                        showWhyItMatters 
                          ? 'bg-orange-100 text-orange-600' 
                          : 'bg-orange-50 text-orange-500'
                      }`}
                      title="Why this matters for testosterone"
                    >
                      <span className="text-xs font-bold">T+</span>
                      <Info size={16} />
                    </button>
                  </div>
                )}
              </div>
              
              {/* Category and Difficulty */}
              <div className="flex items-center gap-2 mb-2">
                <span 
                  className="text-xs font-medium px-2 py-1 rounded-full"
                  style={{ 
                    backgroundColor: `${getCategoryColor(task.category)}15`,
                    color: getCategoryColor(task.category)
                  }}
                >
                  {task.category}
                </span>
                <div className="flex items-center gap-1">
                  {Array.from({ length: 3 }, (_, i) => (
                    <div
                      key={i}
                      className={`w-1.5 h-1.5 rounded-full ${
                        i < task.difficulty ? '' : 'bg-gray-200'
                      }`}
                      style={{ 
                        backgroundColor: i < task.difficulty 
                          ? getDifficultyColor(task.difficulty) 
                          : undefined 
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Status indicator */}
            {status === 'completed' && (
              <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0">
                <CheckCircle className="w-4 h-4 text-white" />
              </div>
            )}
          </div>

          <div className="mb-3">
            <p className={`text-sm leading-relaxed ${
              status === 'completed' ? 'text-green-600' :
              status === 'skipped' ? 'text-gray-400' : 'text-gray-600'
            }`}>
              {task.subtitle}
            </p>
            {task.whyItMatters && !showWhyItMatters && (
              <p 
                className="text-xs text-orange-500/80 mt-1 font-medium active:text-orange-600 transition-colors inline-flex items-center gap-1 rounded-lg py-1" 
                onClick={() => setShowWhyItMatters(true)}
              >
                💡 Learn why this supports energy and vitality
              </p>
            )}
          </div>

          {/* Why It Matters Expandable Section */}
          <AnimatePresence>
            {showWhyItMatters && task.whyItMatters && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden mb-3"
              >
                <div className="bg-gradient-to-r from-orange-50 to-yellow-50 border-l-4 border-orange-400 p-3 rounded-r-lg relative">
                  {/* Close button */}
                  <button
                    onClick={() => setShowWhyItMatters(false)}
                    className="absolute top-2 right-2 p-1 rounded-full hover:bg-orange-100 transition-colors"
                    title="Close explanation"
                  >
                    <X size={16} className="text-orange-400 hover:text-orange-600" />
                  </button>
                  
                  <div className="flex items-start gap-2 pr-8">
                    <Zap size={16} className="text-orange-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <h5 className="text-sm font-semibold text-orange-800 mb-1">
                        Why this supports energy and vitality:
                      </h5>
                      <p className="text-sm text-orange-700 leading-relaxed">
                        {task.whyItMatters}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Status Messages */}
          <AnimatePresence>
          {status === 'completed' && (
              <motion.div 
                className="flex items-center justify-between p-3 bg-green-50 rounded-xl border border-green-200 mb-3"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
              >
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span className="text-sm font-medium text-green-700">Completed</span>
            </div>
                {completedAt && (
                  <span className="text-xs text-green-600">
                    {completedAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                )}
              </motion.div>
          )}

          {status === 'skipped' && (
              <motion.div 
                className="space-y-3"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-200">
                  <div className="flex items-center gap-2">
                    <XCircle className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-600">Skipped</span>
                  </div>
                  {skippedAt && (
                    <span className="text-xs text-gray-500">
                      {skippedAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  )}
              </div>
              <Button
                onClick={onComplete}
                  className="w-full bg-green-500 hover:bg-green-600 text-white font-medium py-3 rounded-xl"
              >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Mark as Completed
              </Button>
              </motion.div>
          )}
          </AnimatePresence>

          {/* Action Buttons */}
          {status === 'active' && canInteract && (
            <div className="flex gap-2">
              <Button
                onClick={onComplete}
                className="flex-1 bg-green-500 hover:bg-green-600 text-white font-medium py-3 rounded-xl"
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                Complete
              </Button>
              <Button
                onClick={onSkip}
                variant="outline"
                className="flex-1 bg-yellow-400 border-yellow-500 text-yellow-900 hover:bg-yellow-500 hover:border-yellow-600 py-3 rounded-xl font-medium"
              >
                <XCircle className="w-4 h-4 mr-2" />
                Skip
              </Button>
            </div>
          )}

          {status === 'active' && !canInteract && (
            <div className="bg-gray-50 rounded-xl p-4 text-center border border-gray-200">
              <Lock className="w-5 h-5 text-gray-400 mx-auto mb-2" />
              <div className="text-sm text-gray-600 font-medium">
                Complete previous days first
              </div>
              <div className="text-xs text-gray-500 mt-1">
                Tasks unlock progressively
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

export interface TaskListProps {
  onTaskComplete?: (taskId: string) => void;
  onTaskSkip?: (taskId: string) => void;
}

function TaskList({ onTaskComplete, onTaskSkip }: TaskListProps = {}) {
  const { taskEngine, unSkipTask, triggerRefresh } = useTaskEngine();
  const { isOnline, addPendingAction, hasPendingActions } = useOffline();
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
    };
  }>({
    active: [],
    completed: [],
    skipped: [],
    dayInfo: {
      dayNumber: 1,
      isCurrentDay: true,
      isUnlocked: true,
      canInteract: true
    }
  });
  const [activeTab, setActiveTab] = useState<'active' | 'completed' | 'skipped'>('active');
  const [lastDayNumber, setLastDayNumber] = useState(1);

  useEffect(() => {
    loadTasks();
  }, [taskEngine]);

  const loadTasks = async () => {
    if (!taskEngine) return;
    
    try {
      // CRITICAL FIX: Always sync to active day when loading tasks
      // This ensures day counter and task content stay in sync when switching tabs
      await taskEngine.syncToActiveDay();
      
      const currentDayTasks = await taskEngine.getCurrentDayTasks();
      const dayInfo = {
        dayNumber: taskEngine.getViewingDay(),
        isCurrentDay: taskEngine.getViewingDay() === taskEngine.getActiveDay(),
        isUnlocked: taskEngine.getViewingDay() <= taskEngine.getActiveDay(),
        canInteract: taskEngine.getViewingDay() === taskEngine.getActiveDay()
      };

      if (dayInfo.dayNumber !== lastDayNumber) {
        setActiveTab('active');
        setLastDayNumber(dayInfo.dayNumber);
      }

      setTasks({
        active: currentDayTasks.active,
        completed: currentDayTasks.completed,
        skipped: currentDayTasks.skipped,
        dayInfo
      });
    } catch (error) {
      console.error('Failed to load tasks:', error);
    }
  };

  const handleComplete = async (taskId: string) => {
    try {
      if (!isOnline) {
        addPendingAction({
          type: 'completeTask',
          data: { taskId },
          timestamp: new Date()
        });
        toast({
          title: "Task queued",
          description: "Task will be completed when back online",
          variant: "default"
        });
      }

      if (onTaskComplete) {
        await onTaskComplete(taskId);
      }
      
      await loadTasks();
      triggerRefresh();
    } catch (error) {
      console.error('Failed to complete task:', error);
      toast({
        title: "Error",
        description: "Failed to complete task. Please try again.",
        variant: "error"
      });
    }
  };

  const handleSkip = async (taskId: string) => {
    try {
      if (!isOnline) {
        addPendingAction({
          type: 'skipTask',
          data: { taskId },
          timestamp: new Date()
        });
        toast({
          title: "Task queued",
          description: "Task will be skipped when back online",
          variant: "default"
        });
      }

      if (onTaskSkip) {
        await onTaskSkip(taskId);
      }
      
      await loadTasks();
      triggerRefresh();
    } catch (error) {
      console.error('Failed to skip task:', error);
      toast({
        title: "Error",
        description: "Failed to skip task. Please try again.",
        variant: "error"
      });
    }
  };

  const handleUnSkip = async (taskId: string) => {
    try {
      await unSkipTask(taskId);
      loadTasks();
      toast({
        title: "Task unmarked",
        description: "Task moved back to active list",
        variant: "default"
      });
    } catch (error) {
      console.error('Failed to unskip task:', error);
    }
  };

  const handleNavigatePrevious = async () => {
    if (taskEngine) {
      const success = taskEngine.navigatePrevious();
      if (success) {
        await loadTasks();
      }
    }
  };

  const handleNavigateNext = async () => {
    if (taskEngine) {
      const success = taskEngine.navigateNext();
      if (success) {
        await loadTasks();
      }
    }
  };

  const handleGoToToday = async () => {
    if (taskEngine) {
      const success = taskEngine.goToToday();
      if (success) {
        await loadTasks();
      }
    }
  };

  const handleRefresh = async () => {
    await loadTasks();
  };

  const getCurrentTabTasks = () => {
    switch (activeTab) {
      case 'active':
        return tasks.active.map((task, index) => (
          <TaskCard
            key={task.id}
            task={task}
            status="active"
            canInteract={tasks.dayInfo.canInteract}
            onComplete={() => handleComplete(task.id)}
            onSkip={() => handleSkip(task.id)}
            index={index}
          />
        ));
      case 'completed':
        return tasks.completed.map((task, index) => (
          <TaskCard
            key={task.id}
            task={task}
            status="completed"
            canInteract={false}
            completedAt={task.completedAt}
            index={index}
          />
        ));
      case 'skipped':
        return tasks.skipped.map((task, index) => (
          <TaskCard
            key={task.id}
            task={task}
            status="skipped"
            canInteract={tasks.dayInfo.canInteract}
            skippedAt={task.skippedAt}
            skipReason={task.skipReason}
            onComplete={() => handleComplete(task.id)}
            index={index}
          />
        ));
      default:
        return [];
    }
  };

  const getTabCount = (tab: 'active' | 'completed' | 'skipped') => {
    return tasks[tab].length;
  };

  const totalTasks = tasks.active.length + tasks.completed.length + tasks.skipped.length;
  const completionRate = totalTasks > 0 ? Math.round((tasks.completed.length / totalTasks) * 100) : 0;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white px-4 pt-12 pb-6 border-b border-gray-100">
        <motion.div 
          className="text-center mb-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <h1 className="text-2xl font-bold text-gray-900 mb-1">
            Day {tasks.dayInfo.dayNumber}
          </h1>
          <p className="text-gray-600">
            Your wellness journey continues
          </p>
        </motion.div>

        {/* Day Navigation */}
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={handleNavigatePrevious}
            className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
          >
            <ChevronLeft className="w-5 h-5 text-gray-600" />
          </button>
          
          <div className="flex-1 mx-4">
            {/* Progress Overview */}
            <div className="text-center mb-3">
              <div className="text-lg font-semibold text-gray-900">
                {tasks.completed.length} of {totalTasks} completed
              </div>
              <div className="text-sm text-gray-600">
                {completionRate}% complete
              </div>
            </div>
            
            {/* Progress Bar */}
            <div className="w-full bg-gray-200 rounded-full h-2">
              <motion.div 
                className="bg-green-500 h-2 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${completionRate}%` }}
                transition={{ delay: 0.3, duration: 0.8, ease: "easeOut" }}
              />
            </div>
          </div>
          
          <button
            onClick={handleNavigateNext}
            className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
          >
            <ChevronRight className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Connection Status & Quick Actions */}
        <div className="flex items-center justify-between">
          <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm ${
            isOnline ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'
          }`}>
            {isOnline ? <Wifi className="w-4 h-4" /> : <WifiOff className="w-4 h-4" />}
            <span className="font-medium">
              {isOnline ? 'Online' : 'Offline'}
            </span>
            {hasPendingActions && !isOnline && (
              <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse" />
            )}
          </div>

          <button
            onClick={handleGoToToday}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-medium ${
              tasks.dayInfo.isCurrentDay 
                ? 'bg-gray-200 text-gray-600' 
                : 'bg-blue-500 text-white'
            }`}
          >
            <Calendar className="w-4 h-4" />
            Today
          </button>
        </div>
      </div>

      <PullToRefresh onRefresh={handleRefresh}>
        <div className="px-4 py-4">
          {/* Tab Navigation */}
          <div className="flex bg-gray-100 rounded-xl p-1 mb-6">
            {[
              { id: 'active', label: 'Active', icon: Play },
              { id: 'completed', label: 'Done', icon: CheckCircle },
              { id: 'skipped', label: 'Skipped', icon: XCircle }
            ].map((tab) => {
              const Icon = tab.icon;
              const count = getTabCount(tab.id as any);
              const isActive = activeTab === tab.id;
              
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex-1 py-2.5 px-3 rounded-lg font-medium transition-all flex items-center justify-center gap-2 ${
                    isActive
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="text-sm">{tab.label}</span>
                  {count > 0 && (
                    <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                      isActive ? 'bg-gray-100 text-gray-600' : 'bg-gray-200 text-gray-500'
                    }`}>
                      {count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Task List */}
          <div className="space-y-3">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                className="space-y-3"
              >
                {getCurrentTabTasks()}
              </motion.div>
            </AnimatePresence>

            {/* Empty State */}
            {getCurrentTabTasks().length === 0 && (
              <motion.div 
                className="text-center py-12"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center rounded-full bg-gray-100">
                  {activeTab === 'active' && <Target className="w-8 h-8 text-gray-400" />}
                  {activeTab === 'completed' && <PartyPopper className="w-8 h-8 text-gray-400" />}
                  {activeTab === 'skipped' && <SkipForward className="w-8 h-8 text-gray-400" />}
        </div>
                <h3 className="text-lg font-semibold text-gray-700 mb-2">
                  {activeTab === 'active' && 'No active tasks'}
                  {activeTab === 'completed' && 'No completed tasks yet'}
                  {activeTab === 'skipped' && 'No skipped tasks'}
            </h3>
                <p className="text-gray-500 text-sm">
                  {activeTab === 'active' && 'All tasks for today are complete!'}
                  {activeTab === 'completed' && 'Complete some tasks to see them here'}
                  {activeTab === 'skipped' && 'Skipped tasks will appear here'}
            </p>
              </motion.div>
            )}
          </div>
        </div>
      </PullToRefresh>
    </div>
  );
}

export default TaskList;