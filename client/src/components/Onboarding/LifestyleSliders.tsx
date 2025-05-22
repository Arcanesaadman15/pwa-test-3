import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, Clock, Gauge, Bed, Activity } from "lucide-react";

interface LifestyleSlidersProps {
  onNext: () => void;
  onPrevious: () => void;
  data: any;
  updateData: (data: any) => void;
  currentStep: number;
  totalSteps: number;
}

export function LifestyleSliders({ 
  onNext, 
  onPrevious, 
  data, 
  updateData, 
  currentStep, 
  totalSteps 
}: LifestyleSlidersProps) {
  const sliders = [
    {
      id: 'timeCommitment',
      icon: Clock,
      title: 'Daily Time Commitment',
      description: 'How many minutes per day can you dedicate?',
      value: data.timeCommitment || 30,
      min: 15,
      max: 90,
      step: 15,
      unit: 'min',
      color: 'purple'
    },
    {
      id: 'stressLevel',
      icon: Gauge,
      title: 'Current Stress Level',
      description: 'Rate your typical daily stress (1-5)',
      value: data.stressLevel || 3,
      min: 1,
      max: 5,
      step: 1,
      unit: '/5',
      color: 'orange'
    },
    {
      id: 'sleepQuality',
      icon: Bed,
      title: 'Sleep Quality',
      description: 'How well do you typically sleep? (1-5)',
      value: data.sleepQuality || 3,
      min: 1,
      max: 5,
      step: 1,
      unit: '/5',
      color: 'blue'
    }
  ];

  const activityLevels = [
    { id: 'low', label: 'Beginner', description: 'Just starting out', icon: '🌱' },
    { id: 'moderate', label: 'Moderate', description: 'Some experience', icon: '⚡' },
    { id: 'high', label: 'Active', description: 'Regular exerciser', icon: '🔥' }
  ];

  const updateSlider = (id: string, value: number) => {
    updateData({ [id]: value });
  };

  const updateActivityLevel = (level: string) => {
    updateData({ activityLevel: level });
  };

  const getColorClasses = (color: string) => {
    const colors = {
      purple: { bg: 'bg-purple-600', slider: 'accent-purple-500' },
      orange: { bg: 'bg-orange-600', slider: 'accent-orange-500' },
      blue: { bg: 'bg-blue-600', slider: 'accent-blue-500' }
    };
    return colors[color as keyof typeof colors] || colors.purple;
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col">
      {/* Header */}
      <div className="bg-gradient-to-br from-purple-900 via-indigo-800 to-blue-800 px-6 pt-16 pb-12">
        <div className="flex items-center gap-4 mb-6">
          <Button
            onClick={onPrevious}
            className="bg-white/10 hover:bg-white/20 text-white border border-white/20 p-2"
            size="sm"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div className="flex-1">
            <div className="text-sm text-purple-200 mb-1">
              Step {currentStep} of {totalSteps}
            </div>
            <div className="w-full bg-purple-800 rounded-full h-1">
              <div 
                className="bg-purple-300 h-1 rounded-full transition-all duration-300"
                style={{ width: `${(currentStep / totalSteps) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>
        
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white mb-4">
            Your Lifestyle
          </h1>
          <p className="text-xl text-purple-200 leading-relaxed">
            Help us understand your current situation
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 px-6 py-8 space-y-8">
        {/* Activity Level */}
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <Activity className="w-5 h-5 text-green-400" />
            Activity Level
          </h3>
          <div className="grid grid-cols-3 gap-3">
            {activityLevels.map((level) => (
              <div 
                key={level.id}
                onClick={() => updateActivityLevel(level.id)}
                className={`p-4 rounded-2xl border-2 transition-all cursor-pointer text-center ${
                  data.activityLevel === level.id 
                    ? 'border-green-500 bg-green-900/30' 
                    : 'border-gray-700 bg-gray-800 hover:border-gray-600'
                }`}
              >
                <div className="text-2xl mb-2">{level.icon}</div>
                <h4 className="font-bold text-white text-sm mb-1">{level.label}</h4>
                <p className="text-gray-400 text-xs">{level.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Sliders */}
        <div className="space-y-6">
          {sliders.map((slider) => {
            const colors = getColorClasses(slider.color);
            return (
              <div key={slider.id} className="bg-gray-800 rounded-2xl p-6 border border-gray-700">
                <div className="flex items-center gap-3 mb-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${colors.bg}`}>
                    <slider.icon className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-white">{slider.title}</h3>
                    <p className="text-gray-400 text-sm">{slider.description}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-white">
                      {slider.value}{slider.unit}
                    </div>
                  </div>
                </div>
                
                <div className="mt-4">
                  <input
                    type="range"
                    min={slider.min}
                    max={slider.max}
                    step={slider.step}
                    value={slider.value}
                    onChange={(e) => updateSlider(slider.id, parseInt(e.target.value))}
                    className={`w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer ${colors.slider}`}
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>{slider.min}{slider.unit}</span>
                    <span>{slider.max}{slider.unit}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Summary */}
        <div className="bg-gradient-to-r from-indigo-900/50 to-purple-900/50 rounded-2xl p-6 border border-indigo-500/30">
          <h3 className="text-lg font-bold text-white mb-3">
            📊 Your Profile Summary
          </h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-400">Activity:</span>
              <span className="text-white ml-2 font-medium capitalize">{data.activityLevel || 'moderate'}</span>
            </div>
            <div>
              <span className="text-gray-400">Time:</span>
              <span className="text-white ml-2 font-medium">{data.timeCommitment || 30} min/day</span>
            </div>
            <div>
              <span className="text-gray-400">Stress:</span>
              <span className="text-white ml-2 font-medium">{data.stressLevel || 3}/5</span>
            </div>
            <div>
              <span className="text-gray-400">Sleep:</span>
              <span className="text-white ml-2 font-medium">{data.sleepQuality || 3}/5</span>
            </div>
          </div>
        </div>
      </div>

      {/* Action Button */}
      <div className="px-6 pb-8">
        <Button
          onClick={onNext}
          className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white py-4 rounded-2xl text-lg font-medium"
        >
          Create My Program
          <ArrowRight className="w-5 h-5 ml-2" />
        </Button>
      </div>
    </div>
  );
}