import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { X, Download, Smartphone, Monitor, Share } from "lucide-react";
import { useState } from "react";
import { Icon } from '@/lib/iconUtils';

interface InstallPromptProps {
  onInstall: () => void;
  onDismiss: () => void;
  onDismissPermanently?: () => void;
  isIOS?: boolean;
  showBanner?: boolean;
}

export function InstallPrompt({ 
  onInstall, 
  onDismiss, 
  onDismissPermanently,
  isIOS = false,
  showBanner = false 
}: InstallPromptProps) {
  const [showInstructions, setShowInstructions] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);

  if (isMinimized && showBanner) {
    return (
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0, opacity: 0 }}
        className="fixed bottom-4 right-4 z-50"
      >
        <Button
          onClick={() => setIsMinimized(false)}
          className="w-14 h-14 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 shadow-lg border-2 border-white/20"
        >
          <Download className="w-6 h-6 text-white" />
        </Button>
      </motion.div>
    );
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: showBanner ? 100 : 0, opacity: 0, scale: showBanner ? 0.9 : 1 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        exit={{ y: showBanner ? 100 : 0, opacity: 0, scale: showBanner ? 0.9 : 1 }}
        transition={{ 
          type: "spring", 
          damping: 25, 
          stiffness: 300,
          duration: 0.4 
        }}
        className={`fixed z-50 ${
          showBanner 
            ? "bottom-4 left-4 right-4" 
            : "top-4 left-4 right-4"
        }`}
      >
        <div className="bg-gradient-to-br from-blue-600 via-blue-700 to-purple-700 text-white rounded-2xl shadow-2xl border border-white/20 max-w-md mx-auto backdrop-blur-sm">
          {/* Header */}
          <div className="relative p-6 pb-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                  <Download className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-white">Install PeakForge</h3>
                  <p className="text-blue-100 text-sm">Get the full app experience</p>
                </div>
              </div>
              
              <div className="flex space-x-1">
                {showBanner && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsMinimized(true)}
                    className="text-white/70 hover:text-white hover:bg-white/10 w-8 h-8 p-0"
                  >
                    <span className="text-lg">−</span>
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onDismiss}
                  className="text-white/70 hover:text-white hover:bg-white/10 w-8 h-8 p-0"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Benefits */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="flex items-center space-x-2 text-sm text-blue-100">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span>Offline access</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-blue-100">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span>Faster loading</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-blue-100">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span>Push notifications</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-blue-100">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span>Home screen icon</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="px-6 pb-4">
            <div className="flex space-x-3">
              <Button
                onClick={onInstall}
                className="flex-1 bg-white text-blue-700 hover:bg-blue-50 font-semibold py-3 rounded-xl shadow-lg"
              >
                {isIOS ? (
                  <>
                    <Share className="w-4 h-4 mr-2" />
                    Show Steps
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4 mr-2" />
                    Install Now
                  </>
                )}
              </Button>
              
              <Button
                variant="ghost"
                onClick={() => setShowInstructions(!showInstructions)}
                className="text-white/80 hover:text-white hover:bg-white/10 px-4 py-3 rounded-xl"
              >
                {isIOS ? <Smartphone className="w-4 h-4" /> : <Monitor className="w-4 h-4" />}
              </Button>
            </div>

            {/* Dismiss Options */}
            <div className="flex justify-center space-x-4 mt-3 text-xs">
              <button
                onClick={onDismiss}
                className="text-white/60 hover:text-white/80 transition-colors"
              >
                Maybe later
              </button>
              {onDismissPermanently && (
                <button
                  onClick={onDismissPermanently}
                  className="text-white/60 hover:text-white/80 transition-colors"
                >
                  Don't ask again
                </button>
              )}
            </div>
          </div>

          {/* Instructions Panel */}
          <AnimatePresence>
            {showInstructions && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <div className="px-6 pb-6 pt-2 border-t border-white/20">
                  <h4 className="font-semibold text-white mb-3 flex items-center">
                    {isIOS ? (
                      <>
                        <Smartphone className="w-4 h-4 mr-2" />
                        iOS Installation Steps
                      </>
                    ) : (
                      <>
                        <Monitor className="w-4 h-4 mr-2" />
                        Installation Steps
                      </>
                    )}
                  </h4>
                  
                  {isIOS ? (
                    <ol className="list-decimal list-inside space-y-2 text-sm text-gray-300">
                      <li>Tap the share <Icon name="ArrowUp" size={16} className="inline mx-1" /> button at the bottom of Safari</li>
                      <li>Scroll down and tap "Add to Home Screen"</li>
                      <li className="flex items-center gap-2">
                        <Icon name="Smartphone" size={16} className="text-blue-400" />
                        Scroll down and tap "Add to Home Screen"
                      </li>
                      <li className="flex items-center gap-2">
                        <Icon name="PartyPopper" size={16} className="text-green-400" />
                        Find the app icon on your home screen!
                      </li>
                    </ol>
                  ) : (
                    <ol className="list-decimal list-inside space-y-2 text-sm text-blue-100">
                      <li>Open your browser menu (⋮ or ⋯)</li>
                      <li>Look for "Install app" or "Add to Home screen"</li>
                      <li>Follow the prompts to install</li>
                      <li>Launch PeakForge from your device!</li>
                    </ol>
                  )}
                  
                  <div className="mt-4 p-3 bg-white/10 rounded-lg">
                    <p className="text-xs text-blue-100">
                      💡 <strong>Tip:</strong> Once installed, PeakForge will work offline and load faster than the web version.
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
