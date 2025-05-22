import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, Sun, Trees, Users, Zap } from "lucide-react";

interface PersonalizationTogglesProps {
  onNext: () => void;
  onPrevious: () => void;
  data: any;
  updateData: (data: any) => void;
  currentStep: number;
  totalSteps: number;
}

export function PersonalizationToggles({ 
  onNext, 
  onPrevious, 
  data, 
  updateData, 
  currentStep, 
  totalSteps 
}: PersonalizationTogglesProps) {
  const preferences = [
    {
      id: 'morningPerson',
      icon: Sun,
      title: 'Morning Person',
      description: 'I prefer morning workouts and early starts',
      value: data.preferences?.morningPerson || false
    },
    {
      id: 'outdoorActivities',
      icon: Trees,
      title: 'Outdoor Activities',
      description: 'I enjoy exercising outside when possible',
      value: data.preferences?.outdoorActivities || false
    },
    {
      id: 'socialActivities',
      icon: Users,
      title: 'Social Activities',
      description: 'I like group activities and accountability',
      value: data.preferences?.socialActivities || false
    },
    {
      id: 'highIntensity',
      icon: Zap,
      title: 'High Intensity',
      description: 'I enjoy challenging, intense workouts',
      value: data.preferences?.highIntensity || false
    }
  ];

  const togglePreference = (id: string) => {
    updateData({
      preferences: {
        ...data.preferences,
        [id]: !data.preferences?.[id]
      }
    });
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col">
      {/* Header */}
      <div className="bg-gradient-to-br from-green-900 via-teal-800 to-blue-800 px-6 pt-16 pb-12">
        <div className="flex items-center gap-4 mb-6">
          <Button
            onClick={onPrevious}
            className="bg-white/10 hover:bg-white/20 text-white border border-white/20 p-2"
            size="sm"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div className="flex-1">
            <div className="text-sm text-teal-200 mb-1">
              Step {currentStep} of {totalSteps}
            </div>
            <div className="w-full bg-teal-800 rounded-full h-1">
              <div 
                className="bg-teal-300 h-1 rounded-full transition-all duration-300"
                style={{ width: `${(currentStep / totalSteps) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>
        
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white mb-4">
            Your Preferences
          </h1>
          <p className="text-xl text-teal-200 leading-relaxed">
            Tell us what you enjoy to personalize your experience
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 px-6 py-8 space-y-6">
        {/* Preference Cards */}
        <div className="space-y-4">
          {preferences.map((preference) => (
            <div 
              key={preference.id}
              onClick={() => togglePreference(preference.id)}
              className={`p-6 rounded-2xl border-2 transition-all cursor-pointer ${
                preference.value 
                  ? 'border-teal-500 bg-teal-900/30' 
                  : 'border-gray-700 bg-gray-800 hover:border-gray-600'
              }`}
            >
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                  preference.value ? 'bg-teal-600' : 'bg-gray-700'
                }`}>
                  <preference.icon className="w-6 h-6 text-white" />
                </div>
                
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-white mb-1">
                    {preference.title}
                  </h3>
                  <p className="text-gray-400 text-sm">
                    {preference.description}
                  </p>
                </div>
                
                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                  preference.value 
                    ? 'border-teal-500 bg-teal-500' 
                    : 'border-gray-500'
                }`}>
                  {preference.value && (
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Info Box */}
        <div className="bg-blue-900/20 rounded-2xl p-6 border border-blue-500/30">
          <h3 className="text-lg font-bold text-blue-400 mb-2">
            💡 Personalization Benefits
          </h3>
          <p className="text-blue-200 text-sm leading-relaxed">
            Your preferences help us recommend the best tasks and timing for your lifestyle. 
            You can always change these later in your profile settings.
          </p>
        </div>
      </div>

      {/* Action Button */}
      <div className="px-6 pb-8">
        <Button
          onClick={onNext}
          className="w-full bg-gradient-to-r from-teal-600 to-blue-600 hover:from-teal-700 hover:to-blue-700 text-white py-4 rounded-2xl text-lg font-medium"
        >
          Continue
          <ArrowRight className="w-5 h-5 ml-2" />
        </Button>
      </div>
    </div>
  );
}