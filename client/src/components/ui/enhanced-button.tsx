import React, { useRef, useEffect, forwardRef } from 'react';
import { motion, MotionProps } from 'framer-motion';
import { Button, ButtonProps } from '@/components/ui/button';
import { useMicroInteractions } from '@/hooks/useMicroInteractions';
import { cn } from '@/lib/utils';

interface EnhancedButtonProps extends ButtonProps {
  hapticType?: 'tap' | 'success' | 'error' | 'longPress';
  animationType?: 'spring' | 'pulse' | 'bounce' | 'none';
  glowEffect?: boolean;
  rippleEffect?: boolean;
  soundEnabled?: boolean;
  children: React.ReactNode;
  motionProps?: MotionProps;
}

export const EnhancedButton = forwardRef<HTMLButtonElement, EnhancedButtonProps>(
  ({
    hapticType = 'tap',
    animationType = 'spring',
    glowEffect = false,
    rippleEffect = true,
    soundEnabled = false,
    className,
    children,
    onClick,
    motionProps,
    ...props
  }, ref) => {
    const buttonRef = useRef<HTMLButtonElement>(null);
    const rippleRef = useRef<HTMLDivElement>(null);
    const { interactions, createSpringAnimation, createPulseAnimation, prefersReducedMotion } = useMicroInteractions({
      sounds: soundEnabled
    });

    // Merge refs
    useEffect(() => {
      if (ref) {
        if (typeof ref === 'function') {
          ref(buttonRef.current);
        } else {
          ref.current = buttonRef.current;
        }
      }
    }, [ref]);

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
      // Trigger haptic feedback
      interactions[hapticType]();

      // Trigger animation
      if (buttonRef.current && !prefersReducedMotion()) {
        switch (animationType) {
          case 'spring':
            createSpringAnimation(buttonRef.current, 0.95, 150);
            break;
          case 'pulse':
            createPulseAnimation(buttonRef.current, 1.05, 200);
            break;
          case 'bounce':
            createSpringAnimation(buttonRef.current, 0.9, 200);
            break;
        }
      }

      // Trigger ripple effect
      if (rippleEffect && rippleRef.current) {
        createRippleEffect(event);
      }

      // Call original onClick
      onClick?.(event);
    };

    const createRippleEffect = (event: React.MouseEvent<HTMLButtonElement>) => {
      if (!rippleRef.current || !buttonRef.current) return;

      const button = buttonRef.current;
      const ripple = rippleRef.current;
      const rect = button.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      const x = event.clientX - rect.left - size / 2;
      const y = event.clientY - rect.top - size / 2;

      ripple.style.width = ripple.style.height = size + 'px';
      ripple.style.left = x + 'px';
      ripple.style.top = y + 'px';
      ripple.classList.remove('animate-ripple');
      
      // Force reflow
      ripple.offsetHeight;
      ripple.classList.add('animate-ripple');
    };

    const baseMotionProps: MotionProps = {
      whileTap: prefersReducedMotion() ? {} : { scale: 0.98 },
      transition: { type: "spring", stiffness: 400, damping: 17 },
      ...motionProps
    };

    return (
      <motion.div {...baseMotionProps} className="relative inline-block">
        <Button
          ref={buttonRef}
          className={cn(
            'relative overflow-hidden transition-all duration-200',
            glowEffect && 'hover:shadow-lg hover:shadow-blue-500/25',
            className
          )}
          onClick={handleClick}
          {...props}
        >
          {children}
          
          {/* Ripple effect */}
          {rippleEffect && (
            <div
              ref={rippleRef}
              className="absolute rounded-full bg-white/30 pointer-events-none opacity-0 animate-ripple"
              style={{
                transform: 'scale(0)',
                animation: 'none'
              }}
            />
          )}
          
          {/* Glow effect */}
          {glowEffect && (
            <div className="absolute inset-0 rounded-md bg-gradient-to-r from-blue-400/0 via-blue-400/20 to-blue-400/0 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
          )}
        </Button>
      </motion.div>
    );
  }
);

EnhancedButton.displayName = 'EnhancedButton'; 