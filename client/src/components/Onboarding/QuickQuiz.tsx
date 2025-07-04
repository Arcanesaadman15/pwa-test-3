import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { QUICK_QUIZ_QUESTIONS } from '@/data/onboardingData';
import { OptionCard, OptionTitle, OptionSubtitle } from '@/components/ui/option-card';

interface QuickQuizProps {
  onComplete: (data: {
    ageRange: string;
    sleepQuality: string; 
    exerciseFrequency: string;
    primaryGoal: string;
  }) => void;
}

export function QuickQuiz({ onComplete }: QuickQuizProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [selectedOption, setSelectedOption] = useState<string>('');
  const [isTransitioning, setIsTransitioning] = useState(false);

  const handleOptionSelect = (value: string) => {
    if (isTransitioning) return; // Prevent double-clicks during transition
    
    setSelectedOption(value);
    setIsTransitioning(true);
    
    // Auto-advance after selection with enhanced timing
    setTimeout(() => {
      const questionId = QUICK_QUIZ_QUESTIONS[currentQuestion].id;
      const newAnswers = { ...answers, [questionId]: value };
      setAnswers(newAnswers);
      
      if (currentQuestion < QUICK_QUIZ_QUESTIONS.length - 1) {
        setCurrentQuestion(prev => prev + 1);
        setSelectedOption('');
        setIsTransitioning(false);
      } else {
        // Quiz completed
        onComplete(newAnswers as any);
      }
    }, 600); // Slightly longer for better visual feedback
  };

  const progress = ((currentQuestion + 1) / QUICK_QUIZ_QUESTIONS.length) * 100;
  const question = QUICK_QUIZ_QUESTIONS[currentQuestion];

  return (
    <div className="min-h-screen bg-black flex flex-col relative">
      {/* Subtle background effects */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          className="absolute top-20 right-10 w-32 h-32 bg-orange-500/5 rounded-full blur-2xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute bottom-40 left-10 w-24 h-24 bg-orange-500/3 rounded-full blur-xl"
          animate={{
            scale: [0.8, 1.1, 0.8],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2
          }}
        />
      </div>

      {/* Header with enhanced progress */}
      <motion.div 
        className="pt-8 px-6 relative z-10"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <div className="flex items-center justify-between mb-6">
          <motion.div 
            className="text-sm text-gray-400 font-medium"
            key={`question-${currentQuestion}`}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            Question {currentQuestion + 1} of {QUICK_QUIZ_QUESTIONS.length}
          </motion.div>
          <motion.div 
            className="text-sm text-gray-400 font-medium"
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            key={`progress-${Math.round(progress)}`}
          >
            {Math.round(progress)}% complete
          </motion.div>
        </div>
        
        {/* Enhanced Progress bar */}
        <div className="w-full h-3 bg-gray-800/60 rounded-full overflow-hidden backdrop-blur-sm border border-gray-700/50">
          <motion.div
            className="h-full bg-gradient-to-r from-orange-400 via-orange-500 to-orange-600 rounded-full shadow-lg shadow-orange-500/30"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          />
          {/* Shine effect */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
            animate={{ x: [-100, 300] }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1
            }}
          />
        </div>
      </motion.div>

      {/* Question content with better transitions */}
      <div className="flex-1 flex flex-col justify-center px-6 pb-20 relative z-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestion}
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -30, scale: 0.95 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="text-center mb-12"
          >
            {/* Question with enhanced styling */}
            <motion.h1 
              className="text-3xl font-bold text-white mb-4 leading-tight relative"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.6 }}
            >
              {question.question}
            </motion.h1>
            
            {/* Subtitle with subtle animation */}
            <motion.p 
              className="text-lg text-gray-300 max-w-md mx-auto"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              {question.subtitle}
            </motion.p>
          </motion.div>
        </AnimatePresence>

        {/* Enhanced Options */}
        <motion.div 
          className="space-y-4 max-w-lg mx-auto w-full"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          <AnimatePresence mode="wait">
            {question.options.map((option, index) => (
              <OptionCard
                key={`${currentQuestion}-${option.value}`}
                onClick={() => handleOptionSelect(option.value)}
                isSelected={selectedOption === option.value}
                isDisabled={isTransitioning}
                index={index}
              >
                <OptionTitle isSelected={selectedOption === option.value}>
                  {option.label}
                </OptionTitle>
                {option.subtitle && (
                  <OptionSubtitle isSelected={selectedOption === option.value}>
                    {option.subtitle}
                  </OptionSubtitle>
                )}
              </OptionCard>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Enhanced help text */}
        <motion.div 
          className="text-center mt-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.6 }}
        >
          <motion.p 
            className="text-sm text-gray-500 font-medium"
            animate={{ opacity: [0.5, 0.8, 0.5] }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            Choose the option that best describes you
          </motion.p>
        </motion.div>
      </div>

      {/* Enhanced Question indicators */}
      <motion.div 
        className="pb-8 px-6 relative z-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.6 }}
      >
        <div className="flex justify-center space-x-3">
          {QUICK_QUIZ_QUESTIONS.map((_, index) => (
            <motion.div
              key={index}
              className={`rounded-full transition-all duration-500 ${
                index < currentQuestion
                  ? 'w-3 h-3 bg-green-500 shadow-lg shadow-green-400/50'
                  : index === currentQuestion
                  ? 'w-4 h-4 bg-orange-500 shadow-lg shadow-orange-500/50'
                  : 'w-2 h-2 bg-gray-600'
              }`}
              animate={index === currentQuestion ? {
                scale: [1, 1.2, 1],
                boxShadow: [
                  "0 0 0 0 rgba(249, 115, 22, 0.5)",
                  "0 0 0 8px rgba(249, 115, 22, 0)",
                  "0 0 0 0 rgba(249, 115, 22, 0)"
                ]
              } : {}}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          ))}
        </div>
      </motion.div>
    </div>
  );
}