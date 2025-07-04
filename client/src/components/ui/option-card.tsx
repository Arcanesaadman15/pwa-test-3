import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface OptionCardProps {
  children: React.ReactNode;
  isSelected?: boolean;
  isDisabled?: boolean;
  onClick: () => void;
  className?: string;
  index?: number;
}

export const OptionCard = React.forwardRef<HTMLButtonElement, OptionCardProps>(
  ({ children, isSelected = false, isDisabled = false, onClick, className, index = 0 }, ref) => {
    return (
      <motion.button
        ref={ref}
        onClick={onClick}
        disabled={isDisabled}
        className={cn(
          // Base styles - proper layout and spacing
          "w-full text-left relative overflow-hidden group",
          "border-2 rounded-lg transition-all duration-300",
          "min-h-[80px] p-6 flex items-start",
          "focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:ring-offset-2 focus:ring-offset-black",
          "disabled:pointer-events-none disabled:opacity-50",
          
          // Selected state
          isSelected ? [
            "border-orange-500 bg-orange-500/10 text-white",
            "scale-105 shadow-lg shadow-orange-500/25"
          ] : [
            "border-gray-600/50 bg-gray-900/80 text-gray-100",
            "hover:border-orange-400/60 hover:bg-gray-800/90",
            "hover:shadow-lg hover:shadow-orange-400/20 backdrop-blur-sm"
          ],
          
          className
        )}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.1, duration: 0.4, ease: "easeOut" }}
        whileHover={{ scale: isSelected ? 1.05 : 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        {/* Background shimmer effect */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-orange-400/10 to-transparent opacity-0 group-hover:opacity-100"
          animate={{ x: [-100, 300] }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        
        {/* Content with proper spacing */}
        <div className="flex flex-col text-left w-full relative z-10 space-y-2">
          {children}
        </div>
        
        {/* Selection indicator */}
        {isSelected && (
          <motion.div
            className="absolute right-4 top-1/2 transform -translate-y-1/2"
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
          >
            <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center">
              <motion.div
                className="w-2 h-2 bg-white rounded-full"
                animate={{ scale: [0, 1.2, 1] }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </motion.div>
        )}
      </motion.button>
    );
  }
);

OptionCard.displayName = "OptionCard";

// Utility components for consistent text styling within option cards
export const OptionTitle = React.forwardRef<HTMLSpanElement, { 
  children: React.ReactNode; 
  isSelected?: boolean;
  className?: string;
}>(({ children, isSelected = false, className }, ref) => (
  <motion.span 
    ref={ref}
    className={cn(
      "font-semibold text-lg leading-tight block",
      isSelected ? 'text-white' : 'text-gray-100 group-hover:text-white',
      className
    )}
    animate={isSelected ? { x: [0, 5, 0] } : {}}
    transition={{ duration: 0.3 }}
  >
    {children}
  </motion.span>
));

OptionTitle.displayName = "OptionTitle";

export const OptionSubtitle = React.forwardRef<HTMLSpanElement, { 
  children: React.ReactNode; 
  isSelected?: boolean;
  className?: string;
}>(({ children, isSelected = false, className }, ref) => (
  <motion.span 
    ref={ref}
    className={cn(
      "text-sm leading-relaxed block",
      isSelected ? 'text-orange-200' : 'text-gray-300 group-hover:text-gray-200',
      className
    )}
    animate={isSelected ? { opacity: [0.7, 1, 0.7] } : {}}
    transition={{ duration: 0.5 }}
  >
    {children}
  </motion.span>
));

OptionSubtitle.displayName = "OptionSubtitle"; 