interface ProgressCalendarProps {
  currentDay: number;
}

export function ProgressCalendar({ currentDay }: ProgressCalendarProps) {
  const generateCalendarDays = () => {
    const days = [];
    const today = new Date();
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
    
    // Generate mock completion data for demonstration
    const completionData: { [key: number]: 'completed' | 'partial' | 'skipped' | 'future' } = {};
    
    for (let day = 1; day <= daysInMonth; day++) {
      if (day < today.getDate()) {
        // Past days - mix of completed, partial, and skipped
        const rand = Math.random();
        if (rand > 0.8) completionData[day] = 'skipped';
        else if (rand > 0.3) completionData[day] = 'completed';
        else completionData[day] = 'partial';
      } else if (day === today.getDate()) {
        completionData[day] = 'partial'; // Today
      } else {
        completionData[day] = 'future'; // Future days
      }
    }
    
    return { daysInMonth, completionData };
  };

  const { daysInMonth, completionData } = generateCalendarDays();
  
  const getdayStyle = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-primary text-white';
      case 'partial':
        return 'bg-amber-400 text-white';
      case 'skipped':
        return 'bg-gray-300 text-gray-600';
      case 'future':
        return 'bg-gray-100 text-gray-400';
      default:
        return 'bg-gray-100 text-gray-400';
    }
  };

  const weekDays = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm">
      <h3 className="font-semibold text-gray-800 mb-4">Progress Calendar</h3>
      
      {/* Week day headers */}
      <div className="grid grid-cols-7 gap-1 text-center text-xs mb-2">
        {weekDays.map((day) => (
          <div key={day} className="text-gray-500 py-1 font-medium">
            {day}
          </div>
        ))}
      </div>
      
      {/* Calendar days */}
      <div className="grid grid-cols-7 gap-1">
        {Array.from({ length: daysInMonth }, (_, i) => {
          const day = i + 1;
          const status = completionData[day];
          
          return (
            <div
              key={day}
              className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-medium transition-all duration-200 ${getdayStyle(status)}`}
            >
              {day}
            </div>
          );
        })}
      </div>
      
      {/* Legend */}
      <div className="flex items-center justify-center space-x-4 mt-4 text-xs">
        <div className="flex items-center space-x-1">
          <div className="w-3 h-3 bg-primary rounded"></div>
          <span className="text-gray-600">Complete</span>
        </div>
        <div className="flex items-center space-x-1">
          <div className="w-3 h-3 bg-amber-400 rounded"></div>
          <span className="text-gray-600">Partial</span>
        </div>
        <div className="flex items-center space-x-1">
          <div className="w-3 h-3 bg-gray-300 rounded"></div>
          <span className="text-gray-600">Skipped</span>
        </div>
      </div>
    </div>
  );
}
