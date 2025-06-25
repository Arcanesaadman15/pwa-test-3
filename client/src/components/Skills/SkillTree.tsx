import { UserSkills } from "@/types";
import { Lock, Star, Trophy, Target } from "lucide-react";
import { Icon, getCategoryIcon } from '@/lib/iconUtils';

interface SkillTreeProps {
  userSkills: UserSkills;
}

export function SkillTree({ userSkills }: SkillTreeProps) {
  const skillCategories = [
    {
      id: 'sleep',
      name: 'Sleep Mastery',
      icon: getCategoryIcon('Sleep'),
      description: 'Master the foundation of recovery',
      color: 'purple',
      level: userSkills.sleep?.level || 1,
      progress: userSkills.sleep?.progress || 0,
      maxLevel: 10,
      skills: [
        { name: 'Consistent Bedtime', unlocked: true, description: 'Regular sleep schedule' },
        { name: 'Sleep Quality', unlocked: (userSkills.sleep?.level || 0) >= 2, description: 'Optimize sleep environment' },
        { name: 'Recovery Expert', unlocked: (userSkills.sleep?.level || 0) >= 4, description: 'Advanced sleep optimization' },
        { name: 'Sleep Master', unlocked: (userSkills.sleep?.level || 0) >= 6, description: 'Complete sleep mastery' }
      ]
    },
    {
      id: 'movement',
      name: 'Movement Flow',
      icon: getCategoryIcon('Physical'),
      description: 'Build strength, endurance, and mobility',
      color: 'green',
      level: userSkills.movement?.level || 1,
      progress: userSkills.movement?.progress || 0,
      maxLevel: 10,
      skills: [
        { name: 'Daily Steps', unlocked: true, description: 'Consistent walking habit' },
        { name: 'Strength Training', unlocked: (userSkills.movement?.level || 0) >= 2, description: 'Build muscle strength' },
        { name: 'Flexibility', unlocked: (userSkills.movement?.level || 0) >= 3, description: 'Improve range of motion' },
        { name: 'Athletic Performance', unlocked: (userSkills.movement?.level || 0) >= 5, description: 'Peak physical condition' }
      ]
    },
    {
      id: 'nutrition',
      name: 'Nutrition Wisdom',
      icon: getCategoryIcon('Nutrition'),
      description: 'Fuel your body with optimal nutrition',
      color: 'orange',
      level: userSkills.nutrition?.level || 1,
      progress: userSkills.nutrition?.progress || 0,
      maxLevel: 10,
      skills: [
        { name: 'Meal Planning', unlocked: true, description: 'Plan balanced meals' },
        { name: 'Macro Balance', unlocked: (userSkills.nutrition?.level || 0) >= 2, description: 'Understand macronutrients' },
        { name: 'Meal Prep Pro', unlocked: (userSkills.nutrition?.level || 0) >= 4, description: 'Efficient food preparation' },
        { name: 'Nutrition Expert', unlocked: (userSkills.nutrition?.level || 0) >= 6, description: 'Advanced nutrition knowledge' }
      ]
    },
    {
      id: 'recovery',
      name: 'Recovery Arts',
      icon: getCategoryIcon('Recovery'),
      description: 'Master recovery and stress management',
      color: 'blue',
      level: userSkills.recovery?.level || 1,
      progress: userSkills.recovery?.progress || 0,
      maxLevel: 10,
      skills: [
        { name: 'Stress Awareness', unlocked: true, description: 'Recognize stress signals' },
        { name: 'Breathing Techniques', unlocked: (userSkills.recovery?.level || 0) >= 2, description: 'Controlled breathing' },
        { name: 'Recovery Protocols', unlocked: (userSkills.recovery?.level || 0) >= 4, description: 'Active recovery methods' },
        { name: 'Zen Master', unlocked: (userSkills.recovery?.level || 0) >= 7, description: 'Complete stress mastery' }
      ]
    },
    {
      id: 'mindfulness',
      name: 'Mental Clarity',
      icon: getCategoryIcon('Mental'),
      description: 'Develop focus, presence, and awareness',
      color: 'pink',
      level: userSkills.mindfulness?.level || 1,
      progress: userSkills.mindfulness?.progress || 0,
      maxLevel: 10,
      skills: [
        { name: 'Meditation Basics', unlocked: true, description: 'Daily meditation practice' },
        { name: 'Focus Training', unlocked: (userSkills.mindfulness?.level || 0) >= 3, description: 'Concentration exercises' },
        { name: 'Emotional Balance', unlocked: (userSkills.mindfulness?.level || 0) >= 5, description: 'Emotional regulation' },
        { name: 'Mindfulness Master', unlocked: (userSkills.mindfulness?.level || 0) >= 8, description: 'Deep awareness state' }
      ]
    }
  ];

  const getColorClasses = (color: string) => {
    const colorMap: Record<string, any> = {
      purple: {
        bg: 'bg-purple-600',
        border: 'border-purple-500',
        progress: 'bg-purple-500',
        text: 'text-purple-400'
      },
      green: {
        bg: 'bg-green-600',
        border: 'border-green-500',
        progress: 'bg-green-500',
        text: 'text-green-400'
      },
      orange: {
        bg: 'bg-orange-600',
        border: 'border-orange-500',
        progress: 'bg-orange-500',
        text: 'text-orange-400'
      },
      blue: {
        bg: 'bg-blue-600',
        border: 'border-blue-500',
        progress: 'bg-blue-500',
        text: 'text-blue-400'
      },
      pink: {
        bg: 'bg-pink-600',
        border: 'border-pink-500',
        progress: 'bg-pink-500',
        text: 'text-pink-400'
      }
    };
    return colorMap[color] || colorMap.purple;
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <div className="bg-gradient-to-br from-purple-900 via-purple-800 to-pink-800 px-6 pt-12 pb-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            Skill Tree
          </h1>
          <p className="text-purple-200">
            Unlock abilities as you progress
          </p>
        </div>
      </div>

      <div className="px-6 py-6 space-y-6">
        {/* Overall Progress */}
        <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700">
          <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <Trophy className="w-5 h-5 text-yellow-400" />
            Overall Progress
          </h3>
          <div className="grid grid-cols-5 gap-3">
            {skillCategories.map((category) => {
              const colors = getColorClasses(category.color);
              const progressPercent = (category.level / category.maxLevel) * 100;
              
              return (
                <div key={category.id} className="text-center">
                  <div className={`w-12 h-12 mx-auto rounded-full ${colors.bg} flex items-center justify-center text-lg mb-2`}>
                    <Icon name={category.icon} size={20} className="text-white" />
                  </div>
                  <div className="text-xs text-gray-400 mb-1">{category.name.split(' ')[0]}</div>
                  <div className="text-sm font-bold text-white">Lv.{category.level}</div>
                  <div className="w-full bg-gray-700 rounded-full h-1 mt-1">
                    <div 
                      className={`h-1 rounded-full ${colors.progress}`}
                      style={{ width: `${progressPercent}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Skill Categories */}
        {skillCategories.map((category) => {
          const colors = getColorClasses(category.color);
          const progressPercent = (category.progress / 100) * 100;
          
          return (
            <div key={category.id} className="bg-gray-800 rounded-2xl p-6 border border-gray-700">
              {/* Category Header */}
              <div className="flex items-center gap-4 mb-4">
                <div className={`w-16 h-16 rounded-2xl ${colors.bg} flex items-center justify-center text-2xl`}>
                  <Icon name={category.icon} size={32} className="text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-white">{category.name}</h3>
                  <p className="text-gray-400 text-sm mb-2">{category.description}</p>
                  <div className="flex items-center gap-2">
                    <span className={`font-bold ${colors.text}`}>Level {category.level}</span>
                    <div className="flex-1 bg-gray-700 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${colors.progress}`}
                        style={{ width: `${progressPercent}%` }}
                      ></div>
                    </div>
                    <span className="text-xs text-gray-400">{category.progress}%</span>
                  </div>
                </div>
              </div>

              {/* Skills Grid */}
              <div className="space-y-3">
                {category.skills.map((skill, index) => (
                  <div 
                    key={index}
                    className={`flex items-center gap-4 p-4 rounded-xl border transition-all ${
                      skill.unlocked 
                        ? `${colors.border}/30 bg-gray-700/50`
                        : 'border-gray-600 bg-gray-700/30 opacity-50'
                    }`}
                  >
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      skill.unlocked ? colors.bg : 'bg-gray-600'
                    }`}>
                      {skill.unlocked ? (
                        <Star className="w-5 h-5 text-white" />
                      ) : (
                        <Lock className="w-5 h-5 text-gray-400" />
                      )}
                    </div>
                    <div className="flex-1">
                      <h4 className={`font-medium ${skill.unlocked ? 'text-white' : 'text-gray-400'}`}>
                        {skill.name}
                      </h4>
                      <p className="text-xs text-gray-500">{skill.description}</p>
                    </div>
                    {skill.unlocked && (
                      <div className={`text-xs font-medium px-2 py-1 rounded-full ${colors.bg} text-white`}>
                        Unlocked
                      </div>
                    )}
                    {!skill.unlocked && (
                      <div className="text-xs text-gray-500">
                        Lv.{index + 2} Required
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Next Unlock */}
              <div className="mt-4 p-3 bg-gray-700/50 rounded-xl">
                <div className="flex items-center gap-2 text-sm">
                  <Target className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-400">
                    Next unlock at Level {category.level + 1} 
                    <span className={`ml-1 font-medium ${colors.text}`}>
                      ({100 - category.progress}% remaining)
                    </span>
                  </span>
                </div>
              </div>
            </div>
          );
        })}

        {/* Skill Tips */}
        <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700">
          <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <Star className="w-5 h-5 text-yellow-400" />
            How to Level Up
          </h3>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-xs font-bold text-white">1</div>
              <div>
                <h4 className="font-medium text-white">Complete Daily Tasks</h4>
                <p className="text-sm text-gray-400">Each completed task in a category gives you skill points</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-green-600 rounded-full flex items-center justify-center text-xs font-bold text-white">2</div>
              <div>
                <h4 className="font-medium text-white">Maintain Streaks</h4>
                <p className="text-sm text-gray-400">Consistent daily practice accelerates your progress</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-purple-600 rounded-full flex items-center justify-center text-xs font-bold text-white">3</div>
              <div>
                <h4 className="font-medium text-white">Unlock New Abilities</h4>
                <p className="text-sm text-gray-400">Higher levels unlock advanced techniques and benefits</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}