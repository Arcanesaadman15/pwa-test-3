import { useState } from "react";
import { SplashScreen } from "./SplashScreen";
import { ProblemSpotlight } from "./ProblemSpotlight";
import { QuickQuiz } from "./QuickQuiz";
import { LifestyleSliders } from "./LifestyleSliders";
import { PersonalizationToggles } from "./PersonalizationToggles";
import { ProgramPreview } from "./ProgramPreview";

interface OnboardingFlowProps {
  onComplete: () => void;
}

export function OnboardingFlow({ onComplete }: OnboardingFlowProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [onboardingData, setOnboardingData] = useState({
    activityLevel: '',
    timeCommitment: 30,
    stressLevel: 5,
    sleepQuality: 6,
    preferences: {
      morningPerson: true,
      outdoorActivities: false,
      socialActivities: true,
      highIntensity: false
    }
  });

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = () => {
    // Save onboarding data to storage
    localStorage.setItem('peakforge-onboarding-data', JSON.stringify(onboardingData));
    onComplete();
  };

  const updateOnboardingData = (data: Partial<typeof onboardingData>) => {
    setOnboardingData(prev => ({ ...prev, ...data }));
  };

  const steps = [
    { component: SplashScreen, showControls: false },
    { component: ProblemSpotlight, showControls: true },
    { component: QuickQuiz, showControls: true },
    { component: LifestyleSliders, showControls: true },
    { component: PersonalizationToggles, showControls: true },
    { component: ProgramPreview, showControls: false }
  ];

  const CurrentStepComponent = steps[currentStep].component;

  return (
    <div className="fixed inset-0 z-50 bg-white">
      <CurrentStepComponent
        onNext={handleNext}
        onPrevious={handlePrevious}
        onComplete={handleComplete}
        data={onboardingData}
        updateData={updateOnboardingData}
        currentStep={currentStep}
        totalSteps={steps.length}
        showControls={steps[currentStep].showControls}
      />
    </div>
  );
}
