interface BottomNavigationProps {
  activeTab: 'tasks' | 'stats' | 'skills' | 'profile';
  onTabChange: (tab: 'tasks' | 'stats' | 'skills' | 'profile') => void;
}

export function BottomNavigation({ activeTab, onTabChange }: BottomNavigationProps) {
  const tabs = [
    { id: 'tasks' as const, icon: 'fas fa-tasks', label: 'Tasks' },
    { id: 'stats' as const, icon: 'fas fa-chart-line', label: 'Stats' },
    { id: 'skills' as const, icon: 'fas fa-tree', label: 'Skills' },
    { id: 'profile' as const, icon: 'fas fa-user-circle', label: 'Profile' }
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2 z-30 pwa-bottom">
      <div className="max-w-md mx-auto">
        <div className="flex justify-around">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex flex-col items-center py-2 px-3 transition-colors touch-feedback ${
                activeTab === tab.id ? 'text-primary' : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              <i className={`${tab.icon} text-xl mb-1`}></i>
              <span className="text-xs font-medium">{tab.label}</span>
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
}
