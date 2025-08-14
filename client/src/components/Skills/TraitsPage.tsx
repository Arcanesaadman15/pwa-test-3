import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TRAIT_DEFINITIONS, getTraitsByCategory } from '@/data/traitDefinitions';
import { traitSystem } from '@/lib/traitSystem';
import { getTraitCategoryOverview } from '@/lib/traitInitializer';
import { UserTraitScores, TraitProgress } from '@/types/traits';
import { Progress } from '@/components/ui/progress';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Icon } from '@/lib/iconUtils';
import { ArrowUp, TrendingUp, Target, Info, Flame, Award, Star, Zap, Trophy, ChevronRight } from 'lucide-react';

interface TraitsPageProps {
  onTraitClick?: (traitId: string) => void;
}

interface TraitCardProps {
  trait: any;
  progress: TraitProgress;
  onClick?: () => void;
  index: number;
}

function TraitCard({ trait, progress, onClick, index }: TraitCardProps) {
  const getScoreLevel = (score: number) => {
    if (score >= 85) return 'elite';
    if (score >= 70) return 'advanced';
    if (score >= 50) return 'intermediate';
    if (score >= 30) return 'beginner';
    return 'starting';
  };

  const getScoreTheme = (score: number) => {
    const level = getScoreLevel(score);
    const themes = {
      elite: {
        gradient: 'from-yellow-400 via-orange-500 to-red-500',
        text: 'text-yellow-600',
        bg: 'bg-gradient-to-br from-yellow-50 to-orange-50',
        border: 'border-yellow-300',
        shadow: 'shadow-yellow-200/50',
        ring: 'ring-yellow-200',
        badge: 'bg-yellow-100 text-yellow-800',
        icon: 'text-yellow-600'
      },
      advanced: {
        gradient: 'from-emerald-400 to-teal-500',
        text: 'text-emerald-600',
        bg: 'bg-gradient-to-br from-emerald-50 to-teal-50',
        border: 'border-emerald-300',
        shadow: 'shadow-emerald-200/50',
        ring: 'ring-emerald-200',
        badge: 'bg-emerald-100 text-emerald-800',
        icon: 'text-emerald-600'
      },
      intermediate: {
        gradient: 'from-blue-400 to-indigo-500',
        text: 'text-blue-600',
        bg: 'bg-gradient-to-br from-blue-50 to-indigo-50',
        border: 'border-blue-300',
        shadow: 'shadow-blue-200/50',
        ring: 'ring-blue-200',
        badge: 'bg-blue-100 text-blue-800',
        icon: 'text-blue-600'
      },
      beginner: {
        gradient: 'from-purple-400 to-pink-500',
        text: 'text-purple-600',
        bg: 'bg-gradient-to-br from-purple-50 to-pink-50',
        border: 'border-purple-300',
        shadow: 'shadow-purple-200/50',
        ring: 'ring-purple-200',
        badge: 'bg-purple-100 text-purple-800',
        icon: 'text-purple-600'
      },
      starting: {
        gradient: 'from-gray-400 to-slate-500',
        text: 'text-gray-600',
        bg: 'bg-gradient-to-br from-gray-50 to-slate-50',
        border: 'border-gray-300',
        shadow: 'shadow-gray-200/50',
        ring: 'ring-gray-200',
        badge: 'bg-gray-100 text-gray-800',
        icon: 'text-gray-600'
      }
    };
    return themes[level];
  };

  const getCategoryTheme = (category: string) => {
    const themes: Record<string, any> = {
      'Physical': { 
        color: 'bg-red-500', 
        badge: 'bg-red-100 text-red-800 border-red-200',
        name: '💪 Physical'
      },
      'Nutrition': { 
        color: 'bg-green-500', 
        badge: 'bg-green-100 text-green-800 border-green-200',
        name: '🥗 Nutrition'
      },
      'Sleep': { 
        color: 'bg-indigo-500', 
        badge: 'bg-indigo-100 text-indigo-800 border-indigo-200',
        name: '😴 Sleep'
      },
      'Mental': { 
        color: 'bg-purple-500', 
        badge: 'bg-purple-100 text-purple-800 border-purple-200',
        name: '🧠 Mental'
      },
      'Recovery': { 
        color: 'bg-orange-500', 
        badge: 'bg-orange-100 text-orange-800 border-orange-200',
        name: '🔄 Recovery'
      }
    };
    return themes[category] || { color: 'bg-gray-500', badge: 'bg-gray-100 text-gray-800', name: category };
  };

  const getIconName = (traitId: string) => {
    const iconMap: Record<string, string> = {
      'SleepConsistency': 'Moon',
      'MovementVolume': 'Footprints',
      'StrengthTraining': 'Dumbbell',
      'ExplosivePower': 'Zap',
      'MobilityFlexibility': 'RotateCcw',
      'PostureBreathControl': 'Wind',
      'ProteinAdequacy': 'Apple',
      'Hydration': 'Droplets',
      'CircadianSunlight': 'Sun',
      'ColdResilience': 'Snowflake',
      'RecoveryHygiene': 'Leaf',
      'StressResilience': 'Brain',
      'ConfidenceDrive': 'Target'
    };
    return iconMap[traitId] || 'Circle';
  };

  const theme = getScoreTheme(progress.currentScore);
  const categoryTheme = getCategoryTheme(trait.category);
  const hasRecentGain = progress.weeklyGain > 0;
  const level = getScoreLevel(progress.currentScore);
  const improvementPercent = progress.projectedScore > progress.currentScore 
    ? Math.round(((progress.projectedScore - progress.currentScore) / progress.currentScore) * 100)
    : 0;

  const levelNames = {
    elite: 'Elite Master',
    advanced: 'Advanced',
    intermediate: 'Intermediate', 
    beginner: 'Developing',
    starting: 'Getting Started'
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ 
        delay: index * 0.08, 
        duration: 0.5,
        type: "spring",
        stiffness: 100,
        damping: 15
      }}
      whileHover={{ 
        scale: 1.03, 
        y: -8,
        transition: { duration: 0.2 }
      }}
      whileTap={{ scale: 0.97 }}
      className="group"
    >
      <div 
        className={`
          relative p-6 rounded-2xl cursor-pointer transition-all duration-500
          ${theme.bg} border-2 ${theme.border} ${theme.shadow}
          hover:shadow-2xl hover:${theme.ring} hover:ring-4
          transform-gpu backdrop-blur-sm
          overflow-hidden
        `}
        onClick={onClick}
      >
        {/* Animated background gradient */}
        <motion.div
          className={`absolute inset-0 bg-gradient-to-br ${theme.gradient} opacity-5`}
          animate={{ 
            scale: [1, 1.1, 1],
            opacity: [0.05, 0.1, 0.05]
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />

        {/* Glow effect for high scores */}
        {level === 'elite' && (
          <motion.div
            className="absolute inset-0 bg-gradient-to-br from-yellow-400/20 to-orange-500/20 rounded-2xl"
            animate={{ 
              opacity: [0.2, 0.4, 0.2],
              scale: [0.95, 1.05, 0.95]
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        )}

        {/* Recent gain sparkle */}
        {hasRecentGain && (
          <motion.div
            className="absolute top-4 right-4 z-20"
            initial={{ scale: 0, rotate: 0 }}
            animate={{ 
              scale: [1, 1.2, 1], 
              rotate: [0, 180, 360],
              opacity: [0.8, 1, 0.8]
            }}
            transition={{ 
              duration: 2, 
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <div className={`flex items-center gap-1 px-2 py-1 rounded-full ${theme.badge} border backdrop-blur-sm`}>
              <Zap size={12} className={theme.icon} />
              <span className="text-xs font-bold">+{progress.weeklyGain}</span>
            </div>
          </motion.div>
        )}

        {/* Level badge */}
        <motion.div
          className="absolute top-4 left-4 z-10"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: index * 0.1 + 0.3, type: "spring", stiffness: 200 }}
        >
          <div className={`flex items-center gap-1 px-3 py-1 rounded-full ${categoryTheme.badge} border backdrop-blur-sm shadow-sm`}>
            <div className={`w-2 h-2 rounded-full ${categoryTheme.color}`} />
            <span className="text-xs font-semibold">{categoryTheme.name}</span>
          </div>
        </motion.div>

        {/* Main content */}
        <div className="relative z-10 pt-12">
          {/* Icon with glow */}
          <motion.div 
            className="flex items-center justify-center mb-4"
            whileHover={{ scale: 1.1, rotate: 5 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <div className={`relative w-16 h-16 rounded-2xl ${theme.bg} border-2 ${theme.border} flex items-center justify-center group-hover:shadow-lg transition-all duration-300`}>
              <Icon 
                name={getIconName(trait.id)} 
                size={28} 
                className={`${theme.icon} group-hover:scale-110 transition-transform duration-300`}
              />
              {level === 'elite' && (
                <motion.div
                  className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                >
                  <Trophy size={14} className="text-white" />
                </motion.div>
              )}
            </div>
          </motion.div>

          {/* Title */}
          <motion.h3 
            className={`font-bold text-lg mb-2 ${theme.text} text-center group-hover:scale-105 transition-transform duration-300`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: index * 0.1 + 0.4 }}
          >
            {trait.title}
          </motion.h3>

          {/* Level indicator */}
          <motion.div 
            className="text-center mb-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: index * 0.1 + 0.5 }}
          >
            <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full ${theme.badge} text-xs font-medium`}>
              <Star size={12} className={theme.icon} />
              {levelNames[level]}
            </div>
          </motion.div>

          {/* Description */}
          <motion.p 
            className="text-sm text-gray-600 mb-6 text-center leading-relaxed px-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: index * 0.1 + 0.6 }}
          >
            {trait.description}
          </motion.p>

          {/* Score display */}
          <motion.div 
            className="text-center mb-4"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: index * 0.1 + 0.7, type: "spring", stiffness: 200 }}
          >
            <motion.div 
              className={`text-4xl font-black ${theme.text} mb-1`}
              whileHover={{ scale: 1.1 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              {progress.currentScore}
              <span className="text-xl opacity-60">/100</span>
            </motion.div>
          </motion.div>

          {/* Progress bar with projection */}
          <motion.div 
            className="space-y-3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 + 0.8 }}
          >
            <div className="relative">
              <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                <motion.div
                  className={`h-full bg-gradient-to-r ${theme.gradient} rounded-full relative`}
                  initial={{ width: 0 }}
                  animate={{ width: `${progress.currentScore}%` }}
                  transition={{ 
                    delay: index * 0.1 + 1, 
                    duration: 1,
                    ease: "easeOut"
                  }}
                >
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                    animate={{ x: [-100, 200] }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: index * 0.1 + 2
                    }}
                  />
                </motion.div>
              </div>
              
              {/* Projection indicator */}
              {improvementPercent > 0 && (
                <motion.div
                  className="absolute top-0 h-3 rounded-full border-2 border-dashed border-gray-400 bg-gray-100/50"
                  style={{ 
                    left: `${progress.currentScore}%`, 
                    width: `${Math.min(progress.projectedScore - progress.currentScore, 100 - progress.currentScore)}%` 
                  }}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 + 1.5 }}
                />
              )}
            </div>

            {/* Improvement indicator */}
            {improvementPercent > 0 && (
              <motion.div 
                className="flex items-center justify-center gap-1 text-xs text-gray-600"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: index * 0.1 + 1.8 }}
              >
                <TrendingUp size={12} className="text-green-500" />
                <span>+{improvementPercent}% potential growth</span>
              </motion.div>
            )}
          </motion.div>

          {/* Click indicator */}
          <motion.div 
            className="flex items-center justify-center mt-4 opacity-0 group-hover:opacity-100 transition-all duration-300"
            initial={{ y: 10 }}
            whileHover={{ y: 0 }}
          >
            <div className="flex items-center gap-1 text-xs text-gray-500">
              <span>View details</span>
              <ChevronRight size={14} />
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}

function CategoryOverview({ category, data }: { category: string; data: any }) {
  const getCategoryTheme = (category: string) => {
    const themes: Record<string, any> = {
      'Physical': { 
        icon: 'Dumbbell',
        gradient: 'from-red-500 to-pink-500',
        bg: 'bg-gradient-to-br from-red-50 to-pink-50',
        border: 'border-red-200',
        text: 'text-red-700',
        emoji: '💪'
      },
      'Nutrition': { 
        icon: 'Apple',
        gradient: 'from-green-500 to-emerald-500',
        bg: 'bg-gradient-to-br from-green-50 to-emerald-50',
        border: 'border-green-200',
        text: 'text-green-700',
        emoji: '🥗'
      },
      'Sleep': { 
        icon: 'Moon',
        gradient: 'from-indigo-500 to-blue-500',
        bg: 'bg-gradient-to-br from-indigo-50 to-blue-50',
        border: 'border-indigo-200',
        text: 'text-indigo-700',
        emoji: '😴'
      },
      'Mental': { 
        icon: 'Brain',
        gradient: 'from-purple-500 to-violet-500',
        bg: 'bg-gradient-to-br from-purple-50 to-violet-50',
        border: 'border-purple-200',
        text: 'text-purple-700',
        emoji: '🧠'
      },
      'Recovery': { 
        icon: 'RotateCcw',
        gradient: 'from-orange-500 to-amber-500',
        bg: 'bg-gradient-to-br from-orange-50 to-amber-50',
        border: 'border-orange-200',
        text: 'text-orange-700',
        emoji: '🔄'
      }
    };
    return themes[category] || { 
      icon: 'Circle', 
      gradient: 'from-gray-500 to-slate-500',
      bg: 'bg-gray-50',
      border: 'border-gray-200',
      text: 'text-gray-700',
      emoji: '⚡'
    };
  };

  const getAverageLevel = (average: number) => {
    if (average >= 80) return { level: 'Elite', color: 'text-yellow-600' };
    if (average >= 60) return { level: 'Advanced', color: 'text-emerald-600' };
    if (average >= 40) return { level: 'Good', color: 'text-blue-600' };
    return { level: 'Growing', color: 'text-purple-600' };
  };

  const theme = getCategoryTheme(category);
  const averageLevel = getAverageLevel(data.average);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.5, type: "spring", stiffness: 150 }}
      whileHover={{ 
        scale: 1.05, 
        y: -5,
        transition: { duration: 0.2 }
      }}
      whileTap={{ scale: 0.95 }}
    >
      <div className={`
        relative p-4 rounded-xl cursor-pointer transition-all duration-300
        ${theme.bg} border-2 ${theme.border}
        hover:shadow-lg hover:shadow-gray-200/50
        overflow-hidden group
      `}>
        {/* Background gradient */}
        <motion.div
          className={`absolute inset-0 bg-gradient-to-br ${theme.gradient} opacity-5`}
          animate={{ 
            scale: [1, 1.1, 1],
            opacity: [0.05, 0.1, 0.05]
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />

        <div className="relative z-10 flex items-center space-x-3">
          {/* Icon */}
          <motion.div 
            className={`w-12 h-12 rounded-xl ${theme.bg} border ${theme.border} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}
            whileHover={{ rotate: 5 }}
          >
            <div className="text-lg">{theme.emoji}</div>
          </motion.div>
          
          {/* Content */}
          <div className="flex-1">
            <motion.h3 
              className={`font-bold ${theme.text} group-hover:scale-105 transition-transform duration-300`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
            >
              {category}
            </motion.h3>
            <motion.p 
              className="text-sm text-gray-600"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              {data.traits.length} traits • {averageLevel.level}
            </motion.p>
          </div>
          
          {/* Score */}
          <div className="text-center">
            <motion.div 
              className={`text-2xl font-black ${averageLevel.color} group-hover:scale-110 transition-transform duration-300`}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
            >
              {data.average}
            </motion.div>
            <div className="text-xs text-gray-500 font-medium">avg</div>
          </div>
        </div>

        {/* Hover effect indicator */}
        <motion.div 
          className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.4 }}
        >
          <ChevronRight size={16} className={theme.text} />
        </motion.div>
      </div>
    </motion.div>
  );
}

export function TraitsPage({ onTraitClick }: TraitsPageProps) {
  const [traitScores, setTraitScores] = useState<UserTraitScores>({});
  const [traitProgress, setTraitProgress] = useState<TraitProgress[]>([]);
  const [overallStats, setOverallStats] = useState<any>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTraitData();
  }, []);

  const loadTraitData = async () => {
    try {
      setLoading(true);
      const [scores, progress, stats] = await Promise.all([
        traitSystem.getTraitScores(),
        traitSystem.getTraitProgress(),
        traitSystem.getOverallStats()
      ]);

      setTraitScores(scores);
      setTraitProgress(progress);
      setOverallStats(stats);
    } catch (error) {
      console.error('Failed to load trait data:', error);
    } finally {
      setLoading(false);
    }
  };

  const categoryOverview = getTraitCategoryOverview(traitScores);
  const categories = ['All', ...Object.keys(categoryOverview)];

  const getTraitsToDisplay = () => {
    if (selectedCategory === 'All') {
      return TRAIT_DEFINITIONS;
    }
    return getTraitsByCategory(selectedCategory);
  };

  const getProgressForTrait = (traitId: string): TraitProgress => {
    return traitProgress.find(p => p.traitId === traitId) || {
      traitId: traitId as any,
      currentScore: traitScores[traitId] || 0,
      weeklyGain: 0,
      projectedScore: traitScores[traitId] || 0,
      lastUpdated: new Date()
    };
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your traits...</p>
        </div>
      </div>
    );
  }

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
          <h1 className="text-2xl font-bold text-gray-900 mb-2 flex items-center justify-center gap-2">
            <Flame className="text-orange-500" size={28} />
            Testosterone Traits
          </h1>
          <p className="text-gray-600">
            Track your progress in the key areas that naturally boost testosterone
          </p>
        </motion.div>

        {/* Overall Stats */}
        {overallStats && (
          <motion.div 
            className="relative overflow-hidden rounded-3xl p-6 mb-8 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 border border-purple-500/20"
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6, type: "spring", stiffness: 100 }}
          >
            {/* Animated background */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-blue-500/5 to-orange-500/10"
              animate={{ 
                scale: [1, 1.1, 1],
                opacity: [0.3, 0.6, 0.3]
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />

            <motion.div 
              className="relative z-10 text-center mb-4"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <h2 className="text-xl font-bold text-white mb-1 flex items-center justify-center gap-2">
                <Trophy className="text-yellow-400" size={24} />
                Your Testosterone Journey
              </h2>
              <p className="text-gray-300 text-sm">Overall progress across all traits</p>
            </motion.div>

            <div className="relative z-10 grid grid-cols-2 md:grid-cols-4 gap-6">
              <motion.div 
                className="text-center group cursor-pointer"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
                whileHover={{ scale: 1.05 }}
              >
                <div className="relative">
                  <motion.div 
                    className="text-3xl font-black text-blue-400 mb-1 group-hover:scale-110 transition-transform duration-300"
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  >
                    {overallStats.averageScore}
                  </motion.div>
                  <div className="text-blue-300 text-sm font-medium">Average Score</div>
                  <motion.div 
                    className="absolute -inset-2 bg-blue-400/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    animate={{ scale: [0.9, 1.1, 0.9] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  />
                </div>
              </motion.div>

              <motion.div 
                className="text-center group cursor-pointer"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6, type: "spring", stiffness: 200 }}
                whileHover={{ scale: 1.05 }}
              >
                <div className="relative">
                  <motion.div 
                    className="text-3xl font-black text-emerald-400 mb-1 group-hover:scale-110 transition-transform duration-300"
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                  >
                    {overallStats.traitsAbove75}
                  </motion.div>
                  <div className="text-emerald-300 text-sm font-medium">Elite Level</div>
                  <motion.div 
                    className="absolute -inset-2 bg-emerald-400/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    animate={{ scale: [0.9, 1.1, 0.9] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                  />
                </div>
              </motion.div>

              <motion.div 
                className="text-center group cursor-pointer"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.7, type: "spring", stiffness: 200 }}
                whileHover={{ scale: 1.05 }}
              >
                <div className="relative">
                  <motion.div 
                    className="text-3xl font-black text-purple-400 mb-1 group-hover:scale-110 transition-transform duration-300"
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                  >
                    {overallStats.traitsAbove50}
                  </motion.div>
                  <div className="text-purple-300 text-sm font-medium">Good Level</div>
                  <motion.div 
                    className="absolute -inset-2 bg-purple-400/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    animate={{ scale: [0.9, 1.1, 0.9] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                  />
                </div>
              </motion.div>

              <motion.div 
                className="text-center group cursor-pointer"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.8, type: "spring", stiffness: 200 }}
                whileHover={{ scale: 1.05 }}
              >
                <div className="relative">
                  <motion.div 
                    className="text-3xl font-black text-orange-400 mb-1 group-hover:scale-110 transition-transform duration-300"
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
                  >
                    {overallStats.weeklyActivity}
                  </motion.div>
                  <div className="text-orange-300 text-sm font-medium">Weekly Points</div>
                  <motion.div 
                    className="absolute -inset-2 bg-orange-400/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    animate={{ scale: [0.9, 1.1, 0.9] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
                  />
                </div>
              </motion.div>
            </div>

            {/* Decorative elements */}
            <motion.div
              className="absolute top-4 right-4 text-yellow-400/30"
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            >
              <Star size={20} />
            </motion.div>
            <motion.div
              className="absolute bottom-4 left-4 text-purple-400/30"
              animate={{ rotate: -360 }}
              transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
            >
              <Zap size={16} />
            </motion.div>
          </motion.div>
        )}

        {/* Category Overview */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3 mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.4 }}
        >
          {Object.entries(categoryOverview).map(([category, data]) => (
            <CategoryOverview 
              key={category} 
              category={category} 
              data={data}
            />
          ))}
        </motion.div>

        {/* Category Filter */}
        <motion.div 
          className="flex flex-wrap gap-2 justify-center"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.4 }}
        >
          {categories.map(category => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(category)}
              className="transition-all duration-200"
            >
              {category}
              {category !== 'All' && (
                <Badge variant="secondary" className="ml-2">
                  {getTraitsByCategory(category).length}
                </Badge>
              )}
            </Button>
          ))}
        </motion.div>
      </div>

      {/* Traits Grid */}
      <div className="p-6">
        <motion.div 
          className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-8 max-w-8xl mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.4 }}
        >
          {getTraitsToDisplay().map((trait, index) => (
            <TraitCard
              key={trait.id}
              trait={trait}
              progress={getProgressForTrait(trait.id)}
              onClick={() => onTraitClick?.(trait.id)}
              index={index}
            />
          ))}
        </motion.div>

        {/* Empty State */}
        {getTraitsToDisplay().length === 0 && (
          <motion.div 
            className="text-center py-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <Info size={48} className="text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-600 mb-2">
              No traits found
            </h3>
            <p className="text-gray-500">
              Try selecting a different category
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
