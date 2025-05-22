import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";

interface InstallPromptProps {
  onInstall: () => void;
  onDismiss: () => void;
}

export function InstallPrompt({ onInstall, onDismiss }: InstallPromptProps) {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        className="fixed bottom-24 left-4 right-4 z-50"
      >
        <div className="bg-white rounded-xl p-4 shadow-2xl border border-gray-200 glass-effect max-w-md mx-auto">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center flex-shrink-0">
              <i className="fas fa-download text-white text-xl"></i>
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-800">Install PeakForge</h3>
              <p className="text-sm text-gray-600">Get the full app experience on your device</p>
            </div>
            <div className="flex space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={onDismiss}
                className="text-gray-600 hover:text-gray-800"
              >
                Later
              </Button>
              <Button
                size="sm"
                onClick={onInstall}
                className="bg-primary text-white hover:bg-primary/90"
              >
                Install
              </Button>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
