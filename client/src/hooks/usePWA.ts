import { useState, useEffect } from "react";

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

interface PWAUpdateInfo {
  isUpdateAvailable: boolean;
  updateServiceWorker: () => Promise<void>;
  skipWaiting: () => void;
}

export function usePWA() {
  const [isInstallable, setIsInstallable] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [updateInfo, setUpdateInfo] = useState<PWAUpdateInfo>({
    isUpdateAvailable: false,
    updateServiceWorker: async () => {},
    skipWaiting: () => {}
  });
  const [installPromptDismissed, setInstallPromptDismissed] = useState(false);
  const [showInstallBanner, setShowInstallBanner] = useState(false);

  useEffect(() => {
    // Detect iOS (including iPadOS which may not contain 'iPad' in user agent)
    const iOS = /iPad|iPhone|iPod/.test(navigator.userAgent) || 
                (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
    setIsIOS(iOS);

    // Detect if already installed (standalone mode)
    const standalone = window.matchMedia('(display-mode: standalone)').matches || 
                      (window.navigator as any).standalone === true;
    setIsStandalone(standalone);

    // Check if install was previously dismissed
    const installDismissed = localStorage.getItem('pwa-install-dismissed');
    const dismissedTime = localStorage.getItem('pwa-install-dismissed-time');
    
    // Reset dismissal after 7 days
    if (installDismissed && dismissedTime) {
      const dismissedDate = new Date(dismissedTime);
      const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
      if (dismissedDate < weekAgo) {
        localStorage.removeItem('pwa-install-dismissed');
        localStorage.removeItem('pwa-install-dismissed-time');
        setInstallPromptDismissed(false);
      } else {
        setInstallPromptDismissed(true);
      }
    }

    // Track user engagement for Chrome PWA requirements
    let engagementStartTime = Date.now();
    let hasInteracted = false;
    let pageViews = parseInt(localStorage.getItem('pwa-page-views') || '0');
    
    // Increment page views
    pageViews++;
    localStorage.setItem('pwa-page-views', pageViews.toString());

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
    document.addEventListener('scroll', trackInteraction);
    
    // Check engagement time every 5 seconds
    const engagementTimer = setInterval(trackEngagementTime, 5000);

    const handleBeforeInstallPrompt = (e: Event) => {
      // App can be installed
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      
      // Show install prompt based on engagement criteria
      if (!installDismissed && !standalone && pageViews >= 2) {
        // Setting installable to true
        setIsInstallable(true);
        
        // Show banner after user has engaged for a bit
        setTimeout(() => {
          if (hasInteracted) {
            setShowInstallBanner(true);
          }
        }, 10000); // 10 seconds after interaction
      }
    };

    const handleAppInstalled = () => {
              // App installed successfully
      setIsInstallable(false);
      setDeferredPrompt(null);
      setIsStandalone(true);
      setShowInstallBanner(false);
      localStorage.setItem('pwa-installed', 'true');
      localStorage.setItem('pwa-install-date', new Date().toISOString());
      
      // Track install success
      if ('gtag' in window) {
        (window as any).gtag('event', 'pwa_install', {
          event_category: 'PWA',
          event_label: 'App Installed'
        });
      }
    };

    // Service Worker Update Detection
    const handleServiceWorkerUpdate = () => {
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/sw.js')
          .then((registration) => {
            // Service worker registered
            
            // Check for updates
            registration.addEventListener('updatefound', () => {
              const newWorker = registration.installing;
              if (newWorker) {
                newWorker.addEventListener('statechange', () => {
                  if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                    // New app version available
                    setUpdateInfo({
                      isUpdateAvailable: true,
                      updateServiceWorker: async () => {
                        if (registration.waiting) {
                          registration.waiting.postMessage({ type: 'SKIP_WAITING' });
                          window.location.reload();
                        }
                      },
                      skipWaiting: () => {
                        if (registration.waiting) {
                          registration.waiting.postMessage({ type: 'SKIP_WAITING' });
                        }
                      }
                    });
                  }
                });
              }
            });

            // Listen for controlling service worker change
            navigator.serviceWorker.addEventListener('controllerchange', () => {
              // App updated, reloading
              window.location.reload();
            });
          })
          .catch((registrationError) => {
            // Service worker registration failed
          });
      }
    };

    // iOS-specific install prompt logic
    if (iOS && !standalone && !installDismissed && pageViews >= 2) {
      setTimeout(() => {
        if (hasInteracted) {
          setIsInstallable(true);
          setShowInstallBanner(true);
        }
      }, 15000); // Show after 15 seconds on iOS
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);
    
    handleServiceWorkerUpdate();

    return () => {
      document.removeEventListener('click', trackInteraction);
      document.removeEventListener('touchstart', trackInteraction);
      document.removeEventListener('scroll', trackInteraction);
      clearInterval(engagementTimer);
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const promptInstall = async () => {
          // Install button clicked
    
    // For Android/Desktop with deferred prompt
    if (deferredPrompt) {
      try {
        // Triggering install prompt
        await deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        
                  if (outcome === 'accepted') {
            // User accepted the install prompt
          setIsStandalone(true);
          
          // Track successful install
          if ('gtag' in window) {
            (window as any).gtag('event', 'pwa_install_accepted', {
              event_category: 'PWA',
              event_label: 'Install Accepted'
            });
          }
                  } else {
            // User dismissed the install prompt
          
          // Track dismissal
          if ('gtag' in window) {
            (window as any).gtag('event', 'pwa_install_dismissed', {
              event_category: 'PWA',
              event_label: 'Install Dismissed'
            });
          }
        }
        
        setDeferredPrompt(null);
        setIsInstallable(false);
        setShowInstallBanner(false);
      } catch (error) {
        console.error('Error during install prompt:', error);
        // Show fallback instructions
        showInstallInstructions();
      }
    } else {
      // For iOS or browsers without native install prompt support
      showInstallInstructions();
    }
  };

  const showInstallInstructions = () => {
    if (isIOS) {
      // Create a more user-friendly iOS instruction modal
      const instructions = `To install PeakForge on your iPhone/iPad:

1. Tap the Share button (⬆️) at the bottom of Safari
2. Scroll down and tap "Add to Home Screen"
3. Tap "Add" to install the app

You'll then be able to open PeakForge directly from your home screen!`;
      
      alert(instructions);
    } else {
      const instructions = `To install PeakForge:

1. Open the browser menu (⋮ or ⋯)
2. Look for "Install app" or "Add to Home screen"
3. Follow the prompts to install

Once installed, you can access PeakForge directly from your device!`;
      
      alert(instructions);
    }
  };

  const dismissInstall = () => {
    setIsInstallable(false);
    setShowInstallBanner(false);
    setInstallPromptDismissed(true);
    localStorage.setItem('pwa-install-dismissed', 'true');
    localStorage.setItem('pwa-install-dismissed-time', new Date().toISOString());
    
    // Track dismissal
    if ('gtag' in window) {
      (window as any).gtag('event', 'pwa_install_banner_dismissed', {
        event_category: 'PWA',
        event_label: 'Banner Dismissed'
      });
    }
  };

  const dismissInstallPermanently = () => {
    dismissInstall();
    localStorage.setItem('pwa-install-permanently-dismissed', 'true');
  };

  return {
    isInstallable,
    promptInstall,
    dismissInstall,
    dismissInstallPermanently,
    isIOS,
    isStandalone,
    updateInfo,
    showInstallBanner,
    installPromptDismissed
  };
}