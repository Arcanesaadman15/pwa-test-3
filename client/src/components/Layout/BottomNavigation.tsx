import { CheckSquare, TreePine, User } from "lucide-react";
import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useMicroInteractions } from "@/hooks/useMicroInteractions";

interface BottomNavigationProps {
  activeTab: 'tasks' | 'skills' | 'profile';
  onTabChange: (tab: 'tasks' | 'skills' | 'profile') => void;
}

export function BottomNavigation({ activeTab, onTabChange }: BottomNavigationProps) {
  const { interactions, prefersReducedMotion, createSpringAnimation } = useMicroInteractions();
  const previousTabRef = useRef(activeTab);
  
  const tabs = [
    { 
      id: 'tasks' as const, 
      label: 'Tasks', 
      icon: CheckSquare,
      activeColor: 'text-blue-400',
      inactiveColor: 'text-gray-500',
      gradientFrom: 'from-blue-500',
      gradientTo: 'to-blue-600',
      bgGlow: 'shadow-blue-500/25',
      badgeColor: 'bg-blue-500'
    },
    { 
      id: 'skills' as const, 
      label: 'Skills', 
      icon: TreePine,
      activeColor: 'text-purple-400',
      inactiveColor: 'text-gray-500',
      gradientFrom: 'from-purple-500',
      gradientTo: 'to-purple-600',
      bgGlow: 'shadow-purple-500/25',
      badgeColor: 'bg-purple-500'
    },
    { 
      id: 'profile' as const, 
      label: 'Profile', 
      icon: User,
      activeColor: 'text-pink-400',
      inactiveColor: 'text-gray-500',
      gradientFrom: 'from-pink-500',
      gradientTo: 'to-pink-600',
      bgGlow: 'shadow-pink-500/25',
      badgeColor: 'bg-pink-500'
    }
  ];

  // Trigger haptic feedback when active tab changes
  useEffect(() => {
    if (previousTabRef.current !== activeTab) {
      interactions.tap();
      previousTabRef.current = activeTab;
    }
  }, [activeTab, interactions]);

  const handleTabPress = (tabId: typeof activeTab) => {
    if (tabId !== activeTab) {
      interactions.tap();
      onTabChange(tabId);
    } else {
      // Double-tap for already active tab - stronger feedback
      interactions.success();
    }
  };

  const getTabIndex = (tabId: typeof activeTab) => {
    return tabs.findIndex(tab => tab.id === tabId);
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 ios-tab-bar">
      <div className="relative">
        {/* Enhanced glass blur background with gradient overlay */}
        <div className="absolute inset-0 bg-gray-900/80 backdrop-blur-xl" />
        
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 via-gray-900/40 to-transparent" />
        
        {/* Top border with subtle glow */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
        
        <div className="relative flex justify-around items-center h-16 px-4">  // Reduced height for iOS feel
          {/* Animated background indicator for active tab */}
          <motion.div
            className="absolute top-2 bottom-2 rounded-2xl"
            initial={false}
            animate={{
              left: `${getTabIndex(activeTab) * 25}%`,
              opacity: 1
            }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 25,
              duration: 0.4
            }}
            style={{
              width: '25%',
              background: (() => {
                const tab = tabs.find(t => t.id === activeTab);
                if (!tab) return 'transparent';
                const fromColor = tab.gradientFrom.replace('from-', '');
                const toColor = tab.gradientTo.replace('to-', '');
                return `linear-gradient(135deg, ${fromColor}20, ${toColor}30)`;
              })()
            }}
          />
          
          {/* Enhanced tab buttons */}
          {tabs.map((tab, index) => {
            const isActive = activeTab === tab.id;
            const Icon = tab.icon;
            
            return (
              <motion.button
                key={tab.id}
                onClick={() => handleTabPress(tab.id)}
                className="flex flex-col items-center justify-center flex-1 py-2 px-1 rounded-2xl relative z-10 group"
                whileTap={prefersReducedMotion() ? {} : { scale: 0.95 }}
                whileHover={prefersReducedMotion() ? {} : { y: isActive ? 0 : -2 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                {/* Enhanced icon container with multiple effects */}
                <motion.div 
                  className="relative"
                  animate={prefersReducedMotion() ? {} : {
                    scale: isActive ? 1.1 : 1,
                    y: isActive ? -2 : 0
                  }}
                  transition={{
                    type: "spring",
                    stiffness: 400,
                    damping: 25
                  }}
                >
                  {/* Glow effect behind icon */}
                  {isActive && (
                    <motion.div
                      className={`absolute inset-0 rounded-full blur-md ${tab.badgeColor} opacity-40`}
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1.5, opacity: 0.4 }}
                      transition={{ duration: 0.3 }}
                    />
                  )}
                  
                  {/* Icon with enhanced styling */}
                  <Icon 
                    className={`w-7 h-7 transition-all duration-300 relative z-10 ${
                      isActive ? tab.activeColor : tab.inactiveColor
                    } group-hover:${tab.activeColor}`}
                    strokeWidth={isActive ? 2.5 : 2}
                  />
                  
                  {/* Pulse effect for active tab */}
                  {isActive && !prefersReducedMotion() && (
                    <motion.div
                      className={`absolute inset-0 rounded-full ${tab.badgeColor} opacity-20`}
                      animate={{
                        scale: [1, 1.5, 1],
                        opacity: [0.2, 0, 0.2]
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    />
                  )}
                </motion.div>
                
                {/* Enhanced label with better animations */}
                <motion.span 
                  className={`text-[10px] font-medium mt-1 transition-all duration-300 ${
                    isActive ? tab.activeColor : tab.inactiveColor
                  } group-hover:${tab.activeColor}`}
                  animate={prefersReducedMotion() ? {} : {
                    y: isActive ? -1 : 0,
                    scale: isActive ? 1.05 : 1
                  }}
                  transition={{
                    type: "spring",
                    stiffness: 400,
                    damping: 25
                  }}
                  style={{
                    fontVariationSettings: isActive ? '"wght" 700' : '"wght" 500'
                  }}
                >
                  {tab.label}
                </motion.span>
                
                {/* Enhanced active indicator with animation */}
                <AnimatePresence>
                  {isActive && (
                    <motion.div
                      className="absolute -bottom-1 left-1/2"
                      initial={{ scale: 0, opacity: 0, x: "-50%" }}
                      animate={{ scale: 1, opacity: 1, x: "-50%" }}
                      exit={{ scale: 0, opacity: 0, x: "-50%" }}
                      transition={{
                        type: "spring",
                        stiffness: 500,
                        damping: 25
                      }}
                    >
                      <div className={`w-2 h-2 rounded-full ${
                        tab.badgeColor
                      } shadow-lg ${tab.bgGlow}`} />
                    </motion.div>
                  )}
                </AnimatePresence>
                
                {/* Hover effect overlay */}
                <motion.div
                  className="absolute inset-0 rounded-2xl bg-white/5"
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: isActive ? 0 : 1 }}
                  transition={{ duration: 0.2 }}
                />
              </motion.button>
            );
          })}
        </div>
        
        {/* Safe area padding for devices with home indicators */}
        <div style={{ height: 'env(safe-area-inset-bottom)' }} className="bg-white" />  // Safe area
      </div>
    </div>
  );
}