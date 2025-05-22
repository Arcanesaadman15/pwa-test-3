import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

interface TaskCompletionModalProps {
  isOpen: boolean;
  onClose: () => void;
  taskId: string | null;
  userStreak: number;
}

export function TaskCompletionModal({ isOpen, onClose, taskId, userStreak }: TaskCompletionModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-sm mx-4">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center p-6"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="w-16 h-16 bg-primary rounded-full mx-auto mb-4 flex items-center justify-center"
          >
            <i className="fas fa-check text-white text-2xl"></i>
          </motion.div>
          
          <h3 className="text-xl font-bold text-gray-800 mb-2">Task Completed!</h3>
          <p className="text-gray-600 mb-6">
            Great job on completing your wellness task
          </p>
          
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6"
          >
            <div className="flex items-center justify-center space-x-2 text-amber-600">
              <i className="fas fa-fire streak-flame"></i>
              <span className="font-semibold">Streak continues!</span>
              <span className="bg-amber-500 text-white px-2 py-1 rounded-full text-sm font-bold">
                {userStreak}
              </span>
            </div>
          </motion.div>
          
          <Button 
            onClick={onClose}
            className="w-full bg-primary text-white py-3 rounded-xl font-semibold hover:bg-primary/90 transition-colors"
          >
            Continue
          </Button>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}
