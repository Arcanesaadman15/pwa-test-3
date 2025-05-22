import { useState, useEffect } from "react";
import { SkillSystem } from "@/lib/skillSystem";
import { UserSkills } from "@/types";

export function useSkillTree() {
  const [skillSystem] = useState(() => new SkillSystem());
  const [userSkills, setUserSkills] = useState<UserSkills>({});

  useEffect(() => {
    loadUserSkills();
  }, []);

  const loadUserSkills = async () => {
    try {
      const skills = await skillSystem.getUserSkills();
      setUserSkills(skills);
    } catch (error) {
      console.error('Failed to load user skills:', error);
    }
  };

  const checkForSkillUnlocks = async () => {
    try {
      const newSkills = await skillSystem.checkSkillUnlocks();
      if (newSkills.length > 0) {
        await loadUserSkills();
      }
      return newSkills;
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
      await skillSystem.unlockSkill(skillId, category);
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
