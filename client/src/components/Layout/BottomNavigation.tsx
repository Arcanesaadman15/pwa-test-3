import { CheckSquare, BarChart3, TreePine, User } from "lucide-react";

interface BottomNavigationProps {
  activeTab: 'tasks' | 'stats' | 'skills' | 'profile';
  onTabChange: (tab: 'tasks' | 'stats' | 'skills' | 'profile') => void;
}

export function BottomNavigation({ activeTab, onTabChange }: BottomNavigationProps) {
  const tabs = [
    { 
      id: 'tasks' as const, 
      label: 'Tasks', 
      icon: CheckSquare,
      activeColor: 'text-blue-400',
      inactiveColor: 'text-gray-500'
    },
    { 
      id: 'stats' as const, 
      label: 'Stats', 
      icon: BarChart3,
      activeColor: 'text-green-400',
      inactiveColor: 'text-gray-500'
    },
    { 
      id: 'skills' as const, 
      label: 'Skills', 
      icon: TreePine,
      activeColor: 'text-purple-400',
      inactiveColor: 'text-gray-500'
    },
    { 
      id: 'profile' as const, 
      label: 'Profile', 
      icon: User,
      activeColor: 'text-pink-400',
      inactiveColor: 'text-gray-500'
    }
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gray-800/95 backdrop-blur-lg border-t border-gray-700 safe-bottom">
      <div className="flex justify-around items-center h-16 px-4">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          const Icon = tab.icon;
          
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex flex-col items-center justify-center flex-1 py-2 px-1 rounded-xl transition-all duration-200 ${
                isActive 
                  ? 'bg-gray-700/60 scale-105' 
                  : 'hover:bg-gray-700/30 active:scale-95'
              }`}
            >
              <div className={`transition-all duration-200 ${
                isActive ? 'transform scale-110' : ''
              }`}>
                <Icon 
                  className={`w-6 h-6 transition-colors duration-200 ${
                    isActive ? tab.activeColor : tab.inactiveColor
                  }`}
                />
              </div>
              <span 
                className={`text-xs font-medium mt-1 transition-colors duration-200 ${
                  isActive ? tab.activeColor : tab.inactiveColor
                }`}
              >
                {tab.label}
              </span>
              
              {/* Active indicator dot */}
              {isActive && (
                <div className={`w-1 h-1 rounded-full mt-1 ${
                  tab.activeColor.replace('text-', 'bg-')
                }`} />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}