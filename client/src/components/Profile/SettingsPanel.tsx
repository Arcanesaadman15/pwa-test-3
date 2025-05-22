import { Switch } from "@/components/ui/switch";
import { useState } from "react";
import { storage } from "@/lib/storage";

export function SettingsPanel() {
  const [settings, setSettings] = useState({
    pushNotifications: true,
    hapticFeedback: true,
    darkMode: false,
    dailyReminders: true
  });

  const updateSetting = (key: string, value: boolean) => {
    setSettings(prev => ({ ...prev, [key]: value }));
    // TODO: Persist to storage
  };

  const handleResetProgress = async () => {
    if (confirm('Are you sure you want to reset all progress? This will clear your onboarding data, tasks, and start fresh. This cannot be undone.')) {
      try {
        await storage.clearAllData();
        // Clear PWA install dismissal too
        localStorage.removeItem('pwa-install-dismissed');
        localStorage.removeItem('pwa-user-interacted');
        localStorage.removeItem('pwa-engagement-time');
        localStorage.removeItem('pwa-installed');
        
        alert('All data cleared! The page will now reload to start fresh.');
        window.location.reload();
      } catch (error) {
        console.error('Error resetting progress:', error);
        alert('Error resetting progress. Please try again.');
      }
    }
  };

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <h3 className="font-semibold text-gray-800 mb-4">App Settings</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium text-gray-700">Push Notifications</div>
              <div className="text-sm text-gray-500">Daily reminders and achievements</div>
            </div>
            <Switch
              checked={settings.pushNotifications}
              onCheckedChange={(checked) => updateSetting('pushNotifications', checked)}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium text-gray-700">Haptic Feedback</div>
              <div className="text-sm text-gray-500">Vibration on task completion</div>
            </div>
            <Switch
              checked={settings.hapticFeedback}
              onCheckedChange={(checked) => updateSetting('hapticFeedback', checked)}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium text-gray-700">Dark Mode</div>
              <div className="text-sm text-gray-500">Automatic based on system</div>
            </div>
            <Switch
              checked={settings.darkMode}
              onCheckedChange={(checked) => updateSetting('darkMode', checked)}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium text-gray-700">Daily Reminders</div>
              <div className="text-sm text-gray-500">8:00 AM notifications</div>
            </div>
            <Switch
              checked={settings.dailyReminders}
              onCheckedChange={(checked) => updateSetting('dailyReminders', checked)}
            />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl p-6 shadow-sm">
        <h3 className="font-semibold text-gray-800 mb-4">Account</h3>
        <div className="space-y-3">
          <button className="w-full text-left py-3 text-gray-700 hover:text-primary transition-colors border-b border-gray-100">
            Export Progress Data
          </button>
          <button className="w-full text-left py-3 text-gray-700 hover:text-primary transition-colors border-b border-gray-100">
            Privacy Policy
          </button>
          <button className="w-full text-left py-3 text-gray-700 hover:text-primary transition-colors border-b border-gray-100">
            Terms of Service
          </button>
          <button 
            onClick={handleResetProgress}
            className="w-full text-left py-3 text-red-600 hover:text-red-700 transition-colors"
          >
            Reset Progress
          </button>
        </div>
      </div>
    </div>
  );
}
