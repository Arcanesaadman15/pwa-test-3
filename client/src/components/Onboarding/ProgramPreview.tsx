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
    <div className="p-6 min-h-screen flex flex-col justify-center">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-primary rounded-full mx-auto mb-4 flex items-center justify-center animate-celebration">
          <i className="fas fa-check text-white text-2xl"></i>
        </div>
        <h2 className="text-2xl font-bold mb-2">Perfect Match!</h2>
        <p className="text-gray-600">Based on your answers, we recommend:</p>
      </div>
      
      <div className="bg-gradient-to-r from-primary to-secondary rounded-xl p-6 text-white mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-lg">{programType} Program</h3>
          <span className="bg-white bg-opacity-20 px-3 py-1 rounded-full text-sm font-medium">
            Recommended
          </span>
        </div>
        
        <p className="text-sm opacity-90 mb-4">
          {programType === 'Beginner' && 
            "Gentle introduction to wellness habits with focus on sleep, basic movement, and stress management."
          }
          {programType === 'Intermediate' && 
            "Balanced approach combining consistent habits with moderate challenges across all wellness areas."
          }
          {programType === 'Advanced' && 
            "Comprehensive wellness routines with high-intensity activities and complex habit combinations."
          }
        </p>
        
        <div className="space-y-2 text-sm">
          <div className="flex items-center space-x-2">
            <i className="fas fa-calendar-alt"></i>
            <span>63-day journey</span>
          </div>
          <div className="flex items-center space-x-2">
            <i className="fas fa-tasks"></i>
            <span>
              {programType === 'Beginner' && "1-3 tasks per day"}
              {programType === 'Intermediate' && "2-4 tasks per day"}
              {programType === 'Advanced' && "3-5 tasks per day"}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <i className="fas fa-clock"></i>
            <span>{data.timeCommitment} min daily commitment</span>
          </div>
        </div>
      </div>
      
      <div className="text-center mb-6">
        <img 
          src="https://images.unsplash.com/photo-1441974231531-c6227db76b6e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=200" 
          alt="Mountain path through forest" 
          className="rounded-xl w-full h-32 object-cover mb-4"
        />
        <p className="text-sm text-gray-600">
          Your journey starts with small, sustainable changes
        </p>
      </div>
      
      <Button 
        onClick={onComplete}
        className="w-full bg-primary text-white py-4 rounded-xl font-semibold text-lg shadow-lg hover:bg-primary/90"
      >
        Start My Journey
      </Button>
    </div>
  );
}
