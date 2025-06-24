import { User } from "@/types";
import { Calendar, Target, Flame, Trophy } from "lucide-react";
import { motion } from "framer-motion";

interface StatsOverviewProps {
  user: User;
}

export function StatsOverview({ user }: StatsOverviewProps) {
  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-blue-100 rounded-full mx-auto mb-4 animate-pulse"></div>
          <div className="text-gray-500 text-sm">Loading...</div>
        </div>
      </div>
    );
  }

  const totalDays = 63;
  const completedDays = user.completedDays || 0;
  const currentStreak = user.currentStreak || 0;
  const longestStreak = user.longestStreak || 0;
  const progressPercentage = Math.round((completedDays / totalDays) * 100);
  const level = user.level || Math.floor(completedDays / 10) + 1;

  const stats = [
    { 
      label: 'Days Completed', 
      value: completedDays, 
      icon: Calendar, 
      color: 'text-green-500',
      subtitle: `${progressPercentage}% of journey`
    },
    { 
      label: 'Current Streak', 
      value: currentStreak, 
      icon: Flame, 
      color: 'text-red-500',
      subtitle: 'days in a row'
    },
    { 
      label: 'Best Streak', 
      value: longestStreak, 
      icon: Trophy, 
      color: 'text-yellow-500',
      subtitle: 'personal record'
    },
    { 
      label: 'Current Level', 
      value: level, 
      icon: Target, 
      color: 'text-blue-500',
      subtitle: 'wellness level'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white px-4 pt-12 pb-6 border-b border-gray-100">
        <motion.div 
          className="text-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <h1 className="text-2xl font-bold text-gray-900 mb-1">
            Your Progress
          </h1>
          <p className="text-gray-600">
            Simple metrics that matter
          </p>
        </motion.div>
      </div>

      <div className="px-4 py-6">
        {/* Main Progress */}
        <motion.div 
          className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.4 }}
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Journey Progress</h3>
          
          <div className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-600 text-sm">Program Completion</span>
                <span className="text-gray-900 font-semibold">{progressPercentage}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <motion.div 
                  className="bg-blue-500 h-3 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPercentage}%` }}
                  transition={{ delay: 0.3, duration: 1, ease: "easeOut" }}
                />
              </div>
              <div className="text-xs text-gray-500 mt-1">
                Day {user.currentDay || 1} of {totalDays}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4">
          {stats.map((stat, index) => (
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
              <p className="text-gray-600 text-sm font-medium">{stat.label}</p>
              <p className="text-gray-400 text-xs">{stat.subtitle}</p>
            </motion.div>
          ))}
        </div>

        {/* Simple milestones */}
        <motion.div 
          className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm mt-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.4 }}
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Next Milestones</h3>
          
          <div className="space-y-3">
            {[
              { title: "Week 1 Complete", target: 7, current: completedDays, emoji: "🎯" },
              { title: "7 Day Streak", target: 7, current: currentStreak, emoji: "🔥" },
              { title: "Halfway Point", target: 32, current: completedDays, emoji: "🏔️" },
              { title: "Level 5", target: 50, current: completedDays, emoji: "⭐" }
            ].map((milestone, index) => {
              const progress = Math.min((milestone.current / milestone.target) * 100, 100);
              const isCompleted = milestone.current >= milestone.target;
              
              return (
                <div 
                  key={milestone.title}
                  className={`p-3 rounded-xl ${
                    isCompleted ? 'bg-green-50 border border-green-200' : 'bg-gray-50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{milestone.emoji}</span>
                      <span className={`text-sm font-medium ${
                        isCompleted ? 'text-green-700' : 'text-gray-700'
                      }`}>
                        {milestone.title}
                      </span>
                    </div>
                    <div className={`text-xs font-medium ${
                      isCompleted ? 'text-green-600' : 'text-gray-600'
                    }`}>
                      {milestone.current}/{milestone.target}
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-1.5">
                    <div 
                      className={`h-1.5 rounded-full ${
                        isCompleted ? 'bg-green-500' : 'bg-blue-500'
                      }`}
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Simple footer */}
        <div className="text-center mt-8 text-gray-500 text-sm">
          <p>Keep going! Every day counts. 💪</p>
        </div>
      </div>
    </div>
  );
}