import { SettingsPanel } from "./SettingsPanel";
import { User } from "@/types";
import { usePWA } from "@/hooks/usePWA";
import { Button } from "@/components/ui/button";

interface ProfileOverviewProps {
  user: User;
}

export function ProfileOverview({ user }: ProfileOverviewProps) {
  const { isInstallable, promptInstall, isIOS, isStandalone } = usePWA();

  return (
    <div className="p-4 max-w-md mx-auto space-y-6">
      {/* Profile Header */}
      <div className="bg-gradient-to-r from-primary to-secondary rounded-xl p-6 text-white">
        <div className="flex items-center space-x-4 mb-4">
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
            <i className="fas fa-user text-2xl"></i>
          </div>
          <div>
            <h2 className="text-xl font-bold">{user.name || 'Wellness Warrior'}</h2>
            <p className="opacity-90">
              {user.program || 'Beginner'} Program • Day {user.currentDay || 1}
            </p>
            <p className="text-sm opacity-75">
              Member since {new Date(user.startDate || Date.now()).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </p>
          </div>
        </div>
        
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold">{user.completedDays || 0}</div>
            <div className="text-xs opacity-80">Days Active</div>
          </div>
          <div>
            <div className="text-2xl font-bold">{user.achievements || 0}</div>
            <div className="text-xs opacity-80">Achievements</div>
          </div>
          <div>
            <div className="text-2xl font-bold">{user.level || 1}</div>
            <div className="text-xs opacity-80">Level</div>
          </div>
        </div>
      </div>

      {/* Program Selection */}
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <h3 className="font-semibold text-gray-800 mb-4">Current Program</h3>
        <div className="border border-primary rounded-lg p-4 bg-primary/5">
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-semibold text-primary">{user.program || 'Beginner'} Program</h4>
            <span className="bg-primary text-white px-2 py-1 rounded-full text-xs">Active</span>
          </div>
          <p className="text-sm text-gray-600 mb-3">
            {user.program === 'Advanced' && "Comprehensive wellness routines with high-intensity activities"}
            {user.program === 'Intermediate' && "Balanced approach combining consistent habits with moderate challenges"}
            {(!user.program || user.program === 'Beginner') && "Gentle introduction to wellness habits"}
          </p>
          <div className="flex justify-between text-sm text-gray-500">
            <span>Day {user.currentDay || 1} of 63</span>
            <span>{Math.round(((user.completedDays || 0) / Math.max(user.currentDay || 1, 1)) * 100)}% completion rate</span>
          </div>
        </div>
        
        <button className="w-full mt-3 py-3 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors">
          Change Program
        </button>
      </div>

      {/* Skill Tree Preview */}
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-semibold text-gray-800">Skill Tree Progress</h3>
          <button className="text-primary font-medium text-sm hover:text-primary/80 transition-colors">
            View All
          </button>
        </div>
        
        <div className="grid grid-cols-5 gap-3">
          <div className="text-center">
            <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center mb-2 skill-node mx-auto">
              <i className="fas fa-bed text-white"></i>
            </div>
            <div className="text-xs text-gray-600">Sleep</div>
            <div className="text-xs text-purple-600 font-medium">Lv 2</div>
          </div>
          
          <div className="text-center">
            <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mb-2 skill-node mx-auto">
              <i className="fas fa-running text-white"></i>
            </div>
            <div className="text-xs text-gray-600">Movement</div>
            <div className="text-xs text-green-600 font-medium">Lv 1</div>
          </div>
          
          <div className="text-center">
            <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center mb-2 mx-auto">
              <i className="fas fa-apple-alt text-gray-500"></i>
            </div>
            <div className="text-xs text-gray-400">Nutrition</div>
            <div className="text-xs text-gray-400">Locked</div>
          </div>
          
          <div className="text-center">
            <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center mb-2 skill-node mx-auto">
              <i className="fas fa-sun text-white"></i>
            </div>
            <div className="text-xs text-gray-600">Recovery</div>
            <div className="text-xs text-orange-600 font-medium">Lv 1</div>
          </div>
          
          <div className="text-center">
            <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center mb-2 mx-auto">
              <i className="fas fa-brain text-gray-500"></i>
            </div>
            <div className="text-xs text-gray-400">Mindfulness</div>
            <div className="text-xs text-gray-400">Locked</div>
          </div>
        </div>
      </div>

      {/* PWA Install Section */}
      {!isStandalone && (
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl p-6 text-white">
          <div className="flex items-center space-x-4 mb-4">
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
              <i className="fas fa-download text-xl"></i>
            </div>
            <div>
              <h3 className="font-semibold text-lg">📱 Install PeakForge App</h3>
              <p className="text-sm text-white/90">
                {isIOS 
                  ? "Add to your home screen for the full app experience" 
                  : "Install for offline access and push notifications"
                }
              </p>
            </div>
          </div>
          
          <Button
            onClick={promptInstall}
            className="w-full bg-white text-purple-600 hover:bg-white/90 font-semibold"
          >
            {isIOS ? "Show Install Instructions" : "Install Now"}
          </Button>
          
          {isIOS && (
            <div className="mt-4 p-3 bg-white/10 rounded-lg">
              <div className="text-sm">
                <p className="font-medium mb-2">Quick Install Steps:</p>
                <ol className="list-decimal list-inside space-y-1 text-xs">
                  <li>Tap the Share button <i className="fas fa-share"></i> in Safari</li>
                  <li>Scroll down and tap "Add to Home Screen"</li>
                  <li>Tap "Add" to install PeakForge</li>
                </ol>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Settings */}
      <SettingsPanel />
    </div>
  );
}
