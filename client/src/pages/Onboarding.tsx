import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { OnboardingData } from '@/data/onboardingData';
import { storage } from '@/lib/storage';
import { useAuth } from '@/contexts/AuthContext';
import { analytics } from '@/lib/analytics';

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
  // Removed unused loading state
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

  // Track step viewed
  useEffect(() => {
    const steps: OnboardingStep[] = [
      'splash', 'problems', 'quiz', 'sliders', 'commitment', 
      'diagnosis', 'roadmap', 'social', 'paywall', 'complete'
    ];
    const currentIndex = steps.indexOf(currentStep);
    
    analytics.track('onboarding_step_viewed', { 
      step: currentStep, 
      progress: getProgress(),
      step_index: currentIndex,
      total_steps: steps.length - 1 // exclude 'complete'
    });
    
    if (currentStep === 'paywall') {
      analytics.track('paywall_viewed');
    }
  }, [currentStep]);

  // Track onboarding abandonment when component unmounts
  useEffect(() => {
    return () => {
      // Only track abandonment if not completed
      if (currentStep !== 'complete') {
        const steps: OnboardingStep[] = [
          'splash', 'problems', 'quiz', 'sliders', 'commitment', 
          'diagnosis', 'roadmap', 'social', 'paywall', 'complete'
        ];
        const currentIndex = steps.indexOf(currentStep);
        
        analytics.track('onboarding_abandoned', { 
          abandoned_at_step: currentStep,
          progress: getProgress(),
          step_index: currentIndex,
          steps_completed: currentIndex
        });
      }
    };
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
    
    // Track step completion before advancing
    analytics.track('onboarding_step_completed', { 
      step: currentStep, 
      progress: getProgress(),
      step_index: currentIndex,
      next_step: currentIndex < steps.length - 1 ? steps[currentIndex + 1] : 'complete'
    });
    
    if (currentIndex < steps.length - 1) {
      setCurrentStep(steps[currentIndex + 1]);
    }
  };

  const handleComplete = async () => {
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
      await updateProfile({ onboarding_complete: true });
      
      onComplete(cleanData);
      analytics.track('onboarding_completed', {
        primaryGoal: onboardingData.primaryGoal,
        recommendedProgram: onboardingData.recommendedProgram,
        total_steps: 9, // excluding splash and complete
        completion_time_minutes: Math.round((Date.now() - (cleanData.completedAt?.getTime() || Date.now())) / 60000),
        final_progress: 100
      });
    } catch (error) {
      // Handle onboarding completion error
    } finally {
    }
  };

  const handlePaywallSuccess = () => {
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
    <div className="min-h-screen bg-gray-900 text-white">
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

      {/* Screen Container with proper scrolling */}
      <div className="relative w-full min-h-screen">
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
            className="w-full min-h-screen"
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
                onComplete={(dataWithProgram) => {
                  if (dataWithProgram) {
                    updateOnboardingData(dataWithProgram);
                  }
                  goToNextStep();
                }}
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