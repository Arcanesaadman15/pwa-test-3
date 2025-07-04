import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LIFESTYLE_SLIDERS } from '@/data/onboardingData';
import { Button } from '@/components/ui/button';

interface LifestyleSlidersProps {
  onComplete: (data: {
    waistCircumference: number;
    stressLevel: number;
    dailySteps: number;
  }) => void;
}

export function LifestyleSliders({ onComplete }: LifestyleSlidersProps) {
  const [values, setValues] = useState<Record<string, number>>({
    waistCircumference: 34,
    stressLevel: 5,
    dailySteps: 5000
  });

  const [currentSlider, setCurrentSlider] = useState(0);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const handleSliderChange = (sliderId: string, value: number) => {
    setValues(prev => ({ ...prev, [sliderId]: value }));
    setHasInteracted(true);
  };

  // Auto-advance after user interaction (delayed)
  useEffect(() => {
    if (hasInteracted && !isDragging) {
      const timer = setTimeout(() => {
        setHasInteracted(false);
        // Optional: could auto-advance here
        // goNext();
      }, 2000);
      
      return () => clearTimeout(timer);
    }
  }, [hasInteracted, isDragging]);

  const goNext = () => {
    if (currentSlider < LIFESTYLE_SLIDERS.length - 1) {
      setCurrentSlider(prev => prev + 1);
    } else {
      onComplete(values as any);
    }
  };

  const goBack = () => {
    if (currentSlider > 0) {
      setCurrentSlider(prev => prev - 1);
    }
  };

  const slider = LIFESTYLE_SLIDERS[currentSlider];
  const currentValue = values[slider.id] || slider.default;
  const progress = ((currentSlider + 1) / LIFESTYLE_SLIDERS.length) * 100;

  // Get color based on value for stress level
  const getSliderColor = () => {
    if (slider.id === 'stressLevel') {
      if (currentValue <= 3) return 'from-green-500 to-blue-500';
      if (currentValue <= 6) return 'from-yellow-500 to-orange-500';
      return 'from-orange-500 to-red-500';
    }
    return slider.gradient;
  };

  const getValueDescription = () => {
    if (slider.id === 'waistCircumference') {
      if (currentValue <= 32) return 'Lean physique';
      if (currentValue <= 36) return 'Average build';
      if (currentValue <= 40) return 'Above average';
      return 'Higher body fat';
    }
    
    if (slider.id === 'stressLevel') {
      if (currentValue <= 3) return 'Low stress - great for T levels';
      if (currentValue <= 6) return 'Moderate stress';
      if (currentValue <= 8) return 'High stress - needs attention';
      return 'Very high stress - major concern';
    }
    
    if (slider.id === 'dailySteps') {
      if (currentValue <= 3000) return 'Sedentary lifestyle';
      if (currentValue <= 7000) return 'Lightly active';
      if (currentValue <= 10000) return 'Moderately active';
      return 'Very active';
    }
    
    return '';
  };

  const getDescriptionColor = () => {
    if (slider.id === 'stressLevel') {
      if (currentValue <= 3) return 'text-green-400';
      if (currentValue <= 6) return 'text-yellow-400';
      return 'text-red-400';
    }
    
    if (slider.id === 'waistCircumference') {
      if (currentValue <= 32) return 'text-green-400';
      if (currentValue <= 36) return 'text-blue-400';
      if (currentValue <= 40) return 'text-yellow-400';
      return 'text-red-400';
    }
    
    if (slider.id === 'dailySteps') {
      if (currentValue <= 3000) return 'text-red-400';
      if (currentValue <= 7000) return 'text-yellow-400';
      if (currentValue <= 10000) return 'text-blue-400';
      return 'text-green-400';
    }
    
    return 'text-gray-400';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex flex-col relative">
      {/* Background effects */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          className="absolute top-1/4 right-10 w-40 h-40 bg-blue-500/5 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.3, 0.6, 0.3],
            x: [0, 20, 0],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute bottom-1/3 left-10 w-32 h-32 bg-purple-500/5 rounded-full blur-2xl"
          animate={{
            scale: [0.8, 1.2, 0.8],
            opacity: [0.2, 0.5, 0.2],
            y: [0, -15, 0],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2.5
          }}
        />
      </div>

      {/* Header */}
      <motion.div 
        className="pt-4 px-4 pb-4 safe-area-top relative z-10"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="flex items-center justify-between mb-6">
          <motion.div 
            className="text-sm text-gray-400 font-medium"
            key={`slider-${currentSlider}`}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            {currentSlider + 1} of {LIFESTYLE_SLIDERS.length}
          </motion.div>
          <motion.div 
            className="text-sm text-gray-400 font-medium"
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 0.5 }}
          >
            Baseline Assessment
          </motion.div>
        </div>
        
        {/* Progress bar */}
        <div className="w-full h-3 bg-gray-900/60 rounded-full overflow-hidden backdrop-blur-sm border border-gray-700/50 relative">
          <motion.div
            className="h-full bg-gradient-to-r from-orange-500 to-orange-600 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          />
          {/* Progress shine effect */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
            animate={{ x: [-100, 400] }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1
            }}
          />
        </div>
      </motion.div>

      {/* Main content - scrollable with proper spacing */}
      <div className="flex-1 overflow-y-auto px-4 py-8">
        <div className="max-w-md mx-auto">
          {/* Title */}
          <motion.h1 
            className="text-3xl md:text-4xl font-bold text-white mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.6 }}
          >
            <span className="text-white">
              {slider.title}
            </span>
          </motion.h1>
          
          {/* Subtitle */}
          <motion.p 
            className="text-lg text-gray-300 max-w-md mx-auto mb-8"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            {slider.subtitle}
          </motion.p>

          {/* Current value display with enhanced styling */}
          <motion.div 
            className="mb-8"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            <motion.div 
              className="text-5xl font-bold text-white mb-2"
              animate={{ scale: isDragging ? 1.1 : 1 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
            >
              {currentValue}
              <motion.span 
                className="text-2xl text-gray-400 ml-2"
                animate={{ opacity: [0.6, 1, 0.6] }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                {slider.unit}
              </motion.span>
            </motion.div>
            <motion.div 
              className={`text-base font-medium ${getDescriptionColor()}`}
              animate={{ opacity: [0.8, 1, 0.8] }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              {getValueDescription()}
            </motion.div>
          </motion.div>

          {/* Enhanced Slider */}
          <motion.div 
            className="max-w-lg mx-auto w-full mb-8"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            <div className="relative px-6">
              {/* Slider track with enhanced styling */}
              <div className="w-full h-6 bg-gray-700/60 rounded-full relative overflow-hidden backdrop-blur-sm border border-gray-600/50">
                {/* Active track with gradient */}
                <motion.div
                  className={`h-full bg-gradient-to-r ${getSliderColor()} rounded-full shadow-lg relative`}
                  style={{ 
                    width: `${((currentValue - slider.min) / (slider.max - slider.min)) * 100}%` 
                  }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                >
                  {/* Inner shine effect */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                    animate={{ x: [-100, 200] }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: 1
                    }}
                  />
                </motion.div>
              </div>
              
              {/* Enhanced Slider thumb - properly constrained */}
              <motion.div
                className="absolute top-1/2 transform -translate-y-1/2 -translate-x-1/2 cursor-pointer z-20"
                style={{ 
                  left: `calc(${((currentValue - slider.min) / (slider.max - slider.min)) * 100}%)`,
                  width: '40px',
                  height: '40px'
                }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onMouseDown={() => setIsDragging(true)}
                onMouseUp={() => setIsDragging(false)}
                onTouchStart={() => setIsDragging(true)}
                onTouchEnd={() => setIsDragging(false)}
              >
                <motion.div 
                  className="w-10 h-10 bg-white rounded-full shadow-xl border-4 border-gray-800 relative overflow-hidden flex items-center justify-center"
                  animate={{
                    boxShadow: isDragging 
                      ? "0 0 0 8px rgba(59, 130, 246, 0.3)" 
                      : "0 0 0 0px rgba(59, 130, 246, 0.3)"
                  }}
                  transition={{ duration: 0.2 }}
                >
                  {/* Inner glow */}
                  <div className={`absolute inset-2 bg-gradient-to-br ${getSliderColor()} rounded-full opacity-20`} />
                  
                  {/* Center dot */}
                  <motion.div
                    className={`w-3 h-3 bg-gradient-to-r ${getSliderColor()} rounded-full`}
                    animate={{
                      scale: isDragging ? [1, 1.5, 1] : 1
                    }}
                    transition={{
                      duration: 0.3,
                      repeat: isDragging ? Infinity : 0
                    }}
                  />
                </motion.div>
              </motion.div>
              
              {/* Improved range input for better accessibility and interaction */}
              <input
                type="range"
                min={slider.min}
                max={slider.max}
                value={currentValue}
                onChange={(e) => handleSliderChange(slider.id, parseInt(e.target.value))}
                onMouseDown={() => setIsDragging(true)}
                onMouseUp={() => setIsDragging(false)}
                onTouchStart={() => setIsDragging(true)}
                onTouchEnd={() => setIsDragging(false)}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-30"
                style={{ margin: 0, padding: 0 }}
              />
            </div>
            
            {/* Min/Max labels with better styling */}
            <motion.div 
              className="flex justify-between mt-6 text-sm text-gray-500 px-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.4 }}
            >
              <motion.span
                animate={{ opacity: [0.5, 0.8, 0.5] }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                {slider.min}{slider.unit}
              </motion.span>
              <motion.span
                animate={{ opacity: [0.5, 0.8, 0.5] }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 1
                }}
              >
                {slider.max}{slider.unit}
              </motion.span>
            </motion.div>
          </motion.div>
        </div>

        {/* Navigation buttons */}
        <motion.div 
          className="flex justify-between items-center mt-12 px-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.6 }}
        >
          <Button
            onClick={goBack}
            disabled={currentSlider === 0}
            variant="outline"
            className="px-6 py-3 bg-gray-900/60 border-gray-700 hover:bg-gray-800/60 hover:border-gray-600 
                     disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-300
                     backdrop-blur-sm shadow-lg hover:shadow-xl"
          >
            <motion.span
              whileHover={{ x: -2 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
            >
              ← Back
            </motion.span>
          </Button>

          <motion.div
            animate={{ scale: [1, 1.05, 1] }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <Button
              onClick={goNext}
              className="px-8 py-3 bg-orange-500 hover:bg-orange-600 
                       text-white font-semibold shadow-xl hover:shadow-2xl transform hover:scale-105 
                       transition-all duration-300"
            >
              <motion.span
                whileHover={{ x: 2 }}
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
              >
                {currentSlider === LIFESTYLE_SLIDERS.length - 1 ? 'Continue →' : 'Next →'}
              </motion.span>
            </Button>
          </motion.div>
        </motion.div>

        {/* Step indicators */}
        <motion.div 
          className="flex justify-center space-x-3 mt-8 pb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.6 }}
        >
          {LIFESTYLE_SLIDERS.map((_, index) => (
            <motion.div
              key={index}
              className={`rounded-full transition-all duration-500 ${
                index < currentSlider
                  ? 'w-3 h-3 bg-gradient-to-r from-green-400 to-green-500 shadow-lg shadow-green-400/50'
                  : index === currentSlider
                  ? 'w-4 h-4 bg-gradient-to-r from-blue-500 to-purple-500 shadow-lg shadow-blue-500/50'
                  : 'w-2 h-2 bg-gray-600'
              }`}
              animate={index === currentSlider ? {
                scale: [1, 1.2, 1],
                boxShadow: [
                  "0 0 0 0 rgba(59, 130, 246, 0.5)",
                  "0 0 0 8px rgba(59, 130, 246, 0)",
                  "0 0 0 0 rgba(59, 130, 246, 0)"
                ]
              } : {}}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          ))}
        </motion.div>
      </div>
    </div>
  );
}