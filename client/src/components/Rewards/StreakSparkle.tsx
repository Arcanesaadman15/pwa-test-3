import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Flame, Star, Trophy, Crown } from 'lucide-react';

interface StreakSparkleProps {
  streakCount: number;
  isVisible: boolean;
  onComplete?: () => void;
}

interface Sparkle {
  id: number;
  x: number;
  y: number;
  delay: number;
  color: string;
  size: number;
}

export function StreakSparkle({ streakCount, isVisible, onComplete }: StreakSparkleProps) {
  const [sparkles, setSparkles] = useState<Sparkle[]>([]);
  const [showCelebration, setShowCelebration] = useState(false);

  // Generate sparkles based on streak count
  useEffect(() => {
    if (isVisible && streakCount > 0) {
      const sparkleCount = Math.min(streakCount * 2 + 5, 20); // More sparkles for higher streaks
      const newSparkles: Sparkle[] = [];

      for (let i = 0; i < sparkleCount; i++) {
        newSparkles.push({
          id: i,
          x: Math.random() * 100,
          y: Math.random() * 100,
          delay: Math.random() * 0.5,
          color: getSparkleColor(streakCount),
          size: Math.random() * 8 + 4
        });
      }

      setSparkles(newSparkles);
      setShowCelebration(true);

      // Auto-hide after animation
      const timer = setTimeout(() => {
        setShowCelebration(false);
        onComplete?.();
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [isVisible, streakCount, onComplete]);

  const getSparkleColor = (streak: number): string => {
    if (streak >= 30) return '#FFD700'; // Gold for 30+ day streaks
    if (streak >= 21) return '#FF6B6B'; // Red for 21+ day streaks
    if (streak >= 14) return '#4ECDC4'; // Teal for 14+ day streaks
    if (streak >= 7) return '#45B7D1';  // Blue for 7+ day streaks
    if (streak >= 3) return '#96CEB4';  // Green for 3+ day streaks
    return '#FFEAA7'; // Yellow for starting streaks
  };

  const getStreakIcon = (streak: number) => {
    if (streak >= 30) return Crown;
    if (streak >= 21) return Trophy;
    if (streak >= 14) return Star;
    if (streak >= 7) return Flame;
    return Sparkles;
  };

  const getStreakMessage = (streak: number): string => {
    if (streak >= 30) return `🏆 LEGENDARY ${streak} DAY STREAK! 🏆`;
    if (streak >= 21) return `👑 AMAZING ${streak} DAY STREAK! 👑`;
    if (streak >= 14) return `⭐ FANTASTIC ${streak} DAY STREAK! ⭐`;
    if (streak >= 7) return `🔥 GREAT ${streak} DAY STREAK! 🔥`;
    if (streak >= 3) return `✨ NICE ${streak} DAY STREAK! ✨`;
    return `🌟 ${streak} DAY STREAK! 🌟`;
  };

  const StreakIcon = getStreakIcon(streakCount);

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      {showCelebration && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* Background overlay */}
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
          
          {/* Sparkles */}
          {sparkles.map((sparkle) => (
            <motion.div
              key={sparkle.id}
              className="absolute pointer-events-none"
              style={{
                left: `${sparkle.x}%`,
                top: `${sparkle.y}%`,
                width: sparkle.size,
                height: sparkle.size,
              }}
              initial={{ 
                scale: 0, 
                rotate: 0,
                opacity: 0
              }}
              animate={{ 
                scale: [0, 1.2, 1, 0], 
                rotate: [0, 180, 360],
                opacity: [0, 1, 1, 0],
                y: [-20, -40, -60]
              }}
              transition={{ 
                duration: 1.5, 
                delay: sparkle.delay,
                ease: "easeOut"
              }}
            >
              <div
                className="w-full h-full rounded-full"
                style={{
                  background: `radial-gradient(circle, ${sparkle.color} 0%, transparent 70%)`,
                  boxShadow: `0 0 10px ${sparkle.color}`
                }}
              />
            </motion.div>
          ))}

          {/* Main celebration content */}
          <motion.div
            className="relative bg-gray-900 rounded-2xl p-4 mx-4 text-center shadow-2xl border-2 max-w-xs"
            style={{ borderColor: getSparkleColor(streakCount) }}
            initial={{ scale: 0, y: 50 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0, y: -50 }}
            transition={{ 
              type: "spring", 
              stiffness: 300, 
              damping: 20,
              delay: 0.2 
            }}
          >
            {/* Animated icon */}
            <motion.div
              className="flex justify-center mb-4"
              animate={{ 
                rotate: [0, 10, -10, 0],
                scale: [1, 1.1, 1]
              }}
              transition={{ 
                duration: 0.6, 
                repeat: 2,
                repeatType: "reverse" 
              }}
            >
              <StreakIcon 
                size={40} 
                style={{ color: getSparkleColor(streakCount) }}
                className="drop-shadow-lg"
              />
            </motion.div>

            {/* Streak message */}
            <motion.h2
              className="text-lg font-bold text-white mb-2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              {getStreakMessage(streakCount)}
            </motion.h2>

            {/* Motivational text */}
            <motion.p
              className="text-gray-300 text-sm"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              Keep up the amazing momentum! 🚀
            </motion.p>

            {/* Floating sparkles around the card */}
            {Array.from({ length: 6 }).map((_, i) => (
              <motion.div
                key={`card-sparkle-${i}`}
                className="absolute w-3 h-3 rounded-full"
                style={{
                  background: getSparkleColor(streakCount),
                  left: `${10 + (i * 15)}%`,
                  top: `${-10 + (i % 2) * 120}%`,
                }}
                animate={{
                  y: [0, -20, 0],
                  opacity: [0, 1, 0],
                  scale: [0, 1, 0]
                }}
                transition={{
                  duration: 2,
                  delay: 0.8 + (i * 0.1),
                  repeat: Infinity,
                  repeatType: "loop"
                }}
              />
            ))}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}