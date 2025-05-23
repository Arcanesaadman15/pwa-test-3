import { motion } from 'framer-motion';
import { Flame, Sparkles } from 'lucide-react';

interface StreakIndicatorProps {
  currentStreak: number;
  longestStreak: number;
  className?: string;
}

export function StreakIndicator({ currentStreak, longestStreak, className = "" }: StreakIndicatorProps) {
  const getStreakColor = (streak: number) => {
    if (streak >= 30) return '#FFD700'; // Gold
    if (streak >= 21) return '#FF6B6B'; // Red
    if (streak >= 14) return '#4ECDC4'; // Teal
    if (streak >= 7) return '#45B7D1';  // Blue
    if (streak >= 3) return '#96CEB4';  // Green
    return '#FFEAA7'; // Yellow
  };

  const getStreakIntensity = (streak: number) => {
    if (streak >= 30) return 'legendary';
    if (streak >= 21) return 'amazing';
    if (streak >= 14) return 'fantastic';
    if (streak >= 7) return 'great';
    if (streak >= 3) return 'good';
    return 'starting';
  };

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* Animated streak flame */}
      <motion.div
        className="relative"
        animate={{
          scale: currentStreak > 0 ? [1, 1.1, 1] : 1,
        }}
        transition={{
          duration: 2,
          repeat: currentStreak >= 7 ? Infinity : 0,
          repeatType: "reverse"
        }}
      >
        {currentStreak >= 7 ? (
          <Flame 
            size={24} 
            style={{ color: getStreakColor(currentStreak) }}
            className="drop-shadow-lg"
          />
        ) : (
          <Sparkles 
            size={24} 
            style={{ color: getStreakColor(currentStreak) }}
            className="drop-shadow-lg"
          />
        )}
        
        {/* Glowing effect for high streaks */}
        {currentStreak >= 14 && (
          <motion.div
            className="absolute inset-0 rounded-full blur-sm"
            style={{ 
              background: getStreakColor(currentStreak),
              opacity: 0.3
            }}
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.3, 0.6, 0.3]
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              repeatType: "reverse"
            }}
          />
        )}
      </motion.div>

      {/* Streak count and status */}
      <div className="flex flex-col">
        <div className="flex items-center gap-2">
          <motion.span
            className="text-lg font-bold"
            style={{ color: getStreakColor(currentStreak) }}
            animate={currentStreak > 0 ? {
              textShadow: [
                '0 0 0px rgba(255,255,255,0)',
                `0 0 10px ${getStreakColor(currentStreak)}40`,
                '0 0 0px rgba(255,255,255,0)'
              ]
            } : {}}
            transition={{
              duration: 2,
              repeat: currentStreak >= 14 ? Infinity : 0,
              repeatType: "reverse"
            }}
          >
            {currentStreak} day{currentStreak !== 1 ? 's' : ''}
          </motion.span>
          
          {currentStreak > longestStreak && (
            <motion.span
              className="text-xs bg-yellow-500 text-black px-2 py-1 rounded-full font-bold"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              NEW RECORD!
            </motion.span>
          )}
        </div>
        
        <span className="text-sm text-gray-600 dark:text-gray-400 capitalize">
          {getStreakIntensity(currentStreak)} streak
        </span>
        
        {longestStreak > currentStreak && (
          <span className="text-xs text-gray-500 dark:text-gray-500">
            Best: {longestStreak} days
          </span>
        )}
      </div>

      {/* Floating sparkles for very high streaks */}
      {currentStreak >= 21 && (
        <div className="relative">
          {Array.from({ length: 3 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 rounded-full"
              style={{
                background: getStreakColor(currentStreak),
                left: `${i * 8 - 8}px`,
                top: `${i % 2 === 0 ? -10 : -5}px`,
              }}
              animate={{
                y: [0, -15, 0],
                opacity: [0, 1, 0],
                scale: [0, 1, 0]
              }}
              transition={{
                duration: 2,
                delay: i * 0.3,
                repeat: Infinity,
                repeatType: "loop"
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}