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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      {/* Skip button */}
      <div className="absolute top-6 right-6 z-10">
        <button
          onClick={onComplete}
          className="text-gray-400 hover:text-white transition-colors text-sm px-4 py-2"
        >
          Skip
        </button>
      </div>

      {/* Main content container */}
      <div
        ref={containerRef}
        className="relative h-screen overflow-hidden"
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
              damping: 30,
              opacity: { duration: 0.3 }
            }}
            className="absolute inset-0 flex flex-col items-center justify-center px-8 text-center"
          >
            {/* Problem Icon */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className={`w-32 h-32 rounded-full bg-gradient-to-br ${PROBLEM_SPOTLIGHT_SLIDES[currentSlide].gradient} 
                         flex items-center justify-center mb-8 shadow-2xl`}
            >
              <span className="text-6xl">{PROBLEM_SPOTLIGHT_SLIDES[currentSlide].image}</span>
            </motion.div>

            {/* Problem Title */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="text-4xl font-bold text-white mb-4 max-w-lg"
            >
              {PROBLEM_SPOTLIGHT_SLIDES[currentSlide].title}
            </motion.h1>

            {/* Problem Subtitle */}
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="text-xl text-gray-300 mb-6 max-w-md font-medium"
            >
              {PROBLEM_SPOTLIGHT_SLIDES[currentSlide].subtitle}
            </motion.h2>

            {/* Problem Description */}
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="text-gray-400 text-lg leading-relaxed max-w-lg mb-12"
            >
              {PROBLEM_SPOTLIGHT_SLIDES[currentSlide].description}
            </motion.p>

            {/* Action button for last slide */}
            {isLastSlide && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.6 }}
              >
                <Button
                  onClick={onComplete}
                  size="lg"
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 
                           text-white font-semibold px-8 py-4 text-lg rounded-xl shadow-xl hover:shadow-2xl 
                           transform hover:scale-105 transition-all duration-200"
                >
                  I want to change this →
                </Button>
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Slide indicators */}
        <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 flex space-x-3">
          {PROBLEM_SPOTLIGHT_SLIDES.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentSlide
                  ? 'bg-white shadow-lg scale-125'
                  : 'bg-gray-600 hover:bg-gray-500'
              }`}
            />
          ))}
        </div>

        {/* Swipe hint */}
        {currentSlide === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2 }}
            className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
          >
            <div className="flex items-center space-x-2 text-gray-500 text-sm">
              <span>Swipe to explore</span>
              <motion.div
                animate={{ x: [0, 10, 0] }}
                transition={{ repeat: Infinity, duration: 2 }}
              >
                →
              </motion.div>
            </div>
          </motion.div>
        )}

        {/* Next button for non-last slides */}
        {!isLastSlide && (
          <button
            onClick={goNext}
            className="absolute right-6 top-1/2 transform -translate-y-1/2 w-12 h-12 
                     bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center
                     text-white hover:scale-110 transition-all duration-200"
          >
            →
          </button>
        )}
      </div>
    </div>
  );
}