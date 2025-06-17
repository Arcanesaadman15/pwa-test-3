import { useCallback, useRef, useEffect } from 'react';

interface HapticPattern {
  pattern: number[];
  intensity?: 'light' | 'medium' | 'heavy';
}

interface SoundEffect {
  url: string;
  volume?: number;
  preload?: boolean;
}

interface MicroInteractionConfig {
  haptics?: boolean;
  sounds?: boolean;
  animations?: boolean;
  reducedMotion?: boolean;
}

const HAPTIC_PATTERNS = {
  tap: { pattern: [50], intensity: 'light' as const },
  success: { pattern: [100, 50, 100], intensity: 'medium' as const },
  error: { pattern: [200, 100, 200], intensity: 'heavy' as const },
  notification: { pattern: [50, 50, 50], intensity: 'light' as const },
  longPress: { pattern: [100], intensity: 'medium' as const },
  swipe: { pattern: [30], intensity: 'light' as const },
  achievement: { pattern: [100, 50, 100, 50, 200], intensity: 'heavy' as const },
  taskComplete: { pattern: [80, 40, 80], intensity: 'medium' as const },
  levelUp: { pattern: [150, 75, 150, 75, 300], intensity: 'heavy' as const }
};

const SOUND_EFFECTS = {
  tap: { url: 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIG2m98OScTgwOUarm7blmGgU7k9n1unEiBC13yO/eizEIHWq+8+OWT' },
  success: { url: 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIG2m98OScTgwOUarm7blmGgU7k9n1unEiBC13yO/eizEIHWq+8+OWT' },
  error: { url: 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIG2m98OScTgwOUarm7blmGgU7k9n1unEiBC13yO/eizEIHWq+8+OWT' },
  notification: { url: 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIG2m98OScTgwOUarm7blmGgU7k9n1unEiBC13yO/eizEIHWq+8+OWT' }
};

export function useMicroInteractions(config: MicroInteractionConfig = {}) {
  const {
    haptics = true,
    sounds = false, // Disabled by default to avoid annoying users
    animations = true,
    reducedMotion = false
  } = config;

  const audioContextRef = useRef<AudioContext | null>(null);
  const soundCacheRef = useRef<Map<string, AudioBuffer>>(new Map());
  const lastHapticRef = useRef<number>(0);

  // Initialize audio context
  useEffect(() => {
    if (sounds && typeof window !== 'undefined' && 'AudioContext' in window) {
      audioContextRef.current = new AudioContext();
    }

    return () => {
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, [sounds]);

  // Check for reduced motion preference
  const prefersReducedMotion = useCallback(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches || reducedMotion;
  }, [reducedMotion]);

  // Haptic feedback function
  const triggerHaptic = useCallback((pattern: keyof typeof HAPTIC_PATTERNS | number[]) => {
    if (!haptics || typeof navigator === 'undefined' || !navigator.vibrate) return;

    // Throttle haptic feedback to prevent overwhelming
    const now = Date.now();
    if (now - lastHapticRef.current < 50) return;
    lastHapticRef.current = now;

    try {
      if (Array.isArray(pattern)) {
        navigator.vibrate(pattern);
      } else {
        const hapticPattern = HAPTIC_PATTERNS[pattern];
        if (hapticPattern) {
          navigator.vibrate(hapticPattern.pattern);
        }
      }
    } catch (error) {
      console.warn('Haptic feedback failed:', error);
    }
  }, [haptics]);

  // Sound effect function
  const playSound = useCallback(async (soundKey: keyof typeof SOUND_EFFECTS, volume = 0.3) => {
    if (!sounds || !audioContextRef.current) return;

    try {
      const soundEffect = SOUND_EFFECTS[soundKey];
      if (!soundEffect) return;

      // Create oscillator for simple beep sounds (fallback)
      const oscillator = audioContextRef.current.createOscillator();
      const gainNode = audioContextRef.current.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContextRef.current.destination);

      // Different frequencies for different sounds
      const frequencies = {
        tap: 800,
        success: 1000,
        error: 400,
        notification: 600
      };

      oscillator.frequency.setValueAtTime(frequencies[soundKey] || 800, audioContextRef.current.currentTime);
      gainNode.gain.setValueAtTime(volume, audioContextRef.current.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContextRef.current.currentTime + 0.1);

      oscillator.start(audioContextRef.current.currentTime);
      oscillator.stop(audioContextRef.current.currentTime + 0.1);
    } catch (error) {
      console.warn('Sound effect failed:', error);
    }
  }, [sounds]);

  // Combined interaction function
  const triggerInteraction = useCallback((
    type: keyof typeof HAPTIC_PATTERNS,
    options: {
      haptic?: boolean;
      sound?: boolean;
      soundVolume?: number;
    } = {}
  ) => {
    const { haptic = true, sound = false, soundVolume = 0.3 } = options;

    if (haptic) {
      triggerHaptic(type);
    }

    if (sound) {
      playSound(type as keyof typeof SOUND_EFFECTS, soundVolume);
    }
  }, [triggerHaptic, playSound]);

  // Specific interaction functions
  const interactions = {
    tap: () => triggerInteraction('tap'),
    success: () => triggerInteraction('success', { sound: true, soundVolume: 0.4 }),
    error: () => triggerInteraction('error', { sound: true, soundVolume: 0.5 }),
    notification: () => triggerInteraction('notification'),
    longPress: () => triggerInteraction('longPress'),
    swipe: () => triggerInteraction('swipe'),
    achievement: () => triggerInteraction('achievement', { sound: true, soundVolume: 0.6 }),
    taskComplete: () => triggerInteraction('taskComplete', { sound: true, soundVolume: 0.4 }),
    levelUp: () => triggerInteraction('levelUp', { sound: true, soundVolume: 0.7 })
  };

  // Animation helpers
  const createSpringAnimation = useCallback((
    element: HTMLElement,
    scale = 0.95,
    duration = 150
  ) => {
    if (prefersReducedMotion() || !animations) return;

    element.style.transition = `transform ${duration}ms cubic-bezier(0.34, 1.56, 0.64, 1)`;
    element.style.transform = `scale(${scale})`;

    setTimeout(() => {
      element.style.transform = 'scale(1)';
      setTimeout(() => {
        element.style.transition = '';
      }, duration);
    }, duration);
  }, [animations, prefersReducedMotion]);

  const createPulseAnimation = useCallback((
    element: HTMLElement,
    intensity = 1.05,
    duration = 200
  ) => {
    if (prefersReducedMotion() || !animations) return;

    element.style.transition = `transform ${duration}ms ease-out`;
    element.style.transform = `scale(${intensity})`;

    setTimeout(() => {
      element.style.transform = 'scale(1)';
      setTimeout(() => {
        element.style.transition = '';
      }, duration);
    }, duration);
  }, [animations, prefersReducedMotion]);

  const createShakeAnimation = useCallback((
    element: HTMLElement,
    intensity = 5,
    duration = 300
  ) => {
    if (prefersReducedMotion() || !animations) return;

    const keyframes = [
      { transform: 'translateX(0)' },
      { transform: `translateX(-${intensity}px)` },
      { transform: `translateX(${intensity}px)` },
      { transform: `translateX(-${intensity}px)` },
      { transform: 'translateX(0)' }
    ];

    element.animate(keyframes, {
      duration,
      easing: 'ease-in-out'
    });
  }, [animations, prefersReducedMotion]);

  // Button interaction helper
  const enhanceButton = useCallback((
    element: HTMLElement,
    interactionType: keyof typeof interactions = 'tap'
  ) => {
    const handlePointerDown = () => {
      interactions[interactionType]();
      createSpringAnimation(element);
    };

    const handlePointerUp = () => {
      createPulseAnimation(element, 1.02, 100);
    };

    element.addEventListener('pointerdown', handlePointerDown);
    element.addEventListener('pointerup', handlePointerUp);

    return () => {
      element.removeEventListener('pointerdown', handlePointerDown);
      element.removeEventListener('pointerup', handlePointerUp);
    };
  }, [interactions, createSpringAnimation, createPulseAnimation]);

  return {
    // Core functions
    triggerHaptic,
    playSound,
    triggerInteraction,
    
    // Specific interactions
    interactions,
    
    // Animation helpers
    createSpringAnimation,
    createPulseAnimation,
    createShakeAnimation,
    enhanceButton,
    
    // Utilities
    prefersReducedMotion,
    isHapticsSupported: typeof navigator !== 'undefined' && 'vibrate' in navigator,
    isSoundSupported: typeof window !== 'undefined' && 'AudioContext' in window
  };
} 