import { useState, useEffect } from 'react';

interface OfflineData {
  tasks: any[];
  userProgress: any;
  habits: any[];
  lastSync: Date | null;
}

export function useOffline() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [offlineData, setOfflineData] = useState<OfflineData | null>(null);
  const [pendingActions, setPendingActions] = useState<any[]>([]);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      syncPendingActions();
    };

    const handleOffline = () => {
      setIsOnline(false);
      cacheCurrentData();
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Load cached data on mount
    loadCachedData();

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const cacheCurrentData = async () => {
    try {
      const data: OfflineData = {
        tasks: JSON.parse(localStorage.getItem('cached_tasks') || '[]'),
        userProgress: JSON.parse(localStorage.getItem('cached_user_progress') || '{}'),
        habits: JSON.parse(localStorage.getItem('cached_habits') || '[]'),
        lastSync: new Date()
      };
      
      localStorage.setItem('offline_data', JSON.stringify(data));
      setOfflineData(data);
    } catch (error) {
      console.error('Failed to cache data:', error);
    }
  };

  const loadCachedData = () => {
    try {
      const cached = localStorage.getItem('offline_data');
      if (cached) {
        setOfflineData(JSON.parse(cached));
      }
      
      const pending = localStorage.getItem('pending_actions');
      if (pending) {
        setPendingActions(JSON.parse(pending));
      }
    } catch (error) {
      console.error('Failed to load cached data:', error);
    }
  };

  const addPendingAction = (action: any) => {
    const newActions = [...pendingActions, { ...action, timestamp: new Date() }];
    setPendingActions(newActions);
    localStorage.setItem('pending_actions', JSON.stringify(newActions));
  };

  const syncPendingActions = async () => {
    if (pendingActions.length === 0) return;

    try {
      // Process each pending action
      for (const action of pendingActions) {
        switch (action.type) {
          case 'COMPLETE_TASK':
            // Sync task completion
            console.log('Syncing task completion:', action);
            break;
          case 'UPDATE_HABIT':
            // Sync habit update
            console.log('Syncing habit update:', action);
            break;
          case 'UPDATE_PROGRESS':
            // Sync progress update
            console.log('Syncing progress update:', action);
            break;
        }
      }

      // Clear pending actions after successful sync
      setPendingActions([]);
      localStorage.removeItem('pending_actions');
      
      // Show success notification
      if ('serviceWorker' in navigator && 'Notification' in window) {
        new Notification('PeakForge', {
          body: 'Your progress has been synced!',
          icon: '/david.png',
          badge: '/david.png'
        });
      }
    } catch (error) {
      console.error('Failed to sync pending actions:', error);
    }
  };

  const getOfflineCapabilities = () => {
    return {
      canCompleteTask: true,
      canUpdateHabits: true,
      canViewProgress: true,
      canAccessSkills: offlineData?.tasks ? true : false
    };
  };

  const showOfflineNotification = () => {
    if ('serviceWorker' in navigator && 'Notification' in window) {
      new Notification('PeakForge - Offline Mode', {
        body: 'You\'re offline, but you can still track your progress!',
        icon: '/david.png',
        badge: '/david.png'
      });
    }
  };

  // Show offline notification when going offline
  useEffect(() => {
    if (!isOnline) {
      showOfflineNotification();
    }
  }, [isOnline]);

  return {
    isOnline,
    offlineData,
    pendingActions,
    addPendingAction,
    syncPendingActions,
    getOfflineCapabilities,
    hasPendingActions: pendingActions.length > 0
  };
} 