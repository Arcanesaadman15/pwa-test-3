import { useState } from "react";
import { ProblemSpotlight } from "./ProblemSpotlight";
import { PersonalizationToggles } from "./PersonalizationToggles";
import { LifestyleSliders } from "./LifestyleSliders";
import { ProgramPreview } from "./ProgramPreview";

interface OnboardingFlowProps {
  onComplete: () => void;
}

export function OnboardingFlow({ onComplete }: OnboardingFlowProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [onboardingData, setOnboardingData] = useState({
    activityLevel: 'moderate',
    timeCommitment: 30,
    stressLevel: 3,
    sleepQuality: 3,
    preferences: {
      morningPerson: false,
      outdoorActivities: false,
      socialActivities: false,
      highIntensity: false
    }
  });

  const updateData = (newData: any) => {
    setOnboardingData(prev => ({ ...prev, ...newData }));
  };

  const nextStep = () => {
    setCurrentStep(prev => prev + 1);
  };

  const previousStep = () => {
    setCurrentStep(prev => prev - 1);
  };

  const totalSteps = 4;

  const steps = [
    <ProblemSpotlight key="problem" onComplete={nextStep} />,
    <PersonalizationToggles 
      key="personalization"
      onComplete={(preferences) => {
        updateData({ preferences });
        nextStep();
      }}
    />,
    <LifestyleSliders 
      key="lifestyle"
      onComplete={(lifestyleData) => {
        updateData(lifestyleData);
        nextStep();
      }}
    />,
    <ProgramPreview 
      key="preview"
      onComplete={onComplete}
      data={onboardingData}
    />
  ];

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {steps[currentStep]}
    </div>
  );
}