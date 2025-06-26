import { useState, useEffect } from "react";
import { Switch, Route } from "wouter";
import Onboarding from "@/pages/Onboarding";
import { BottomNavigation } from "@/components/Layout/BottomNavigation";
import TaskList from "@/components/Tasks/TaskList";
import { ComprehensiveSkillTree } from "@/components/Skills/ComprehensiveSkillTree";
import { ProfileOverview } from "@/components/Profile/ProfileOverview";
import { SettingsPanel } from "@/components/Profile/SettingsPanel";
import { ProgramSelector } from "@/components/Profile/ProgramSelector";
import { AchievementShare } from "@/components/social/achievement-share";
import { QuickActions, defaultQuickActions } from "@/components/ui/quick-actions";
import { Button } from "@/components/ui/button";

import { SkillUnlockModal } from "@/components/Modals/SkillUnlockModal";
import { useUserProgress } from "@/hooks/useUserProgress";
import { useTaskEngine } from "@/hooks/useTaskEngine";
import { useSkillTree } from "@/hooks/useSkillTree";
import { useOffline } from "@/hooks/useOffline";
import { useTabSwipeNavigation } from "@/hooks/useSwipeNavigation";
import { StreakSparkle } from "@/components/Rewards/StreakSparkle";
import { storage } from "@/lib/storage";
import { skillUnlockSystem } from "@/lib/skillUnlockSystem";

type TabType = 'tasks' | 'skills' | 'profile';
type ViewType = 'main' | 'settings' | 'programSelector';

const TAB_ORDER: TabType[] = ['tasks', 'skills', 'profile'];

