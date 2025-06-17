import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SKILL_CATEGORIES, SKILL_DEFINITIONS, UnlockedSkill } from "@/data/skillDefinitions";
import { skillUnlockSystem } from "@/lib/skillUnlockSystem";
import { SkillConnectionVisualization } from "./SkillConnectionVisualization";
import { Search, Filter, ArrowUp, Star, Zap } from "lucide-react";

interface SkillTreeProps {
  onSkillClick?: (skill: UnlockedSkill) => void;
}

interface SkillNodeProps {
  skill: any;
  isUnlocked: boolean;
  isRecentlyUnlocked: boolean;
  onClick?: () => void;
  index?: number;
}

function SkillNode({ skill, isUnlocked, isRecentlyUnlocked, onClick, index = 0 }: SkillNodeProps) {
  const category = SKILL_CATEGORIES[skill.category as keyof typeof SKILL_CATEGORIES];
  
  return (
    <motion.div
      className="group relative"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
    >
    <motion.div
      className={`
          relative w-20 h-20 rounded-2xl cursor-pointer transition-all duration-300 border
        ${isUnlocked 
            ? 'bg-white border-gray-200 shadow-sm hover:shadow-md' 
            : 'bg-gray-50 border-gray-200 opacity-60'
        }
          ${isRecentlyUnlocked ? 'ring-2 ring-blue-200' : ''}
      `}
        whileHover={isUnlocked ? { 
          scale: 1.05,
          transition: { duration: 0.2 }
        } : {}}
        whileTap={isUnlocked ? { scale: 0.95 } : {}}
        onClick={isUnlocked ? onClick : undefined}
    >
      {/* Skill Icon */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-2xl transform transition-transform group-hover:scale-110">
        {isUnlocked ? category.icon : '🔒'}
          </div>
      </div>
      
      {/* Level Badge */}
        <div 
          className={`absolute -top-2 -right-2 w-6 h-6 rounded-full text-xs font-bold flex items-center justify-center text-white shadow-sm ${
            isUnlocked ? 'bg-blue-500' : 'bg-gray-400'
          }`}
        >
          {skill.level}
        </div>
      
        {/* Recently Unlocked Animation */}
      {isRecentlyUnlocked && (
        <motion.div
            className="absolute -top-1 -right-1 text-blue-500"
          animate={{ 
              scale: [1, 1.2, 1]
          }}
          transition={{ 
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          ✨
        </motion.div>
      )}
    </motion.div>
      
      {/* Skill Title */}
      <motion.div 
        className="mt-3 text-center max-w-20"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: index * 0.05 + 0.2 }}
      >
        <div className={`text-xs font-medium leading-tight ${isUnlocked ? 'text-gray-900' : 'text-gray-400'}`}>
          {isUnlocked ? skill.title : '???'}
        </div>
        {isUnlocked && (
          <div className="text-xs text-gray-500 mt-1">
            Level {skill.level}
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}

function CategoryProgress({ category, progress, total, isSelected, onClick }: any) {
  const categoryData = SKILL_CATEGORIES[category as keyof typeof SKILL_CATEGORIES];
  const percentage = total > 0 ? (progress / total) * 100 : 0;
  
  return (
    <motion.button
      onClick={onClick}
      className={`
        relative p-4 rounded-2xl border transition-all duration-300 w-full text-left
        ${isSelected 
          ? 'bg-blue-50 border-blue-200 shadow-sm' 
          : 'bg-white border-gray-200 hover:bg-gray-50 hover:border-gray-300'
        }
      `}
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
    >
      <div className="flex items-center space-x-3">
        <div className="text-2xl">{categoryData.icon}</div>
        <div className="flex-1">
          <div className={`font-semibold ${isSelected ? 'text-blue-900' : 'text-gray-900'}`}>
            {categoryData.name}
          </div>
          <div className={`text-sm ${isSelected ? 'text-blue-600' : 'text-gray-500'}`}>
            {progress}/{total} unlocked
          </div>
        </div>
        <div className="text-right">
          <div className={`text-lg font-bold ${isSelected ? 'text-blue-600' : 'text-gray-900'}`}>
            {Math.round(percentage)}%
          </div>
          <div className="w-12 bg-gray-200 rounded-full h-2 mt-1">
            <div 
              className={`h-2 rounded-full transition-all duration-300 ${
                isSelected ? 'bg-blue-500' : 'bg-green-500'
              }`}
              style={{ width: `${percentage}%` }}
            />
          </div>
        </div>
      </div>
    </motion.button>
  );
}

export function ComprehensiveSkillTree({ onSkillClick }: SkillTreeProps) {
  const [unlockedSkills, setUnlockedSkills] = useState<UnlockedSkill[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [overallProgress, setOverallProgress] = useState<any>(null);
  const [viewMode, setViewMode] = useState<'tree' | 'connections'>('tree');
  const [searchTerm, setSearchTerm] = useState('');
  const [showOnlyUnlocked, setShowOnlyUnlocked] = useState(false);

  useEffect(() => {
    loadSkillData();
  }, []);

  const loadSkillData = async () => {
    const [unlocked, progress] = await Promise.all([
      skillUnlockSystem.getAllUnlockedSkills(),
      skillUnlockSystem.getOverallProgress()
    ]);
    
    setUnlockedSkills(unlocked);
    setOverallProgress(progress);
  };

  const getSkillsToDisplay = () => {
    let skills = SKILL_DEFINITIONS;
    
    // Filter by category
    if (selectedCategory !== 'All') {
      skills = skills.filter(skill => skill.category === selectedCategory);
    }
    
    // Filter by search term
    if (searchTerm) {
      skills = skills.filter(skill => 
        skill.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        skill.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Filter by unlocked status
    if (showOnlyUnlocked) {
      const unlockedIds = new Set(unlockedSkills.map(s => s.id));
      skills = skills.filter(skill => unlockedIds.has(skill.id));
    }
    
    return skills;
  };

  const isSkillUnlocked = (skillId: string) => {
    return unlockedSkills.some(skill => skill.id === skillId);
  };

  const isSkillRecentlyUnlocked = (skillId: string) => {
    const skill = unlockedSkills.find(s => s.id === skillId);
    return skill?.isRecentlyUnlocked || false;
  };

  const handleSkillClick = (skill: any) => {
    if (isSkillUnlocked(skill.id)) {
      const unlockedSkill = unlockedSkills.find(s => s.id === skill.id);
      if (unlockedSkill && onSkillClick) {
        onSkillClick(unlockedSkill);
      }
    }
  };

  const skillsByLevel = [1, 2, 3, 4, 5].map(level => ({
    level,
    skills: getSkillsToDisplay().filter(skill => skill.level === level)
  }));

  // If connection view is selected, render the connection visualization
  if (viewMode === 'connections') {
    return <SkillConnectionVisualization 
      onSkillClick={onSkillClick} 
      onBackToTree={() => setViewMode('tree')}
    />;
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
          <h1 className="text-2xl font-bold text-gray-900 mb-1">
            Skills
          </h1>
          <p className="text-gray-600">
            Track your progress and unlock new abilities
          </p>
        </motion.div>

        {/* Progress Overview */}
        {overallProgress && (
          <motion.div 
            className="bg-blue-50 rounded-2xl p-4 border border-blue-100 mb-4"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.4 }}
          >
            <div className="grid grid-cols-3 gap-4 mb-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {overallProgress.unlockedSkills}
                </div>
                <div className="text-blue-600 text-sm font-medium">Unlocked</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {Math.round((overallProgress.unlockedSkills / overallProgress.totalSkills) * 100)}%
                </div>
                <div className="text-green-600 text-sm font-medium">Complete</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {Object.keys(SKILL_CATEGORIES).length}
                </div>
                <div className="text-purple-600 text-sm font-medium">Categories</div>
              </div>
            </div>
            
            <div className="w-full bg-blue-100 rounded-full h-2">
              <motion.div 
                className="bg-blue-500 h-2 rounded-full"
                initial={{ width: 0 }}
                animate={{ 
                  width: `${(overallProgress.unlockedSkills / overallProgress.totalSkills) * 100}%` 
                }}
                transition={{ delay: 0.5, duration: 1, ease: "easeOut" }}
              />
            </div>
          </motion.div>
        )}
      </div>

      <div className="px-4 py-4 space-y-4">
        {/* View Toggle */}
        <div className="flex bg-gray-100 rounded-xl p-1">
          <button
            onClick={() => setViewMode('tree')}
            className={`flex-1 py-2.5 px-3 rounded-lg font-medium transition-all flex items-center justify-center gap-2 ${
              viewMode === 'tree' 
                ? 'bg-white text-gray-900 shadow-sm' 
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            🌳 <span className="text-sm">Skill Tree</span>
          </button>
          <button
            onClick={() => setViewMode('connections')}
            className={`flex-1 py-2.5 px-3 rounded-lg font-medium transition-all flex items-center justify-center gap-2 ${
              viewMode === 'tree' 
                ? 'bg-white text-gray-900 shadow-sm' 
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            🔗 <span className="text-sm">Connections</span>
          </button>
        </div>

        {/* Search and Filters */}
        <div className="space-y-3">
          <div className="flex items-center space-x-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search skills..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:outline-none"
              />
            </div>
            <button
              onClick={() => setShowOnlyUnlocked(!showOnlyUnlocked)}
              className={`px-4 py-3 rounded-xl font-medium transition-all flex items-center gap-2 ${
                showOnlyUnlocked 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Filter className="w-4 h-4" />
              <span className="text-sm">{showOnlyUnlocked ? 'All' : 'Unlocked'}</span>
            </button>
          </div>
        </div>

        {/* Category Overview */}
        {selectedCategory === 'All' && overallProgress && (
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              Categories
            </h3>
            <div className="grid grid-cols-1 gap-3">
              {Object.keys(SKILL_CATEGORIES).map(category => (
                <CategoryProgress
                  key={category}
                  category={category}
                  progress={overallProgress.byCategory[category]?.unlocked || 0}
                  total={overallProgress.byCategory[category]?.total || 0}
                  isSelected={false}
                  onClick={() => setSelectedCategory(category)}
              />
              ))}
            </div>
          </div>
        )}

        {/* Category Filter Pills */}
        <div className="flex flex-wrap gap-2">
          {['All', ...Object.keys(SKILL_CATEGORIES)].map(category => {
          const categoryData = category === 'All' ? null : SKILL_CATEGORIES[category as keyof typeof SKILL_CATEGORIES];
          const isSelected = selectedCategory === category;
          
          return (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
                className={`px-3 py-2 rounded-xl font-medium transition-all text-sm ${
                  isSelected 
                    ? 'bg-blue-500 text-white shadow-sm' 
                    : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
                }`}
            >
              {categoryData?.icon} {category}
            </button>
          );
        })}
      </div>

        {/* Skill Tree by Level */}
        <AnimatePresence mode="wait">
          <motion.div 
            className="space-y-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
        {skillsByLevel.map(({ level, skills }) => {
          if (skills.length === 0) return null;
          
          return (
                <motion.div 
                  key={level} 
                  className="space-y-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: level * 0.1 }}
                >
                  <div className="text-center">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Level {level}
              </h3>
                    <div className="w-16 h-0.5 bg-blue-500 rounded-full mx-auto" />
                  </div>
              
                  <div className="grid grid-cols-3 gap-4 justify-items-center">
                    {skills.map((skill, index) => (
                    <SkillNode
                        key={skill.id}
                      skill={skill}
                      isUnlocked={isSkillUnlocked(skill.id)}
                      isRecentlyUnlocked={isSkillRecentlyUnlocked(skill.id)}
                      onClick={() => handleSkillClick(skill)}
                        index={index}
                      />
                    ))}
                  </div>
                </motion.div>
          );
        })}
          </motion.div>
        </AnimatePresence>

        {/* No Results State */}
        {skillsByLevel.every(({ skills }) => skills.length === 0) && (
          <motion.div 
            className="text-center py-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-lg font-semibold text-gray-700 mb-2">No skills found</h3>
            <p className="text-gray-500 text-sm">Try adjusting your search or filters</p>
          </motion.div>
        )}
      </div>
    </div>
  );
}