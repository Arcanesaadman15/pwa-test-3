import { useState, useEffect } from "react";
import { skillUnlockSystem } from "@/lib/skillUnlockSystem";
import { UserSkills } from "@/types";

export function useSkillTree() {
  const [userSkills, setUserSkills] = useState<UserSkills>({});

  useEffect(() => {
    loadUserSkills();
  }, []);

  const loadUserSkills = async () => {
    try {
      const skills = await skillUnlockSystem.getAllUnlockedSkills();
      // Convert array to UserSkills format
      const skillsMap: UserSkills = {};
      skills.forEach(skill => {
        if (!skillsMap[skill.category]) {
          skillsMap[skill.category] = [];
        }
        skillsMap[skill.category].push(skill.id);
      });
      setUserSkills(skillsMap);
    } catch (error) {
      console.error('Failed to load user skills:', error);
    }
  };

  const checkForSkillUnlocks = async () => {
    try {
      const result = await skillUnlockSystem.checkForNewUnlocks();
      if (result.newlyUnlocked.length > 0) {
        await loadUserSkills();
      }
      return result.newlyUnlocked;
    } catch (error) {
      console.error('Failed to check skill unlocks:', error);
      return [];
    }
  };

  const getUserSkills = () => {
    return userSkills;
  };

  const unlockSkill = async (skillId: string, category: string) => {
    try {
      // Skill unlocking is handled automatically by the system
      await loadUserSkills();
    } catch (error) {
      console.error('Failed to unlock skill:', error);
    }
  };

  return {
    userSkills,
    checkForSkillUnlocks,
    getUserSkills,
    unlockSkill,
    loadUserSkills
  };
}
