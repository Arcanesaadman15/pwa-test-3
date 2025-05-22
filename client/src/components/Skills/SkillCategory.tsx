interface SkillCategoryProps {
  category: {
    id: string;
    name: string;
    icon: string;
    color: string;
    level: number;
    progress: number;
    skills: Array<{
      id: string;
      name: string;
      unlocked: boolean;
    }>;
  };
}

export function SkillCategory({ category }: SkillCategoryProps) {
  const getColorClasses = (color: string) => {
    const colorMap = {
      purple: {
        bg: 'bg-purple-50',
        text: 'text-purple-900',
        accent: 'bg-purple-500',
        border: 'border-purple-200',
        progress: 'bg-purple-500'
      },
      green: {
        bg: 'bg-green-50',
        text: 'text-green-900',
        accent: 'bg-green-500',
        border: 'border-green-200',
        progress: 'bg-green-500'
      },
      blue: {
        bg: 'bg-blue-50',
        text: 'text-blue-900',
        accent: 'bg-blue-500',
        border: 'border-blue-200',
        progress: 'bg-blue-500'
      },
      orange: {
        bg: 'bg-orange-50',
        text: 'text-orange-900',
        accent: 'bg-orange-500',
        border: 'border-orange-200',
        progress: 'bg-orange-500'
      },
      indigo: {
        bg: 'bg-indigo-50',
        text: 'text-indigo-900',
        accent: 'bg-indigo-500',
        border: 'border-indigo-200',
        progress: 'bg-indigo-500'
      }
    };
    
    return colorMap[color as keyof typeof colorMap] || colorMap.purple;
  };

  const colors = getColorClasses(category.color);
  const unlockedCount = category.skills.filter(skill => skill.unlocked).length;
  const totalSkills = category.skills.length;
  const progressPercentage = Math.round((unlockedCount / totalSkills) * 100);

  return (
    <div className={`${colors.bg} rounded-xl p-6 border ${colors.border}`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className={`w-12 h-12 ${colors.accent} rounded-xl flex items-center justify-center`}>
            <i className={`${category.icon} text-white text-xl`}></i>
          </div>
          <div>
            <h3 className={`font-bold ${colors.text}`}>{category.name}</h3>
            <p className="text-sm text-gray-600">
              Level {category.level} • {unlockedCount}/{totalSkills} skills unlocked
            </p>
          </div>
        </div>
        <div className="text-right">
          <div className={`text-lg font-bold ${colors.text}`}>{progressPercentage}%</div>
        </div>
      </div>
      
      {/* Progress Bar */}
      <div className="w-full bg-gray-200 rounded-full h-2 mb-6">
        <div 
          className={`${colors.progress} h-2 rounded-full progress-fill transition-all duration-1000`}
          style={{ width: `${progressPercentage}%` }}
        ></div>
      </div>
      
      {/* Skills */}
      <div className="flex items-center justify-between space-x-2">
        {category.skills.map((skill, index) => (
          <div key={skill.id} className="flex-1 flex flex-col items-center">
            {/* Connection Line */}
            {index > 0 && (
              <div className={`w-full h-0.5 mb-2 ${skill.unlocked ? colors.progress : 'bg-gray-300'}`}></div>
            )}
            
            {/* Skill Node */}
            <div 
              className={`skill-node w-12 h-12 rounded-full flex items-center justify-center text-white relative mb-2 ${
                skill.unlocked 
                  ? `${colors.accent} ${index === unlockedCount - 1 ? 'animate-skill-unlock' : ''}` 
                  : 'bg-gray-300'
              }`}
            >
              {skill.unlocked ? (
                <i className="fas fa-check"></i>
              ) : (
                <i className="fas fa-lock text-gray-500"></i>
              )}
            </div>
            
            {/* Skill Name */}
            <div className={`text-xs text-center font-medium ${
              skill.unlocked ? colors.text : 'text-gray-500'
            }`}>
              {skill.name}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
