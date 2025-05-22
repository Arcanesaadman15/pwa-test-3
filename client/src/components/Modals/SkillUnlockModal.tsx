import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

interface SkillUnlockModalProps {
  isOpen: boolean;
  onClose: () => void;
  skill: any;
}

export function SkillUnlockModal({ isOpen, onClose, skill }: SkillUnlockModalProps) {
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'PeakForge Achievement',
        text: `I just unlocked "${skill?.title}" in my wellness journey!`,
        url: window.location.href
      });
    }
    onClose();
  };

  if (!skill) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-sm mx-4">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center p-6"
        >
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="w-16 h-16 bg-gradient-to-r from-amber-500 to-yellow-500 rounded-full mx-auto mb-4 flex items-center justify-center"
          >
            <i className="fas fa-star text-white text-2xl animate-pulse-soft"></i>
          </motion.div>
          
          <h3 className="text-xl font-bold text-gray-800 mb-2">Skill Unlocked!</h3>
          <p className="text-gray-600 mb-2">{skill.title}</p>
          <p className="text-sm text-gray-500 mb-6">{skill.description}</p>
          
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="bg-purple-50 border border-purple-200 rounded-lg p-4 mb-6"
          >
            <div className="flex items-center justify-center space-x-3">
              <i className={`${skill.categoryIcon} text-purple-600 text-lg`}></i>
              <span className="font-semibold text-purple-700">{skill.categoryName}</span>
              <span className="bg-purple-600 text-white px-2 py-1 rounded-full text-xs">
                Level {skill.level}
              </span>
            </div>
          </motion.div>
          
          <div className="space-y-3">
            <Button 
              onClick={handleShare}
              className="w-full bg-gradient-to-r from-amber-500 to-yellow-500 text-white py-3 rounded-xl font-semibold hover:from-amber-600 hover:to-yellow-600 transition-all"
            >
              Share Achievement
            </Button>
            <Button 
              onClick={onClose}
              variant="outline"
              className="w-full py-3 rounded-xl font-semibold"
            >
              Continue
            </Button>
          </div>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}
