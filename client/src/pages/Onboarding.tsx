import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { OnboardingData } from '@/data/onboardingData';
import { storage } from '@/lib/storage';
import { useAuth } from '@/contexts/AuthContext';

// Import all onboarding screens
import { SplashScreen } from '@/components/Onboarding/SplashScreen';
import { ProblemSpotlight } from '@/components/Onboarding/ProblemSpotlight';
import { QuickQuiz } from '@/components/Onboarding/QuickQuiz';
import { LifestyleSliders } from '@/components/Onboarding/LifestyleSliders';
import { CommitmentQuestions } from '@/components/Onboarding/CommitmentQuestions';
import { InstantDiagnosis } from '@/components/Onboarding/InstantDiagnosis';
import { RoadmapPreview } from '@/components/Onboarding/RoadmapPreview';
import { SocialProof } from '@/components/Onboarding/SocialProof';
import { Paywall } from '@/components/Onboarding/Paywall';

export type OnboardingStep = 
  | 'splash'
  | 'problems' 
  | 'quiz'
  | 'sliders'
  | 'commitment'
  | 'diagnosis'
  | 'roadmap'
  | 'social'
  | 'paywall'
  | 'complete';

interface OnboardingProps {
  onComplete: (data: OnboardingData) => void;
}

export default function Onboarding({ onComplete }: OnboardingProps) {
  const [currentStep, setCurrentStep] = useState<OnboardingStep>('splash');
  const [onboardingData, setOnboardingData] = useState<Partial<OnboardingData>>({});
  const [isLoading, setIsLoading] = useState(false);
  const { updateProfile } = useAuth();

  // Auto-advance from splash screen
  useEffect(() => {
    if (currentStep === 'splash') {
      const timer = setTimeout(() => {
        setCurrentStep('problems');
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [currentStep]);

  const updateOnboardingData = (newData: Partial<OnboardingData>) => {
    setOnboardingData(prev => ({ ...prev, ...newData }));
  };

  const goToNextStep = () => {
    const steps: OnboardingStep[] = [
      'splash', 'problems', 'quiz', 'sliders', 'commitment', 
      'diagnosis', 'roadmap', 'social', 'paywall', 'complete'
    ];
    
    const currentIndex = steps.indexOf(currentStep);
    if (currentIndex < steps.length - 1) {
      setCurrentStep(steps[currentIndex + 1]);
    }
  };

  const handleComplete = async () => {
    setIsLoading(true);
    try {
      // Clean the data to remove any circular references
      const cleanData = {
        ageRange: onboardingData.ageRange,
        sleepQuality: onboardingData.sleepQuality,
        exerciseFrequency: onboardingData.exerciseFrequency,
        primaryGoal: onboardingData.primaryGoal,
        waistCircumference: onboardingData.waistCircumference,
        stressLevel: onboardingData.stressLevel,
        dailySteps: onboardingData.dailySteps,
        // Note: No longer saving meaningless personalization data
        recommendedProgram: onboardingData.recommendedProgram,
        completedAt: new Date()
      } as OnboardingData;
      
      // Save to localStorage for backup
      await storage.saveOnboardingData(cleanData);
      await storage.setOnboardingComplete();
      
      // Most importantly: Update the user profile to mark onboarding as complete
      console.log('🎯 Onboarding completed, updating user profile...');
      await updateProfile({ onboarding_complete: true });
      
      onComplete(cleanData);
    } catch (error) {
      console.error('Error completing onboarding:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePaywallSuccess = () => {
    console.log('🎉 Paywall success triggered!');
    console.log('📊 Current onboarding data:', onboardingData);
    handleComplete();
  };

  // Progress calculation for progress bar
  const getProgress = () => {
    const steps = ['splash', 'problems', 'quiz', 'sliders', 'commitment', 'diagnosis', 'roadmap', 'social', 'paywall'];
    const currentIndex = steps.indexOf(currentStep);
    return ((currentIndex + 1) / steps.length) * 100;
  };

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? '100%' : '-100%',
      opacity: 0
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? '100%' : '-100%',
      opacity: 0
    })
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white overflow-hidden">
      {/* Progress Bar - Only show during data collection steps */}
      {!['splash', 'paywall'].includes(currentStep) && (
        <div className="fixed top-0 left-0 right-0 z-50">
          <div className="h-1 bg-gray-800/50">
            <motion.div
              className="h-full bg-gradient-to-r from-blue-500 to-purple-600"
              initial={{ width: 0 }}
              animate={{ width: `${getProgress()}%` }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            />
          </div>
        </div>
      )}

      {/* Screen Container */}
      <div className="relative w-full h-screen">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            custom={1}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: "spring", stiffness: 300, damping: 30 },
              opacity: { duration: 0.2 }
            }}
            className="absolute inset-0"
          >
            {currentStep === 'splash' && (
              <SplashScreen onComplete={goToNextStep} />
            )}
            
            {currentStep === 'problems' && (
              <ProblemSpotlight onComplete={goToNextStep} />
            )}
            
            {currentStep === 'quiz' && (
              <QuickQuiz 
                onComplete={(data) => {
                  updateOnboardingData(data);
                  goToNextStep();
                }}
              />
            )}
            
            {currentStep === 'sliders' && (
              <LifestyleSliders 
                onComplete={(data) => {
                  updateOnboardingData(data);
                  goToNextStep();
                }}
              />
            )}
            
            {currentStep === 'commitment' && (
              <CommitmentQuestions 
                onComplete={(data) => {
                  updateOnboardingData(data);
                  goToNextStep();
                }}
              />
            )}
            
            {currentStep === 'diagnosis' && (
              <InstantDiagnosis 
                data={onboardingData}
                onComplete={goToNextStep}
              />
            )}
            
            {currentStep === 'roadmap' && (
              <RoadmapPreview 
                onComplete={goToNextStep}
              />
            )}
            
            {currentStep === 'social' && (
              <SocialProof onComplete={goToNextStep} />
            )}
            
            {currentStep === 'paywall' && (
              <Paywall 
                onComplete={handlePaywallSuccess} 
                onboardingData={onboardingData}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}