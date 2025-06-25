import { Button } from "@/components/ui/button";

interface ProgramPreviewProps {
  onComplete: () => void;
  data: any;
}

export function ProgramPreview({ onComplete, data }: ProgramPreviewProps) {
  const getProgramType = () => {
    if (data.activityLevel === 'sedentary' || data.timeCommitment <= 30) {
      return 'Beginner';
    } else if (data.activityLevel === 'very' && data.preferences?.highIntensity) {
      return 'Advanced';
    }
    return 'Intermediate';
  };

  const programType = getProgramType();

  return (
    <div className="min-h-screen bg-black text-white overflow-y-auto">
      <div className="max-w-2xl mx-auto p-6 py-12">
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full mx-auto mb-6 flex items-center justify-center shadow-xl">
            <span className="text-3xl">🎯</span>
          </div>
          <h2 className="text-3xl font-bold mb-4 text-white">Your 63-Day Transformation</h2>
          <p className="text-lg text-gray-300">Based on your answers, we've designed your perfect program:</p>
        </div>
        
        <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl p-8 text-white mb-8 shadow-2xl">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-2xl">{programType} Program</h3>
            <span className="bg-white bg-opacity-20 px-4 py-2 rounded-full text-sm font-medium">
              Recommended
            </span>
          </div>
          
          <p className="text-lg opacity-90 mb-6 leading-relaxed">
            {programType === 'Beginner' && 
              "Gentle introduction to masculine wellness with focus on sleep optimization, basic movement, and stress management. Perfect for rebuilding your foundation."
            }
            {programType === 'Intermediate' && 
              "Balanced approach combining consistent habits with moderate challenges across all wellness areas. Designed to accelerate your transformation."
            }
            {programType === 'Advanced' && 
              "Comprehensive wellness routines with high-intensity activities and complex habit combinations. For men ready to dominate their health."
            }
          </p>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
            <div className="flex items-center space-x-3 bg-white/10 rounded-lg p-3">
              <span className="text-2xl">📅</span>
              <div>
                <div className="font-semibold">Duration</div>
                <div className="opacity-80">63-day journey</div>
              </div>
            </div>
            <div className="flex items-center space-x-3 bg-white/10 rounded-lg p-3">
              <span className="text-2xl">✅</span>
              <div>
                <div className="font-semibold">Daily Tasks</div>
                <div className="opacity-80">
                  {programType === 'Beginner' && "1-3 per day"}
                  {programType === 'Intermediate' && "2-4 per day"}
                  {programType === 'Advanced' && "3-5 per day"}
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-3 bg-white/10 rounded-lg p-3">
              <span className="text-2xl">⏱️</span>
              <div>
                <div className="font-semibold">Time Needed</div>
                <div className="opacity-80">{data.timeCommitment || 30} min daily</div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Transformation Preview */}
        <div className="bg-gray-900/50 rounded-2xl p-6 mb-8 border border-gray-700">
          <h4 className="text-xl font-bold mb-4 text-white">What to Expect:</h4>
          <div className="space-y-4">
            <div className="flex items-start space-x-4">
              <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-white text-sm font-bold">1</div>
              <div>
                <h5 className="font-semibold text-white">Week 1-3: Foundation Building</h5>
                <p className="text-gray-300 text-sm">Establish sleep patterns, basic nutrition, and movement habits</p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-white text-sm font-bold">2</div>
              <div>
                <h5 className="font-semibold text-white">Week 4-6: Momentum Phase</h5>
                <p className="text-gray-300 text-sm">Increase intensity, add strength training, optimize testosterone</p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-white text-sm font-bold">3</div>
              <div>
                <h5 className="font-semibold text-white">Week 7-9: Transformation</h5>
                <p className="text-gray-300 text-sm">Advanced protocols, body recomposition, confidence building</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="text-center mb-8">
          <img 
            src="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=200" 
            alt="Strong confident man" 
            className="rounded-xl w-full h-48 object-cover mb-4 shadow-lg"
          />
          <p className="text-gray-300 leading-relaxed">
            Your journey to reclaiming your masculine power starts with one decision. Today is the day you stop being weak.
          </p>
        </div>
        
        <Button 
          onClick={onComplete}
          className="w-full bg-orange-500 hover:bg-orange-600 text-white py-6 rounded-xl font-bold text-xl shadow-2xl hover:shadow-3xl 
                   transform hover:scale-105 active:scale-95 transition-all duration-200"
        >
          Start My Transformation →
        </Button>

        {/* Safe area padding for mobile */}
        <div className="h-8" />
      </div>
    </div>
  );
}
