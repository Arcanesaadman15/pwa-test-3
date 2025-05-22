import { CategoryProgress } from "./CategoryProgress";
import { ProgressCalendar } from "./ProgressCalendar";
import { User } from "@/types";

interface StatsOverviewProps {
  user: User;
}

export function StatsOverview({ user }: StatsOverviewProps) {
  const stats = {
    currentStreak: user.currentStreak || 0,
    longestStreak: user.longestStreak || 0,
    totalDays: user.completedDays || 0,
    successRate: Math.round(((user.completedDays || 0) / Math.max(user.currentDay || 1, 1)) * 100)
  };

  return (
    <div className="p-4 max-w-md mx-auto space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white rounded-xl p-4 shadow-sm text-center">
          <div className="flex items-center justify-center mb-2">
            <i className="fas fa-fire text-orange-500 mr-2 streak-flame"></i>
            <div className="text-2xl font-bold text-primary">{stats.currentStreak}</div>
          </div>
          <div className="text-sm text-gray-600">Current Streak</div>
        </div>
        
        <div className="bg-white rounded-xl p-4 shadow-sm text-center">
          <div className="text-2xl font-bold text-secondary mb-1">{stats.longestStreak}</div>
          <div className="text-sm text-gray-600">Longest Streak</div>
        </div>
        
        <div className="bg-white rounded-xl p-4 shadow-sm text-center">
          <div className="text-2xl font-bold text-accent mb-1">{stats.totalDays}</div>
          <div className="text-sm text-gray-600">Days Completed</div>
        </div>
        
        <div className="bg-white rounded-xl p-4 shadow-sm text-center">
          <div className="text-2xl font-bold text-green-500 mb-1">{stats.successRate}%</div>
          <div className="text-sm text-gray-600">Success Rate</div>
        </div>
      </div>

      {/* Weekly Progress Chart */}
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <h3 className="font-semibold text-gray-800 mb-4">Weekly Activity</h3>
        <div className="flex items-end justify-between space-x-2 h-32">
          {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, index) => {
            const heights = [80, 100, 60, 90, 75, 45, 65]; // Mock data percentages
            const isComplete = index < 5; // Mock: first 5 days completed
            
            return (
              <div key={day} className="flex flex-col items-center flex-1">
                <div 
                  className={`w-full rounded-t transition-all duration-500 ${
                    isComplete ? 'bg-primary' : 'bg-gray-300'
                  }`}
                  style={{ height: `${heights[index]}%` }}
                ></div>
                <span className="text-xs text-gray-500 mt-1">{day}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Progress Calendar */}
      <ProgressCalendar currentDay={user.currentDay || 1} />

      {/* Category Progress */}
      <CategoryProgress 
        categories={{
          sleep: 92,
          movement: 85,
          nutrition: 78,
          recovery: 90,
          mindfulness: 0
        }}
      />

      {/* Recent Achievements */}
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <h3 className="font-semibold text-gray-800 mb-4">Recent Achievements</h3>
        <div className="space-y-3">
          <div className="flex items-center space-x-3 p-3 bg-gradient-to-r from-accent/10 to-accent/5 rounded-xl">
            <div className="w-10 h-10 bg-accent rounded-full flex items-center justify-center">
              <i className="fas fa-fire text-white"></i>
            </div>
            <div>
              <div className="font-medium text-gray-800">Week Warrior</div>
              <div className="text-sm text-gray-600">Completed 7 days in a row</div>
            </div>
          </div>
          
          <div className="flex items-center space-x-3 p-3 bg-gradient-to-r from-primary/10 to-primary/5 rounded-xl">
            <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
              <i className="fas fa-running text-white"></i>
            </div>
            <div>
              <div className="font-medium text-gray-800">Movement Master</div>
              <div className="text-sm text-gray-600">Completed 20 movement tasks</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
