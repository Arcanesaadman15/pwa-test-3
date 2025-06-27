import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { COMMITMENT_QUESTIONS } from "@/data/onboardingData";
import { ChevronLeft } from "lucide-react";

interface CommitmentQuestionsProps {
  onComplete: (data: { [key: string]: string }) => void;
}

export function CommitmentQuestions({ onComplete }: CommitmentQuestionsProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<{ [key: string]: string }>({});
  const [selectedOption, setSelectedOption] = useState<string>("");

  // Debug effect to track component state
  useEffect(() => {
    // Track component state
    const state = {
      currentQuestion,
      totalQuestions: COMMITMENT_QUESTIONS?.length || 0,
      isValidIndex: currentQuestion >= 0 && currentQuestion < (COMMITMENT_QUESTIONS?.length || 0)
    };
  }, [currentQuestion]);

  useEffect(() => {
  }, [currentQuestion]);

  // Safety check to prevent crashes
  if (!COMMITMENT_QUESTIONS || COMMITMENT_QUESTIONS.length === 0) {
    console.error('CommitmentQuestions: COMMITMENT_QUESTIONS is empty or undefined');
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl mb-4">Loading questions...</p>
          <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin mx-auto"></div>
        </div>
      </div>
    );
  }

  // Ensure currentQuestion is always within valid bounds
  const safeCurrentQuestion = Math.max(0, Math.min(currentQuestion, COMMITMENT_QUESTIONS.length - 1));
  
  // Reset currentQuestion if it's out of bounds
  if (currentQuestion !== safeCurrentQuestion) {
    console.warn('CommitmentQuestions: currentQuestion out of bounds, resetting to', safeCurrentQuestion);
    setCurrentQuestion(safeCurrentQuestion);
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl mb-4">Adjusting questions...</p>
          <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin mx-auto"></div>
        </div>
      </div>
    );
  }

  const question = COMMITMENT_QUESTIONS[safeCurrentQuestion];
  const isLastQuestion = safeCurrentQuestion === COMMITMENT_QUESTIONS.length - 1;

  // Additional safety check for the current question
  if (!question) {
    console.error('CommitmentQuestions: question is undefined for index', safeCurrentQuestion);
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl mb-4">Question loading error</p>
          <button 
            onClick={() => setCurrentQuestion(0)}
            className="px-4 py-2 bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Reset Questions
          </button>
        </div>
      </div>
    );
  }

  const handleOptionSelect = (value: string) => {
    setSelectedOption(value);
    // Auto-advance after selection with slight delay for visual feedback
    setTimeout(() => {
      const newAnswers = { ...answers, [question.id]: value };
      setAnswers(newAnswers);
      
      if (isLastQuestion) {
        onComplete(newAnswers);
      } else {
        setCurrentQuestion(prev => prev + 1);
        setSelectedOption("");
      }
    }, 300);
  };

  const handleBack = () => {
    if (safeCurrentQuestion > 0) {
      const newQuestionIndex = safeCurrentQuestion - 1;
      // Ensure the new index is valid
      if (newQuestionIndex >= 0 && newQuestionIndex < COMMITMENT_QUESTIONS.length) {
        setCurrentQuestion(newQuestionIndex);
        const previousQuestion = COMMITMENT_QUESTIONS[newQuestionIndex];
        if (previousQuestion) {
          setSelectedOption(answers[previousQuestion.id] || "");
        }
      }
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header with Progress */}
      <div className="sticky top-0 z-40 bg-black/80 backdrop-blur-xl border-b border-gray-800">
        <div className="max-w-md mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            {safeCurrentQuestion > 0 && (
              <button
                onClick={handleBack}
                className="p-2 rounded-full bg-gray-900 hover:bg-gray-800 transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
            )}
            <div className="flex-1 text-center">
              <span className="text-sm text-gray-400">
                Question {safeCurrentQuestion + 1} of {COMMITMENT_QUESTIONS.length}
              </span>
            </div>
            <div className="w-9" /> {/* Spacer for centering */}
          </div>
          
          {/* Progress Bar */}
          <div className="w-full bg-gray-900 rounded-full h-2">
            <motion.div
              className="h-2 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${((safeCurrentQuestion + 1) / COMMITMENT_QUESTIONS.length) * 100}%` }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-md mx-auto px-4 py-8 pb-24">
        <AnimatePresence mode="wait">
          <motion.div
            key={safeCurrentQuestion}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            {/* Question Header */}
            <div className="text-center mb-8">
              <motion.h1
                className="text-3xl md:text-4xl font-bold mb-4 leading-tight"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                {question.question}
              </motion.h1>
              <motion.p
                className="text-lg text-gray-300 leading-relaxed"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                {question.subtitle}
              </motion.p>
            </div>

            {/* Options */}
            <div className="space-y-4">
              {question.options.map((option, index) => (
                <motion.div
                  key={option.value}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    onClick={() => handleOptionSelect(option.value)}
                    variant="outline"
                    className={`w-full p-6 text-left border-2 transition-all duration-300 min-h-[80px] flex items-start relative overflow-hidden group ${
                      selectedOption === option.value
                        ? 'border-orange-500 bg-orange-500/20 text-white scale-105 shadow-lg shadow-orange-500/25'
                        : 'border-gray-600/70 bg-gray-900/50 hover:border-gray-500 hover:bg-gray-800/60 text-gray-200 hover:shadow-lg hover:shadow-gray-500/10'
                    }`}
                  >
                    {/* Background shimmer effect */}
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100"
                      animate={{ x: [-100, 300] }}
                      transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    />
                    
                    <div className="flex flex-col text-left w-full relative z-10">
                      <motion.span 
                        className="font-semibold text-lg mb-2 leading-tight text-left"
                        animate={selectedOption === option.value ? { x: [0, 5, 0] } : {}}
                        transition={{ duration: 0.3 }}
                      >
                        {option.label}
                      </motion.span>
                      {option.subtitle && (
                        <motion.span 
                          className="text-sm text-gray-400 leading-relaxed text-left"
                          animate={selectedOption === option.value ? { opacity: [0.7, 1, 0.7] } : {}}
                          transition={{ duration: 0.5 }}
                        >
                          {option.subtitle}
                        </motion.span>
                      )}
                    </div>
                    
                    {/* Selection indicator */}
                    {selectedOption === option.value && (
                      <motion.div
                        className="absolute right-4 top-1/2 transform -translate-y-1/2"
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ type: "spring", stiffness: 300, damping: 25 }}
                      >
                        <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center">
                          <motion.div
                            className="w-2 h-2 bg-white rounded-full"
                            animate={{ scale: [0, 1.2, 1] }}
                            transition={{ duration: 0.3 }}
                          />
                        </div>
                      </motion.div>
                    )}
                  </Button>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Safe Area Padding */}
      <div className="h-safe-bottom" />
    </div>
  );
} 