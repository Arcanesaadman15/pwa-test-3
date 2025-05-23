import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { OnboardingData } from '@/data/onboardingData';
import { storage } from '@/lib/storage';

// Import all onboarding screens
import { SplashScreen } from '@/components/Onboarding/SplashScreen';
import { ProblemSpotlight } from '@/components/Onboarding/ProblemSpotlight';
import { QuickQuiz } from '@/components/Onboarding/QuickQuiz';
import { LifestyleSliders } from '@/components/Onboarding/LifestyleSliders';
import { PersonalizationToggles } from '@/components/Onboarding/PersonalizationToggles';
import { InstantDiagnosis } from '@/components/Onboarding/InstantDiagnosis';
import { RoadmapPreview } from '@/components/Onboarding/RoadmapPreview';
import { SocialProof } from '@/components/Onboarding/SocialProof';
import { Paywall } from '@/components/Onboarding/Paywall';

export type OnboardingStep = 
  | 'splash'
  | 'problems' 
  | 'quiz'
  | 'sliders'
  | 'toggles'
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
      'splash', 'problems', 'quiz', 'sliders', 'toggles', 
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
      const finalData: OnboardingData = {
        ...onboardingData,
        completedAt: new Date()
      } as OnboardingData;
      
      await storage.saveOnboardingData(finalData);
      await storage.setOnboardingComplete();
      onComplete(finalData);
    } catch (error) {
      console.error('Error completing onboarding:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePaywallSuccess = () => {
    handleComplete();
  };

  // Progress calculation for progress bar
  const getProgress = () => {
    const steps = ['splash', 'problems', 'quiz', 'sliders', 'toggles', 'diagnosis', 'roadmap', 'social', 'paywall'];
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
      {/* Progress Bar - Hidden on splash and paywall */}
      {currentStep !== 'splash' && currentStep !== 'paywall' && (
        <div className="fixed top-0 left-0 right-0 z-50">
          <div className="h-1 bg-gray-800">
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
        <AnimatePresence mode="wait" custom={1}>
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
            
            {currentStep === 'toggles' && (
              <PersonalizationToggles 
                onComplete={(data) => {
                  updateOnboardingData(data);
                  goToNextStep();
                }}
              />
            )}
            
            {currentStep === 'diagnosis' && (
              <InstantDiagnosis 
                data={onboardingData}
                onComplete={(data) => {
                  updateOnboardingData(data);
                  goToNextStep();
                }}
              />
            )}
            
            {currentStep === 'roadmap' && (
              <RoadmapPreview 
                data={onboardingData}
                onComplete={goToNextStep}
              />
            )}
            
            {currentStep === 'social' && (
              <SocialProof onComplete={goToNextStep} />
            )}
            
            {currentStep === 'paywall' && (
              <Paywall 
                data={onboardingData}
                onSuccess={handlePaywallSuccess}
                isLoading={isLoading}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}