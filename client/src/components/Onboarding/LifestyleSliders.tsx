import { useState } from 'react';
import { motion } from 'framer-motion';
import { LIFESTYLE_SLIDERS } from '@/data/onboardingData';
import { Button } from '@/components/ui/button';

interface LifestyleSlidersProps {
  onComplete: (data: {
    waistCircumference: number;
    stressLevel: number;
    dailySteps: number;
  }) => void;
}

export function LifestyleSliders({ onComplete }: LifestyleSlidersProps) {
  const [values, setValues] = useState<Record<string, number>>({
    waistCircumference: 34,
    stressLevel: 5,
    dailySteps: 5000
  });

  const [currentSlider, setCurrentSlider] = useState(0);

  const handleSliderChange = (sliderId: string, value: number) => {
    setValues(prev => ({ ...prev, [sliderId]: value }));
  };

  const goNext = () => {
    if (currentSlider < LIFESTYLE_SLIDERS.length - 1) {
      setCurrentSlider(prev => prev + 1);
    } else {
      onComplete(values as any);
    }
  };

  const goBack = () => {
    if (currentSlider > 0) {
      setCurrentSlider(prev => prev - 1);
    }
  };

  const slider = LIFESTYLE_SLIDERS[currentSlider];
  const currentValue = values[slider.id] || slider.default;
  const progress = ((currentSlider + 1) / LIFESTYLE_SLIDERS.length) * 100;

  // Get color based on value for stress level
  const getSliderColor = () => {
    if (slider.id === 'stressLevel') {
      if (currentValue <= 3) return 'from-green-500 to-blue-500';
      if (currentValue <= 6) return 'from-yellow-500 to-orange-500';
      return 'from-orange-500 to-red-500';
    }
    return slider.gradient;
  };

  const getValueDescription = () => {
    if (slider.id === 'waistCircumference') {
      if (currentValue <= 32) return 'Lean physique';
      if (currentValue <= 36) return 'Average build';
      if (currentValue <= 40) return 'Above average';
      return 'Higher body fat';
    }
    
    if (slider.id === 'stressLevel') {
      if (currentValue <= 3) return 'Low stress - great for T levels';
      if (currentValue <= 6) return 'Moderate stress';
      if (currentValue <= 8) return 'High stress - needs attention';
      return 'Very high stress - major concern';
    }
    
    if (slider.id === 'dailySteps') {
      if (currentValue <= 3000) return 'Sedentary lifestyle';
      if (currentValue <= 7000) return 'Lightly active';
      if (currentValue <= 10000) return 'Moderately active';
      return 'Very active';
    }
    
    return '';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex flex-col">
      {/* Header */}
      <div className="pt-8 px-6">
        <div className="flex items-center justify-between mb-6">
          <div className="text-sm text-gray-400">
            {currentSlider + 1} of {LIFESTYLE_SLIDERS.length}
          </div>
          <div className="text-sm text-gray-400">
            Baseline Assessment
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

      {/* Main content */}
      <div className="flex-1 flex flex-col justify-center px-6 py-12">
        <motion.div
          key={currentSlider}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          {/* Icon */}
          <div className={`w-24 h-24 rounded-full bg-gradient-to-br ${getSliderColor()} 
                         flex items-center justify-center mx-auto mb-8 shadow-2xl`}>
            <span className="text-4xl">{slider.icon}</span>
          </div>

          {/* Title */}
          <h1 className="text-3xl font-bold text-white mb-4">
            {slider.title}
          </h1>
          
          {/* Subtitle */}
          <p className="text-lg text-gray-400 max-w-md mx-auto mb-8">
            {slider.subtitle}
          </p>

          {/* Current value display */}
          <div className="mb-12">
            <div className="text-5xl font-bold text-white mb-2">
              {currentValue}
              <span className="text-2xl text-gray-400 ml-2">{slider.unit}</span>
            </div>
            <div className="text-lg text-gray-400">
              {getValueDescription()}
            </div>
          </div>
        </motion.div>

        {/* Slider */}
        <div className="max-w-lg mx-auto w-full">
          <div className="relative">
            {/* Slider track */}
            <div className="w-full h-3 bg-gray-700 rounded-full relative overflow-hidden">
              {/* Active track */}
              <motion.div
                className={`h-full bg-gradient-to-r ${getSliderColor()} rounded-full`}
                style={{ 
                  width: `${((currentValue - slider.min) / (slider.max - slider.min)) * 100}%` 
                }}
                transition={{ duration: 0.2 }}
              />
            </div>
            
            {/* Slider thumb */}
            <motion.div
              className="absolute top-1/2 transform -translate-y-1/2 w-8 h-8 bg-white rounded-full shadow-xl border-4 border-gray-900 cursor-pointer"
              style={{ 
                left: `${((currentValue - slider.min) / (slider.max - slider.min)) * 100}%`,
                marginLeft: '-16px'
              }}
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
            />
            
            {/* Hidden input for accessibility */}
            <input
              type="range"
              min={slider.min}
              max={slider.max}
              value={currentValue}
              onChange={(e) => handleSliderChange(slider.id, parseInt(e.target.value))}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
          </div>
          
          {/* Min/Max labels */}
          <div className="flex justify-between mt-4 text-sm text-gray-500">
            <span>{slider.min}{slider.unit}</span>
            <span>{slider.max}{slider.unit}</span>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="px-6 pb-8">
        <div className="flex justify-between items-center">
          <Button
            onClick={goBack}
            variant="outline"
            disabled={currentSlider === 0}
            className="px-6 py-3"
          >
            Back
          </Button>
          
          <div className="flex space-x-2">
            {LIFESTYLE_SLIDERS.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index < currentSlider
                    ? 'bg-green-500'
                    : index === currentSlider
                    ? 'bg-blue-500 scale-125'
                    : 'bg-gray-600'
                }`}
              />
            ))}
          </div>

          <Button
            onClick={goNext}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 px-6 py-3"
          >
            {currentSlider === LIFESTYLE_SLIDERS.length - 1 ? 'Continue' : 'Next'}
          </Button>
        </div>
      </div>
    </div>
  );
}