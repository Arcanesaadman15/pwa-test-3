import { User } from "@/types";
import { User as UserIcon, Settings, Trophy, Target, Calendar, Flame, Star, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ProfileOverviewProps {
  user: User;
  onOpenSettings: () => void;
}

export function ProfileOverview({ user, onOpenSettings }: ProfileOverviewProps) {
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    }).format(date);
  };

  const getProgramBadge = (program: string) => {
    const badges = {
      beginner: { color: 'bg-green-600', text: 'Beginner Explorer', icon: '🌱' },
      intermediate: { color: 'bg-blue-600', text: 'Skilled Practitioner', icon: '⚡' },
      advanced: { color: 'bg-purple-600', text: 'Master Achiever', icon: '🔥' }
    };
    return badges[program as keyof typeof badges] || badges.beginner;
  };

  const badge = getProgramBadge(user.program);
  const daysSinceStart = Math.floor((new Date().getTime() - new Date(user.startDate).getTime()) / (1000 * 60 * 60 * 24));
  const progressPercentage = Math.round((user.completedDays / 63) * 100);

  const quickStats = [
    { label: 'Current Streak', value: user.currentStreak, icon: Flame, color: 'text-red-400' },
    { label: 'Days Completed', value: user.completedDays, icon: Calendar, color: 'text-green-400' },
    { label: 'Current Level', value: user.level || 1, icon: Star, color: 'text-yellow-400' },
    { label: 'Achievements', value: user.achievements || 0, icon: Trophy, color: 'text-purple-400' }
  ];

  const milestones = [
    { title: 'First Week', description: 'Complete 7 days', achieved: user.completedDays >= 7, icon: '🎯' },
    { title: 'Monthly Warrior', description: 'Complete 30 days', achieved: user.completedDays >= 30, icon: '🏆' },
    { title: 'Halfway Hero', description: 'Reach day 32', achieved: user.currentDay >= 32, icon: '⭐' },
    { title: 'Program Graduate', description: 'Complete all 63 days', achieved: user.completedDays >= 63, icon: '👑' }
  ];

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header with Profile Info */}
      <div className="bg-gradient-to-br from-indigo-900 via-purple-800 to-pink-800 px-6 pt-12 pb-8">
        <div className="text-center mb-8">
          {/* Avatar */}
          <div className="w-24 h-24 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4 border-4 border-white/20">
            <UserIcon className="w-12 h-12 text-gray-300" />
          </div>
          
          {/* Name and Program */}
          <h1 className="text-3xl font-bold text-white mb-2">
            {user.name}
          </h1>
          
          {/* Program Badge */}
          <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${badge.color} text-white text-sm font-medium`}>
            <span className="text-lg">{badge.icon}</span>
            {badge.text}
          </div>
          
          <p className="text-purple-200 mt-2">
            Journey started {formatDate(new Date(user.startDate))}
          </p>
        </div>

        {/* Settings Button */}
        <div className="text-center">
          <Button 
            onClick={onOpenSettings}
            className="bg-white/10 hover:bg-white/20 text-white border border-white/20"
          >
            <Settings className="w-4 h-4 mr-2" />
            Settings
          </Button>
        </div>
      </div>

      <div className="px-6 py-6 space-y-6">
        {/* Progress Overview */}
        <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700">
          <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <Target className="w-5 h-5 text-blue-400" />
            Journey Progress
          </h3>
          
          <div className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-400">Overall Progress</span>
                <span className="text-white font-bold">{progressPercentage}%</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-3">
                <div 
                  className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full transition-all duration-300"
                  style={{ width: `${progressPercentage}%` }}
                ></div>
              </div>
              <div className="text-xs text-gray-400 mt-1">
                Day {user.currentDay} of 63
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-400">{daysSinceStart}</div>
                <div className="text-xs text-gray-400">Days Since Start</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-400">{user.longestStreak}</div>
                <div className="text-xs text-gray-400">Best Streak</div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-2 gap-4">
          {quickStats.map((stat, index) => (
            <div key={index} className="bg-gray-800 rounded-2xl p-5 border border-gray-700">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center">
                  <stat.icon className={`w-5 h-5 ${stat.color}`} />
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">{stat.value}</p>
                </div>
              </div>
              <p className="text-gray-400 text-sm">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Milestones */}
        <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700">
          <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <Shield className="w-5 h-5 text-yellow-400" />
            Milestones
          </h3>
          
          <div className="space-y-3">
            {milestones.map((milestone, index) => (
              <div 
                key={index}
                className={`flex items-center gap-4 p-4 rounded-xl border transition-all ${
                  milestone.achieved 
                    ? 'border-yellow-500/30 bg-yellow-900/20' 
                    : 'border-gray-600 bg-gray-700/50'
                }`}
              >
                <div className={`text-2xl ${milestone.achieved ? '' : 'grayscale opacity-50'}`}>
                  {milestone.icon}
                </div>
                <div className="flex-1">
                  <h4 className={`font-medium ${milestone.achieved ? 'text-yellow-400' : 'text-gray-400'}`}>
                    {milestone.title}
                  </h4>
                  <p className="text-xs text-gray-500">{milestone.description}</p>
                </div>
                {milestone.achieved && (
                  <div className="text-yellow-400 text-xs font-medium">
                    ✓ Completed
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Activity Summary */}
        <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700">
          <h3 className="text-xl font-bold text-white mb-4">Activity Summary</h3>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Total Days Active</span>
              <span className="text-white font-bold">{daysSinceStart} days</span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Completion Rate</span>
              <span className="text-white font-bold">
                {daysSinceStart > 0 ? Math.round((user.completedDays / daysSinceStart) * 100) : 0}%
              </span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Program Type</span>
              <span className="text-white font-bold capitalize">{user.program}</span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Started</span>
              <span className="text-white font-bold">{formatDate(new Date(user.startDate))}</span>
            </div>
          </div>
        </div>

        {/* Motivational Section */}
        <div className="bg-gradient-to-r from-purple-800/50 to-pink-800/50 rounded-2xl p-6 border border-purple-500/30">
          <h3 className="text-xl font-bold text-white mb-2">Keep Going!</h3>
          <p className="text-purple-200 text-sm mb-4">
            {user.currentStreak > 0 
              ? `You're on a ${user.currentStreak} day streak! Don't break the chain.`
              : "Start your journey today and build momentum with your first task!"
            }
          </p>
          <div className="flex items-center gap-2 text-purple-300 text-sm">
            <Flame className="w-4 h-4" />
            <span>
              {63 - user.completedDays} days remaining to complete your transformation
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}