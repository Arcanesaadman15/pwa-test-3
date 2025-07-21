import { Button } from "@/components/ui/button";
import { RefreshCw, AlertTriangle, ArrowLeft, Trash2, RotateCcw, Download, Target, LogOut, MessageSquare } from "lucide-react";
import { storage } from "@/lib/storage";
import { useToast } from "@/hooks/use-toast";
import { usePWA } from "@/hooks/usePWA";
import { useAuth } from "@/contexts/AuthContext";

interface SettingsPanelProps {
  onBack: () => void;
  onDataReset: () => void;
  onProgramChange: () => void;
}

export function SettingsPanel({ onBack, onDataReset, onProgramChange }: SettingsPanelProps) {
  const { toast } = useToast();
  const { isInstallable, promptInstall, isIOS, isStandalone } = usePWA();
  const { signOut, userProfile } = useAuth();

  const handleResetData = async () => {
    try {
      await storage.clearAllData();
      onDataReset();
      toast({
        title: "✨ Fresh Start!",
        description: "All data cleared. You can restart your journey now.",
      });
    } catch (error) {
      console.error('Failed to reset data:', error);
      toast({
        title: "Error",
        description: "Failed to reset data. Please try again.",
        variant: "error"
      });
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      toast({
        title: "Signed Out",
        description: "You have been successfully signed out.",
      });
    } catch (error) {
      console.error('Sign out error:', error);
      toast({
        title: "Error",
        description: "Failed to sign out. Please try again.",
        variant: "error"
      });
    }
  };

  const handleFeedback = () => {
    window.open('https://peakforge.canny.io/feature-requests-and-issues', '_blank');
  };

  type SettingsItem = {
    icon: any;
    title: string;
    description: string;
    action: () => void;
    disabled?: boolean;
    destructive?: boolean;
  };

  const settingsSections: { title: string; items: SettingsItem[] }[] = [
    {
      title: "Account",
      items: [
        {
          icon: LogOut,
          title: "Sign Out",
          description: `Signed in as ${userProfile?.email || 'user'}`,
          action: handleSignOut,
          destructive: true
        }
      ]
    },
    {
      title: "App",
      items: [
        ...(!isStandalone && (isInstallable || isIOS) ? [{
          icon: Download,
          title: "Install App",
          description: isIOS ? "Add to Home Screen for full experience" : "Install PeakForge for offline access",
          action: promptInstall,
          disabled: false
        }] : []),
        {
          icon: RefreshCw,
          title: "Sync Data",
          description: "Synchronize your progress across devices",
          action: () => {
            toast({
              title: "Coming Soon",
              description: "Cloud sync feature will be available in a future update.",
            });
          },
          disabled: true
        }
      ]
    },
    {
      title: "Program",
      items: [
        {
          icon: Target,
          title: "Change Program",
          description: "Switch between beginner, intermediate, and advanced",
          action: onProgramChange,
          disabled: false
        }
      ]
    },
    {
      title: "Progress",
      items: [
        {
          icon: RotateCcw,
          title: "Reset Progress",
          description: "Clear all data and start fresh",
          action: handleResetData,
          destructive: true
        }
      ]
    },
    {
      title: "Feedback",
      items: [
        {
          icon: MessageSquare,
          title: "Send Feedback",
          description: "Request features, report bugs, or share ideas",
          action: handleFeedback,
          disabled: false
        }
      ]
    },
    {
      title: "About",
      items: [
        {
          icon: AlertTriangle,
          title: "Version",
          description: "PeakForge v1.0.0",
          action: () => {},
          disabled: true
        }
      ]
    },
    {
      title: "Legal & Support",
      items: []
    }
  ];

  return (
    <div className="min-h-screen bg-[var(--ios-background)] text-black">
      {/* Header */}
      <div className="bg-white px-6 pt-12 pb-8 border-b border-gray-100">
        <div className="flex items-center gap-4 mb-8">
          <Button
            onClick={onBack}
            variant="outline"
            className="border-gray-300 text-gray-700 hover:bg-gray-50 p-2"
            size="sm"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Settings
            </h1>
            <p className="text-gray-600">
              Manage your app preferences
            </p>
          </div>
        </div>
      </div>

      <div className="px-6 py-6 space-y-6">
        {/* Settings Sections */}
        {settingsSections.slice(0, -1).map((section, sectionIndex) => (
          <div key={sectionIndex} className="ios-card p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">{section.title}</h3>
            
            <div className="space-y-3">
              {section.items.map((item, itemIndex) => (
                <div 
                  key={itemIndex}
                  className={`flex items-center gap-4 p-4 rounded-xl border transition-all ${
                    item.disabled 
                      ? 'border-gray-200 bg-gray-50 opacity-50 cursor-not-allowed'
                      : item.destructive
                        ? 'border-red-200 bg-red-50 hover:bg-red-100 cursor-pointer'
                        : 'border-gray-200 bg-gray-50 hover:bg-gray-100 cursor-pointer'
                  }`}
                  onClick={!item.disabled ? item.action : undefined}
                >
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    item.destructive ? 'bg-red-500' : 'bg-gray-500'
                  }`}>
                    <item.icon className="w-5 h-5 text-white" />
                  </div>
                  
                  <div className="flex-1">
                    <h4 className={`font-medium ${
                      item.destructive ? 'text-red-600' : 'text-gray-900'
                    }`}>
                      {item.title}
                    </h4>
                    <p className="text-xs text-gray-500">{item.description}</p>
                  </div>
                  
                  {item.disabled && (
                    <div className="text-xs text-gray-500">
                      Coming Soon
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* Reset Data Warning */}
        <div className="bg-red-50 rounded-2xl p-6 border border-red-200">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-red-500 mt-0.5" />
            <div>
              <h3 className="text-lg font-bold text-red-700 mb-2">Data Reset Warning</h3>
              <p className="text-red-600 text-sm mb-4">
                Resetting your data will permanently delete all progress, including:
              </p>
              <ul className="text-red-600 text-sm space-y-1 mb-4">
                <li>• Task completion history</li>
                <li>• Skill progression and unlocks</li>
                <li>• Streak records and achievements</li>
                <li>• All user preferences and settings</li>
              </ul>
              <p className="text-red-600 text-xs">
                This action cannot be undone. Make sure you want to start completely fresh.
              </p>
            </div>
          </div>
        </div>

        {/* App Info */}
        <div className="ios-card p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">App Information</h3>
          
          <div className="space-y-3 text-sm">
            <div className="flex justify-between items-center">
              <span className="text-gray-500">Version</span>
              <span className="text-gray-900 font-medium">1.0.0</span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-gray-500">Build</span>
              <span className="text-gray-900 font-medium">2024.1</span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-gray-500">Platform</span>
              <span className="text-gray-900 font-medium">Progressive Web App</span>
            </div>
          </div>
        </div>

        {/* Privacy Notice */}
        <div className="bg-blue-50 rounded-2xl p-6 border border-blue-200">
          <h3 className="text-lg font-bold text-blue-700 mb-2">Privacy & Data</h3>
          <p className="text-blue-600 text-sm">
            All your data is stored locally on your device. We don't collect or share any personal information. 
            Your wellness journey stays completely private and under your control.
          </p>
        </div>

        {/* Legal & Support Section */}
        <div className="ios-card p-6">
          <h3 className="text-lg font-bold mb-4">Product Details</h3>
                      <p className="text-sm text-gray-600 mb-4">PeakForge is a progressive web app designed to help men naturally support their energy and vitality through personalized daily habits, skill-building exercises, and comprehensive wellness programs.</p>
          
          <h3 className="text-lg font-bold mb-2">Privacy Policy</h3>
          <p className="text-sm text-gray-600 mb-4">Your program data is stored locally on your device for privacy. Only subscription-related information is stored securely online. We do not collect or share any personal health data without consent.</p>
          
          <h3 className="text-lg font-bold mb-2">Contact Us</h3>
          <p className="text-sm text-gray-600">For support or inquiries: saadman.masud15@gmail.com</p>
        </div>
      </div>
    </div>
  );
}