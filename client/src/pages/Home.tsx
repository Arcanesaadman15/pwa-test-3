import { useState, useEffect } from "react";
import { OnboardingFlow } from "@/components/Onboarding/OnboardingFlow";
import { Header } from "@/components/Layout/Header";
import { BottomNavigation } from "@/components/Layout/BottomNavigation";
import TaskList from "@/components/Tasks/TaskList";
import { StatsOverview } from "@/components/Stats/StatsOverview";
import { SkillTree } from "@/components/Skills/SkillTree";
import { ProfileOverview } from "@/components/Profile/ProfileOverview";
import { SettingsPanel } from "@/components/Profile/SettingsPanel";
import { ProgramSelector } from "@/components/Profile/ProgramSelector";
import { TaskCompletionModal } from "@/components/Modals/TaskCompletionModal";
import { SkillUnlockModal } from "@/components/Modals/SkillUnlockModal";
import { useUserProgress } from "@/hooks/useUserProgress";
import { useTaskEngine } from "@/hooks/useTaskEngine";
import { useSkillTree } from "@/hooks/useSkillTree";
import { StreakSparkle } from "@/components/Rewards/StreakSparkle";

type TabType = 'tasks' | 'stats' | 'skills' | 'profile';
type ViewType = 'main' | 'settings' | 'programSelector';

export default function Home() {
  const [activeTab, setActiveTab] = useState<TabType>('tasks');
  const [currentView, setCurrentView] = useState<ViewType>('main');
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [showSkillModal, setShowSkillModal] = useState(false);
  const [showStreakSparkle, setShowStreakSparkle] = useState(false);
  const [completedTaskId, setCompletedTaskId] = useState<string | null>(null);
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
      
      setCompletedTaskId(taskId);
      setShowCompletionModal(true);
      
      // Force trigger sparkle celebration for testing milestone detection
      console.log(`🎯 Task completed! Previous streak: ${previousStreak}`);
      
      // Temporary: trigger sparkle for any task completion to test
      setTimeout(() => {
        console.log(`🎉 FORCE TRIGGERING SPARKLE CELEBRATION for testing!`);
        setShowStreakSparkle(true);
      }, 1000);
      
      // Check for skill unlocks after task completion
      const newSkills = await checkForSkillUnlocks();
      if (newSkills.length > 0) {
        setUnlockedSkill(newSkills[0]);
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
    return <OnboardingFlow onComplete={completeOnboarding} />;
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
        return <SkillTree userSkills={getUserSkills()} />;
      case 'profile':
        return <ProfileOverview user={user} onOpenSettings={handleOpenSettings} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#111827' }}>
      <main className="pb-20">
        {user ? renderTabContent() : (
          <div className="p-4 max-w-md mx-auto">
            <div className="flex justify-center items-center h-64">
              <div className="animate-pulse text-center">
                <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-32 mx-auto mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-24 mx-auto"></div>
              </div>
            </div>
          </div>
        )}
      </main>
      
      <BottomNavigation activeTab={activeTab} onTabChange={setActiveTab} />
      
      {/* Modals */}
      <TaskCompletionModal
        isOpen={showCompletionModal}
        onClose={() => setShowCompletionModal(false)}
        taskId={completedTaskId}
        userStreak={user?.currentStreak || 0}
      />
      
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
