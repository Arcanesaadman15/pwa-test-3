import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';

interface SplashScreenProps {
  onComplete: () => void;
}

export function SplashScreen({ onComplete }: SplashScreenProps) {
  const [canSkip, setCanSkip] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    // Allow manual skip after 2 seconds
    const skipTimer = setTimeout(() => {
      setCanSkip(true);
    }, 2000);

    // Auto-advance after 5 seconds (increased from 2.5)
    const autoTimer = setTimeout(() => {
      if (!isTransitioning) {
        handleComplete();
      }
    }, 5000);

    return () => {
      clearTimeout(skipTimer);
      clearTimeout(autoTimer);
    };
  }, [isTransitioning]);

  const handleComplete = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    
    // Add a small delay for smooth transition
    setTimeout(() => {
      onComplete();
    }, 300);
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col justify-center items-center relative">
      {/* Skip button - appears after 2 seconds */}
      {canSkip && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          onClick={handleComplete}
          className="absolute top-4 right-4 z-20 px-4 py-2 rounded-full bg-gray-900/50 backdrop-blur-sm border border-gray-700 text-gray-300 hover:text-white hover:bg-gray-800/50 transition-all duration-200 text-sm font-medium"
        >
          Skip
        </motion.button>
      )}

      {/* Enhanced background effects */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          className="absolute top-1/4 right-1/4 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.6, 0.3],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute bottom-1/4 left-1/4 w-80 h-80 bg-orange-500/5 rounded-full blur-2xl"
          animate={{
            scale: [0.8, 1.3, 0.8],
            opacity: [0.2, 0.5, 0.2],
            y: [0, -30, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 4
          }}
        />
      </div>

      <div className="text-center px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="mb-8"
        >
          <motion.div 
            className="w-20 h-20 flex items-center justify-center mx-auto mb-6"
            animate={{ 
              boxShadow: [
                "0 0 0 0 rgba(249, 115, 22, 0.3)",
                "0 0 0 20px rgba(249, 115, 22, 0)",
                "0 0 0 0 rgba(249, 115, 22, 0)"
              ]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <img src="/icon-192x192.png" alt="PeakForge Logo" className="w-20 h-20" />
          </motion.div>
          
          <motion.h1 
            className="text-4xl md:text-5xl font-bold mb-4"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8, ease: "easeOut" }}
          >
            Welcome to <span className="text-orange-500">PeakForge</span>
          </motion.h1>
          
          <motion.p 
            className="text-lg text-gray-300 leading-relaxed max-w-md mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8, ease: "easeOut" }}
          >
            Build natural habits that support masculine vitality and energy. 
            <span className="text-orange-400 font-semibold"> Your transformation starts here.</span>
          </motion.p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.8, ease: "easeOut" }}
        >
          <motion.div
            whileHover={{ scale: canSkip ? 1.05 : 1 }}
            whileTap={{ scale: canSkip ? 0.95 : 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
          >
            <Button
              onClick={handleComplete}
              disabled={!canSkip || isTransitioning}
              size="lg"
              className={`font-semibold px-8 py-4 text-lg rounded-xl shadow-xl transform transition-all duration-300 min-h-[56px] touch-manipulation ${
                canSkip && !isTransitioning
                  ? 'bg-orange-500 hover:bg-orange-600 text-white hover:shadow-2xl'
                  : 'bg-gray-700 text-gray-400 cursor-not-allowed'
              }`}
            >
              {isTransitioning ? 'Starting...' : 'Start Your Transformation'}
            </Button>
          </motion.div>
          
          <motion.p 
            className="text-sm text-gray-400 mt-4"
            animate={{ opacity: [0.7, 1, 0.7] }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            Takes 3 minutes • Based on science
          </motion.p>

          {/* Progress indicator - only show when canSkip is true */}
          {canSkip && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              className="mt-6 w-32 h-1 bg-gray-800 rounded-full overflow-hidden"
            >
              <motion.div
                className="h-full bg-gradient-to-r from-orange-500 to-orange-400 rounded-full"
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ duration: 3, ease: "linear" }}
              />
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
}