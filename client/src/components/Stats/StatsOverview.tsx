import { User } from "@/types";
import { Calendar, Target, Flame, Trophy, TrendingUp, Clock } from "lucide-react";

interface StatsOverviewProps {
  user: User;
}

export function StatsOverview({ user }: StatsOverviewProps) {
  // Calculate stats from user data
  const totalDays = 63;
  const completedDays = user.completedDays || 0;
  const currentStreak = user.currentStreak || 0;
  const longestStreak = user.longestStreak || 0;
  const progressPercentage = Math.round((completedDays / totalDays) * 100);
  
  // Mock data for demonstration - in real app this would come from task completions
  const weeklyStats = [
    { day: 'Mon', completed: 3, total: 4 },
    { day: 'Tue', completed: 4, total: 4 },
    { day: 'Wed', completed: 2, total: 4 },
    { day: 'Thu', completed: 4, total: 4 },
    { day: 'Fri', completed: 3, total: 4 },
    { day: 'Sat', completed: 1, total: 4 },
    { day: 'Sun', completed: 0, total: 4 }
  ];

  const categoryStats = [
    { name: 'Sleep', completed: 12, total: 20, icon: '🌙', color: 'purple' },
    { name: 'Movement', completed: 8, total: 15, icon: '🏃', color: 'green' },
    { name: 'Nutrition', completed: 15, total: 18, icon: '🥗', color: 'orange' },
    { name: 'Recovery', completed: 6, total: 10, icon: '💆', color: 'blue' },
    { name: 'Mindfulness', completed: 4, total: 8, icon: '🧘', color: 'pink' }
  ];

  const achievements = [
    { id: 1, title: "First Steps", description: "Completed your first day", icon: "🎯", unlocked: true },
    { id: 2, title: "Week Warrior", description: "7 day streak achieved", icon: "🔥", unlocked: currentStreak >= 7 },
    { id: 3, title: "Sleep Master", description: "Complete 10 sleep tasks", icon: "🌙", unlocked: false },
    { id: 4, title: "Movement King", description: "Complete 15 movement tasks", icon: "💪", unlocked: false }
  ];

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <div className="bg-gradient-to-br from-blue-900 via-blue-800 to-purple-800 px-6 pt-12 pb-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            Your Progress
          </h1>
          <p className="text-blue-200">
            Track your wellness journey
          </p>
        </div>
      </div>

      <div className="px-6 py-6 space-y-6">
        {/* Key Stats Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gray-800 rounded-2xl p-5 border border-gray-700">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center">
                <Calendar className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-gray-400 text-sm">Days Completed</p>
                <p className="text-2xl font-bold text-white">{completedDays}</p>
              </div>
            </div>
            <div className="text-xs text-gray-400">
              {completedDays} of {totalDays} days
            </div>
          </div>

          <div className="bg-gray-800 rounded-2xl p-5 border border-gray-700">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center">
                <Flame className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-gray-400 text-sm">Current Streak</p>
                <p className="text-2xl font-bold text-white">{currentStreak}</p>
              </div>
            </div>
            <div className="text-xs text-gray-400">
              Best: {longestStreak} days
            </div>
          </div>

          <div className="bg-gray-800 rounded-2xl p-5 border border-gray-700">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center">
                <Target className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-gray-400 text-sm">Progress</p>
                <p className="text-2xl font-bold text-white">{progressPercentage}%</p>
              </div>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div 
                className="bg-purple-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
          </div>

          <div className="bg-gray-800 rounded-2xl p-5 border border-gray-700">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-yellow-600 rounded-full flex items-center justify-center">
                <Trophy className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-gray-400 text-sm">Level</p>
                <p className="text-2xl font-bold text-white">{user.level || 1}</p>
              </div>
            </div>
            <div className="text-xs text-gray-400">
              {user.achievements || 0} achievements
            </div>
          </div>
        </div>

        {/* Weekly Progress */}
        <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700">
          <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-blue-400" />
            This Week
          </h3>
          <div className="grid grid-cols-7 gap-2">
            {weeklyStats.map((day) => {
              const percentage = (day.completed / day.total) * 100;
              return (
                <div key={day.day} className="text-center">
                  <div className="text-xs text-gray-400 mb-2">{day.day}</div>
                  <div className="bg-gray-700 rounded-lg h-16 flex flex-col justify-end p-1">
                    <div 
                      className="bg-blue-500 rounded transition-all duration-300"
                      style={{ height: `${percentage}%`, minHeight: '4px' }}
                    ></div>
                  </div>
                  <div className="text-xs text-gray-400 mt-1">
                    {day.completed}/{day.total}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Category Breakdown */}
        <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700">
          <h3 className="text-xl font-bold text-white mb-4">Category Progress</h3>
          <div className="space-y-4">
            {categoryStats.map((category) => {
              const percentage = Math.round((category.completed / category.total) * 100);
              const colorMap: Record<string, string> = {
                purple: 'bg-purple-500',
                green: 'bg-green-500',
                orange: 'bg-orange-500',
                blue: 'bg-blue-500',
                pink: 'bg-pink-500'
              };
              
              return (
                <div key={category.name} className="flex items-center gap-4">
                  <div className="text-2xl">{category.icon}</div>
                  <div className="flex-1">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-white font-medium">{category.name}</span>
                      <span className="text-gray-400 text-sm">
                        {category.completed}/{category.total}
                      </span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full transition-all duration-300 ${colorMap[category.color]}`}
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>
                  <div className="text-white font-bold text-sm w-12 text-right">
                    {percentage}%
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recent Achievements */}
        <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700">
          <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <Trophy className="w-5 h-5 text-yellow-400" />
            Achievements
          </h3>
          <div className="grid grid-cols-2 gap-3">
            {achievements.map((achievement) => (
              <div 
                key={achievement.id}
                className={`rounded-xl p-4 border transition-all ${
                  achievement.unlocked 
                    ? 'border-yellow-500/30 bg-yellow-900/20' 
                    : 'border-gray-600 bg-gray-700/50 opacity-60'
                }`}
              >
                <div className="text-2xl mb-2">{achievement.icon}</div>
                <h4 className={`font-medium mb-1 ${
                  achievement.unlocked ? 'text-yellow-400' : 'text-gray-400'
                }`}>
                  {achievement.title}
                </h4>
                <p className="text-xs text-gray-500">
                  {achievement.description}
                </p>
                {achievement.unlocked && (
                  <div className="mt-2 text-xs text-yellow-400 font-medium">
                    ✓ Unlocked
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700">
          <h3 className="text-xl font-bold text-white mb-4">Quick Stats</h3>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-blue-400">{Math.round((completedDays / totalDays) * 100)}%</div>
              <div className="text-xs text-gray-400">Program Complete</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-400">{currentStreak}</div>
              <div className="text-xs text-gray-400">Day Streak</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-purple-400">{user.level || 1}</div>
              <div className="text-xs text-gray-400">Current Level</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}