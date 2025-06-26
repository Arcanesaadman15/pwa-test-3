import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PROBLEM_SPOTLIGHT_SLIDES } from '@/data/onboardingData';
import { Button } from '@/components/ui/button';

interface ProblemSpotlightProps {
  onComplete: () => void;
}

export function ProblemSpotlight({ onComplete }: ProblemSpotlightProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const minSwipeDistance = 50;

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe && currentSlide < PROBLEM_SPOTLIGHT_SLIDES.length - 1) {
      setCurrentSlide(prev => prev + 1);
    }
    if (isRightSwipe && currentSlide > 0) {
      setCurrentSlide(prev => prev - 1);
    }
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  const goNext = () => {
    if (currentSlide < PROBLEM_SPOTLIGHT_SLIDES.length - 1) {
      setCurrentSlide(prev => prev + 1);
    }
  };

  const isLastSlide = currentSlide === PROBLEM_SPOTLIGHT_SLIDES.length - 1;

  return (
    <div className="min-h-screen bg-black flex flex-col">
      {/* Skip button - Apple style */}
      <div className="absolute top-4 right-4 z-20 safe-area-top">
        <button
          onClick={onComplete}
          className="px-3 py-2 rounded-full bg-gray-900/50 backdrop-blur-sm border border-gray-700 text-gray-300 hover:text-white hover:bg-gray-800/50 transition-all duration-200 text-sm font-medium"
        >
          Skip
        </button>
      </div>

      {/* Main content container - flexible height with proper scrolling */}
      <div
        ref={containerRef}
        className="flex-1 relative min-h-screen pb-20"
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, x: 300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -300 }}
            transition={{ 
              type: "spring", 
              stiffness: 300, 
              damping: 35,
              opacity: { duration: 0.3 }
            }}
            className="absolute inset-0 flex flex-col px-4 text-center"
          >
            {/* Content Area - takes most of the space */}
            <div className="flex-1 flex flex-col justify-center items-center py-8">
              {/* Problem Icon with glassmorphism */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.6, ease: "easeOut" }}
                className="relative mb-6"
              >
                <div className={`w-20 h-20 rounded-3xl bg-gradient-to-br ${PROBLEM_SPOTLIGHT_SLIDES[currentSlide].gradient} 
                               flex items-center justify-center shadow-2xl backdrop-blur-sm border border-orange-500/20`}>
                  <span className="text-3xl">{PROBLEM_SPOTLIGHT_SLIDES[currentSlide].image}</span>
                </div>
                
                {/* Orange glow */}
                <div className={`absolute inset-0 rounded-3xl bg-orange-500/20 opacity-30 blur-xl -z-10 scale-110`} />
            </motion.div>

              {/* Content Card */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.6, ease: "easeOut" }}
                className="max-w-sm mx-auto bg-gray-900 backdrop-blur-xl rounded-3xl p-5 border border-gray-700 shadow-2xl"
              >
                {/* Problem Title */}
                <h1 className="text-xl font-bold text-white mb-3 leading-tight tracking-tight">
                  {PROBLEM_SPOTLIGHT_SLIDES[currentSlide].title}
                </h1>

                {/* Problem Subtitle */}
                <h2 className="text-sm text-gray-300 mb-3 font-medium leading-relaxed">
                  {PROBLEM_SPOTLIGHT_SLIDES[currentSlide].subtitle}
                </h2>

                {/* Problem Description */}
                <p className="text-xs text-gray-400 leading-relaxed">
                  {PROBLEM_SPOTLIGHT_SLIDES[currentSlide].description}
                </p>
              </motion.div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Fixed bottom area for last slide button */}
        {isLastSlide && (
          <div className="absolute bottom-0 left-0 right-0 px-6 py-6 bg-black/95 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.4 }}
              className="max-w-sm mx-auto w-full"
            >
              <Button
                onClick={onComplete}
                size="lg"
                className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-4 text-lg rounded-xl shadow-2xl hover:shadow-3xl 
                         transform hover:scale-105 active:scale-95 transition-all duration-200 border-0"
              >
                I'm done being weak →
              </Button>
            </motion.div>
            {/* Safe area padding for mobile */}
            <div className="h-safe-bottom" />
          </div>
        )}

        {/* Slide indicators - positioned above button area */}
        <div className={`absolute ${isLastSlide ? 'bottom-20' : 'bottom-8'} left-1/2 transform -translate-x-1/2 flex space-x-2 z-10`}>
          {PROBLEM_SPOTLIGHT_SLIDES.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === currentSlide
                  ? 'bg-orange-500 shadow-lg scale-125'
                  : 'bg-gray-500 hover:bg-gray-400'
              }`}
            />
          ))}
        </div>

        {/* Swipe hint - first slide only */}
        {currentSlide === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2 }}
            className={`absolute ${isLastSlide ? 'bottom-32' : 'bottom-16'} left-1/2 transform -translate-x-1/2`}
          >
            <div className="flex items-center space-x-3 text-gray-400 text-sm bg-gray-900/50 backdrop-blur-sm rounded-full px-4 py-2 border border-gray-700">
              <span>Swipe to explore</span>
              <motion.div
                animate={{ x: [0, 8, 0] }}
                transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                className="text-orange-500"
              >
                →
              </motion.div>
            </div>
          </motion.div>
        )}

        {/* Next button for non-last slides - Apple style */}
        {!isLastSlide && (
          <button
            onClick={goNext}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 w-12 h-12 
                     bg-gray-900/50 hover:bg-gray-800/50 backdrop-blur-sm rounded-full flex items-center justify-center
                     text-orange-500 hover:scale-110 active:scale-95 transition-all duration-200 border border-gray-700
                     shadow-xl z-10"
          >
            →
          </button>
        )}

        {/* Subtle background effects */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            className="absolute top-1/4 -right-32 w-64 h-64 bg-orange-500/5 rounded-full blur-3xl"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          <motion.div
            className="absolute bottom-1/4 -left-32 w-64 h-64 bg-orange-500/3 rounded-full blur-3xl"
            animate={{
              scale: [1.2, 1, 1.2],
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 3
            }}
          />
        </div>
      </div>
    </div>
  );
}