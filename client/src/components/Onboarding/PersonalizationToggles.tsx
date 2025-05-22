import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";

interface PersonalizationTogglesProps {
  onNext: () => void;
  onPrevious: () => void;
  data: any;
  updateData: (data: any) => void;
  currentStep: number;
  totalSteps: number;
}

export function PersonalizationToggles({ onNext, onPrevious, data, updateData, currentStep, totalSteps }: PersonalizationTogglesProps) {
  const [preferences, setPreferences] = useState(data.preferences || {
    morningPerson: true,
    outdoorActivities: false,
    socialActivities: true,
    highIntensity: false
  });

  const updatePreference = (key: string, value: boolean) => {
    const newPreferences = { ...preferences, [key]: value };
    setPreferences(newPreferences);
  };

  const handleContinue = () => {
    updateData({ preferences });
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
          <h2 className="text-2xl font-bold text-gray-900">Your Preferences</h2>
          <span className="text-sm text-gray-500">{currentStep} of {totalSteps}</span>
        </div>
        
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-primary h-2 rounded-full transition-all duration-300" 
            style={{ width: `${(currentStep / totalSteps) * 100}%` }}
          ></div>
        </div>
      </div>
      
      <div className="flex-1 space-y-6">
        <div className="flex items-center justify-between p-4 bg-white rounded-xl shadow-sm">
          <div className="flex items-center space-x-3">
            <i className="fas fa-sun text-orange-500"></i>
            <div>
              <div className="font-medium">Morning Person</div>
              <div className="text-sm text-gray-600">Prefer morning activities</div>
            </div>
          </div>
          <Switch
            checked={preferences.morningPerson}
            onCheckedChange={(checked) => updatePreference('morningPerson', checked)}
          />
        </div>
        
        <div className="flex items-center justify-between p-4 bg-white rounded-xl shadow-sm">
          <div className="flex items-center space-x-3">
            <i className="fas fa-tree text-green-500"></i>
            <div>
              <div className="font-medium">Outdoor Activities</div>
              <div className="text-sm text-gray-600">Prefer outdoor exercises</div>
            </div>
          </div>
          <Switch
            checked={preferences.outdoorActivities}
            onCheckedChange={(checked) => updatePreference('outdoorActivities', checked)}
          />
        </div>
        
        <div className="flex items-center justify-between p-4 bg-white rounded-xl shadow-sm">
          <div className="flex items-center space-x-3">
            <i className="fas fa-users text-blue-500"></i>
            <div>
              <div className="font-medium">Social Activities</div>
              <div className="text-sm text-gray-600">Enjoy group activities</div>
            </div>
          </div>
          <Switch
            checked={preferences.socialActivities}
            onCheckedChange={(checked) => updatePreference('socialActivities', checked)}
          />
        </div>
        
        <div className="flex items-center justify-between p-4 bg-white rounded-xl shadow-sm">
          <div className="flex items-center space-x-3">
            <i className="fas fa-bolt text-yellow-500"></i>
            <div>
              <div className="font-medium">High Intensity</div>
              <div className="text-sm text-gray-600">Prefer challenging workouts</div>
            </div>
          </div>
          <Switch
            checked={preferences.highIntensity}
            onCheckedChange={(checked) => updatePreference('highIntensity', checked)}
          />
        </div>
      </div>
      
      <Button 
        onClick={handleContinue}
        className="w-full bg-primary text-white py-4 rounded-xl font-semibold text-lg"
      >
        Start My Journey
      </Button>
    </div>
  );
}
