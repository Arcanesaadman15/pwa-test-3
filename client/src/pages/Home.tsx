import { useState, useEffect } from "react";
import { OnboardingFlow } from "@/components/Onboarding/OnboardingFlow";
import { Header } from "@/components/Layout/Header";
import { BottomNavigation } from "@/components/Layout/BottomNavigation";
import { TaskList } from "@/components/Tasks/TaskList";
import { StatsOverview } from "@/components/Stats/StatsOverview";
import { SkillTree } from "@/components/Skills/SkillTree";
import { ProfileOverview } from "@/components/Profile/ProfileOverview";
import { TaskCompletionModal } from "@/components/Modals/TaskCompletionModal";
import { SkillUnlockModal } from "@/components/Modals/SkillUnlockModal";
import { useUserProgress } from "@/hooks/useUserProgress";
import { useTaskEngine } from "@/hooks/useTaskEngine";
import { useSkillTree } from "@/hooks/useSkillTree";

type TabType = 'tasks' | 'stats' | 'skills' | 'profile';

export default function Home() {
  const [activeTab, setActiveTab] = useState<TabType>('tasks');
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [showSkillModal, setShowSkillModal] = useState(false);
  const [completedTaskId, setCompletedTaskId] = useState<string | null>(null);
  const [unlockedSkill, setUnlockedSkill] = useState<any>(null);
  
  const {
    user,
    isOnboardingComplete,
    completeOnboarding,
    updateUserProgress
  } = useUserProgress();
  
  const {
    currentDayTasks,
    completeTask,
    skipTask,
    getDayProgress
  } = useTaskEngine();
  
  const {
    checkForSkillUnlocks,
    getUserSkills
  } = useSkillTree();

  const handleTaskComplete = async (taskId: string) => {
    try {
      await completeTask(taskId);
      setCompletedTaskId(taskId);
      setShowCompletionModal(true);
      
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

  // Show onboarding if not completed
  if (!isOnboardingComplete) {
    return <OnboardingFlow onComplete={completeOnboarding} />;
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case 'tasks':
        return (
          <TaskList
            tasks={currentDayTasks}
            onTaskComplete={handleTaskComplete}
            onTaskSkip={handleTaskSkip}
            dayProgress={getDayProgress()}
          />
        );
      case 'stats':
        return <StatsOverview user={user} />;
      case 'skills':
        return <SkillTree userSkills={getUserSkills()} />;
      case 'profile':
        return <ProfileOverview user={user} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header user={user} />
      
      <main className="pb-20">
        {renderTabContent()}
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
    </div>
  );
}
