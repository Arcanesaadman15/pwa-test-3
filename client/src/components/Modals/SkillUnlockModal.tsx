import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

interface SkillUnlockModalProps {
  isOpen: boolean;
  onClose: () => void;
  skill: any;
}

export function SkillUnlockModal({ isOpen, onClose, skill }: SkillUnlockModalProps) {
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'PeakForge Achievement',
          text: `I just unlocked "${skill?.title}" in my wellness journey!`,
          url: window.location.href
        });
        // Only close if sharing was successful
        onClose();
      } catch (error) {
        // User cancelled the share - don't close the modal
        console.log('Share cancelled or failed:', error);
      }
    } else {
      // Fallback for browsers without native share
      onClose();
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
            <i className="fas fa-star text-gray-900 text-2xl"></i>
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
              <i className={`${skill.categoryIcon} text-purple-400 text-lg`}></i>
              <span className="font-semibold text-gray-200 text-sm">{skill.categoryName}</span>
              <span className="bg-gradient-to-r from-purple-500 to-purple-600 text-white px-3 py-1 rounded-full text-xs font-bold">
                Level {skill.level}
              </span>
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
