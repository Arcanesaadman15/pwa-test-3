import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface LoadingSkeletonProps {
  className?: string;
  variant?: 'default' | 'shimmer' | 'pulse' | 'wave';
  lines?: number;
  avatar?: boolean;
  rounded?: boolean;
  height?: string;
  width?: string;
}

export function LoadingSkeleton({
  className,
  variant = 'shimmer',
  lines = 1,
  avatar = false,
  rounded = false,
  height = 'h-4',
  width = 'w-full'
}: LoadingSkeletonProps) {
  const baseClasses = cn(
    'bg-gray-200 dark:bg-gray-700',
    rounded ? 'rounded-full' : 'rounded-md',
    height,
    width,
    className
  );

  const getVariantClasses = () => {
    switch (variant) {
      case 'shimmer':
        return 'animate-shimmer';
      case 'pulse':
        return 'animate-pulse';
      case 'wave':
        return 'animate-bounce-subtle';
      default:
        return 'animate-pulse';
    }
  };

  const skeletonVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: {
        duration: 0.3,
        ease: "easeOut"
      }
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1
      }
    }
  };

  if (avatar) {
    return (
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="flex items-center space-x-3"
      >
        <motion.div
          variants={skeletonVariants}
          className={cn(
            'w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-full',
            getVariantClasses()
          )}
        />
        <div className="space-y-2 flex-1">
          <motion.div
            variants={skeletonVariants}
            className={cn(
              'h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4',
              getVariantClasses()
            )}
          />
          <motion.div
            variants={skeletonVariants}
            className={cn(
              'h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2',
              getVariantClasses()
            )}
          />
        </div>
      </motion.div>
    );
  }

  if (lines > 1) {
    return (
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-3"
      >
        {Array.from({ length: lines }).map((_, index) => (
          <motion.div
            key={index}
            variants={skeletonVariants}
            className={cn(
              baseClasses,
              getVariantClasses(),
              index === lines - 1 && lines > 2 ? 'w-3/4' : 'w-full'
            )}
          />
        ))}
      </motion.div>
    );
  }

  return (
    <motion.div
      variants={skeletonVariants}
      initial="hidden"
      animate="visible"
      className={cn(baseClasses, getVariantClasses())}
    />
  );
}

// Specialized skeleton components
export function TaskSkeleton() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gray-800 rounded-2xl p-6 border border-gray-700"
    >
      <div className="flex items-center justify-between mb-4">
        <LoadingSkeleton width="w-24" height="h-6" variant="shimmer" />
        <LoadingSkeleton width="w-16" height="h-8" rounded variant="pulse" />
      </div>
      
      <LoadingSkeleton width="w-full" height="h-5" className="mb-3" variant="shimmer" />
      <LoadingSkeleton width="w-3/4" height="h-4" variant="shimmer" />
      
      <div className="flex items-center justify-between mt-6">
        <LoadingSkeleton width="w-20" height="h-4" variant="pulse" />
        <LoadingSkeleton width="w-32" height="h-10" rounded variant="shimmer" />
      </div>
    </motion.div>
  );
}

export function StatsSkeleton() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="grid grid-cols-2 gap-4"
    >
      {Array.from({ length: 4 }).map((_, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="bg-gray-800 rounded-xl p-4 border border-gray-700"
        >
          <LoadingSkeleton width="w-8" height="h-8" rounded className="mb-3" variant="pulse" />
          <LoadingSkeleton width="w-16" height="h-6" className="mb-2" variant="shimmer" />
          <LoadingSkeleton width="w-12" height="h-4" variant="pulse" />
        </motion.div>
      ))}
    </motion.div>
  );
}

export function ProfileSkeleton() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <LoadingSkeleton width="w-24" height="h-24" rounded className="mx-auto mb-4" variant="pulse" />
        <LoadingSkeleton width="w-32" height="h-6" className="mx-auto mb-2" variant="shimmer" />
        <LoadingSkeleton width="w-24" height="h-4" className="mx-auto" variant="pulse" />
      </motion.div>

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-3 gap-4"
      >
        {Array.from({ length: 3 }).map((_, index) => (
          <div key={index} className="text-center">
            <LoadingSkeleton width="w-12" height="h-8" className="mx-auto mb-2" variant="shimmer" />
            <LoadingSkeleton width="w-16" height="h-4" className="mx-auto" variant="pulse" />
          </div>
        ))}
      </motion.div>

      {/* Settings */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="space-y-3"
      >
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="flex items-center justify-between p-4 bg-gray-800 rounded-xl">
            <div className="flex items-center space-x-3">
              <LoadingSkeleton width="w-6" height="h-6" rounded variant="pulse" />
              <LoadingSkeleton width="w-24" height="h-4" variant="shimmer" />
            </div>
            <LoadingSkeleton width="w-6" height="h-6" variant="pulse" />
          </div>
        ))}
      </motion.div>
    </motion.div>
  );
} 