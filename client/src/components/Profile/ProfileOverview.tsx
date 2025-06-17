import { User } from "@/types";
import { User as UserIcon, Settings, Trophy, Target, Calendar, Flame, Star, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { StreakSparkle } from "@/components/Rewards/StreakSparkle";
import { motion } from "framer-motion";

interface ProfileOverviewProps {
  user: User;
  onOpenSettings: () => void;
}

export function ProfileOverview({ user, onOpenSettings }: ProfileOverviewProps) {
  const [showTestSparkle, setShowTestSparkle] = useState(false);
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    }).format(date);
  };

  const getProgramBadge = (program: string) => {
    const badges = {
      beginner: { color: 'bg-green-500', text: 'Beginner Explorer', icon: '🌱' },
      intermediate: { color: 'bg-blue-500', text: 'Skilled Practitioner', icon: '⚡' },
      advanced: { color: 'bg-purple-500', text: 'Master Achiever', icon: '🔥' }
    };
    return badges[program as keyof typeof badges] || badges.beginner;
  };

  const badge = getProgramBadge(user.program);
  const daysSinceStart = Math.floor((new Date().getTime() - new Date(user.startDate).getTime()) / (1000 * 60 * 60 * 24));
  const progressPercentage = Math.round((user.completedDays / 63) * 100);

  const quickStats = [
    { label: 'Current Streak', value: user.currentStreak, icon: Flame, color: 'text-red-500' },
    { label: 'Days Completed', value: user.completedDays, icon: Calendar, color: 'text-green-500' },
    { label: 'Current Level', value: user.level || 1, icon: Star, color: 'text-yellow-500' },
    { label: 'Achievements', value: user.achievements || 0, icon: Trophy, color: 'text-purple-500' }
  ];

  const milestones = [
    { title: 'First Week', description: 'Complete 7 days', achieved: user.completedDays >= 7, icon: '🎯' },
    { title: 'Monthly Warrior', description: 'Complete 30 days', achieved: user.completedDays >= 30, icon: '🏆' },
    { title: 'Halfway Hero', description: 'Reach day 32', achieved: user.currentDay >= 32, icon: '⭐' },
    { title: 'Program Graduate', description: 'Complete all 63 days', achieved: user.completedDays >= 63, icon: '👑' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white px-4 pt-12 pb-6 border-b border-gray-100">
        <motion.div 
          className="text-center mb-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          {/* Avatar */}
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 border border-gray-200">
            <UserIcon className="w-10 h-10 text-gray-600" />
          </div>
          
          {/* Name */}
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            {user.name}
          </h1>
          
          {/* Program Badge */}
          <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full ${badge.color} text-white text-sm font-medium`}>
            <span>{badge.icon}</span>
            {badge.text}
          </div>
          
          <p className="text-gray-600 mt-2 text-sm">
            Journey started {formatDate(new Date(user.startDate))}
          </p>
        </motion.div>

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

      <div className="px-4 py-4 space-y-4">
        {/* Progress Overview */}
        <motion.div 
          className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.4 }}
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Target className="w-5 h-5 text-blue-500" />
            Journey Progress
          </h3>
          
          <div className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-600 text-sm">Overall Progress</span>
                <span className="text-gray-900 font-semibold">{progressPercentage}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <motion.div 
                  className="bg-blue-500 h-2 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPercentage}%` }}
                  transition={{ delay: 0.3, duration: 0.8, ease: "easeOut" }}
                />
              </div>
              <div className="text-xs text-gray-500 mt-1">
                Day {user.currentDay} of 63
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-4">
              <div className="text-center">
                <div className="text-xl font-bold text-blue-500">{daysSinceStart}</div>
                <div className="text-xs text-gray-500">Days Since Start</div>
              </div>
              <div className="text-center">
                <div className="text-xl font-bold text-green-500">{user.longestStreak}</div>
                <div className="text-xs text-gray-500">Best Streak</div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-2 gap-3">
          {quickStats.map((stat, index) => (
            <motion.div 
              key={index} 
              className="bg-white rounded-2xl p-4 border border-gray-200 shadow-sm"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + index * 0.1, duration: 0.4 }}
            >
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                  <stat.icon className={`w-4 h-4 ${stat.color}`} />
                </div>
                <div className="text-xl font-bold text-gray-900">{stat.value}</div>
              </div>
              <p className="text-gray-600 text-sm">{stat.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Milestones */}
        <motion.div 
          className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.4 }}
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Shield className="w-5 h-5 text-yellow-500" />
            Milestones
          </h3>
          
          <div className="space-y-3">
            {milestones.map((milestone, index) => (
              <motion.div 
                key={index}
                className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${
                  milestone.achieved 
                    ? 'border-green-200 bg-green-50' 
                    : 'border-gray-200 bg-gray-50'
                }`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + index * 0.1, duration: 0.4 }}
              >
                <div className={`text-xl ${milestone.achieved ? '' : 'grayscale opacity-50'}`}>
                  {milestone.icon}
                </div>
                <div className="flex-1">
                  <h4 className={`font-medium text-sm ${milestone.achieved ? 'text-green-700' : 'text-gray-600'}`}>
                    {milestone.title}
                  </h4>
                  <p className="text-xs text-gray-500">{milestone.description}</p>
                </div>
                {milestone.achieved && (
                  <div className="text-green-600 text-xs font-medium">
                    ✓ Completed
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Activity Summary */}
        <motion.div 
          className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.4 }}
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Activity Summary</h3>
          
          <div className="space-y-3">
            <div className="flex justify-between items-center py-2">
              <span className="text-gray-600 text-sm">Total Days Active</span>
              <span className="text-gray-900 font-semibold">{daysSinceStart} days</span>
            </div>
            
            <div className="flex justify-between items-center py-2">
              <span className="text-gray-600 text-sm">Completion Rate</span>
              <span className="text-gray-900 font-semibold">
                {daysSinceStart > 0 ? Math.round((user.completedDays / daysSinceStart) * 100) : 0}%
              </span>
            </div>
            
            <div className="flex justify-between items-center py-2">
              <span className="text-gray-600 text-sm">Program Type</span>
              <span className="text-gray-900 font-semibold capitalize">{user.program}</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Test Sparkle */}
      <StreakSparkle
        streakCount={user?.currentStreak || 0}
        isVisible={showTestSparkle}
        onComplete={() => setShowTestSparkle(false)}
      />
    </div>
  );
}