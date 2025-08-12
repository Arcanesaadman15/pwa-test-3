import { CheckSquare, TreePine, User } from "lucide-react";
import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { useMicroInteractions } from "@/hooks/useMicroInteractions";

interface BottomNavigationProps {
  activeTab: 'tasks' | 'skills' | 'profile';
  onTabChange: (tab: 'tasks' | 'skills' | 'profile') => void;
}

export function BottomNavigation({ activeTab, onTabChange }: BottomNavigationProps) {
  const { interactions, prefersReducedMotion, createSpringAnimation } = useMicroInteractions();
  const previousTabRef = useRef(activeTab);
  
  const tabs = [
    { id: 'tasks' as const, label: 'Tasks', icon: CheckSquare },
    { id: 'skills' as const, label: 'Skills', icon: TreePine },
    { id: 'profile' as const, label: 'Profile', icon: User },
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

  const getTabIndex = (tabId: typeof activeTab) => tabs.findIndex(tab => tab.id === tabId);

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 ios-tab-bar">
      <div className="relative">
        <div className="relative flex justify-around items-center h-[60px] px-2">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            const Icon = tab.icon;

            return (
              <motion.button
                key={tab.id}
                onClick={() => handleTabPress(tab.id)}
                className="flex flex-col items-center justify-center flex-1 py-1 px-1 rounded-xl"
                whileTap={prefersReducedMotion() ? {} : { scale: 0.96 }}
                transition={{ type: "spring", stiffness: 450, damping: 30 }}
              >
                <Icon
                  className="w-6 h-6"
                  strokeWidth={2}
                  style={{ color: isActive ? 'var(--ios-blue)' : 'var(--ios-gray)' }}
                />
                <span
                  className="text-[11px] mt-0.5 font-medium"
                  style={{ color: isActive ? 'var(--ios-blue)' : 'var(--ios-gray)' }}
                >
                  {tab.label}
                </span>
              </motion.button>
            );
          })}
        </div>
        {/* Safe area padding for devices with home indicators */}
        <div
          style={{ height: 'env(safe-area-inset-bottom)' }}
          className="bg-transparent"
        />
      </div>
    </div>
  );
}