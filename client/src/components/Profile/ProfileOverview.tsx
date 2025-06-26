import { User } from "@/types";
import { Settings, Target, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ProfileOverviewProps {
  user: User;
  onOpenSettings: () => void;
  onProgramChange?: () => void;
}

export function ProfileOverview({ user, onOpenSettings, onProgramChange }: ProfileOverviewProps) {
  const progressPercentage = Math.round((user.completedDays / 63) * 100);
  
  const getProgramBadge = (program: string) => {
    const badges = {
      beginner: { color: 'bg-green-500', text: 'Beginner', icon: '🌱' },
      intermediate: { color: 'bg-blue-500', text: 'Intermediate', icon: '⚡' },
      advanced: { color: 'bg-purple-500', text: 'Advanced', icon: '🔥' }
    };
    return badges[program as keyof typeof badges] || badges.beginner;
  };

  const badge = getProgramBadge(user.program);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white px-4 pt-12 pb-6 border-b border-gray-100">
        <div className="text-center mb-6">
          {/* Name - No avatar image */}
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            {user.name}
          </h1>
          
          {/* Program Badge */}
          <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full ${badge.color} text-white text-sm font-medium`}>
            <span>{badge.icon}</span>
            {badge.text} Program
          </div>
        </div>

        {/* Settings Button */}
        <div className="text-center">
          <Button 
            onClick={onOpenSettings}
            variant="outline"
            className="border-gray-300 text-gray-700 hover:bg-gray-50"
          >
            <Settings className="w-4 h-4 mr-2" />
            Settings
          </Button>
        </div>
      </div>

      <div className="px-4 py-6">
        {/* Progress Overview */}
        <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Target className="w-5 h-5 text-blue-500" />
            Your Progress
          </h3>
          
          <div className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-600 text-sm">Program Completion</span>
                <span className="text-gray-900 font-semibold">{progressPercentage}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className="bg-blue-500 h-3 rounded-full transition-all duration-1000 ease-out"
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
              <div className="text-xs text-gray-500 mt-1">
                Day {user.currentDay || 1} of 63
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-4">
              <div className="text-center">
                <div className="text-xl font-bold text-green-500">{user.completedDays || 0}</div>
                <div className="text-xs text-gray-500">Days Completed</div>
              </div>
              <div className="text-center">
                <div className="text-xl font-bold text-red-500">{user.currentStreak || 0}</div>
                <div className="text-xs text-gray-500">Current Streak</div>
              </div>
            </div>
          </div>
        </div>

        {/* Program Selection */}
        <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Program Settings</h3>
          
          <div className="space-y-4">
            <button
              onClick={onProgramChange}
              className="w-full flex items-center justify-between p-4 rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-full ${badge.color} flex items-center justify-center text-white text-sm`}>
                  {badge.icon}
                </div>
                <div className="text-left">
                  <div className="font-medium text-gray-900">Current Program</div>
                  <div className="text-sm text-gray-500">{badge.text} • 63-day journey</div>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </button>
          </div>
        </div>

        {/* Key Stats */}
        <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Achievement Stats</h3>
          
          <div className="space-y-3">
            <div className="flex justify-between items-center py-2">
              <span className="text-gray-600 text-sm">Best Streak</span>
              <span className="text-gray-900 font-semibold">{user.longestStreak || 0} days</span>
            </div>
            
            <div className="flex justify-between items-center py-2">
              <span className="text-gray-600 text-sm">Current Level</span>
              <span className="text-gray-900 font-semibold">Level {user.level || 1}</span>
            </div>
            
            <div className="flex justify-between items-center py-2">
              <span className="text-gray-600 text-sm">Program</span>
              <span className="text-gray-900 font-semibold capitalize">{user.program}</span>
            </div>
          </div>
        </div>

        {/* Simple motivational footer */}
        <div className="text-center text-gray-500 text-sm">
          <p>Keep building your wellness habits! 🌟</p>
        </div>
      </div>
    </div>
  );
}