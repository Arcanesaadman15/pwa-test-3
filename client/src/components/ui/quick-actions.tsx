import { useState, useEffect } from 'react';
import { Plus, Zap, CheckCircle, SkipForward, Timer } from 'lucide-react';
import { Button } from './button';

interface QuickAction {
  id: string;
  label: string;
  icon: React.ComponentType<any>;
  action: () => void;
  color: string;
  gradient: string;
}

interface QuickActionsProps {
  actions: QuickAction[];
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
  autoHide?: boolean;
  className?: string;
}

export function QuickActions({ 
  actions, 
  position = 'bottom-right',
  autoHide = true,
  className = ""
}: QuickActionsProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  // Auto-hide on scroll
  useEffect(() => {
    if (!autoHide) return;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false);
        setIsExpanded(false);
      } else {
        setIsVisible(true);
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY, autoHide]);

  const getPositionClasses = () => {
    const base = 'fixed z-50';
    const positions = {
      'bottom-right': 'bottom-6 right-6',
      'bottom-left': 'bottom-6 left-6',
      'top-right': 'top-6 right-6',
      'top-left': 'top-6 left-6'
    };
    return `${base} ${positions[position]}`;
  };

  const handleMainButtonClick = () => {
    setIsExpanded(!isExpanded);
    
    // Haptic feedback
    if (navigator.vibrate) {
      navigator.vibrate(30);
    }
  };

  const handleActionClick = (action: QuickAction) => {
    action.action();
    setIsExpanded(false);
    
    // Stronger haptic feedback for actions
    if (navigator.vibrate) {
      navigator.vibrate(50);
    }
  };

  if (!isVisible) {
    return null;
  }

  return (
    <div className={`${getPositionClasses()} ${className}`}>
      {/* Action buttons - appear when expanded */}
      {isExpanded && (
        <div className="flex flex-col-reverse gap-3 mb-4">
          {actions.map((action, index) => {
            const Icon = action.icon;
            return (
              <div
                key={action.id}
                className="animate-in slide-in-from-bottom-2 fade-in duration-200"
                style={{
                  animationDelay: `${index * 50}ms`,
                  animationFillMode: 'both'
                }}
              >
                <Button
                  onClick={() => handleActionClick(action)}
                  className={`
                    w-14 h-14 rounded-full shadow-xl hover:shadow-2xl
                    transform hover:scale-110 active:scale-95
                    transition-all duration-200 ease-out
                    ${action.gradient}
                  `}
                  style={{
                    background: action.gradient.includes('gradient') 
                      ? undefined 
                      : `linear-gradient(135deg, ${action.color}90, ${action.color})`
                  }}
                >
                  <Icon className="w-6 h-6 text-white" />
                </Button>
                
                {/* Action label */}
                <div className="absolute right-16 top-1/2 transform -translate-y-1/2 pointer-events-none">
                  <div className="bg-gray-900/90 backdrop-blur-sm text-white text-xs font-medium px-3 py-2 rounded-lg shadow-lg border border-gray-600/50 whitespace-nowrap">
                    {action.label}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Main FAB button */}
      <Button
        onClick={handleMainButtonClick}
        className={`
          w-16 h-16 rounded-full shadow-xl hover:shadow-2xl
          bg-gradient-to-br from-blue-500 to-purple-600
          hover:from-blue-600 hover:to-purple-700
          transform hover:scale-110 active:scale-95
          transition-all duration-300 ease-out
          ${isExpanded ? 'rotate-45' : 'rotate-0'}
        `}
      >
        <Plus className="w-8 h-8 text-white" />
      </Button>

      {/* Background overlay when expanded */}
      {isExpanded && (
        <div 
          className="fixed inset-0 bg-black/20 backdrop-blur-[1px] -z-10"
          onClick={() => setIsExpanded(false)}
        />
      )}
    </div>
  );
}

// Pre-built quick actions
export const defaultQuickActions: QuickAction[] = [
  {
    id: 'complete-task',
    label: 'Complete Task',
    icon: CheckCircle,
    action: () => console.log('Complete current task'),
    color: '#10b981',
    gradient: 'bg-gradient-to-br from-green-500 to-emerald-600'
  },
  {
    id: 'skip-task',
    label: 'Skip Task',
    icon: SkipForward,
    action: () => console.log('Skip current task'),
    color: '#f59e0b',
    gradient: 'bg-gradient-to-br from-yellow-500 to-orange-600'
  },
  {
    id: 'quick-session',
    label: 'Quick Session',
    icon: Timer,
    action: () => console.log('Start quick session'),
    color: '#8b5cf6',
    gradient: 'bg-gradient-to-br from-purple-500 to-violet-600'
  },
  {
    id: 'boost-mode',
    label: 'Boost Mode',
    icon: Zap,
    action: () => console.log('Activate boost mode'),
    color: '#f97316',
    gradient: 'bg-gradient-to-br from-orange-500 to-red-600'
  }
]; 