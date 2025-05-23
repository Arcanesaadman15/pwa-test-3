import { useState, useEffect } from "react";
import Onboarding from "@/pages/Onboarding";
import { Header } from "@/components/Layout/Header";
import { BottomNavigation } from "@/components/Layout/BottomNavigation";
import TaskList from "@/components/Tasks/TaskList";
import { StatsOverview } from "@/components/Stats/StatsOverview";
import { ComprehensiveSkillTree } from "@/components/Skills/ComprehensiveSkillTree";
import { ProfileOverview } from "@/components/Profile/ProfileOverview";
import { SettingsPanel } from "@/components/Profile/SettingsPanel";
import { ProgramSelector } from "@/components/Profile/ProgramSelector";

import { SkillUnlockModal } from "@/components/Modals/SkillUnlockModal";
import { useUserProgress } from "@/hooks/useUserProgress";
import { useTaskEngine } from "@/hooks/useTaskEngine";
import { useSkillTree } from "@/hooks/useSkillTree";
import { StreakSparkle } from "@/components/Rewards/StreakSparkle";
import { storage } from "@/lib/storage";
import { skillUnlockSystem } from "@/lib/skillUnlockSystem";

type TabType = 'tasks' | 'stats' | 'skills' | 'profile';
type ViewType = 'main' | 'settings' | 'programSelector';

export default function Home() {
  const [activeTab, setActiveTab] = useState<TabType>('tasks');
  const [currentView, setCurrentView] = useState<ViewType>('main');
  const [showSkillModal, setShowSkillModal] = useState(false);
  const [showStreakSparkle, setShowStreakSparkle] = useState(false);
  const [unlockedSkill, setUnlockedSkill] = useState<any>(null);
  
  const {
    user,
    isOnboardingComplete,
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
  
  const {
    checkForSkillUnlocks,
    getUserSkills
  } = useSkillTree();



  const handleTaskComplete = async (taskId: string) => {
    console.log(`🔥 [CRITICAL] handleTaskComplete called for task: ${taskId}`);
    console.log(`🔥 [CRITICAL] User exists: ${!!user}, TaskEngine exists: ${!!taskEngine}`);
    
    if (!taskEngine || !user) {
      console.error(`❌ [CRITICAL] Missing dependencies - taskEngine: ${!!taskEngine}, user: ${!!user}`);
      return;
    }
    
    try {
      console.log(`🔥 [CRITICAL] Current day: ${taskEngine.getActiveDay()}, Viewing day: ${taskEngine.getViewingDay()}`);
      
      const previousStreak = user?.currentStreak || 0;
      console.log(`🔥 [CRITICAL] Calling completeTask...`);
      
      const result = await completeTask(taskId);
      console.log(`🔥 [CRITICAL] completeTask result: ${result}`);
      
      await loadUserData(); // Refresh user data to get updated streak
      
      // Check if day was completed and show streak celebration
      setTimeout(async () => {
        const freshUser = await storage.getUser();
        const newStreak = freshUser?.currentStreak || 0;
        
        console.log(`🎯 DEBUG: Previous streak=${previousStreak}, New streak=${newStreak}`);
        console.log(`🎯 DEBUG: Streak increased? ${newStreak > previousStreak}`);
        
        // Show sparkles for actual streak milestones when streak increased
        if (newStreak > previousStreak) {
          const isStreakMilestone = (
            newStreak === 3 || newStreak === 7 || newStreak === 14 || 
            newStreak === 21 || newStreak === 30 || (newStreak % 10 === 0 && newStreak > 30)
          );
          
          console.log(`🎯 DEBUG: Is milestone (${newStreak})? ${isStreakMilestone}`);
          
          if (isStreakMilestone) {
            console.log(`🎉 TRIGGERING SPARKLE for ${newStreak} day streak milestone!`);
            setShowStreakSparkle(true);
          }
        }
        
        // TEMPORARY: Force show sparkle for testing any streak increase
        if (newStreak > previousStreak && newStreak >= 1) {
          console.log(`🧪 TEST: Forcing sparkle for ANY streak increase: ${newStreak}`);
          setShowStreakSparkle(true);
        }
      }, 1500);
      
      // Check for skill unlocks after task completion using new comprehensive system
      const skillResult = await skillUnlockSystem.checkForNewUnlocks();
      if (skillResult.newlyUnlocked.length > 0) {
        setUnlockedSkill(skillResult.newlyUnlocked[0]);
        setTimeout(() => {
          setShowSkillModal(true);
        }, 1500);
      }
      
      // Haptic feedback
      if (navigator.vibrate) {
        navigator.vibrate([100, 50, 100]);
      }
    } catch (error) {
      console.error('Failed to complete task:', error);
    }
  };

  const handleTaskSkip = async (taskId: string) => {
    try {
      await skipTask(taskId);
    } catch (error) {
      console.error('Failed to skip task:', error);
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

  // Show onboarding if not completed
  if (!isOnboardingComplete) {
    return <Onboarding onComplete={completeOnboarding} />;
  }

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

  const renderTabContent = () => {
    switch (activeTab) {
      case 'tasks':
        return <TaskList onTaskComplete={handleTaskComplete} onTaskSkip={handleTaskSkip} />;
      case 'stats':
        return <StatsOverview user={user} />;
      case 'skills':
        return <ComprehensiveSkillTree onSkillClick={(skill) => {
          setUnlockedSkill(skill);
          setShowSkillModal(true);
        }} />;
      case 'profile':
        return <ProfileOverview user={user} onOpenSettings={handleOpenSettings} />;
      default:
        return null;
    }
  };

  // Show onboarding if user hasn't completed it
  if (!isOnboardingComplete) {
    return <Onboarding onComplete={completeOnboarding} />;
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#111827' }}>
      <Header />
      <main className="pb-20">
        {renderTabContent()}
      </main>
      
      <BottomNavigation activeTab={activeTab} onTabChange={setActiveTab} />
      
      {/* Modals */}
      <SkillUnlockModal
        isOpen={showSkillModal}
        onClose={() => setShowSkillModal(false)}
        skill={unlockedSkill}
      />
      
      {/* Streak Sparkle Celebration */}
      <StreakSparkle
        streakCount={user?.currentStreak || 0}
        isVisible={showStreakSparkle}
        onComplete={() => setShowStreakSparkle(false)}
      />
    </div>
  );
}
