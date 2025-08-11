import posthog from 'posthog-js';

type AnalyticsProperties = Record<string, unknown>;

const POSTHOG_KEY = import.meta.env.VITE_POSTHOG_KEY as string | undefined;
const POSTHOG_HOST = (import.meta.env.VITE_POSTHOG_HOST as string | undefined) || 'https://app.posthog.com';

let initialized = false;
let currentPath: string | null = null;

export const analytics = {
  init(): void {
    if (initialized || !POSTHOG_KEY) return;
    try {
      posthog.init(POSTHOG_KEY, {
        api_host: POSTHOG_HOST,
        autocapture: true,
        capture_pageview: true, // Enable automatic pageview capture
        capture_pageleave: true, // Enable pageleave events for SPAs
        loaded: () => {
          initialized = true;
          // Track initial page
          currentPath = window.location.pathname;
        },
      });

      // Set up SPA navigation tracking
      this.setupSPATracking();
    } catch (error) {
      // Fail silently if env not configured
      // eslint-disable-next-line no-console
      console.warn('PostHog init skipped:', (error as Error)?.message);
    }
  },

  setupSPATracking(): void {
    if (!POSTHOG_KEY) return;
    
    // Track route changes in SPAs
    const trackPageChange = () => {
      const newPath = window.location.pathname;
      if (currentPath && currentPath !== newPath) {
        // Send pageleave for previous page
        try {
          posthog.capture('$pageleave', { 
            $current_url: window.location.origin + currentPath 
          });
        } catch {
          /* noop */
        }
      }
      
      if (currentPath !== newPath) {
        currentPath = newPath;
        // Send pageview for new page
        try {
          posthog.capture('$pageview', { 
            $current_url: window.location.href 
          });
        } catch {
          /* noop */
        }
      }
    };

    // Listen for browser navigation
    window.addEventListener('popstate', trackPageChange);
    
    // Override pushState and replaceState to catch programmatic navigation
    const originalPushState = history.pushState;
    const originalReplaceState = history.replaceState;
    
    history.pushState = function(...args) {
      originalPushState.apply(history, args);
      setTimeout(trackPageChange, 0);
    };
    
    history.replaceState = function(...args) {
      originalReplaceState.apply(history, args);
      setTimeout(trackPageChange, 0);
    };

    // Also listen for hashchange for hash routing
    window.addEventListener('hashchange', trackPageChange);

    // Handle page leave on tab close/navigation away
    window.addEventListener('beforeunload', () => {
      if (currentPath) {
        try {
          posthog.capture('$pageleave', { 
            $current_url: window.location.href 
          });
        } catch {
          /* noop */
        }
      }
    });

    // Handle page visibility changes (tab switching)
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden' && currentPath) {
        try {
          posthog.capture('$pageleave', { 
            $current_url: window.location.href 
          });
        } catch {
          /* noop */
        }
      }
    });
  },

  identify(distinctId: string, properties?: AnalyticsProperties): void {
    if (!POSTHOG_KEY) return;
    try {
      if (properties) posthog.identify(distinctId, properties);
      else posthog.identify(distinctId);
    } catch {
      /* noop */
    }
  },

  setPerson(properties: AnalyticsProperties): void {
    if (!POSTHOG_KEY) return;
    try {
      // setPersonProperties is available on recent posthog-js versions
      (posthog as any).setPersonProperties?.(properties);
    } catch {
      /* noop */
    }
  },

  registerSuper(properties: AnalyticsProperties): void {
    if (!POSTHOG_KEY) return;
    try {
      posthog.register(properties);
    } catch {
      /* noop */
    }
  },

  reset(): void {
    if (!POSTHOG_KEY) return;
    try {
      posthog.reset();
    } catch {
      /* noop */
    }
  },

  track(event: string, properties?: AnalyticsProperties): void {
    if (!POSTHOG_KEY) return;
    try {
      posthog.capture(event, properties);
    } catch {
      /* noop */
    }
  },

  page(name?: string, properties?: AnalyticsProperties): void {
    if (!POSTHOG_KEY) return;
    try {
      posthog.capture('$pageview', { $current_url: window.location.href, name, ...properties });
    } catch {
      /* noop */
    }
  },
};


