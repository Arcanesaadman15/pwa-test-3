import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { TRAIT_DEFINITIONS, getTraitsByCategory } from '@/data/traitDefinitions';
import { traitSystem } from '@/lib/traitSystem';
import { UserTraitScores, TraitProgress } from '@/types/traits';
import { storage } from '@/lib/storage';
import { getTraitCategoryOverview } from '@/lib/traitInitializer';
import { Icon } from '@/lib/iconUtils';
import { Flame, Trophy, Star, TrendingUp, Zap, Target, Brain, Apple, Moon, Dumbbell } from 'lucide-react';

interface TraitsPageProps {
  onTraitClick?: (traitId: string) => void;
}

interface CompactTraitCardProps {
  trait: any;
  progress: TraitProgress;
  onClick?: () => void;
  index: number;
}

function CompactTraitCard({ trait, progress, onClick, index }: CompactTraitCardProps) {
  const getScoreTheme = (score: number) => {
    if (score >= 85) return { 
      gradient: 'from-yellow-400 to-orange-500', 
      text: 'text-yellow-700', 
      bg: 'bg-gradient-to-br from-yellow-50 to-orange-50',
      level: '🏆 Elite'
    };
    if (score >= 70) return { 
      gradient: 'from-emerald-400 to-teal-500', 
      text: 'text-emerald-700', 
      bg: 'bg-gradient-to-br from-emerald-50 to-teal-50',
      level: '⭐ Advanced'
    };
    if (score >= 50) return { 
      gradient: 'from-blue-400 to-indigo-500', 
      text: 'text-blue-700', 
      bg: 'bg-gradient-to-br from-blue-50 to-indigo-50',
      level: '💪 Good'
    };
    if (score >= 30) return { 
      gradient: 'from-purple-400 to-pink-500', 
      text: 'text-purple-700', 
      bg: 'bg-gradient-to-br from-purple-50 to-pink-50',
      level: '🌱 Growing'
    };
    return { 
      gradient: 'from-gray-400 to-slate-500', 
      text: 'text-gray-700', 
      bg: 'bg-gradient-to-br from-gray-50 to-slate-50',
      level: '🚀 Starting'
    };
  };

  const getIconName = (traitId: string) => {
    const iconMap: Record<string, string> = {
      'SleepConsistency': 'Moon', 'MovementVolume': 'Footprints', 'StrengthTraining': 'Dumbbell',
      'ExplosivePower': 'Zap', 'MobilityFlexibility': 'RotateCcw', 'PostureBreathControl': 'Wind',
      'ProteinAdequacy': 'Apple', 'Hydration': 'Droplets', 'CircadianSunlight': 'Sun',
      'ColdResilience': 'Snowflake', 'RecoveryHygiene': 'Leaf', 'StressResilience': 'Brain',
      'ConfidenceDrive': 'Target'
    };
    return iconMap[traitId] || 'Circle';
  };

  const theme = getScoreTheme(progress.currentScore);
  const hasGain = progress.weeklyGain > 0;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.03, duration: 0.3 }}
      whileHover={{ scale: 1.05 }}
      className="group cursor-pointer"
      onClick={onClick}
    >
      <div className={`relative p-3 rounded-xl ${theme.bg} border border-gray-200 hover:border-gray-300 transition-all duration-300 overflow-hidden`}>
        {/* Background gradient */}
        <div className={`absolute inset-0 bg-gradient-to-br ${theme.gradient} opacity-5`} />
        
        {/* Gain indicator */}
        {hasGain && (
          <div className="absolute top-1 right-1 w-2 h-2 bg-green-500 rounded-full animate-pulse" />
        )}

        <div className="relative z-10">
          {/* Icon and Score */}
          <div className="flex items-center justify-between mb-2">
            <div className="w-8 h-8 rounded-lg bg-white/80 flex items-center justify-center">
              <Icon name={getIconName(trait.id)} size={16} className={theme.text} />
            </div>
            <div className={`text-lg font-black ${theme.text}`}>
              {progress.currentScore}
            </div>
          </div>

          {/* Title */}
          <h3 className="text-sm font-bold text-gray-800 mb-1 leading-tight">
            {trait.title}
          </h3>

          {/* Level */}
          <div className="text-xs text-gray-600 mb-2">
            {theme.level}
          </div>

          {/* Progress bar */}
          <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
            <motion.div
              className={`h-full bg-gradient-to-r ${theme.gradient} rounded-full`}
              initial={{ width: 0 }}
              animate={{ width: `${progress.currentScore}%` }}
              transition={{ delay: index * 0.05 + 0.5, duration: 0.8 }}
            />
          </div>

          {/* Weekly gain */}
          {hasGain && (
            <div className="text-xs text-green-600 mt-1 flex items-center gap-1">
              <TrendingUp size={10} />
              +{progress.weeklyGain} this week
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

function CategoryCard({ category, data, index }: { category: string; data: any; index: number }) {
  const getCategoryTheme = (category: string) => {
    const themes: Record<string, any> = {
      'Physical': { 
        icon: Dumbbell,
        gradient: 'from-red-500 to-pink-500',
        bg: 'bg-gradient-to-br from-red-50 to-pink-50',
        border: 'border-red-200',
        text: 'text-red-700',
        emoji: '💪',
        name: 'Physical Power'
      },
      'Nutrition': { 
        icon: Apple,
        gradient: 'from-green-500 to-emerald-500',
        bg: 'bg-gradient-to-br from-green-50 to-emerald-50',
        border: 'border-green-200',
        text: 'text-green-700',
        emoji: '🥗',
        name: 'Nutrition Mastery'
      },
      'Sleep': { 
        icon: Moon,
        gradient: 'from-indigo-500 to-blue-500',
        bg: 'bg-gradient-to-br from-indigo-50 to-blue-50',
        border: 'border-indigo-200',
        text: 'text-indigo-700',
        emoji: '😴',
        name: 'Sleep Quality'
      },
      'Mental': { 
        icon: Brain,
        gradient: 'from-purple-500 to-violet-500',
        bg: 'bg-gradient-to-br from-purple-50 to-violet-50',
        border: 'border-purple-200',
        text: 'text-purple-700',
        emoji: '🧠',
        name: 'Mental Strength'
      },
      'Recovery': { 
        icon: Target,
        gradient: 'from-orange-500 to-amber-500',
        bg: 'bg-gradient-to-br from-orange-50 to-amber-50',
        border: 'border-orange-200',
        text: 'text-orange-700',
        emoji: '🔄',
        name: 'Recovery Focus'
      }
    };
    return themes[category] || { 
      icon: Star, 
      gradient: 'from-gray-500 to-slate-500',
      bg: 'bg-gray-50',
      border: 'border-gray-200',
      text: 'text-gray-700',
      emoji: '⚡',
      name: category
    };
  };

  const theme = getCategoryTheme(category);
  const IconComponent = theme.icon;
  
  // Calculate potential score (current + 20% improvement)
  const currentAvg = data.current || 0;
  const potentialAvg = Math.min(100, currentAvg + 20);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ 
        delay: index * 0.1, 
        duration: 0.5, 
        type: "spring", 
        stiffness: 150 
      }}
      whileHover={{ 
        scale: 1.05, 
        y: -5,
        transition: { duration: 0.2 }
      }}
      className="group cursor-pointer"
    >
      <div className={`
        relative p-4 rounded-2xl ${theme.bg} border-2 ${theme.border}
        hover:shadow-xl hover:shadow-gray-200/50 transition-all duration-300
        overflow-hidden
      `}>
        {/* Subtle background gradient */}
        <div className={`absolute inset-0 bg-gradient-to-br ${theme.gradient} opacity-5`} />

        <div className="relative z-10">
          {/* Header */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className={`w-10 h-10 rounded-xl ${theme.bg} border ${theme.border} flex items-center justify-center`}>
                <span className="text-lg">{theme.emoji}</span>
              </div>
              <div>
                <h3 className={`font-bold ${theme.text} text-sm`}>
                  {theme.name}
                </h3>
                <p className="text-xs text-gray-600">
                  {data.total} traits
                </p>
              </div>
            </div>
            <div className="text-right">
              <div className={`text-2xl font-black ${theme.text}`}>
                {currentAvg}
              </div>
              <div className="text-xs text-gray-500">current</div>
            </div>
          </div>

          {/* Progress Bars */}
          <div className="space-y-2">
            {/* Current Progress */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs font-medium text-gray-600">Current</span>
                <span className="text-xs font-bold text-gray-700">{currentAvg}%</span>
              </div>
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <motion.div
                  className={`h-full bg-gradient-to-r ${theme.gradient} rounded-full`}
                  initial={{ width: 0 }}
                  animate={{ width: `${currentAvg}%` }}
                  transition={{ 
                    delay: index * 0.1 + 0.5, 
                    duration: 1,
                    ease: "easeOut"
                  }}
                />
              </div>
            </div>

            {/* Potential Progress */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs font-medium text-gray-600">Potential</span>
                <span className="text-xs font-bold text-emerald-600">{potentialAvg}%</span>
              </div>
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-emerald-400 to-teal-500 rounded-full opacity-70"
                  initial={{ width: 0 }}
                  animate={{ width: `${potentialAvg}%` }}
                  transition={{ 
                    delay: index * 0.1 + 0.8, 
                    duration: 1,
                    ease: "easeOut"
                  }}
                />
              </div>
            </div>
          </div>

          {/* Improvement indicator */}
          <div className="flex items-center justify-between mt-3 pt-2 border-t border-gray-200">
            <div className="flex items-center gap-1">
              <TrendingUp size={12} className="text-emerald-500" />
              <span className="text-xs text-emerald-600 font-medium">
                +{potentialAvg - currentAvg} potential
              </span>
            </div>
            <div className="text-xs text-gray-500">
              8-week goal
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export function TraitsPage({ onTraitClick }: TraitsPageProps) {
  const [traitScores, setTraitScores] = useState<UserTraitScores>({});
  const [traitProgress, setTraitProgress] = useState<TraitProgress[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTraitData();
  }, []);

  const loadTraitData = async () => {
    try {
      setLoading(true);
      const scores = await storage.getUserTraits();
      const progress = await traitSystem.getAllTraitProgress();

      setTraitScores(scores);
      setTraitProgress(progress);
    } catch (error) {
      console.error('Error loading trait data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getProgressForTrait = (traitId: string): TraitProgress => {
    const progress = traitProgress.find(p => p.id === traitId);
    if (progress) return progress;
    
    return {
      id: traitId as any,
      title: TRAIT_DEFINITIONS.find(t => t.id === traitId)?.title || '',
      description: TRAIT_DEFINITIONS.find(t => t.id === traitId)?.description || '',
      category: TRAIT_DEFINITIONS.find(t => t.id === traitId)?.category || 'Physical',
      icon: '',
      currentScore: traitScores[traitId] || 0,
      projectedScore: (traitScores[traitId] || 0) + 10,
      weeklyGain: 0
    };
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const categoryOverview = getTraitCategoryOverview(traitScores);

  return (
    <div className="h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 p-4 flex flex-col overflow-hidden">
      {/* Header */}
      <motion.div 
        className="text-center mb-4"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-2xl font-black text-gray-900 flex items-center justify-center gap-2">
          <Flame className="text-orange-500" size={28} />
          Testosterone Traits Dashboard
        </h1>
        <p className="text-sm text-gray-600 mt-1">Complete view of your masculine development</p>
      </motion.div>

      {/* Category Cards - Now at the top */}
      <motion.div 
        className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 mb-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        {Object.entries(categoryOverview).map(([category, data], index) => (
          <CategoryCard 
            key={category} 
            category={category} 
            data={data} 
            index={index}
          />
        ))}
      </motion.div>

      {/* Traits Grid - Compact for screenshot */}
      <div className="flex-1 overflow-hidden">
        <motion.div 
          className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 gap-3 h-full"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          {TRAIT_DEFINITIONS.map((trait, index) => (
            <CompactTraitCard
              key={trait.id}
              trait={trait}
              progress={getProgressForTrait(trait.id)}
              onClick={() => onTraitClick?.(trait.id)}
              index={index}
            />
          ))}
        </motion.div>
      </div>

      {/* Bottom signature for viral sharing */}
      <motion.div 
        className="text-center mt-3 py-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.5 }}
      >
        <div className="text-xs text-gray-500 flex items-center justify-center gap-1">
          <Zap size={12} className="text-orange-500" />
          <span className="font-medium">PeakForge</span>
          <span>• Natural Testosterone Optimization</span>
        </div>
      </motion.div>
    </div>
  );
}