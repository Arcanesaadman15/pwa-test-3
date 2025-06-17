import { useRef, useEffect, useState } from 'react';

interface SwipeConfig {
  threshold?: number;
  velocity?: number;
  preventDefaultTouchmoveEvent?: boolean;
  trackMouse?: boolean;
  trackTouch?: boolean;
  delta?: number;
}

interface SwipeHandlers {
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onSwipeUp?: () => void;
  onSwipeDown?: () => void;
  onSwipeStart?: (event: TouchEvent | MouseEvent) => void;
  onSwipeMove?: (event: TouchEvent | MouseEvent, deltaX: number, deltaY: number) => void;
  onSwipeEnd?: (event: TouchEvent | MouseEvent) => void;
}

interface SwipeState {
  isSwipping: boolean;
  direction: 'left' | 'right' | 'up' | 'down' | null;
  deltaX: number;
  deltaY: number;
  velocity: number;
}

const defaultConfig: SwipeConfig = {
  threshold: 50,
  velocity: 0.3,
  preventDefaultTouchmoveEvent: false,
  trackMouse: false,
  trackTouch: true,
  delta: 10
};

export function useSwipeNavigation(
  handlers: SwipeHandlers = {},
  config: SwipeConfig = {}
) {
  const elementRef = useRef<HTMLElement>(null);
  const [swipeState, setSwipeState] = useState<SwipeState>({
    isSwipping: false,
    direction: null,
    deltaX: 0,
    deltaY: 0,
    velocity: 0
  });

  const configRef = useRef({ ...defaultConfig, ...config });
  const handlersRef = useRef(handlers);
  const startRef = useRef({ x: 0, y: 0, time: 0 });
  const lastRef = useRef({ x: 0, y: 0, time: 0 });

  // Update refs when props change
  useEffect(() => {
    configRef.current = { ...defaultConfig, ...config };
    handlersRef.current = handlers;
  }, [config, handlers]);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const getEventData = (event: TouchEvent | MouseEvent) => {
      if ('touches' in event) {
        return {
          x: event.touches[0]?.clientX || 0,
          y: event.touches[0]?.clientY || 0
        };
      }
      return {
        x: event.clientX,
        y: event.clientY
      };
    };

    const handleStart = (event: TouchEvent | MouseEvent) => {
      const { x, y } = getEventData(event);
      const time = Date.now();
      
      startRef.current = { x, y, time };
      lastRef.current = { x, y, time };
      
      setSwipeState(prev => ({
        ...prev,
        isSwipping: true,
        direction: null,
        deltaX: 0,
        deltaY: 0,
        velocity: 0
      }));

      handlersRef.current.onSwipeStart?.(event);
    };

    const handleMove = (event: TouchEvent | MouseEvent) => {
      if (!swipeState.isSwipping && !startRef.current.time) return;

      const { x, y } = getEventData(event);
      const deltaX = x - startRef.current.x;
      const deltaY = y - startRef.current.y;
      const time = Date.now();
      const timeDelta = time - lastRef.current.time;
      const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
      const velocity = timeDelta > 0 ? distance / timeDelta : 0;

      lastRef.current = { x, y, time };

      setSwipeState(prev => ({
        ...prev,
        deltaX,
        deltaY,
        velocity
      }));

      if (configRef.current.preventDefaultTouchmoveEvent) {
        event.preventDefault();
      }

      handlersRef.current.onSwipeMove?.(event, deltaX, deltaY);
    };

    const handleEnd = (event: TouchEvent | MouseEvent) => {
      if (!startRef.current.time) return;

      const deltaX = swipeState.deltaX;
      const deltaY = swipeState.deltaY;
      const absDeltaX = Math.abs(deltaX);
      const absDeltaY = Math.abs(deltaY);
      const time = Date.now() - startRef.current.time;
      const velocity = time > 0 ? Math.sqrt(deltaX * deltaX + deltaY * deltaY) / time : 0;

      let direction: 'left' | 'right' | 'up' | 'down' | null = null;

      // Determine swipe direction
      if (absDeltaX > configRef.current.threshold! || absDeltaY > configRef.current.threshold!) {
        if (absDeltaX > absDeltaY) {
          direction = deltaX > 0 ? 'right' : 'left';
        } else {
          direction = deltaY > 0 ? 'down' : 'up';
        }
      }

      // Check velocity threshold
      if (velocity >= configRef.current.velocity!) {
        switch (direction) {
          case 'left':
            handlersRef.current.onSwipeLeft?.();
            break;
          case 'right':
            handlersRef.current.onSwipeRight?.();
            break;
          case 'up':
            handlersRef.current.onSwipeUp?.();
            break;
          case 'down':
            handlersRef.current.onSwipeDown?.();
            break;
        }
      }

      setSwipeState({
        isSwipping: false,
        direction,
        deltaX: 0,
        deltaY: 0,
        velocity
      });

      startRef.current = { x: 0, y: 0, time: 0 };
      lastRef.current = { x: 0, y: 0, time: 0 };

      handlersRef.current.onSwipeEnd?.(event);
    };

    // Touch events
    if (configRef.current.trackTouch) {
      element.addEventListener('touchstart', handleStart, { passive: true });
      element.addEventListener('touchmove', handleMove, { 
        passive: !configRef.current.preventDefaultTouchmoveEvent 
      });
      element.addEventListener('touchend', handleEnd, { passive: true });
    }

    // Mouse events
    if (configRef.current.trackMouse) {
      element.addEventListener('mousedown', handleStart);
      element.addEventListener('mousemove', handleMove);
      element.addEventListener('mouseup', handleEnd);
    }

    return () => {
      if (configRef.current.trackTouch) {
        element.removeEventListener('touchstart', handleStart);
        element.removeEventListener('touchmove', handleMove);
        element.removeEventListener('touchend', handleEnd);
      }

      if (configRef.current.trackMouse) {
        element.removeEventListener('mousedown', handleStart);
        element.removeEventListener('mousemove', handleMove);
        element.removeEventListener('mouseup', handleEnd);
      }
    };
  }, [swipeState.isSwipping]);

  return {
    ref: elementRef,
    swipeState,
    isSwipping: swipeState.isSwipping
  };
}

// Hook specifically for tab navigation
export function useTabSwipeNavigation(
  currentTab: number,
  totalTabs: number,
  onTabChange: (tabIndex: number) => void,
  config?: SwipeConfig
) {
  const swipeHandlers: SwipeHandlers = {
    onSwipeLeft: () => {
      const nextTab = (currentTab + 1) % totalTabs;
      onTabChange(nextTab);
      
      // Haptic feedback
      if ('vibrate' in navigator) {
        navigator.vibrate(50);
      }
    },
    onSwipeRight: () => {
      const prevTab = currentTab === 0 ? totalTabs - 1 : currentTab - 1;
      onTabChange(prevTab);
      
      // Haptic feedback
      if ('vibrate' in navigator) {
        navigator.vibrate(50);
      }
    }
  };

  return useSwipeNavigation(swipeHandlers, {
    threshold: 80,
    velocity: 0.2,
    ...config
  });
} 