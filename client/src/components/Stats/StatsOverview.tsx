import { User } from "@/types";
import { Calendar, Target, Flame, Trophy, TrendingUp, Clock, Award, Zap, Star, BarChart3 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { useTaskEngine } from "@/hooks/useTaskEngine";

interface StatsOverviewProps {
  user: User;
}

interface WeeklyData {
  day: string;
  completed: number;
  total: number;
  date: string;
}

interface CategoryStat {
  name: string;
  completed: number;
  total: number;
  icon: string;
  color: string;
  improvement: string;
}

interface Achievement {
  id: number;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

export function StatsOverview({ user }: StatsOverviewProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'progress' | 'achievements'>('overview');
  const { taskEngine } = useTaskEngine();
  const [taskStats, setTaskStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTaskStats();
  }, [taskEngine]);

  const loadTaskStats = async () => {
    if (!taskEngine) return;
    
    try {
      setLoading(true);
      
      const totalDays = 63;
      const currentDay = taskEngine.getActiveDay();
      const completedDays = Math.max(0, currentDay - 1);
      
      // Calculate weekly stats
      const weeklyStats: WeeklyData[] = [];
      const today = new Date();
      
      for (let i = 6; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        const dayName = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][date.getDay()];
        
        const dayNumber = currentDay - i;
        
        if (dayNumber > 0 && dayNumber <= currentDay) {
          const dayTasks = await taskEngine.getCurrentDayTasks();
          const total = dayTasks.active.length + dayTasks.completed.length + dayTasks.skipped.length;
          const completed = dayTasks.completed.length;
          
          weeklyStats.push({
            day: dayName,
            completed,
            total,
            date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
          });
        } else {
          weeklyStats.push({
            day: dayName,
            completed: 0,
            total: 0,
            date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
          });
        }
      }

      // Calculate category statistics
      const categories = ['Sleep', 'Movement', 'Nutrition', 'Recovery', 'Mindfulness', 'Training'];
      const categoryStats: Record<string, { completed: number; total: number; improvement: string }> = {};
      
      categories.forEach(cat => {
        categoryStats[cat] = { completed: 0, total: 0, improvement: '+0%' };
      });

      const currentDayTasks = await taskEngine.getCurrentDayTasks();
      
      [...currentDayTasks.completed, ...currentDayTasks.active, ...currentDayTasks.skipped].forEach(task => {
        if (categoryStats[task.category]) {
          categoryStats[task.category].total++;
          if (currentDayTasks.completed.some(ct => ct.id === task.id)) {
            categoryStats[task.category].completed++;
          }
        }
      });

      Object.keys(categoryStats).forEach(category => {
        const completionRate = categoryStats[category].total > 0 
          ? (categoryStats[category].completed / categoryStats[category].total) * 100 
          : 0;
        categoryStats[category].improvement = `+${Math.round(completionRate * 0.2)}%`;
      });

      setTaskStats({
        totalDays,
        completedDays,
        currentStreak: user.currentStreak || 0,
        longestStreak: user.longestStreak || 0,
        weeklyStats,
        categoryStats,
        progressPercentage: Math.round((completedDays / totalDays) * 100)
      });
      
    } catch (error) {
      console.error('Error loading task stats:', error);
    } finally {
      setLoading(false);
    }
  };
  
  if (!user || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <motion.div 
          className="text-center"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <div className="w-16 h-16 bg-blue-100 rounded-full mx-auto mb-4 animate-pulse"></div>
          <div className="h-4 bg-gray-200 rounded w-32 mx-auto mb-2"></div>
          <div className="h-3 bg-gray-200 rounded w-24 mx-auto"></div>
          {loading && (
            <div className="text-gray-500 text-sm mt-4">Loading stats...</div>
          )}
        </motion.div>
      </div>
    );
  }

  const totalDays = taskStats?.totalDays || 63;
  const completedDays = taskStats?.completedDays || user.completedDays || 0;
  const currentStreak = taskStats?.currentStreak || user.currentStreak || 0;
  const longestStreak = taskStats?.longestStreak || user.longestStreak || 0;
  const progressPercentage = taskStats?.progressPercentage || Math.round((completedDays / totalDays) * 100);
  const level = user.level || Math.floor(completedDays / 10) + 1;
  
  const weeklyStats = taskStats?.weeklyStats || [];

  const categoryStatsDisplay: CategoryStat[] = Object.entries(taskStats?.categoryStats || {})
    .filter(([_, stats]: [string, any]) => stats.total > 0)
    .map(([name, stats]: [string, any]) => {
      const icons: Record<string, string> = {
        'Sleep': '🌙',
        'Movement': '🏃',
        'Nutrition': '🥗',
        'Recovery': '💆',
        'Mindfulness': '🧘',
        'Training': '💪'
      };
      
      const colors = ['blue', 'green', 'orange', 'purple', 'pink', 'red'];
      const colorIndex = Object.keys(taskStats?.categoryStats || {}).indexOf(name);
      
      return {
        name,
        completed: stats.completed,
        total: stats.total,
        icon: icons[name] || '📋',
        color: colors[colorIndex % colors.length],
        improvement: stats.improvement
      };
    })
    .slice(0, 6);

  const achievements: Achievement[] = [
    { id: 1, title: "First Steps", description: "Completed your first day", icon: "🎯", unlocked: completedDays >= 1, rarity: "common" },
    { id: 2, title: "Week Warrior", description: "7 day streak achieved", icon: "🔥", unlocked: currentStreak >= 7 || longestStreak >= 7, rarity: "rare" },
    { id: 3, title: "Sleep Master", description: "Complete 15 sleep tasks", icon: "🌙", unlocked: (taskStats?.categoryStats?.Sleep?.completed || 0) >= 15, rarity: "epic" },
    { id: 4, title: "Movement King", description: "Complete 20 movement tasks", icon: "💪", unlocked: (taskStats?.categoryStats?.Movement?.completed || 0) >= 20, rarity: "legendary" },
    { id: 5, title: "Consistency Champion", description: "Reach 21 day streak", icon: "⭐", unlocked: currentStreak >= 21 || longestStreak >= 21, rarity: "legendary" },
    { id: 6, title: "Halfway Hero", description: "Complete 50% of the program", icon: "🏆", unlocked: progressPercentage >= 50, rarity: "epic" }
  ];

  const getRarityColor = (rarity: string) => {
    const colors = {
      'common': 'bg-gray-100 text-gray-700 border-gray-200',
      'rare': 'bg-blue-100 text-blue-700 border-blue-200',
      'epic': 'bg-purple-100 text-purple-700 border-purple-200',
      'legendary': 'bg-yellow-100 text-yellow-700 border-yellow-200'
    };
    return colors[rarity as keyof typeof colors] || colors.common;
  };

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
          <h1 className="text-2xl font-bold text-gray-900 mb-1">
            Statistics
          </h1>
          <p className="text-gray-600">
            Track your wellness journey progress
          </p>
        </motion.div>

        {/* Tab Navigation */}
        <div className="flex bg-gray-100 rounded-xl p-1">
          {[
            { id: 'overview', label: 'Overview', icon: BarChart3 },
            { id: 'progress', label: 'Progress', icon: TrendingUp },
            { id: 'achievements', label: 'Achievements', icon: Trophy }
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex-1 py-2.5 px-3 rounded-lg font-medium transition-all flex items-center justify-center gap-2 ${
                  isActive
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="text-sm">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="px-4 py-4">
        <AnimatePresence mode="wait">
          {activeTab === 'overview' && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-4"
            >
              {/* Quick Stats */}
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: 'Current Streak', value: currentStreak, icon: Flame, color: 'text-red-500' },
                  { label: 'Completed Days', value: completedDays, icon: Calendar, color: 'text-green-500' },
                  { label: 'Current Level', value: level, icon: Star, color: 'text-yellow-500' },
                  { label: 'Progress', value: `${progressPercentage}%`, icon: Target, color: 'text-blue-500' }
                ].map((stat, index) => (
                  <motion.div 
                    key={index} 
                    className="bg-white rounded-2xl p-4 border border-gray-200 shadow-sm"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1, duration: 0.4 }}
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

              {/* Weekly Progress Chart */}
              <motion.div 
                className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.4 }}
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-blue-500" />
                  Weekly Progress
                </h3>
                
                <div className="flex items-end justify-between gap-2 h-32 mb-4">
                  {weeklyStats.map((day: any, index: number) => {
                    const height = day.total > 0 ? (day.completed / day.total) * 100 : 0;
                    
                    return (
                      <div key={index} className="flex-1 flex flex-col items-center gap-2">
                        <div className="flex-1 flex items-end">
                          <motion.div
                            className="w-full bg-blue-500 rounded-t-lg"
                            style={{ height: `${Math.max(height, 5)}%` }}
                            initial={{ height: 0 }}
                            animate={{ height: `${Math.max(height, 5)}%` }}
                            transition={{ delay: index * 0.1, duration: 0.6 }}
                          />
                        </div>
                        <div className="text-xs text-gray-500 font-medium">{day.day}</div>
                      </div>
                    );
                  })}
                </div>
                
                <div className="text-center text-sm text-gray-500">
                  Last 7 days completion rate
                </div>
              </motion.div>

              {/* Category Breakdown */}
              <motion.div 
                className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.4 }}
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Category Breakdown</h3>
                
                <div className="space-y-3">
                  {categoryStatsDisplay.map((category, index) => {
                    const percentage = category.total > 0 ? (category.completed / category.total) * 100 : 0;
                    
                    return (
                      <motion.div 
                        key={category.name}
                        className="space-y-2"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5 + index * 0.1, duration: 0.4 }}
                      >
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-2">
                            <span className="text-lg">{category.icon}</span>
                            <span className="text-sm font-medium text-gray-900">{category.name}</span>
                          </div>
                          <div className="text-sm text-gray-600">
                            {category.completed}/{category.total}
                          </div>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <motion.div 
                            className="bg-blue-500 h-2 rounded-full"
                            initial={{ width: 0 }}
                            animate={{ width: `${percentage}%` }}
                            transition={{ delay: 0.6 + index * 0.1, duration: 0.8, ease: "easeOut" }}
                          />
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </motion.div>
            </motion.div>
          )}

          {activeTab === 'progress' && (
            <motion.div
              key="progress"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-4"
            >
              {/* Overall Progress */}
              <motion.div 
                className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.4 }}
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Target className="w-5 h-5 text-blue-500" />
                  Overall Progress
                </h3>
                
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
                      Day {completedDays} of {totalDays}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-500">{currentStreak}</div>
                      <div className="text-xs text-gray-500">Current Streak</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-500">{longestStreak}</div>
                      <div className="text-xs text-gray-500">Best Streak</div>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Milestones */}
              <motion.div 
                className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.4 }}
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Milestones</h3>
                
                <div className="space-y-3">
                  {[
                    { title: "30 Days Complete", current: completedDays, target: 30, icon: "🏆" },
                    { title: "Level 5 Achieved", current: level, target: 5, icon: "⭐" },
                    { title: "21 Day Streak", current: Math.max(currentStreak, longestStreak), target: 21, icon: "🔥" },
                    { title: "Halfway Point", current: progressPercentage, target: 50, icon: "🎯" }
                  ].map((milestone, index) => {
                    const progress = Math.min((milestone.current / milestone.target) * 100, 100);
                    const isCompleted = milestone.current >= milestone.target;
                    
                    return (
                      <motion.div 
                        key={milestone.title}
                        className={`p-3 rounded-xl border ${
                          isCompleted ? 'border-green-200 bg-green-50' : 'border-gray-200 bg-gray-50'
                        }`}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 + index * 0.1, duration: 0.4 }}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <span className="text-lg">{milestone.icon}</span>
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
                          <motion.div 
                            className={`h-1.5 rounded-full ${
                              isCompleted ? 'bg-green-500' : 'bg-blue-500'
                            }`}
                            initial={{ width: 0 }}
                            animate={{ width: `${progress}%` }}
                            transition={{ delay: 0.4 + index * 0.1, duration: 0.8, ease: "easeOut" }}
                          />
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </motion.div>
            </motion.div>
          )}

          {activeTab === 'achievements' && (
            <motion.div
              key="achievements"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-4"
            >
              <motion.div 
                className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.4 }}
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-yellow-500" />
                  Achievements
                </h3>
                
                <div className="grid grid-cols-1 gap-3">
                  {achievements.map((achievement, index) => (
                    <motion.div 
                      key={achievement.id}
                      className={`p-4 rounded-xl border ${
                        achievement.unlocked 
                          ? getRarityColor(achievement.rarity)
                          : 'bg-gray-50 border-gray-200 opacity-60'
                      }`}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 + index * 0.1, duration: 0.4 }}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`text-2xl ${achievement.unlocked ? '' : 'grayscale'}`}>
                          {achievement.icon}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-semibold text-sm">{achievement.title}</h4>
                            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getRarityColor(achievement.rarity)}`}>
                              {achievement.rarity}
                            </span>
                          </div>
                          <p className="text-xs text-gray-600">{achievement.description}</p>
                        </div>
                        {achievement.unlocked && (
                          <div className="text-green-600 text-xs font-medium">
                            ✓ Unlocked
                          </div>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}