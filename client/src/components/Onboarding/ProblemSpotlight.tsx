import { Button } from "@/components/ui/button";

interface ProblemSpotlightProps {
  onNext: () => void;
}

export function ProblemSpotlight({ onNext }: ProblemSpotlightProps) {
  return (
    <div className="p-6 min-h-screen flex flex-col justify-center">
      <div className="animate-slide-up">
        <h2 className="text-3xl font-bold text-gray-900 mb-6">
          Feeling stuck in your wellness journey?
        </h2>
        
        <div className="space-y-4 mb-8">
          <div className="flex items-center space-x-4 p-4 bg-red-50 rounded-xl">
            <i className="fas fa-bed text-red-500 text-xl"></i>
            <span className="text-gray-700">Struggling with consistent sleep schedules</span>
          </div>
          
          <div className="flex items-center space-x-4 p-4 bg-orange-50 rounded-xl">
            <i className="fas fa-running text-orange-500 text-xl"></i>
            <span className="text-gray-700">Finding it hard to stay active daily</span>
          </div>
          
          <div className="flex items-center space-x-4 p-4 bg-yellow-50 rounded-xl">
            <i className="fas fa-apple-alt text-yellow-500 text-xl"></i>
            <span className="text-gray-700">Inconsistent nutrition habits</span>
          </div>
          
          <div className="flex items-center space-x-4 p-4 bg-blue-50 rounded-xl">
            <i className="fas fa-brain text-blue-500 text-xl"></i>
            <span className="text-gray-700">High stress and poor recovery</span>
          </div>
        </div>
        
        <Button 
          onClick={onNext}
          className="w-full bg-primary text-white py-4 rounded-xl font-semibold text-lg hover:bg-primary/90"
        >
          Let's fix this together
        </Button>
      </div>
    </div>
  );
}
