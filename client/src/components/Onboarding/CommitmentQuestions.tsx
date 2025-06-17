import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { COMMITMENT_QUESTIONS } from "@/data/onboardingData";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface CommitmentQuestionsProps {
  onComplete: (data: { [key: string]: string }) => void;
}

export function CommitmentQuestions({ onComplete }: CommitmentQuestionsProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<{ [key: string]: string }>({});
  const [selectedOption, setSelectedOption] = useState<string>("");

  // Debug effect to track component state
  useEffect(() => {
    console.log('🎯 CommitmentQuestions mounted:', {
      currentQuestion,
      totalQuestions: COMMITMENT_QUESTIONS?.length || 0,
      isValidIndex: currentQuestion >= 0 && currentQuestion < (COMMITMENT_QUESTIONS?.length || 0)
    });
  }, []);

  useEffect(() => {
    console.log('🎯 CommitmentQuestions currentQuestion changed to:', currentQuestion);
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

  const getOptionStyle = (option: any) => {
    const isSelected = selectedOption === option.value;
    const isPositive = option.scoreModifier > 0;
    const isNegative = option.scoreModifier < 0;
    
    let baseStyle = "relative overflow-hidden bg-white/5 backdrop-blur-sm border border-white/10 hover:border-white/20 transition-all duration-300 ease-out transform hover:scale-[1.02] active:scale-[0.98]";
    
    if (isSelected) {
      if (isPositive) {
        baseStyle += " border-green-400/50 bg-green-500/10 shadow-lg shadow-green-500/20";
      } else if (isNegative) {
        baseStyle += " border-red-400/50 bg-red-500/10 shadow-lg shadow-red-500/20";
      } else {
        baseStyle += " border-blue-400/50 bg-blue-500/10 shadow-lg shadow-blue-500/20";
      }
    }
    
    return baseStyle;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white overflow-hidden">
      {/* Header with Progress */}
      <div className="sticky top-0 z-40 bg-gray-900/80 backdrop-blur-xl border-b border-gray-700/50">
        <div className="max-w-md mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            {safeCurrentQuestion > 0 && (
              <button
                onClick={handleBack}
                className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
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
          <div className="w-full bg-gray-700/30 rounded-full h-2">
            <motion.div
              className="h-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${((safeCurrentQuestion + 1) / COMMITMENT_QUESTIONS.length) * 100}%` }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-md mx-auto px-4 py-8">
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
                className="text-2xl font-bold mb-3 leading-tight"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                {question.question}
              </motion.h1>
              <motion.p
                className="text-gray-400 text-sm leading-relaxed"
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
                <motion.button
                  key={option.value}
                  onClick={() => handleOptionSelect(option.value)}
                  className={`w-full p-4 rounded-xl text-left ${getOptionStyle(option)}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="font-medium text-white mb-1 leading-snug">
                        {option.label}
                      </p>
                      <p className="text-sm text-gray-400 leading-relaxed">
                        {option.subtitle}
                      </p>
                    </div>
                    
                    {/* Selection Indicator */}
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ml-3 transition-all duration-200 ${
                      selectedOption === option.value 
                        ? 'border-white bg-white' 
                        : 'border-gray-400'
                    }`}>
                      {selectedOption === option.value && (
                        <motion.div
                          className="w-2 h-2 bg-gray-900 rounded-full"
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ duration: 0.2 }}
                        />
                      )}
                    </div>
                  </div>
                  
                  {/* Hover Gradient Effect */}
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500/5 to-purple-500/5 opacity-0 hover:opacity-100 transition-opacity duration-300" />
                </motion.button>
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