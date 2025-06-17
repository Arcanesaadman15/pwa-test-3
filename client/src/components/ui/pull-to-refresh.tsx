import React, { useState, useRef, useCallback, ReactNode } from 'react';
import { RefreshCw } from 'lucide-react';

interface PullToRefreshProps {
  onRefresh: () => Promise<void>;
  children: ReactNode;
  threshold?: number;
  className?: string;
}

export function PullToRefresh({ 
  onRefresh, 
  children, 
  threshold = 80,
  className = ""
}: PullToRefreshProps) {
  const [isPulling, setIsPulling] = useState(false);
  const [pullDistance, setPullDistance] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  const startY = useRef<number>(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    const container = scrollContainerRef.current;
    if (!container || container.scrollTop > 0) return;
    
    startY.current = e.touches[0].clientY;
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    const container = scrollContainerRef.current;
    if (!container || container.scrollTop > 0 || startY.current === 0) return;

    const currentY = e.touches[0].clientY;
    const distance = Math.max(0, currentY - startY.current);
    
    if (distance > 10) {
      e.preventDefault();
      setIsPulling(true);
      setPullDistance(Math.min(distance * 0.6, threshold * 1.5)); // Damping effect
    }
  }, [threshold]);

  const handleTouchEnd = useCallback(async () => {
    if (pullDistance >= threshold && !isRefreshing) {
      setIsRefreshing(true);
      
      // Haptic feedback
      if (navigator.vibrate) {
        navigator.vibrate(50);
      }
      
      try {
        await onRefresh();
      } catch (error) {
        console.error('Refresh failed:', error);
      } finally {
        setTimeout(() => {
          setIsRefreshing(false);
          setPullDistance(0);
          setIsPulling(false);
          startY.current = 0;
        }, 300);
      }
    } else {
      setPullDistance(0);
      setIsPulling(false);
      startY.current = 0;
    }
  }, [pullDistance, threshold, isRefreshing, onRefresh]);

  const getIndicatorOpacity = () => {
    if (isRefreshing) return 1;
    return Math.min(pullDistance / threshold, 1);
  };

  const getIndicatorScale = () => {
    if (isRefreshing) return 1;
    return Math.min(0.5 + (pullDistance / threshold) * 0.5, 1);
  };

  const getRotation = () => {
    if (isRefreshing) return 'animate-spin';
    return `rotate(${Math.min(pullDistance * 2, 360)}deg)`;
  };

  return (
    <div className={`relative ${className}`}>
      {/* Pull indicator */}
      <div 
        className="absolute top-0 left-0 right-0 z-10 flex items-center justify-center transition-all duration-200 ease-out"
        style={{
          height: `${Math.max(pullDistance * 0.8, 0)}px`,
          opacity: getIndicatorOpacity(),
          pointerEvents: 'none'
        }}
      >
        <div 
          className="bg-gray-800/90 backdrop-blur-sm rounded-full p-3 shadow-lg border border-gray-600/50"
          style={{
            transform: `scale(${getIndicatorScale()})`,
          }}
        >
          <RefreshCw 
            className={`w-6 h-6 text-blue-400 transition-transform duration-200 ${
              isRefreshing ? 'animate-spin' : ''
            }`}
            style={{
              transform: isRefreshing ? 'none' : getRotation()
            }}
          />
        </div>
      </div>

      {/* Content container */}
      <div
        ref={scrollContainerRef}
        className="h-full overflow-y-auto"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        style={{
          transform: `translateY(${isPulling ? pullDistance * 0.3 : 0}px)`,
          transition: isPulling ? 'none' : 'transform 0.3s ease-out'
        }}
      >
        {children}
      </div>
    </div>
  );
} 