// Test comment to verify Vercel auto-deployment
export default function Home() {
  const [activeTab, setActiveTab] = useState<TabType>('tasks');
  const [currentView, setCurrentView] = useState<ViewType>('main');
  const [showSkillModal, setShowSkillModal] = useState(false);
  const [showStreakSparkle, setShowStreakSparkle] = useState(false);
  const [showAchievementShare, setShowAchievementShare] = useState(false);
  const [unlockedSkill, setUnlockedSkill] = useState<any>(null);
  const [achievementToShare, setAchievementToShare] = useState<any>(null);
  const [isNewSkillUnlock, setIsNewSkillUnlock] = useState(false);
  
  const {
    user,
    completeOnboarding,
    updateUserProgress,
    loadUserData
  } = useUserProgress();


  
  const {
    taskEngine,
    currentDayTasks,
    completeTask,
    skipTask,
    getDayProgress,
    switchProgram
  } = useTaskEngine();
  
  // const {
  //   checkForSkillUnlocks,
  //   getUserSkills
  // } = useSkillTree();

  const { isOnline, hasPendingActions } = useOffline();

  // If user is null, force reload user data (since onboarding check is now at App level)
  useEffect(() => {
    if (!user) {
      loadUserData();
    }
  }, [user, loadUserData]);

  // Swipe navigation setup
  const currentTabIndex = TAB_ORDER.indexOf(activeTab);
  const handleTabChange = (newTabIndex: number) => {
    const newTab = TAB_ORDER[newTabIndex];
    setActiveTab(newTab);
  };

  const { ref: swipeRef } = useTabSwipeNavigation(
    currentTabIndex,
    TAB_ORDER.length,
    handleTabChange,
    {
      threshold: 60,
      velocity: 0.2
    }
  );

  const handleTaskComplete = async (taskId: string) => {
    if (!taskEngine || !user) {
      return;
    }
    
    try {
      const previousStreak = user?.current_streak || 0;
      const result = await completeTask(taskId);
      
      await loadUserData();
      
      // Check if day was completed and show streak celebration
      setTimeout(async () => {
        const freshUser = await storage.getUser();
        const newStreak = freshUser?.currentStreak || 0;
        
        // Show sparkles for actual streak milestones when streak increased
        if (newStreak > previousStreak) {
          const isStreakMilestone = (
            newStreak === 3 || newStreak === 7 || newStreak === 14 || 
            newStreak === 21 || newStreak === 30 || (newStreak % 10 === 0 && newStreak > 30)
          );
          
          if (isStreakMilestone) {
            setShowStreakSparkle(true);
            
            // Show achievement share for streak milestones
            setAchievementToShare({
              id: `streak-${newStreak}`,
              title: `${newStreak} Day Streak!`,
              description: `Completed ${newStreak} consecutive days of wellness tasks`,
              icon: '🔥',
              color: '#f97316',
              unlockedAt: new Date(),
              type: 'streak'
            });
          }
        }
      }, 1000);
      
      // Check for skill unlocks after task completion using new comprehensive system
      const skillResult = await skillUnlockSystem.checkForNewUnlocks();
      if (skillResult.newlyUnlocked.length > 0) {
        setUnlockedSkill(skillResult.newlyUnlocked[0]);
        setIsNewSkillUnlock(true);
        setTimeout(() => {
          setShowSkillModal(true);
        }, 1200);
        // Note: No longer setting achievementToShare for skills since the modal handles sharing internally
      }
      
      // Haptic feedback
      if (navigator.vibrate) {
        navigator.vibrate([100, 50, 100]);
      }
    } catch (error) {
      // Task completion failed - could show user-friendly error message
    }
  };

  const handleTaskSkip = async (taskId: string) => {
    try {
      await skipTask(taskId);
      await loadUserData();
    } catch (error) {
      // Task skip failed - could show user-friendly error message
    }
  };

  const handleOpenSettings = () => setCurrentView('settings');
  const handleOpenProgramSelector = () => setCurrentView('programSelector');
  const handleBackToMain = () => { setCurrentView('main'); setActiveTab('profile'); };
  const handleProgramSelect = async (program: 'beginner' | 'intermediate' | 'advanced') => {
    await switchProgram(program);
    await loadUserData(); // Refresh user data to reflect the program change
    setCurrentView('main');
    setActiveTab('tasks');
  };
  const handleDataReset = () => setCurrentView('main');

  // Enhanced quick actions with current task context
  const quickActions = [
    {
      id: 'complete-current',
      label: 'Complete Current',
      icon: defaultQuickActions[0].icon,
      action: () => {
        // Get current active task and complete it
        // TODO: Implement quick task completion
      },
      color: defaultQuickActions[0].color,
      gradient: defaultQuickActions[0].gradient
    },
    ...defaultQuickActions.slice(1)
  ];

  // Convert Supabase User to legacy User format for components
  const convertUserFormat = (supabaseUser: any) => {
    if (!supabaseUser) return null;
    return {
      id: supabaseUser.id,
      name: supabaseUser.name,
      program: supabaseUser.program,
      currentDay: supabaseUser.current_day,
      currentStreak: supabaseUser.current_streak,
      longestStreak: supabaseUser.longest_streak,
      completedDays: supabaseUser.completed_days,
      startDate: new Date(supabaseUser.start_date),
      achievements: supabaseUser.achievements,
      level: supabaseUser.level,
      onboardingComplete: supabaseUser.onboarding_complete,
      preferences: supabaseUser.preferences
    };
  };

  const renderTabContent = () => {
    // Show loading state if user is still loading
    if (!user) {
      return (
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🏔️</span>
            </div>
            <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-white/70">Loading your progress...</p>
            <p className="text-white/50 text-sm mt-2">Setting up your wellness journey</p>
          </div>
        </div>
      );
    }

    const legacyUser = convertUserFormat(user);
    if (!legacyUser) return null;

    switch (activeTab) {
      case 'tasks':
        return <TaskList onTaskComplete={handleTaskComplete} onTaskSkip={handleTaskSkip} />;
      case 'skills':
        return <ComprehensiveSkillTree onSkillClick={(skill) => {
          // Only show modal for viewing unlocked skills (no sharing for viewing)
          setUnlockedSkill(skill);
          setIsNewSkillUnlock(false);
          setShowSkillModal(true);
        }} />;
      case 'profile':
        return <ProfileOverview user={legacyUser} onOpenSettings={handleOpenSettings} />;
      default:
        return null;
    }
  };

  // Handle different views
  if (currentView === 'settings') {
    return (
      <SettingsPanel 
        onBack={handleBackToMain}
        onDataReset={handleDataReset}
        onProgramChange={handleOpenProgramSelector}
      />
    );
  }

  if (currentView === 'programSelector') {
    return (
      <ProgramSelector
        currentProgram={user?.program || 'beginner'}
        onProgramSelect={handleProgramSelect}
        onBack={handleBackToMain}
      />
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#111827' }}>
      <main 
        ref={swipeRef as React.RefObject<HTMLElement>}
        className="pb-20 relative"
      >
        {renderTabContent()}
      </main>
      
      <BottomNavigation activeTab={activeTab} onTabChange={setActiveTab} />
      
      {/* Modals */}
      <SkillUnlockModal
        isOpen={showSkillModal}
        onClose={() => {
          setShowSkillModal(false);
          setIsNewSkillUnlock(false);
          // No longer need to check for achievement sharing since it's handled internally
        }}
        skill={unlockedSkill}
        isNewUnlock={isNewSkillUnlock}
        userStats={user ? {
          name: user.name || 'PeakForge User',
          level: user.level || 1,
          currentStreak: user.current_streak || 0,
          totalTasks: user.completed_days || 0
        } : undefined}
      />
      
      {/* Achievement Share Modal */}
      {showAchievementShare && achievementToShare && user && (
        <AchievementShare
          achievement={achievementToShare}
          userStats={{
            name: user.name || 'PeakForge User',
            level: user.level || 1,
            currentStreak: user.current_streak || 0,
            totalTasks: user.completed_days || 0
          }}
          onClose={() => {
            setShowAchievementShare(false);
            setAchievementToShare(null);
          }}
        />
      )}
      
      {/* Streak Sparkle Celebration */}
      <StreakSparkle
        streakCount={user?.current_streak || 0}
        isVisible={showStreakSparkle}
        onComplete={() => {
          setShowStreakSparkle(false);
          // Show achievement share after sparkle animation
          if (achievementToShare) {
            setTimeout(() => setShowAchievementShare(true), 500);
          }
        }}
      />

      {/* Offline indicator */}
      {!isOnline && (
        <div className="fixed top-4 left-4 right-4 z-50">
          <div className="bg-orange-500/90 backdrop-blur-sm text-white px-4 py-2 rounded-lg text-center text-sm">
            📱 Offline Mode - Changes will sync when connected
            {hasPendingActions && <span className="ml-2">• Pending sync</span>}
          </div>
        </div>
      )}
    </div>
  );
}
