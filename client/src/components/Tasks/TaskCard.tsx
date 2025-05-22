import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Task } from "@/types";

interface TaskCardProps {
  task: Task;
  onComplete?: (taskId: string) => void;
  onSkip?: (taskId: string) => void;
  isCompleted?: boolean;
  completedAt?: Date;
}

export function TaskCard({ task, onComplete, onSkip, isCompleted, completedAt }: TaskCardProps) {
  const getCategoryColor = (category: string) => {
    switch (category.toLowerCase()) {
      case 'sleep':
        return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'movement':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'nutrition':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'recovery':
        return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'mindfulness':
        return 'bg-indigo-100 text-indigo-700 border-indigo-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getDifficultyStars = (difficulty: number) => {
    return Array.from({ length: 3 }, (_, i) => (
      <i 
        key={i} 
        className={`fas fa-star text-xs ${
          i < difficulty ? 'text-amber-400' : 'text-gray-300'
        }`}
      />
    ));
  };

  const formatDuration = (minutes: number) => {
    if (minutes === 0) return 'All day';
    if (minutes < 60) return `${minutes} min`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className={`task-card rounded-xl p-4 shadow-sm mb-3 transition-all ${
        isCompleted 
          ? 'bg-green-50 border-2 border-green-200 opacity-75' 
          : 'bg-white border-2 border-transparent hover:border-primary/20'
      }`}
    >
      <div className="flex items-start space-x-3">
        <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 relative">
          <img 
            src={task.cover} 
            alt={task.title}
            className="w-full h-full object-cover"
          />
          {isCompleted && (
            <div className="absolute inset-0 bg-green-500/20 flex items-center justify-center">
              <i className="fas fa-check text-green-600 text-lg"></i>
            </div>
          )}
        </div>
        
        <div className="flex-1">
          <div className="flex items-start justify-between mb-2">
            <div>
              <h4 className={`font-semibold ${isCompleted ? 'text-gray-700 line-through' : 'text-gray-900'}`}>
                {task.title}
              </h4>
              <p className="text-sm text-gray-600 mb-2">{task.subtitle}</p>
            </div>
            <span className={`text-xs px-2 py-1 rounded-full font-medium border ${getCategoryColor(task.category)}`}>
              {task.category}
            </span>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3 text-xs text-gray-500">
              <span className="flex items-center space-x-1">
                <i className="fas fa-clock"></i>
                <span>{formatDuration(task.durationMin)}</span>
              </span>
              <div className="flex space-x-1">
                {getDifficultyStars(task.difficulty)}
              </div>
              <span>{task.repeat}</span>
            </div>
            
            {isCompleted ? (
              <div className="text-xs text-green-600 font-medium">
                <i className="fas fa-check-circle mr-1"></i>
                Completed {completedAt ? `at ${completedAt.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}` : ''}
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                {onSkip && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onSkip(task.id)}
                    className="text-xs text-gray-400 hover:text-gray-600 h-8 px-3"
                  >
                    Skip
                  </Button>
                )}
                {onComplete && (
                  <Button
                    size="sm"
                    onClick={() => onComplete(task.id)}
                    className="w-8 h-8 p-0 bg-transparent border-2 border-gray-300 rounded-full hover:border-primary hover:bg-primary hover:text-white transition-all"
                  >
                    <i className="fas fa-check text-xs"></i>
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
