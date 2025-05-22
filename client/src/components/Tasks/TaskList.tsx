import { DayNavigation } from "./DayNavigation";
import { TaskCard } from "./TaskCard";
import { ProgressRing } from "@/components/ui/progress-ring";
import { Task, DayProgress } from "@/types";

interface TaskListProps {
  tasks: {
    active: Task[];
    completed: Array<Task & { completedAt: Date }>;
    skipped: Array<Task & { skippedAt: Date }>;
  };
  onTaskComplete: (taskId: string) => void;
  onTaskSkip: (taskId: string) => void;
  dayProgress: DayProgress;
}

export function TaskList({ tasks, onTaskComplete, onTaskSkip, dayProgress }: TaskListProps) {
  // Handle case when tasks might not be loaded yet
  if (!tasks || !tasks.active || !tasks.completed || !tasks.skipped) {
    return (
      <div className="p-4 max-w-md mx-auto">
        <div className="flex justify-center mb-6">
          <div className="animate-pulse bg-gray-200 rounded-full w-32 h-32"></div>
        </div>
        <div className="text-center">
          <div className="animate-pulse bg-gray-200 h-4 w-32 mx-auto rounded"></div>
        </div>
      </div>
    );
  }

  const totalTasks = tasks.active.length + tasks.completed.length + tasks.skipped.length;
  const progressPercentage = totalTasks > 0 ? Math.round((tasks.completed.length / totalTasks) * 100) : 0;

  return (
    <div className="p-4 max-w-md mx-auto">
      {/* Progress Ring */}
      <div className="flex justify-center mb-6">
        <ProgressRing 
          progress={progressPercentage} 
          size={128}
          strokeWidth={8}
          className="text-primary"
        />
      </div>

      {/* Day Navigation */}
      <DayNavigation
        currentDay={dayProgress.currentDay}
        currentPhase={dayProgress.currentPhase}
        canGoToNextDay={tasks.active.length === 0}
        onPreviousDay={() => {/* TODO: Implement */}}
        onNextDay={() => {/* TODO: Implement */}}
      />

      {/* Task Categories */}
      <div className="space-y-6">
        {/* Active Tasks */}
        {tasks.active.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold mb-3 flex items-center">
              <span className="w-3 h-3 bg-amber-400 rounded-full mr-2"></span>
              Active Tasks
            </h3>
            <div className="space-y-0">
              {tasks.active.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onComplete={onTaskComplete}
                  onSkip={onTaskSkip}
                />
              ))}
            </div>
          </div>
        )}

        {/* Completed Tasks */}
        {tasks.completed.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold mb-3 flex items-center">
              <span className="w-3 h-3 bg-primary rounded-full mr-2"></span>
              Completed Tasks
            </h3>
            <div className="space-y-0">
              {tasks.completed.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  isCompleted={true}
                  completedAt={task.completedAt}
                />
              ))}
            </div>
          </div>
        )}

        {/* Skipped Tasks */}
        {tasks.skipped.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold mb-3 flex items-center">
              <span className="w-3 h-3 bg-gray-400 rounded-full mr-2"></span>
              Skipped Tasks
            </h3>
            <div className="space-y-0">
              {tasks.skipped.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                />
              ))}
            </div>
          </div>
        )}

        {/* Motivational Quote */}
        {tasks.completed.length > 0 && (
          <div className="bg-gradient-to-r from-primary to-secondary rounded-xl p-6 text-white">
            <div className="text-center">
              <i className="fas fa-quote-left text-2xl opacity-50 mb-3"></i>
              <p className="text-lg font-medium mb-2">"Progress, not perfection."</p>
              <p className="text-sm opacity-80">Every small step counts towards your transformation</p>
            </div>
          </div>
        )}

        {/* Empty State */}
        {totalTasks === 0 && (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center">
              <i className="fas fa-calendar-check text-gray-400 text-3xl"></i>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No tasks for today</h3>
            <p className="text-gray-600">Enjoy your rest day!</p>
          </div>
        )}
      </div>
    </div>
  );
}
