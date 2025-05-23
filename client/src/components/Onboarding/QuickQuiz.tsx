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
  // Use a simple class-based approach to avoid React hooks conflicts
  let currentQuestion = 0;
  let answers: Record<string, string> = {};
  let selectedOption = '';

  const handleOptionSelect = (value: string) => {
    selectedOption = value;
    
    // Auto-advance after selection with a small delay for visual feedback
    setTimeout(() => {
      const questionId = QUICK_QUIZ_QUESTIONS[currentQuestion].id;
      answers = { ...answers, [questionId]: value };
      
      if (currentQuestion < QUICK_QUIZ_QUESTIONS.length - 1) {
        currentQuestion = currentQuestion + 1;
        selectedOption = '';
        // Force re-render by calling onComplete with partial data
        if (currentQuestion >= QUICK_QUIZ_QUESTIONS.length) {
          onComplete({
            ageRange: answers.ageRange || '',
            sleepQuality: answers.sleepQuality || '',
            exerciseFrequency: answers.exerciseFrequency || '',
            primaryGoal: answers.primaryGoal || ''
          });
        }
      } else {
        // Quiz completed - send answers
        onComplete({
          ageRange: answers.ageRange || '',
          sleepQuality: answers.sleepQuality || '',
          exerciseFrequency: answers.exerciseFrequency || '',
          primaryGoal: answers.primaryGoal || ''
        });
      }
    }, 300);
  };

  const question = QUICK_QUIZ_QUESTIONS[0]; // Start with first question

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white px-8 py-12">
      {/* Quiz Content */}
      <div className="flex flex-col items-center justify-center flex-1 max-w-2xl mx-auto">
        {/* Question Number */}
        <div className="text-center mb-8">
          <div className="text-blue-400 text-sm font-medium mb-2">
            Question 1 of {QUICK_QUIZ_QUESTIONS.length}
          </div>
          <h2 className="text-3xl font-bold mb-4">{question.question}</h2>
          {question.subtitle && (
            <p className="text-gray-400 text-lg">{question.subtitle}</p>
          )}
        </div>

        {/* Options */}
        <div className="w-full space-y-4">
          {question.options.map((option, index) => (
            <motion.button
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => handleOptionSelect(option.value)}
              className="w-full p-6 text-left rounded-xl border-2 border-gray-700 bg-gray-800/50 hover:border-gray-600 hover:bg-gray-800 transition-all duration-200"
            >
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-6 h-6 rounded-full border-2 border-current flex items-center justify-center mt-1">
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
        </div>

        {/* Progress Indicator */}
        <div className="mt-8 w-full max-w-md">
          <div className="flex justify-between text-sm text-gray-400 mb-2">
            <span>Progress</span>
            <span>25%</span>
          </div>
          <div className="w-full bg-gray-800 rounded-full h-2">
            <motion.div
              className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: "25%" }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}