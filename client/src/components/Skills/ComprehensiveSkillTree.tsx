import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { SKILL_CATEGORIES, SKILL_DEFINITIONS, UnlockedSkill } from "@/data/skillDefinitions";
import { skillUnlockSystem } from "@/lib/skillUnlockSystem";

interface SkillTreeProps {
  onSkillClick?: (skill: UnlockedSkill) => void;
}

interface SkillNodeProps {
  skill: any;
  isUnlocked: boolean;
  isRecentlyUnlocked: boolean;
  onClick?: () => void;
}

function SkillNode({ skill, isUnlocked, isRecentlyUnlocked, onClick }: SkillNodeProps) {
  const category = SKILL_CATEGORIES[skill.category as keyof typeof SKILL_CATEGORIES];
  
  return (
    <motion.div
      className={`
        relative w-16 h-16 rounded-full border-2 cursor-pointer flex items-center justify-center
        transition-all duration-300 hover:scale-110
        ${isUnlocked 
          ? `border-[${category.color}] bg-gradient-to-br from-gray-800 to-gray-700 shadow-lg` 
          : 'border-gray-600 bg-gray-800 opacity-50'
        }
        ${isRecentlyUnlocked ? 'ring-4 ring-yellow-400 animate-pulse' : ''}
      `}
      style={{
        borderColor: isUnlocked ? category.color : '#4B5563',
        boxShadow: isUnlocked ? `0 0 20px ${category.color}40` : 'none'
      }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ delay: Math.random() * 0.5 }}
    >
      {/* Skill Icon */}
      <div className="text-2xl">
        {isUnlocked ? category.icon : '🔒'}
      </div>
      
      {/* Level Badge */}
      {isUnlocked && (
        <div 
          className="absolute -top-2 -right-2 w-6 h-6 rounded-full text-xs font-bold flex items-center justify-center text-white"
          style={{ backgroundColor: category.color }}
        >
          {skill.level}
        </div>
      )}
      
      {/* Recently Unlocked Sparkle */}
      {isRecentlyUnlocked && (
        <motion.div
          className="absolute -top-1 -right-1 text-yellow-400"
          animate={{ 
            rotate: [0, 360],
            scale: [1, 1.3, 1]
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
  );
}

export function ComprehensiveSkillTree({ onSkillClick }: SkillTreeProps) {
  const [unlockedSkills, setUnlockedSkills] = useState<UnlockedSkill[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [overallProgress, setOverallProgress] = useState<any>(null);

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
    if (selectedCategory === 'All') {
      return SKILL_DEFINITIONS;
    }
    return SKILL_DEFINITIONS.filter(skill => skill.category === selectedCategory);
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

  const categories = ['All', ...Object.keys(SKILL_CATEGORIES)];

  const skillsByLevel = [1, 2, 3, 4, 5].map(level => ({
    level,
    skills: getSkillsToDisplay().filter(skill => skill.level === level)
  }));

  return (
    <div className="space-y-6 p-4">
      {/* Header with Progress */}
      <div className="text-center space-y-3">
        <h2 className="text-2xl font-bold text-white">Skill Tree</h2>
        {overallProgress && (
          <div className="bg-gray-800 rounded-xl p-4">
            <div className="text-lg font-semibold text-white mb-2">
              {overallProgress.unlockedSkills} / {overallProgress.totalSkills} Skills Unlocked
            </div>
            <div className="w-full bg-gray-700 rounded-full h-3">
              <div 
                className="bg-gradient-to-r from-purple-500 to-blue-500 h-3 rounded-full transition-all duration-500"
                style={{ 
                  width: `${(overallProgress.unlockedSkills / overallProgress.totalSkills) * 100}%` 
                }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2 justify-center">
        {categories.map(category => {
          const categoryData = category === 'All' ? null : SKILL_CATEGORIES[category as keyof typeof SKILL_CATEGORIES];
          const isSelected = selectedCategory === category;
          
          return (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`
                px-4 py-2 rounded-lg font-medium transition-all
                ${isSelected 
                  ? 'bg-purple-600 text-white' 
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }
              `}
            >
              {categoryData?.icon} {category}
            </button>
          );
        })}
      </div>

      {/* Category Progress Summary */}
      {selectedCategory !== 'All' && overallProgress && (
        <div className="bg-gray-800 rounded-xl p-4">
          <div className="text-center">
            <div className="text-lg font-semibold text-white mb-2">
              {selectedCategory} Category
            </div>
            <div className="text-sm text-gray-300">
              {overallProgress.byCategory[selectedCategory]?.unlocked || 0} / {overallProgress.byCategory[selectedCategory]?.total || 0} Skills
            </div>
          </div>
        </div>
      )}

      {/* Skill Tree Grid by Level */}
      <div className="space-y-8">
        {skillsByLevel.map(({ level, skills }) => {
          if (skills.length === 0) return null;
          
          return (
            <div key={level} className="space-y-4">
              <h3 className="text-xl font-bold text-center text-white">
                Level {level}
              </h3>
              
              <div className="grid grid-cols-4 gap-4 justify-items-center">
                {skills.map((skill) => (
                  <div key={skill.id} className="text-center space-y-2">
                    <SkillNode
                      skill={skill}
                      isUnlocked={isSkillUnlocked(skill.id)}
                      isRecentlyUnlocked={isSkillRecentlyUnlocked(skill.id)}
                      onClick={() => handleSkillClick(skill)}
                    />
                    
                    {/* Skill Title (only show if unlocked) */}
                    {isSkillUnlocked(skill.id) && (
                      <div className="text-xs text-gray-300 max-w-16 truncate">
                        {skill.title}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="bg-gray-800 rounded-xl p-4 mt-8">
        <h4 className="text-white font-semibold mb-3 text-center">Legend</h4>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 rounded-full border-2 border-purple-500 bg-gray-700"></div>
            <span className="text-gray-300">Unlocked</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 rounded-full border-2 border-gray-600 bg-gray-800 opacity-50"></div>
            <span className="text-gray-300">Locked</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 rounded-full border-2 border-yellow-400 bg-gray-700 relative">
              <div className="absolute -top-0.5 -right-0.5 text-xs">✨</div>
            </div>
            <span className="text-gray-300">Recently Unlocked</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="text-gray-300">🔒</div>
            <span className="text-gray-300">Hidden Skills</span>
          </div>
        </div>
      </div>
    </div>
  );
}