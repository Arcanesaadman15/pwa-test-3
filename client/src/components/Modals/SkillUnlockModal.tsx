import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { generateAndShareSkillImage } from "@/lib/skillImageGenerator";

interface SkillUnlockModalProps {
  isOpen: boolean;
  onClose: () => void;
  skill: any;
}

// Helper function to convert task IDs to readable names
function getTaskDisplayName(taskId: string): string {
  const taskNames: Record<string, string> = {
    'sleep_7h': 'Sleep ≥ 7 hours',
    'walk_10k_steps': 'Walk 10,000 steps', 
    'walk_30min': '30 min Brisk Walk',
    'protein_target': 'Hit Protein Target',
    'morning_sun_15min': '15 min Morning Sunlight',
    'mindfulness_10min': '10 min Mindfulness',
    'yoga_stretch_15min': '15 min Yoga Stretch',
    'cold_shower_30s': '30s Cold Shower',
    'chair_squats': 'Chair Squats',
    'breath_posture_5min': '5 min Breath & Posture',
    'mobility_20min': '20 min Mobility',
    'bodyweight_circuit': 'Bodyweight Strength Circuit',
    'full_body_workout': 'Full Body Workout',
    'heavy_leg_day': 'Heavy Leg Day',
    'plyometric_jumps': 'Plyometric Jump Set',
    'hiit_sprints': 'HIIT Sprints',
    'loaded_carry': 'Loaded Carry'
  };
  
  return taskNames[taskId] || taskId;
}

export function SkillUnlockModal({ isOpen, onClose, skill }: SkillUnlockModalProps) {
  const handleShare = async () => {
    try {
      await generateAndShareSkillImage(skill, "PeakForge Champion");
      onClose();
    } catch (error) {
      console.log('Image share failed, falling back to text');
      // Fallback to text sharing if image fails
      if (navigator.share) {
        try {
          await navigator.share({
            title: 'PeakForge Achievement',
            text: `I just unlocked "${skill?.title}" in my wellness journey!`,
            url: window.location.href
          });
          onClose();
        } catch (shareError) {
          console.log('Share cancelled or failed:', shareError);
        }
      } else {
        const shareText = `🎉 I unlocked ${skill?.title}! Just achieved "${skill?.title}" in PeakForge! ${skill?.description}`;
        navigator.clipboard.writeText(shareText);
        onClose();
      }
    }
  };

  if (!skill) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-xs mx-auto w-[90vw] left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-gray-900 border-gray-700">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center p-4"
        >
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="w-16 h-16 bg-gradient-to-r from-amber-400 to-yellow-400 rounded-full mx-auto mb-4 flex items-center justify-center shadow-lg"
          >
            <span className="text-2xl">{skill.categoryIcon}</span>
          </motion.div>
          
          <h3 className="text-xl font-bold text-white mb-2">Skill Unlocked!</h3>
          <p className="text-gray-200 mb-2 text-sm font-medium">{skill.title}</p>
          <p className="text-xs text-gray-400 mb-4 leading-relaxed">{skill.description}</p>
          
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="bg-gray-800 border border-gray-600 rounded-xl p-3 mb-4"
          >
            <div className="flex items-center justify-center space-x-3">
              <span className="text-purple-400 text-lg">{skill.categoryIcon}</span>
              <span className="font-semibold text-gray-200 text-sm">{skill.categoryName}</span>
              <span className="bg-gradient-to-r from-purple-500 to-purple-600 text-white px-3 py-1 rounded-full text-xs font-bold">
                Level {skill.level}
              </span>
            </div>
          </motion.div>

          {/* Unlock Requirements */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="bg-gray-800 border border-gray-600 rounded-xl p-3 mb-4"
          >
            <h4 className="text-white font-medium text-sm mb-2 text-center">What You Accomplished</h4>
            <div className="space-y-1">
              {skill.requirements?.map((req: any, index: number) => (
                <div key={index} className="flex items-center justify-between text-xs">
                  <span className="text-gray-300 flex-1">
                    {getTaskDisplayName(req.taskId)} {req.consecutive ? '(consecutive)' : ''}
                  </span>
                  <span className="text-green-400 font-bold">
                    ✓ {req.count}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
          
          <div className="space-y-2">
            <Button 
              onClick={handleShare}
              className="w-full bg-gradient-to-r from-amber-500 to-yellow-500 text-gray-900 py-3 rounded-xl font-semibold hover:from-amber-400 hover:to-yellow-400 transition-all shadow-lg"
            >
              Share Achievement
            </Button>
            <Button 
              onClick={onClose}
              variant="outline"
              className="w-full py-3 rounded-xl font-semibold border-gray-600 text-gray-300 hover:bg-gray-800 hover:text-white transition-all"
            >
              Continue
            </Button>
          </div>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}
