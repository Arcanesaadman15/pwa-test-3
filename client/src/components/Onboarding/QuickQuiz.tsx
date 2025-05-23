import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { QUICK_QUIZ_QUESTIONS } from '@/data/onboardingData';
import { Button } from '@/components/ui/button';

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

  const handleOptionSelect = (value: string) => {
    setSelectedOption(value);
    
    // Auto-advance after selection with a small delay for visual feedback
    setTimeout(() => {
      const questionId = QUICK_QUIZ_QUESTIONS[currentQuestion].id;
      const newAnswers = { ...answers, [questionId]: value };
      setAnswers(newAnswers);
      
      if (currentQuestion < QUICK_QUIZ_QUESTIONS.length - 1) {
        setCurrentQuestion(prev => prev + 1);
        setSelectedOption('');
      } else {
        // Quiz completed - send answers only
        onComplete({
          ageRange: newAnswers.ageRange || '',
          sleepQuality: newAnswers.sleepQuality || '',
          exerciseFrequency: newAnswers.exerciseFrequency || '',
          primaryGoal: newAnswers.primaryGoal || ''
        });
      }
    }, 300);
  };

  const question = QUICK_QUIZ_QUESTIONS[currentQuestion];

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white px-8 py-12">
      {/* Quiz Content */}
      <div className="flex flex-col items-center justify-center flex-1 max-w-2xl mx-auto">
        {/* Question Number */}
        <div className="text-center mb-8">
          <div className="text-blue-400 text-sm font-medium mb-2">
            Question {currentQuestion + 1} of {QUICK_QUIZ_QUESTIONS.length}
          </div>
          <h2 className="text-3xl font-bold mb-4">{question.question}</h2>
          {question.subtitle && (
            <p className="text-gray-400 text-lg">{question.subtitle}</p>
          )}
        </div>

        {/* Options */}
        <div className="w-full space-y-4">
          <AnimatePresence mode="wait">
            {question.options.map((option, index) => (
              <motion.button
                key={`${currentQuestion}-${index}`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => handleOptionSelect(option.value)}
                className={`w-full p-6 text-left rounded-xl border-2 transition-all duration-200 ${
                  selectedOption === option.value
                    ? 'border-blue-500 bg-blue-500/10 text-blue-400'
                    : 'border-gray-700 bg-gray-800/50 hover:border-gray-600 hover:bg-gray-800'
                }`}
              >
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full border-2 border-current flex items-center justify-center mt-1">
                    {selectedOption === option.value && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="w-3 h-3 rounded-full bg-current"
                      />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-lg mb-1">{option.label}</div>
                    {option.subtitle && (
                      <div className="text-gray-400 text-sm">{option.subtitle}</div>
                    )}
                  </div>
                </div>
              </motion.button>
            ))}
          </AnimatePresence>
        </div>

        {/* Progress Indicator */}
        <div className="mt-8 w-full max-w-md">
          <div className="flex justify-between text-sm text-gray-400 mb-2">
            <span>Progress</span>
            <span>{Math.round(((currentQuestion + 1) / QUICK_QUIZ_QUESTIONS.length) * 100)}%</span>
          </div>
          <div className="w-full bg-gray-800 rounded-full h-2">
            <motion.div
              className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${((currentQuestion + 1) / QUICK_QUIZ_QUESTIONS.length) * 100}%` }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}