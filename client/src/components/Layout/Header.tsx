import { User } from "@/types";
import { StreakIndicator } from "@/components/Rewards/StreakIndicator";

interface HeaderProps {
  user: User;
}

export function Header({ user }: HeaderProps) {
  // Show loading state if user is not yet loaded
  if (!user) {
    return (
      <header className="bg-white shadow-sm border-b border-gray-200 p-4 sticky top-0 z-40 pwa-header">
        <div className="max-w-md mx-auto">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-gray-900">
                Day <span className="text-primary">1</span>
              </h1>
              <p className="text-sm text-gray-600">
                Beginner Program • Week 1
              </p>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Animated Streak Indicator */}
              <StreakIndicator 
                currentStreak={0}
                longestStreak={0}
              />
              
              {/* User Avatar */}
              <button className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors touch-feedback">
                <i className="fas fa-user text-gray-600"></i>
              </button>
            </div>
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 p-4 sticky top-0 z-40 pwa-header">
      <div className="max-w-md mx-auto">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-gray-900">
              Day <span className="text-primary">{user.currentDay || 1}</span>
            </h1>
            <p className="text-sm text-gray-600">
              {user.program || 'Beginner'} Program • Week {Math.ceil((user.currentDay || 1) / 7)}
            </p>
          </div>
          
          <div className="flex items-center space-x-4">
            {/* Animated Streak Indicator */}
            <StreakIndicator 
              currentStreak={user.currentStreak || 0}
              longestStreak={user.longestStreak || 0}
            />
            
            {/* User Avatar */}
            <button className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors touch-feedback">
              <i className="fas fa-user text-gray-600"></i>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
