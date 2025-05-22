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
      
      // Initialize user if not exists
      if (!user) {
        const newUser: User = {
          id: 'user1',
          name: 'Wellness Warrior',
          program: 'beginner',
          currentDay: 1,
          currentStreak: 0,
          longestStreak: 0,
          completedDays: 0,
          startDate: new Date(),
          achievements: 0,
          level: 1
        };
        
        await storage.saveUser(newUser);
        setUser(newUser);
      }
    } catch (error) {
      console.error('Failed to complete onboarding:', error);
    }
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
