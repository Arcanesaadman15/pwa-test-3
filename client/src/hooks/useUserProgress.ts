import { useState, useEffect } from "react";
import { User } from "@/types";
import { storage } from "@/lib/storage";

export function useUserProgress() {
  const [user, setUser] = useState<User | null>(null);
  const [isOnboardingComplete, setIsOnboardingComplete] = useState(false);

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const userData = await storage.getUser();
      const onboardingComplete = await storage.getOnboardingStatus();
      
      setUser(userData);
      setIsOnboardingComplete(onboardingComplete);
    } catch (error) {
      console.error('Failed to load user data:', error);
    }
  };

  const completeOnboarding = async () => {
    try {
      await storage.setOnboardingComplete();
      setIsOnboardingComplete(true);
      
      // Always create/update user after onboarding
      const onboardingData = await storage.getOnboardingData();
      const programType = determineProgramType(onboardingData);
      
      const newUser: User = {
        id: 'user1',
        name: 'Wellness Warrior',
        program: programType,
        currentDay: 1,
        currentStreak: 0,
        longestStreak: 0,
        completedDays: 0,
        startDate: new Date(),
        achievements: 0,
        level: 1,
        onboardingComplete: true,
        preferences: onboardingData ? {
          morningPerson: (onboardingData as any).circadianRhythm === 'morning',
          outdoorActivities: (onboardingData as any).activityLocation === 'outdoor',
          socialActivities: (onboardingData as any).socialPreference === 'group',
          highIntensity: (onboardingData as any).intensityApproach === 'high',
          timeCommitment: 30, // Default 30 minutes
          stressLevel: (onboardingData as any).stressLevel || 5,
          sleepQuality: 3, // Convert string to number (1-5 scale)
          activityLevel: 3 // Convert string to number (1-5 scale)
        } : undefined
      };
      
      await storage.saveUser(newUser);
      setUser(newUser);
    } catch (error) {
      console.error('Failed to complete onboarding:', error);
    }
  };

  const determineProgramType = (data: any): 'beginner' | 'intermediate' | 'advanced' => {
    if (!data) return 'beginner';
    
    if (data.activityLevel === 'sedentary' || data.timeCommitment <= 30) {
      return 'beginner';
    } else if (data.activityLevel === 'very' && data.preferences?.highIntensity) {
      return 'advanced';
    }
    return 'intermediate';
  };

  const updateUserProgress = async (updates: Partial<User>) => {
    if (!user) return;
    
    try {
      const updatedUser = { ...user, ...updates };
      await storage.saveUser(updatedUser);
      setUser(updatedUser);
    } catch (error) {
      console.error('Failed to update user progress:', error);
    }
  };

  return {
    user,
    isOnboardingComplete,
    completeOnboarding,
    updateUserProgress,
    loadUserData
  };
}
