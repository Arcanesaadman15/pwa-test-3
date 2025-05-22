import { SkillCategory } from "./SkillCategory";
import { UserSkills } from "@/types";

interface SkillTreeProps {
  userSkills: UserSkills;
}

export function SkillTree({ userSkills }: SkillTreeProps) {
  const skillCategories = [
    {
      id: 'sleep',
      name: 'Sleep Mastery',
      icon: 'fas fa-bed',
      color: 'purple',
      level: userSkills.sleep?.level || 0,
      progress: userSkills.sleep?.progress || 0,
      skills: [
        { id: 'sleep_schedule', name: 'Sleep Schedule', unlocked: true },
        { id: 'seven_hour_habit', name: '7+ Hour Habit', unlocked: true },
        { id: 'sleep_optimizer', name: 'Sleep Optimizer', unlocked: false }
      ]
    },
    {
      id: 'movement',
      name: 'Movement Mastery',
      icon: 'fas fa-running',
      color: 'green',
      level: userSkills.movement?.level || 0,
      progress: userSkills.movement?.progress || 0,
      skills: [
        { id: 'daily_walker', name: 'Daily Walker', unlocked: true },
        { id: 'fitness_novice', name: 'Fitness Novice', unlocked: false },
        { id: 'strength_builder', name: 'Strength Builder', unlocked: false }
      ]
    },
    {
      id: 'nutrition',
      name: 'Nutrition Mastery',
      icon: 'fas fa-apple-alt',
      color: 'blue',
      level: userSkills.nutrition?.level || 0,
      progress: userSkills.nutrition?.progress || 0,
      skills: [
        { id: 'protein_pro', name: 'Protein Pro', unlocked: false },
        { id: 'macro_master', name: 'Macro Master', unlocked: false },
        { id: 'nutrition_guru', name: 'Nutrition Guru', unlocked: false }
      ]
    },
    {
      id: 'recovery',
      name: 'Recovery Mastery',
      icon: 'fas fa-sun',
      color: 'orange',
      level: userSkills.recovery?.level || 0,
      progress: userSkills.recovery?.progress || 0,
      skills: [
        { id: 'sun_seeker', name: 'Sun Seeker', unlocked: true },
        { id: 'stress_buster', name: 'Stress Buster', unlocked: false },
        { id: 'recovery_expert', name: 'Recovery Expert', unlocked: false }
      ]
    },
    {
      id: 'mindfulness',
      name: 'Mental Clarity',
      icon: 'fas fa-brain',
      color: 'indigo',
      level: userSkills.mindfulness?.level || 0,
      progress: userSkills.mindfulness?.progress || 0,
      skills: [
        { id: 'breathing_basics', name: 'Breathing Basics', unlocked: false },
        { id: 'meditation_master', name: 'Meditation Master', unlocked: false },
        { id: 'mindful_warrior', name: 'Mindful Warrior', unlocked: false }
      ]
    }
  ];

  return (
    <div className="p-4 max-w-md mx-auto space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Skill Tree</h2>
        <p className="text-gray-600">Unlock skills as you progress through your journey</p>
      </div>

      <div className="space-y-8">
        {skillCategories.map((category) => (
          <SkillCategory
            key={category.id}
            category={category}
          />
        ))}
      </div>

      {/* Achievement Showcase */}
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <h3 className="font-semibold text-gray-800 mb-4">Recent Achievements</h3>
        <div className="space-y-3">
          <div className="flex items-center space-x-3 p-3 bg-gradient-to-r from-amber-50 to-yellow-50 rounded-xl border border-amber-200">
            <div className="w-10 h-10 bg-amber-500 rounded-full flex items-center justify-center">
              <i className="fas fa-fire text-white"></i>
            </div>
            <div className="flex-1">
              <div className="font-medium text-gray-800">7-Day Streak!</div>
              <div className="text-sm text-gray-600">Consistent progress for a week</div>
            </div>
            <button className="text-amber-500 hover:text-amber-600 transition-colors">
              <i className="fas fa-share-alt"></i>
            </button>
          </div>
          
          <div className="flex items-center space-x-3 p-3 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl border border-purple-200">
            <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center">
              <i className="fas fa-bed text-white"></i>
            </div>
            <div className="flex-1">
              <div className="font-medium text-gray-800">Sleep Specialist</div>
              <div className="text-sm text-gray-600">Completed 14 sleep tasks</div>
            </div>
            <button className="text-purple-500 hover:text-purple-600 transition-colors">
              <i className="fas fa-share-alt"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
