import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";

interface LifestyleSlidersProps {
  onNext: () => void;
  onPrevious: () => void;
  data: any;
  updateData: (data: any) => void;
  currentStep: number;
  totalSteps: number;
}

export function LifestyleSliders({ onNext, onPrevious, data, updateData, currentStep, totalSteps }: LifestyleSlidersProps) {
  const [timeCommitment, setTimeCommitment] = useState(data.timeCommitment || 30);
  const [stressLevel, setStressLevel] = useState(data.stressLevel || 5);
  const [sleepQuality, setSleepQuality] = useState(data.sleepQuality || 6);

  const formatTime = (minutes: number) => {
    if (minutes < 60) return `${minutes} min`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
  };

  const getStressLabel = (level: number) => {
    if (level <= 3) return 'Low';
    if (level <= 7) return 'Medium';
    return 'High';
  };

  const getSleepLabel = (level: number) => {
    if (level <= 3) return 'Poor';
    if (level <= 7) return 'Fair';
    return 'Excellent';
  };

  const handleContinue = () => {
    updateData({
      timeCommitment,
      stressLevel,
      sleepQuality
    });
    onNext();
  };

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
          <h2 className="text-2xl font-bold text-gray-900">Customize Your Experience</h2>
          <span className="text-sm text-gray-500">{currentStep} of {totalSteps}</span>
        </div>
        
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-primary h-2 rounded-full transition-all duration-300" 
            style={{ width: `${(currentStep / totalSteps) * 100}%` }}
          ></div>
        </div>
      </div>
      
      <div className="flex-1 space-y-8">
        <div>
          <label className="block text-lg font-medium mb-4">
            Daily Time Commitment
          </label>
          <Slider
            value={[timeCommitment]}
            onValueChange={(value) => setTimeCommitment(value[0])}
            max={120}
            min={15}
            step={15}
            className="w-full"
          />
          <div className="flex justify-between text-sm text-gray-600 mt-2">
            <span>15 min</span>
            <span className="font-medium">{formatTime(timeCommitment)}</span>
            <span>2+ hours</span>
          </div>
        </div>
        
        <div>
          <label className="block text-lg font-medium mb-4">
            Current Stress Level
          </label>
          <Slider
            value={[stressLevel]}
            onValueChange={(value) => setStressLevel(value[0])}
            max={10}
            min={1}
            step={1}
            className="w-full"
          />
          <div className="flex justify-between text-sm text-gray-600 mt-2">
            <span>Low</span>
            <span className="font-medium">{getStressLabel(stressLevel)}</span>
            <span>High</span>
          </div>
        </div>
        
        <div>
          <label className="block text-lg font-medium mb-4">
            Sleep Quality
          </label>
          <Slider
            value={[sleepQuality]}
            onValueChange={(value) => setSleepQuality(value[0])}
            max={10}
            min={1}
            step={1}
            className="w-full"
          />
          <div className="flex justify-between text-sm text-gray-600 mt-2">
            <span>Poor</span>
            <span className="font-medium">{getSleepLabel(sleepQuality)}</span>
            <span>Excellent</span>
          </div>
        </div>
      </div>
      
      <Button 
        onClick={handleContinue}
        className="w-full bg-primary text-white py-4 rounded-xl font-semibold text-lg"
      >
        Continue
      </Button>
    </div>
  );
}
