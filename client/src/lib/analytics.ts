import posthog from 'posthog-js';

type AnalyticsProperties = Record<string, unknown>;

const POSTHOG_KEY = import.meta.env.VITE_POSTHOG_KEY as string | undefined;
const POSTHOG_HOST = (import.meta.env.VITE_POSTHOG_HOST as string | undefined) || 'https://app.posthog.com';

let initialized = false;

export const analytics = {
  init(): void {
    if (initialized || !POSTHOG_KEY) return;
    try {
      posthog.init(POSTHOG_KEY, {
        api_host: POSTHOG_HOST,
        autocapture: true,
        capture_pageview: false,
        loaded: () => {
          initialized = true;
        },
      });
    } catch (error) {
      // Fail silently if env not configured
      // eslint-disable-next-line no-console
      console.warn('PostHog init skipped:', (error as Error)?.message);
    }
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


