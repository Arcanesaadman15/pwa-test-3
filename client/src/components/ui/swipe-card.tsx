import React, { useState, useRef, useCallback } from 'react';
import { CheckCircle, XCircle, SkipForward } from 'lucide-react';

interface SwipeCardProps {
  children: React.ReactNode;
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onSwipeUp?: () => void;
  leftAction?: {
    icon: React.ComponentType<any>;
    color: string;
    label: string;
  };
  rightAction?: {
    icon: React.ComponentType<any>;
    color: string;
    label: string;
  };
  upAction?: {
    icon: React.ComponentType<any>;
    color: string;
    label: string;
  };
  threshold?: number;
  className?: string;
}

export function SwipeCard({
  children,
  onSwipeLeft,
  onSwipeRight,
  onSwipeUp,
  leftAction = {
    icon: XCircle,
    color: 'bg-red-500',
    label: 'Skip'
  },
  rightAction = {
    icon: CheckCircle,
    color: 'bg-green-500',
    label: 'Complete'
  },
  upAction = {
    icon: SkipForward,
    color: 'bg-blue-500',
    label: 'Later'
  },
  threshold = 100,
  className = ""
}: SwipeCardProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [activeAction, setActiveAction] = useState<'left' | 'right' | 'up' | null>(null);
  
  const startPos = useRef({ x: 0, y: 0 });
  const cardRef = useRef<HTMLDivElement>(null);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    const touch = e.touches[0];
    startPos.current = { x: touch.clientX, y: touch.clientY };
    setIsDragging(true);
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!isDragging) return;
    
    const touch = e.touches[0];
    const deltaX = touch.clientX - startPos.current.x;
    const deltaY = touch.clientY - startPos.current.y;
    
    // Prevent default scrolling when swiping horizontally
    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      e.preventDefault();
    }
    
    setDragOffset({ x: deltaX, y: deltaY });
    
    // Determine active action based on drag direction and distance
    const absX = Math.abs(deltaX);
    const absY = Math.abs(deltaY);
    
    if (absX > absY && absX > threshold / 2) {
      setActiveAction(deltaX > 0 ? 'right' : 'left');
    } else if (absY > absX && deltaY < -threshold / 2) {
      setActiveAction('up');
    } else {
      setActiveAction(null);
    }
  }, [isDragging, threshold]);

  const handleTouchEnd = useCallback(() => {
    if (!isDragging) return;
    
    const { x, y } = dragOffset;
    const absX = Math.abs(x);
    const absY = Math.abs(y);
    
    // Trigger actions based on swipe distance
    if (absX > threshold && absX > absY) {
      if (x > 0 && onSwipeRight) {
        onSwipeRight();
        // Haptic feedback
        if (navigator.vibrate) {
          navigator.vibrate([50, 30, 50]);
        }
      } else if (x < 0 && onSwipeLeft) {
        onSwipeLeft();
        // Haptic feedback
        if (navigator.vibrate) {
          navigator.vibrate([30]);
        }
      }
    } else if (absY > threshold && y < 0 && onSwipeUp) {
      onSwipeUp();
      // Haptic feedback
      if (navigator.vibrate) {
        navigator.vibrate([40]);
      }
    }
    
    // Reset state
    setIsDragging(false);
    setDragOffset({ x: 0, y: 0 });
    setActiveAction(null);
  }, [isDragging, dragOffset, threshold, onSwipeLeft, onSwipeRight, onSwipeUp]);

  const getCardTransform = () => {
    if (!isDragging) return 'translate3d(0, 0, 0) rotate(0deg)';
    
    const { x, y } = dragOffset;
    const rotation = x * 0.1; // Subtle rotation based on horizontal drag
    const scale = 1 - Math.abs(x) * 0.0005; // Slight scale down when dragging
    
    return `translate3d(${x}px, ${y}px, 0) rotate(${rotation}deg) scale(${scale})`;
  };

  const getActionOpacity = (action: 'left' | 'right' | 'up') => {
    if (activeAction !== action) return 0;
    
    const { x, y } = dragOffset;
    const distance = action === 'up' ? Math.abs(y) : Math.abs(x);
    return Math.min(distance / threshold, 1);
  };

  return (
    <div className={`relative ${className}`}>
      {/* Action Indicators */}
      {/* Left Action */}
      <div 
        className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 pointer-events-none"
        style={{ opacity: getActionOpacity('left') }}
      >
        <div className={`${leftAction.color} rounded-full p-3 shadow-lg`}>
          <leftAction.icon className="w-6 h-6 text-white" />
        </div>
        <div className="text-center mt-2">
          <span className="text-xs font-medium text-white bg-black/50 px-2 py-1 rounded">
            {leftAction.label}
          </span>
        </div>
      </div>

      {/* Right Action */}
      <div 
        className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 pointer-events-none"
        style={{ opacity: getActionOpacity('right') }}
      >
        <div className={`${rightAction.color} rounded-full p-3 shadow-lg`}>
          <rightAction.icon className="w-6 h-6 text-white" />
        </div>
        <div className="text-center mt-2">
          <span className="text-xs font-medium text-white bg-black/50 px-2 py-1 rounded">
            {rightAction.label}
          </span>
        </div>
      </div>

      {/* Up Action */}
      <div 
        className="absolute top-4 left-1/2 transform -translate-x-1/2 z-10 pointer-events-none"
        style={{ opacity: getActionOpacity('up') }}
      >
        <div className={`${upAction.color} rounded-full p-3 shadow-lg`}>
          <upAction.icon className="w-6 h-6 text-white" />
        </div>
        <div className="text-center mt-2">
          <span className="text-xs font-medium text-white bg-black/50 px-2 py-1 rounded">
            {upAction.label}
          </span>
        </div>
      </div>

      {/* Card Content */}
      <div
        ref={cardRef}
        className="transition-transform duration-200 ease-out"
        style={{
          transform: getCardTransform(),
          transition: isDragging ? 'none' : 'transform 0.3s ease-out'
        }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {children}
      </div>
    </div>
  );
} 