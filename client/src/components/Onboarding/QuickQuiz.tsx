import { useState } from "react";
import { Button } from "@/components/ui/button";

interface QuickQuizProps {
  onNext: () => void;
  onPrevious: () => void;
  data: any;
  updateData: (data: any) => void;
  currentStep: number;
  totalSteps: number;
}

export function QuickQuiz({ onNext, onPrevious, data, updateData, currentStep, totalSteps }: QuickQuizProps) {
  const [selectedActivity, setSelectedActivity] = useState(data.activityLevel || '');

  const handleOptionSelect = (value: string) => {
    setSelectedActivity(value);
    updateData({ activityLevel: value });
  };

  const canContinue = selectedActivity !== '';

  return (
    <div className="p-6 min-h-screen flex flex-col">
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <button 
            onClick={onPrevious}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <i className="fas fa-arrow-left text-gray-600"></i>
          </button>
          <h2 className="text-2xl font-bold text-gray-900">Quick Assessment</h2>
          <span className="text-sm text-gray-500">{currentStep} of {totalSteps}</span>
        </div>
        
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-primary h-2 rounded-full transition-all duration-300" 
            style={{ width: `${(currentStep / totalSteps) * 100}%` }}
          ></div>
        </div>
      </div>
      
      <div className="flex-1">
        <h3 className="text-xl font-semibold mb-6">
          How would you describe your current activity level?
        </h3>
        
        <div className="space-y-3">
          {[
            {
              value: 'sedentary',
              title: 'Mostly sedentary',
              description: 'Desk job, minimal exercise'
            },
            {
              value: 'light',
              title: 'Lightly active',
              description: 'Some walking, occasional exercise'
            },
            {
              value: 'moderate',
              title: 'Moderately active',
              description: 'Regular exercise 2-3 times per week'
            },
            {
              value: 'very',
              title: 'Very active',
              description: 'Daily exercise, athletic lifestyle'
            }
          ].map((option) => (
            <button
              key={option.value}
              onClick={() => handleOptionSelect(option.value)}
              className={`w-full p-4 text-left border-2 rounded-xl transition-all ${
                selectedActivity === option.value
                  ? 'border-primary bg-primary/5'
                  : 'border-gray-200 hover:border-primary/50'
              }`}
            >
              <div className="font-medium">{option.title}</div>
              <div className="text-sm text-gray-600">{option.description}</div>
            </button>
          ))}
        </div>
      </div>
      
      <Button 
        onClick={onNext}
        disabled={!canContinue}
        className="w-full bg-primary text-white py-4 rounded-xl font-semibold text-lg disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Continue
      </Button>
    </div>
  );
}
