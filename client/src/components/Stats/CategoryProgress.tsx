interface CategoryProgressProps {
  categories: {
    sleep: number;
    movement: number;
    nutrition: number;
    recovery: number;
    mindfulness: number;
  };
}

export function CategoryProgress({ categories }: CategoryProgressProps) {
  const categoryConfig = [
    { key: 'sleep', name: 'Sleep', color: 'bg-purple-500', icon: 'fas fa-bed' },
    { key: 'movement', name: 'Movement', color: 'bg-green-500', icon: 'fas fa-running' },
    { key: 'nutrition', name: 'Nutrition', color: 'bg-blue-500', icon: 'fas fa-apple-alt' },
    { key: 'recovery', name: 'Recovery', color: 'bg-orange-500', icon: 'fas fa-sun' },
    { key: 'mindfulness', name: 'Mindfulness', color: 'bg-indigo-500', icon: 'fas fa-brain' }
  ];

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm">
      <h3 className="font-semibold text-gray-800 mb-4">Category Progress</h3>
      <div className="space-y-4">
        {categoryConfig.map((category) => {
          const percentage = categories[category.key as keyof typeof categories];
          
          return (
            <div key={category.key}>
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center space-x-2">
                  <i className={`${category.icon} text-${category.color.split('-')[1]}-500`}></i>
                  <span className="text-sm font-medium text-gray-700">{category.name}</span>
                </div>
                <span className="text-sm text-gray-600">{percentage}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className={`${category.color} h-2 rounded-full progress-fill transition-all duration-1000`}
                  style={{ width: `${percentage}%` }}
                ></div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
