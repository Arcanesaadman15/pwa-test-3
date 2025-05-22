import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";

interface InstallPromptProps {
  onInstall: () => void;
  onDismiss: () => void;
  isIOS?: boolean;
}

export function InstallPrompt({ onInstall, onDismiss, isIOS = false }: InstallPromptProps) {
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
              <p className="text-sm text-gray-600">
                {isIOS 
                  ? "Tap Share button, then 'Add to Home Screen'" 
                  : "Get the full app experience on your device"
                }
              </p>
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
                {isIOS ? "Show Steps" : "Install"}
              </Button>
            </div>
          </div>
          
          {isIOS && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200"
            >
              <div className="flex items-start space-x-2">
                <i className="fas fa-info-circle text-blue-500 mt-0.5"></i>
                <div className="text-sm text-blue-800">
                  <p className="font-medium mb-2">To install on iOS Safari:</p>
                  <ol className="list-decimal list-inside space-y-1 text-xs">
                    <li>Tap the Share button <i className="fas fa-share text-blue-600"></i> at the bottom</li>
                    <li>Scroll down and tap "Add to Home Screen"</li>
                    <li>Tap "Add" to install PeakForge to your home screen</li>
                  </ol>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
