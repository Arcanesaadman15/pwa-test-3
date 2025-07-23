import { User } from "@/types";
import { Settings, ChevronRight, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Icon, getProgramIcon } from "@/lib/iconUtils";

interface ProfileOverviewProps {
  user: User;
  onOpenSettings: () => void;
  onProgramChange?: () => void;
}

export function ProfileOverview({ user, onOpenSettings, onProgramChange }: ProfileOverviewProps) {
  const handleFeedback = () => {
    window.open('https://peakforge.canny.io/feature-requests-and-issues', '_blank');
  };
  
  const getProgramBadge = (program: string) => {
    const badges = {
      beginner: { color: 'bg-green-500', text: 'Beginner', icon: getProgramIcon('beginner') },
      intermediate: { color: 'bg-blue-500', text: 'Intermediate', icon: getProgramIcon('intermediate') },
      advanced: { color: 'bg-purple-500', text: 'Advanced', icon: getProgramIcon('advanced') }
    };
    return badges[program as keyof typeof badges] || badges.beginner;
  };

  const badge = getProgramBadge(user.program);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white px-4 pt-12 pb-6 border-b border-gray-100">
        <div className="text-center mb-6">
          {/* Name - No avatar image */}
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            {user.name}
          </h1>
          
          {/* Program Badge */}
          <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full ${badge.color} text-white text-sm font-medium`}>
            <Icon name={badge.icon} size={16} className="text-white" />
            {badge.text} Program
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 justify-center">
          <Button 
            onClick={onOpenSettings}
            variant="outline"
            className="border-gray-300 text-gray-700 hover:bg-gray-50"
          >
            <Settings className="w-4 h-4 mr-2" />
            Settings
          </Button>
          <Button 
            onClick={handleFeedback}
            variant="outline"
            className="border-orange-300 text-orange-700 hover:bg-orange-50 hover:border-orange-400"
          >
            <MessageSquare className="w-4 h-4 mr-2" />
            Feedback
          </Button>
        </div>
      </div>

      <div className="px-4 py-6">
        {/* Program Selection */}
        <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Program Settings</h3>
          
          <div className="space-y-4">
            <button
              onClick={onProgramChange}
              className="w-full flex items-center justify-between p-4 rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-full ${badge.color} flex items-center justify-center`}>
                  <Icon name={badge.icon} size={16} className="text-white" />
                </div>
                <div className="text-left">
                  <div className="font-medium text-gray-900">Current Program</div>
                  <div className="text-sm text-gray-500">{badge.text} • 63-day journey</div>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </button>
          </div>
        </div>

        {/* Key Stats */}
        <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Achievement Stats</h3>
          
          <div className="space-y-3">
            <div className="flex justify-between items-center py-2">
              <span className="text-gray-600 text-sm">Days Completed</span>
              <span className="text-gray-900 font-semibold">{user.completedDays || 0}</span>
            </div>

            <div className="flex justify-between items-center py-2">
              <span className="text-gray-600 text-sm">Current Streak</span>
              <span className="text-gray-900 font-semibold">{user.currentStreak || 0} days</span>
            </div>
            
            <div className="flex justify-between items-center py-2">
              <span className="text-gray-600 text-sm">Best Streak</span>
              <span className="text-gray-900 font-semibold">{user.longestStreak || 0} days</span>
            </div>
            
            <div className="flex justify-between items-center py-2">
              <span className="text-gray-600 text-sm">Current Level</span>
              <span className="text-gray-900 font-semibold">Level {user.level || 1}</span>
            </div>
            
            <div className="flex justify-between items-center py-2">
              <span className="text-gray-600 text-sm">Program</span>
              <span className="text-gray-900 font-semibold capitalize">{user.program}</span>
            </div>
          </div>
        </div>

        {/* Feedback Card */}
        <div className="bg-gradient-to-r from-orange-50 to-orange-100 border border-orange-200 rounded-2xl p-6 mb-6">
          <div className="text-center">
            <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-3">
              <MessageSquare className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-orange-900 mb-2">Help Us Improve</h3>
            <p className="text-orange-700 text-sm mb-4 leading-relaxed">
              Your feedback shapes PeakForge. Request features, report issues, or share ideas to make your transformation journey even better.
            </p>
            <Button 
              onClick={handleFeedback}
              className="bg-orange-500 hover:bg-orange-600 text-white font-medium px-6 py-2 rounded-xl transition-all hover:scale-105"
            >
              <MessageSquare className="w-4 h-4 mr-2" />
              Send Feedback
            </Button>
          </div>
        </div>

        {/* Simple motivational footer */}
        <div className="text-center text-gray-500 text-sm flex items-center justify-center gap-2">
          <Icon name="Sparkles" size={16} />
          <p>Keep building your wellness habits!</p>
        </div>
      </div>
    </div>
  );
}