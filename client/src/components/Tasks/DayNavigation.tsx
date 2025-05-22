import { Button } from "@/components/ui/button";

interface DayNavigationProps {
  currentDay: number;
  currentPhase: number;
  canGoToNextDay: boolean;
  onPreviousDay: () => void;
  onNextDay: () => void;
}

export function DayNavigation({ 
  currentDay, 
  currentPhase, 
  canGoToNextDay, 
  onPreviousDay, 
  onNextDay 
}: DayNavigationProps) {
  const getPhaseText = (phase: number) => {
    return `Phase ${phase}`;
  };

  const formatDate = () => {
    const today = new Date();
    return today.toLocaleDateString('en-US', { 
      weekday: 'long',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="flex items-center justify-between mb-6 p-4 bg-white rounded-xl shadow-sm">
      <Button
        variant="ghost"
        size="sm"
        onClick={onPreviousDay}
        disabled={currentDay <= 1}
        className="flex items-center space-x-2 text-gray-400 disabled:opacity-50"
      >
        <i className="fas fa-chevron-left"></i>
        <span className="hidden sm:inline">Yesterday</span>
      </Button>
      
      <div className="text-center">
        <div className="font-semibold text-gray-900">
          Day {currentDay}
        </div>
        <div className="text-sm text-gray-600">
          {formatDate()}
        </div>
        <div className="text-xs text-primary font-medium">
          {getPhaseText(currentPhase)} • Week {Math.ceil(currentDay / 7)}
        </div>
      </div>
      
      <Button
        variant="ghost"
        size="sm"
        onClick={onNextDay}
        disabled={!canGoToNextDay || currentDay >= 63}
        className="flex items-center space-x-2 text-gray-400 disabled:opacity-50"
      >
        <span className="hidden sm:inline">Tomorrow</span>
        {!canGoToNextDay && currentDay < 63 ? (
          <i className="fas fa-lock text-xs"></i>
        ) : (
          <i className="fas fa-chevron-right"></i>
        )}
      </Button>
    </div>
  );
}
