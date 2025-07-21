import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Task } from "@/types";
import { Info, Zap, X } from "lucide-react";
import { useState } from "react";

interface TaskCardProps {
  task: Task;
  onComplete?: (taskId: string) => void;
  onSkip?: (taskId: string) => void;
  isCompleted?: boolean;
  completedAt?: Date;
}

export function TaskCard({ task, onComplete, onSkip, isCompleted, completedAt }: TaskCardProps) {
  const [showWhyItMatters, setShowWhyItMatters] = useState(false);

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
      case 'training':
        return 'bg-red-100 text-red-700 border-red-200';
      case 'explosive training':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'breath & tension':
        return 'bg-teal-100 text-teal-700 border-teal-200';
      case 'mind':
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
      className={`ios-card p-4 mb-4 transition-all duration-200 ${isCompleted ? 'opacity-80' : ''}`}
    >
      <div className="flex items-start space-x-4">
        <div className="w-16 h-16 rounded-[12px] overflow-hidden flex-shrink-0 relative">
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
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h4 className={`font-semibold ${isCompleted ? 'text-gray-700 line-through' : 'text-gray-900'}`}>
                  {task.title}
                </h4>
                {task.whyItMatters && (
                  <button
                    onClick={() => setShowWhyItMatters(!showWhyItMatters)}
                    className="p-1 rounded-full hover:bg-orange-100 transition-colors group"
                    title="Why this matters for testosterone"
                  >
                    <Info 
                      size={16} 
                      className={`transition-colors ${
                        showWhyItMatters 
                          ? 'text-orange-600' 
                          : 'text-gray-400 group-hover:text-orange-500'
                      }`}
                    />
                  </button>
                )}
              </div>
              <p className="text-sm text-gray-600 mb-2">{task.subtitle}</p>
            </div>
            <span className={`text-xs px-2 py-1 rounded-full font-medium border flex-shrink-0 ${getCategoryColor(task.category)}`}>
              {task.category}
            </span>
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
