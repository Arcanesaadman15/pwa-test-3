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

    // Show install prompt immediately for testing (you can adjust this later)
    if (!standalone) {
      const installDismissed = localStorage.getItem('pwa-install-dismissed');
      if (!installDismissed) {
        // Show install prompt immediately for testing
        setTimeout(() => {
          setIsInstallable(true);
        }, 1000);
      }
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

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
      document.removeEventListener('click', trackInteraction);
      document.removeEventListener('touchstart', trackInteraction);
      clearInterval(engagementTimer);
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const promptInstall = async () => {
    // For iOS, show instructions instead of trying to prompt
    if (isIOS) {
      alert('To install PeakForge:\n\n1. Tap the Share button (⬆️) at the bottom of Safari\n2. Scroll down and tap "Add to Home Screen"\n3. Tap "Add" to install the app');
      return;
    }

    // For Android/Desktop with deferred prompt
    if (deferredPrompt) {
      try {
        await deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        
        if (outcome === 'accepted') {
          console.log('User accepted the install prompt');
        } else {
          console.log('User dismissed the install prompt');
        }
        
        setDeferredPrompt(null);
        setIsInstallable(false);
      } catch (error) {
        console.error('Error during install prompt:', error);
      }
    } else {
      // Fallback for browsers without beforeinstallprompt
      alert('To install PeakForge:\n\n1. Open the browser menu (⋮)\n2. Look for "Install app" or "Add to Home screen"\n3. Follow the prompts to install');
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