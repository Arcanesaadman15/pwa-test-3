import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { storage } from "@/lib/storage";

export function useUserProgress() {
  const { user: authUser, userProfile, loading, updateProfile } = useAuth();
  const [isOnboardingComplete, setIsOnboardingComplete] = useState(false);

  useEffect(() => {
    loadUserData();
  }, [userProfile]);

  const loadUserData = async () => {
    try {
      if (userProfile) {
        setIsOnboardingComplete(userProfile.onboarding_complete);
      } else {
        // Check local storage for onboarding status if no user profile
        const onboardingComplete = await storage.getOnboardingStatus();
        setIsOnboardingComplete(onboardingComplete);
      }
    } catch (error) {
      console.error('Failed to load user data:', error);
    }
  };

  const completeOnboarding = async () => {
    try {
      // Completing onboarding
      await storage.setOnboardingComplete();
      setIsOnboardingComplete(true);
      
      // If we have a user profile, update it to mark onboarding as complete
      if (updateProfile && userProfile) {
        // Updating profile to mark onboarding complete
        await updateProfile({ onboarding_complete: true });
      }
      
              // Onboarding completed successfully
    } catch (error) {
      console.error('Failed to complete onboarding:', error);
    }
  };

  const updateUserProgress = async (updates: any) => {
    if (!userProfile) return;
    
    try {
      // Convert old property names to new ones
      const convertedUpdates: any = {};
      
      if (updates.currentStreak !== undefined) {
        convertedUpdates.current_streak = updates.currentStreak;
      }
      if (updates.completedDays !== undefined) {
        convertedUpdates.completed_days = updates.completedDays;
      }
      if (updates.longestStreak !== undefined) {
        convertedUpdates.longest_streak = updates.longestStreak;
      }
      if (updates.currentDay !== undefined) {
        convertedUpdates.current_day = updates.currentDay;
      }
      
      // Add any other properties as is
      Object.keys(updates).forEach(key => {
        if (!['currentStreak', 'completedDays', 'longestStreak', 'currentDay'].includes(key)) {
          convertedUpdates[key] = updates[key];
        }
      });

      await updateProfile(convertedUpdates);
    } catch (error) {
      console.error('Failed to update user progress:', error);
    }
  };

  return {
    user: userProfile,
    authUser,
    isOnboardingComplete,
    loading,
    completeOnboarding,
    updateUserProgress,
    loadUserData
  };
}
