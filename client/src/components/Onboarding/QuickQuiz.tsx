import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { QUICK_QUIZ_QUESTIONS } from '@/data/onboardingData';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface QuickQuizProps {
  onComplete: (data: {
    name: string;
    email: string;
    ageRange: string;
    sleepQuality: string; 
    exerciseFrequency: string;
    primaryGoal: string;
  }) => void;
}

export function QuickQuiz({ onComplete }: QuickQuizProps) {
  const [showPersonalInfo, setShowPersonalInfo] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
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
        // Quiz completed - include name, email, and all answers
        onComplete({
          name,
          email,
          ageRange: newAnswers.ageRange || '',
          sleepQuality: newAnswers.sleepQuality || '',
          exerciseFrequency: newAnswers.exerciseFrequency || '',
          primaryGoal: newAnswers.primaryGoal || ''
        });
      }
    }, 300);
  };

  const handlePersonalInfoComplete = () => {
    if (name.trim() && email.trim()) {
      setShowPersonalInfo(false);
    }
  };

  // Show personal info form first
  if (showPersonalInfo) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex flex-col">
        {/* Header */}
        <div className="pt-8 px-6">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-white mb-2">Let's get started!</h2>
            <p className="text-gray-400">First, tell us a bit about yourself</p>
          </div>
        </div>

        {/* Personal Info Form */}
        <div className="flex-1 flex flex-col justify-center px-6 pb-20">
          <div className="max-w-md mx-auto w-full space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-white font-medium">
                What's your name? *
              </Label>
              <Input
                id="name"
                type="text"
                placeholder="Enter your first name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="bg-gray-800 border-gray-700 text-white placeholder-gray-400 focus:border-blue-500"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-white font-medium">
                Email address *
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-gray-800 border-gray-700 text-white placeholder-gray-400 focus:border-blue-500"
              />
            </div>

            <Button
              onClick={handlePersonalInfoComplete}
              disabled={!name.trim() || !email.trim()}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 py-3 text-lg font-semibold"
            >
              Start Quick Assessment →
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const progress = ((currentQuestion + 1) / QUICK_QUIZ_QUESTIONS.length) * 100;
  const question = QUICK_QUIZ_QUESTIONS[currentQuestion];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex flex-col">
      {/* Header with progress */}
      <div className="pt-8 px-6">
        <div className="flex items-center justify-between mb-6">
          <div className="text-sm text-gray-400">
            Question {currentQuestion + 1} of {QUICK_QUIZ_QUESTIONS.length}
          </div>
          <div className="text-sm text-gray-400">
            {Math.round(progress)}% complete
          </div>
        </div>
        
        {/* Progress bar */}
        <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-blue-500 to-purple-600"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          />
        </div>
      </div>

      {/* Question content */}
      <div className="flex-1 flex flex-col justify-center px-6 pb-20">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestion}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="text-center mb-12"
          >
            {/* Question */}
            <h1 className="text-3xl font-bold text-white mb-4 leading-tight">
              {question.question}
            </h1>
            
            {/* Subtitle */}
            <p className="text-lg text-gray-400 max-w-md mx-auto">
              {question.subtitle}
            </p>
          </motion.div>
        </AnimatePresence>

        {/* Options */}
        <div className="space-y-4 max-w-lg mx-auto w-full">
          <AnimatePresence mode="wait">
            {question.options.map((option, index) => (
              <motion.div
                key={`${currentQuestion}-${option.value}`}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ 
                  delay: index * 0.1,
                  duration: 0.4,
                  ease: "easeOut"
                }}
              >
                <Button
                  onClick={() => handleOptionSelect(option.value)}
                  variant="outline"
                  className={`w-full p-6 text-left border-2 transition-all duration-200 ${
                    selectedOption === option.value
                      ? 'border-blue-500 bg-blue-500/10 text-white scale-105'
                      : 'border-gray-600 bg-gray-800/50 hover:border-gray-500 hover:bg-gray-700/50 text-gray-200'
                  }`}
                >
                  <div className="flex flex-col">
                    <span className="font-semibold text-lg mb-1">
                      {option.label}
                    </span>
                    <span className="text-sm text-gray-400">
                      {option.subtitle}
                    </span>
                  </div>
                </Button>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Help text */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-center mt-12"
        >
          <p className="text-sm text-gray-500">
            Choose the option that best describes you
          </p>
        </motion.div>
      </div>

      {/* Question indicators */}
      <div className="pb-8 px-6">
        <div className="flex justify-center space-x-2">
          {QUICK_QUIZ_QUESTIONS.map((_, index) => (
            <div
              key={index}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index < currentQuestion
                  ? 'bg-green-500'
                  : index === currentQuestion
                  ? 'bg-blue-500 scale-125'
                  : 'bg-gray-600'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}