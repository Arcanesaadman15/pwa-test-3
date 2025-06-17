import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { RefreshCw, X, Download, Sparkles } from "lucide-react";
import { useState } from "react";

interface UpdateNotificationProps {
  isVisible: boolean;
  onUpdate: () => void;
  onDismiss: () => void;
}

export function UpdateNotification({ isVisible, onUpdate, onDismiss }: UpdateNotificationProps) {
  const [isUpdating, setIsUpdating] = useState(false);

  const handleUpdate = async () => {
    setIsUpdating(true);
    try {
      await onUpdate();
    } catch (error) {
      console.error('Update failed:', error);
      setIsUpdating(false);
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: -100, opacity: 0, scale: 0.9 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: -100, opacity: 0, scale: 0.9 }}
          transition={{ 
            type: "spring", 
            damping: 25, 
            stiffness: 300,
            duration: 0.4 
          }}
          className="fixed top-4 left-4 right-4 z-50"
        >
          <div className="bg-gradient-to-br from-green-600 via-green-700 to-emerald-700 text-white rounded-2xl shadow-2xl border border-white/20 max-w-md mx-auto backdrop-blur-sm">
            {/* Header */}
            <div className="relative p-6 pb-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                    <motion.div
                      animate={{ rotate: isUpdating ? 360 : 0 }}
                      transition={{ 
                        duration: isUpdating ? 1 : 0, 
                        repeat: isUpdating ? Infinity : 0,
                        ease: "linear"
                      }}
                    >
                      <RefreshCw className="w-6 h-6 text-white" />
                    </motion.div>
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-white flex items-center">
                      <Sparkles className="w-4 h-4 mr-2" />
                      Update Available
                    </h3>
                    <p className="text-green-100 text-sm">New features and improvements</p>
                  </div>
                </div>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onDismiss}
                  disabled={isUpdating}
                  className="text-white/70 hover:text-white hover:bg-white/10 w-8 h-8 p-0"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>

              {/* Update Features */}
              <div className="space-y-2 mb-4">
                <div className="flex items-center space-x-2 text-sm text-green-100">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                  <span>Performance improvements</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-green-100">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                  <span>Bug fixes and stability</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-green-100">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                  <span>Enhanced user experience</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="px-6 pb-6">
              <div className="flex space-x-3">
                <Button
                  onClick={handleUpdate}
                  disabled={isUpdating}
                  className="flex-1 bg-white text-green-700 hover:bg-green-50 font-semibold py-3 rounded-xl shadow-lg disabled:opacity-50"
                >
                  {isUpdating ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="mr-2"
                      >
                        <RefreshCw className="w-4 h-4" />
                      </motion.div>
                      Updating...
                    </>
                  ) : (
                    <>
                      <Download className="w-4 h-4 mr-2" />
                      Update Now
                    </>
                  )}
                </Button>
                
                <Button
                  variant="ghost"
                  onClick={onDismiss}
                  disabled={isUpdating}
                  className="text-white/80 hover:text-white hover:bg-white/10 px-4 py-3 rounded-xl"
                >
                  Later
                </Button>
              </div>

              <div className="mt-3 text-center">
                <p className="text-xs text-green-200">
                  Update will reload the app automatically
                </p>
              </div>
            </div>

            {/* Progress indicator when updating */}
            {isUpdating && (
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20 rounded-b-2xl overflow-hidden">
                <motion.div
                  initial={{ width: "0%" }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 2, ease: "easeInOut" }}
                  className="h-full bg-gradient-to-r from-yellow-400 to-green-400"
                />
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
} 