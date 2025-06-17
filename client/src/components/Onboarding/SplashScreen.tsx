import { useEffect } from 'react';
import { motion } from 'framer-motion';

interface SplashScreenProps {
  onComplete: () => void;
}

export function SplashScreen({ onComplete }: SplashScreenProps) {
  useEffect(() => {
    const timer = setTimeout(onComplete, 2500);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex flex-col items-center justify-center px-6 overflow-hidden relative">
      {/* Enhanced Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-1/4 -right-32 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.3, 0.6, 0.3],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute bottom-1/4 -left-32 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl"
          animate={{
            scale: [1.3, 1, 1.3],
            opacity: [0.3, 0.6, 0.3],
            rotate: [360, 180, 0],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 3
          }}
        />
        {/* Additional floating elements */}
        <motion.div
          className="absolute top-1/3 left-1/4 w-32 h-32 bg-cyan-500/5 rounded-full blur-2xl"
          animate={{
            y: [-20, 20, -20],
            x: [-10, 10, -10],
            scale: [0.8, 1.2, 0.8],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1
          }}
        />
      </div>

      {/* Logo Animation with enhanced effects */}
      <motion.div
        initial={{ scale: 0.3, opacity: 0, y: 50 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{
          duration: 1.2,
          ease: [0.68, -0.55, 0.265, 1.55], // Apple-like bounce
        }}
        className="mb-8 relative z-10"
      >
        <div className="relative">
          {/* Main Logo with enhanced styling */}
          <motion.div 
            className="w-32 h-32 bg-gradient-to-br from-blue-500 via-blue-600 to-purple-600 rounded-3xl flex items-center justify-center shadow-2xl shadow-blue-500/40 backdrop-blur-sm border border-white/20 relative overflow-hidden"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            {/* Inner glow effect */}
            <div className="absolute inset-2 bg-gradient-to-br from-white/20 to-transparent rounded-2xl" />
            
            <motion.span 
              className="text-5xl relative z-10"
              animate={{ 
                scale: [1, 1.1, 1],
                rotate: [0, 5, -5, 0]
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 1
              }}
            >
              🏔️
            </motion.span>
          </motion.div>
          
          {/* Enhanced Glow Effects */}
          <motion.div 
            className="absolute inset-0 rounded-3xl bg-gradient-to-br from-blue-400/30 to-purple-400/30 blur-xl -z-10 scale-110"
            animate={{
              scale: [1.1, 1.3, 1.1],
              opacity: [0.5, 0.8, 0.5],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-blue-400/10 to-purple-400/10 blur-2xl -z-20 scale-150" />
        </div>
      </motion.div>

      {/* App Name with enhanced typography */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.8, ease: "easeOut" }}
        className="text-center mb-6"
      >
        <motion.h1 
          className="text-4xl font-bold text-white mb-3 tracking-tight relative"
          whileHover={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
          <span className="bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent">
            PeakForge
          </span>
          {/* Subtle text shadow */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 blur-sm -z-10">
            PeakForge
          </div>
        </motion.h1>
        
        <motion.div 
          className="h-0.5 bg-gradient-to-r from-blue-500 to-purple-600 mx-auto rounded-full"
          initial={{ width: 0 }}
          animate={{ width: 80 }}
          transition={{ delay: 0.8, duration: 0.6, ease: "easeOut" }}
        />
      </motion.div>

      {/* Enhanced Tagline */}
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7, duration: 0.8, ease: "easeOut" }}
        className="text-lg text-gray-300 text-center max-w-xs leading-relaxed font-medium relative"
      >
        <span className="relative z-10">Reclaim your masculine power, naturally</span>
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent blur-sm opacity-0"
          animate={{ opacity: [0, 0.5, 0], x: [-100, 100] }}
          transition={{
            duration: 2.5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1.5
          }}
        />
      </motion.p>

      {/* Enhanced Loading Indicator */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1.2, duration: 0.5 }}
        className="mt-16"
      >
        <div className="flex space-x-3">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="relative"
            >
              <motion.div
                className="w-3 h-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full shadow-lg"
                animate={{
                  scale: [1, 1.5, 1],
                  opacity: [0.4, 1, 0.4],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  delay: i * 0.2,
                  ease: "easeInOut"
                }}
              />
              <motion.div
                className="absolute inset-0 w-3 h-3 bg-blue-400 rounded-full blur-sm"
                animate={{
                  scale: [1, 2, 1],
                  opacity: [0, 0.6, 0],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  delay: i * 0.2,
                  ease: "easeInOut"
                }}
              />
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Subtle progress indication */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 0.5 }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
      >
        <motion.div
          className="text-xs text-gray-500 font-medium tracking-wide"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          Preparing your transformation...
        </motion.div>
      </motion.div>
    </div>
  );
}