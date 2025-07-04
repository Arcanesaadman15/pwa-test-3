import { useState } from 'react';
import { motion } from 'framer-motion';
import { PERSONALIZATION_TOGGLES } from '@/data/onboardingData';
import { OptionCard, OptionTitle } from '@/components/ui/option-card';

interface PersonalizationTogglesProps {
  onComplete: (data: {
    circadianRhythm: 'morning' | 'evening';
    activityLocation: 'indoor' | 'outdoor';
    socialPreference: 'solo' | 'group';
    intensityApproach: 'high' | 'gentle';
  }) => void;
}

export function PersonalizationToggles({ onComplete }: PersonalizationTogglesProps) {
  const [preferences, setPreferences] = useState<Record<string, string>>({});
  const [currentToggle, setCurrentToggle] = useState(0);

  const handleToggleSelect = (toggleId: string, value: string) => {
    setPreferences(prev => ({ ...prev, [toggleId]: value }));
    
    // Auto-advance after selection
    setTimeout(() => {
      if (currentToggle < PERSONALIZATION_TOGGLES.length - 1) {
        setCurrentToggle(prev => prev + 1);
      } else {
        // All toggles completed
        onComplete(preferences as any);
      }
    }, 500);
  };

  const toggle = PERSONALIZATION_TOGGLES[currentToggle];
  const selectedValue = preferences[toggle.id];
  const progress = ((currentToggle + 1) / PERSONALIZATION_TOGGLES.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex flex-col">
      {/* Header */}
      <div className="pt-8 px-6">
        <div className="flex items-center justify-between mb-6">
          <div className="text-sm text-gray-400">
            {currentToggle + 1} of {PERSONALIZATION_TOGGLES.length}
          </div>
          <div className="text-sm text-gray-400">
            Personalization
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
      <div className="flex-1 flex flex-col justify-center px-6">
        <motion.div
          key={currentToggle}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          {/* Title */}
          <h1 className="text-3xl md:text-4xl font-bold mb-4 text-white">
            {toggle.title}
          </h1>
          
          {/* Description */}
          <p className="text-lg text-gray-300 max-w-md mx-auto mb-12">
            {toggle.description}
          </p>
        </motion.div>

        {/* Toggle Options */}
        <div className="space-y-6 max-w-lg mx-auto w-full">
          {/* Left option */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <OptionCard
              onClick={() => handleToggleSelect(toggle.id, toggle.leftValue)}
              isSelected={selectedValue === toggle.leftValue}
              isDisabled={false}
              index={0}
            >
              <div className="flex items-center space-x-4">
                <span className="text-3xl">{toggle.leftIcon}</span>
                <div>
                  <OptionTitle isSelected={selectedValue === toggle.leftValue}>
                    {toggle.leftLabel}
                  </OptionTitle>
                  <div className={`text-sm ${selectedValue === toggle.leftValue ? 'text-orange-200' : 'text-gray-400'}`}>
                    Choose this style
                  </div>
                </div>
              </div>
            </OptionCard>
          </motion.div>

          {/* VS indicator */}
          <div className="text-center py-2">
            <span className="text-gray-500 font-medium">VS</span>
          </div>

          {/* Right option */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            <OptionCard
              onClick={() => handleToggleSelect(toggle.id, toggle.rightValue)}
              isSelected={selectedValue === toggle.rightValue}
              isDisabled={false}
              index={1}
            >
              <div className="flex items-center space-x-4">
                <span className="text-3xl">{toggle.rightIcon}</span>
                <div>
                  <OptionTitle isSelected={selectedValue === toggle.rightValue}>
                    {toggle.rightLabel}
                  </OptionTitle>
                  <div className={`text-sm ${selectedValue === toggle.rightValue ? 'text-orange-200' : 'text-gray-400'}`}>
                    Choose this style
                  </div>
                </div>
              </div>
            </OptionCard>
          </motion.div>
        </div>

        {/* Help text */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-center mt-12"
        >
          <p className="text-sm text-gray-400">
            Select the approach that feels right for you
          </p>
        </motion.div>
      </div>

      {/* Progress indicators */}
      <div className="pb-8 px-6">
        <div className="flex justify-center space-x-2">
          {PERSONALIZATION_TOGGLES.map((_, index) => (
            <div
              key={index}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index < currentToggle
                  ? 'bg-green-500'
                  : index === currentToggle
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