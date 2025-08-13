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
import { ArrowUp, TrendingUp, Target, Info, Flame, Award } from 'lucide-react';

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
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-blue-600';
    if (score >= 40) return 'text-orange-600';
    return 'text-red-600';
  };

  const getProgressColor = (score: number) => {
    if (score >= 80) return 'bg-green-500';
    if (score >= 60) return 'bg-blue-500';
    if (score >= 40) return 'bg-orange-500';
    return 'bg-red-500';
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      'Physical': 'bg-red-100 text-red-800',
      'Nutrition': 'bg-green-100 text-green-800',
      'Sleep': 'bg-blue-100 text-blue-800',
      'Mental': 'bg-purple-100 text-purple-800',
      'Recovery': 'bg-orange-100 text-orange-800'
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
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

  const hasRecentGain = progress.weeklyGain > 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ 
        delay: index * 0.05, 
        duration: 0.3,
        type: "spring",
        stiffness: 150
      }}
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.98 }}
    >
      <Card 
        className="p-6 cursor-pointer transition-all duration-300 hover:shadow-lg border-2 hover:border-blue-200 relative overflow-hidden"
        onClick={onClick}
      >
        {/* Recent gain indicator */}
        {hasRecentGain && (
          <motion.div
            className="absolute top-3 right-3"
            animate={{ scale: [1, 1.1, 1], opacity: [0.7, 1, 0.7] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Badge variant="secondary" className="bg-green-100 text-green-700 text-xs">
              +{progress.weeklyGain} this week
            </Badge>
          </motion.div>
        )}

        <div className="flex items-start space-x-4">
          {/* Icon */}
          <div className="flex-shrink-0">
            <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center">
              <Icon 
                name={getIconName(trait.id)} 
                size={24} 
                className="text-gray-600"
              />
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-gray-900 truncate">
                {trait.title}
              </h3>
              <Badge className={getCategoryColor(trait.category)}>
                {trait.category}
              </Badge>
            </div>

            <p className="text-sm text-gray-600 mb-4 line-clamp-2">
              {trait.description}
            </p>

            {/* Score and Progress */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">
                  Current Score
                </span>
                <span className={`text-lg font-bold ${getScoreColor(progress.currentScore)}`}>
                  {progress.currentScore}/100
                </span>
              </div>

              <div className="space-y-2">
                <Progress 
                  value={progress.currentScore} 
                  className="h-2"
                />
                
                {/* Projected score overlay */}
                {progress.projectedScore > progress.currentScore && (
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>Potential</span>
                    <span className="flex items-center">
                      <TrendingUp size={12} className="mr-1" />
                      {progress.projectedScore}/100
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}

function CategoryOverview({ category, data }: { category: string; data: any }) {
  const getCategoryIcon = (category: string) => {
    const icons: Record<string, string> = {
      'Physical': 'Dumbbell',
      'Nutrition': 'Apple',
      'Sleep': 'Moon',
      'Mental': 'Brain',
      'Recovery': 'RotateCcw'
    };
    return icons[category] || 'Circle';
  };

  const getAverageColor = (average: number) => {
    if (average >= 80) return 'text-green-600';
    if (average >= 60) return 'text-blue-600';
    if (average >= 40) return 'text-orange-600';
    return 'text-red-600';
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      whileHover={{ scale: 1.02 }}
    >
      <Card className="p-4 border-2 hover:border-blue-200 transition-all duration-300">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center">
            <Icon name={getCategoryIcon(category)} size={20} className="text-gray-600" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900">{category}</h3>
            <p className="text-sm text-gray-600">{data.traits.length} traits</p>
          </div>
          <div className="text-right">
            <div className={`text-xl font-bold ${getAverageColor(data.average)}`}>
              {data.average}
            </div>
            <div className="text-xs text-gray-500">average</div>
          </div>
        </div>
      </Card>
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
            className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-4 border border-blue-100 mb-6"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.4 }}
          >
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {overallStats.averageScore}
                </div>
                <div className="text-blue-600 text-sm font-medium">Average Score</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {overallStats.traitsAbove75}
                </div>
                <div className="text-green-600 text-sm font-medium">Elite Level</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {overallStats.traitsAbove50}
                </div>
                <div className="text-purple-600 text-sm font-medium">Good Level</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">
                  {overallStats.weeklyActivity}
                </div>
                <div className="text-orange-600 text-sm font-medium">Weekly Points</div>
              </div>
            </div>
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
      <div className="p-4">
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 max-w-7xl mx-auto"
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
