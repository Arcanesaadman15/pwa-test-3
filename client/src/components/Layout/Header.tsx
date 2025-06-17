import { User } from "@/types";
import { StreakIndicator } from "@/components/Rewards/StreakIndicator";
import { useAuth } from "@/contexts/AuthContext";
import { useState, useRef, useEffect } from "react";
import { LogOut, User as UserIcon, Settings } from "lucide-react";

interface HeaderProps {
  user: User;
  onOpenProfile?: () => void;
}

export function Header({ user, onOpenProfile }: HeaderProps) {
  const { signOut } = useAuth();
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut();
      setShowMenu(false);
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  // Show loading state if user is not yet loaded
  if (!user) {
    return (
      <header className="bg-white shadow-sm border-b border-gray-200 p-4 sticky top-0 z-40 pwa-header">
        <div className="max-w-md mx-auto">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-gray-900">
                Day <span className="text-primary">1</span>
              </h1>
              <p className="text-sm text-gray-600">
                Beginner Program • Week 1
              </p>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Animated Streak Indicator */}
              <StreakIndicator 
                currentStreak={0}
                longestStreak={0}
              />
              
              {/* User Avatar */}
              <button className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors touch-feedback">
                <UserIcon className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 p-4 sticky top-0 z-40 pwa-header">
      <div className="max-w-md mx-auto">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-gray-900">
              Day <span className="text-primary">{user.currentDay || 1}</span>
            </h1>
            <p className="text-sm text-gray-600">
              {user.program || 'Beginner'} Program • Week {Math.ceil((user.currentDay || 1) / 7)}
            </p>
          </div>
          
          <div className="flex items-center space-x-4">
            {/* Animated Streak Indicator */}
            <StreakIndicator 
              currentStreak={user.currentStreak || 0}
              longestStreak={user.longestStreak || 0}
            />
            
            {/* User Avatar with Dropdown Menu */}
            <div className="relative" ref={menuRef}>
              <button 
                onClick={() => setShowMenu(!showMenu)}
                className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors touch-feedback"
              >
                <UserIcon className="w-5 h-5 text-gray-600" />
              </button>
              
              {/* Dropdown Menu */}
              {showMenu && (
                <div className="absolute right-0 top-12 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                  <div className="px-4 py-2 border-b border-gray-100">
                    <p className="text-sm font-medium text-gray-900 truncate">{user.name}</p>
                    <p className="text-xs text-gray-500 truncate">{user.email}</p>
                  </div>
                  
                  {onOpenProfile && (
                    <button
                      onClick={() => {
                        onOpenProfile();
                        setShowMenu(false);
                      }}
                      className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                    >
                      <Settings className="w-4 h-4" />
                      Profile & Settings
                    </button>
                  )}
                  
                  <button
                    onClick={handleSignOut}
                    className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign Out
            </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
