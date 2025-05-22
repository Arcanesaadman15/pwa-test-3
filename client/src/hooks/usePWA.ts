import { useState, useEffect } from "react";

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export function usePWA() {
  const [isInstallable, setIsInstallable] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    // Detect iOS
    const iOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    setIsIOS(iOS);

    // Detect if already installed (standalone mode)
    const standalone = window.matchMedia('(display-mode: standalone)').matches || 
                      (window.navigator as any).standalone === true;
    setIsStandalone(standalone);

    // Track user engagement for Chrome PWA requirements
    let engagementStartTime = Date.now();
    let hasInteracted = false;

    const trackInteraction = () => {
      if (!hasInteracted) {
        hasInteracted = true;
        localStorage.setItem('pwa-user-interacted', 'true');
      }
    };

    const trackEngagementTime = () => {
      const timeSpent = Date.now() - engagementStartTime;
      if (timeSpent >= 30000) { // 30 seconds
        localStorage.setItem('pwa-engagement-time', 'true');
      }
    };

    // Add event listeners for user interaction
    document.addEventListener('click', trackInteraction);
    document.addEventListener('touchstart', trackInteraction);
    
    // Check engagement time every 5 seconds
    const engagementTimer = setInterval(trackEngagementTime, 5000);

    const handleBeforeInstallPrompt = (e: Event) => {
      console.log('beforeinstallprompt event fired');
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      
      // Check if user meets engagement requirements
      const hasInteracted = localStorage.getItem('pwa-user-interacted');
      const hasEngagementTime = localStorage.getItem('pwa-engagement-time');
      const installDismissed = localStorage.getItem('pwa-install-dismissed');
      
      if (!installDismissed && !standalone && (hasInteracted || hasEngagementTime)) {
        setIsInstallable(true);
      }
    };

    const handleAppInstalled = () => {
      console.log('App installed');
      setIsInstallable(false);
      setDeferredPrompt(null);
      setIsStandalone(true);
      localStorage.setItem('pwa-installed', 'true');
    };

    // For iOS, show install prompt after interaction
    if (iOS && !standalone) {
      const installDismissed = localStorage.getItem('pwa-install-dismissed');
      if (!installDismissed) {
        setTimeout(() => {
          setIsInstallable(true);
        }, 2000);
      }
    }

    // For Android/other browsers, wait for proper engagement
    if (!iOS && !standalone) {
      const installDismissed = localStorage.getItem('pwa-install-dismissed');
      if (!installDismissed) {
        // Show install prompt after user meets engagement requirements
        setTimeout(() => {
          const hasInteracted = localStorage.getItem('pwa-user-interacted');
          const hasEngagementTime = localStorage.getItem('pwa-engagement-time');
          if (hasInteracted || hasEngagementTime) {
            setIsInstallable(true);
          }
        }, 31000); // Wait 31 seconds to ensure engagement time requirement
      }
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      document.removeEventListener('click', trackInteraction);
      document.removeEventListener('touchstart', trackInteraction);
      clearInterval(engagementTimer);
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

    // Register service worker
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js')
        .then((registration) => {
          console.log('SW registered: ', registration);
        })
        .catch((registrationError) => {
          console.log('SW registration failed: ', registrationError);
        });
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const promptInstall = async () => {
    if (!deferredPrompt) return;

    try {
      await deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      
      if (outcome === 'accepted') {
        console.log('User accepted the install prompt');
      }
      
      setDeferredPrompt(null);
      setIsInstallable(false);
    } catch (error) {
      console.error('Error prompting for install:', error);
    }
  };

  const dismissInstall = () => {
    setIsInstallable(false);
    localStorage.setItem('pwa-install-dismissed', 'true');
  };

  return {
    isInstallable,
    promptInstall,
    dismissInstall,
    isIOS,
    isStandalone
  };
}
