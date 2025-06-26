import React from 'react';
import {
  Dumbbell,
  Apple,
  Moon,
  Brain,
  RotateCcw,
  Star,
  Trophy,
  Target,
  Flame,
  Sparkles,
  Crown,
  CheckCircle,
  Award,
  Zap,
  TrendingUp,
  Activity,
  Heart,
  Shield,
  Sun,
  Clock,
  Footprints,
  Utensils,
  Wind,
  Droplets,
  // New icons for replacing emojis
  Rocket,
  Mountain,
  Smartphone,
  ArrowUp,
  PartyPopper,
  Clipboard,
  Sprout,
  Tablet,
  User,
  Share2,
  Settings
} from 'lucide-react';

// Icon mapping for lucide-react components
export const IconMap = {
  // Category Icons
  Dumbbell,
  Apple,
  Moon,
  Brain,
  RotateCcw,
  Star,
  Sun,
  Activity,
  Heart,
  Footprints,
  Utensils,
  Wind,
  Droplets,
  
  // Achievement Icons
  Trophy,
  Target,
  Flame,
  Sparkles,
  Crown,
  CheckCircle,
  Award,
  Zap,
  TrendingUp,
  Shield,
  Clock,
  
  // UI/Program Icons
  Rocket,
  Mountain,
  Smartphone,
  ArrowUp,
  PartyPopper,
  Clipboard,
  Sprout,
  Tablet,
  User,
  Share2,
  Settings
} as const;

export type IconName = keyof typeof IconMap;

// Component to render icons by name
interface IconProps {
  name: IconName;
  size?: number;
  className?: string;
  color?: string;
}

export const Icon: React.FC<IconProps> = ({ name, size = 20, className = "", color }) => {
  const IconComponent = IconMap[name];
  
  if (!IconComponent) {
    console.warn(`Icon "${name}" not found. Using default Star icon.`);
    return <Star size={size} className={className} style={{ color }} />;
  }
  
  return <IconComponent size={size} className={className} style={{ color }} />;
};

// Helper function to get category icon component
export const getCategoryIcon = (category: string): IconName => {
  const categoryIcons: { [key: string]: IconName } = {
    // Legacy categories (keep for backward compatibility)
    Physical: 'Dumbbell',
    Nutrition: 'Apple',
    Sleep: 'Moon',
    Mental: 'Brain',
    Recovery: 'RotateCcw',
    // Task categories
    Movement: 'Activity',
    Mindfulness: 'Heart',
    Training: 'Dumbbell',
    'Explosive Training': 'Zap',
    'Breath & Tension': 'Wind',
    Mind: 'Brain'
  };
  
  return categoryIcons[category] || 'Star';
};

// Helper function to get achievement type icon
export const getAchievementIcon = (type: string): IconName => {
  const achievementIcons: { [key: string]: IconName } = {
    streak: 'Flame',
    completion: 'Target',
    milestone: 'Trophy',
    skill: 'Award',
    level: 'Star',
    mastery: 'Crown'
  };
  
  return achievementIcons[type] || 'Trophy';
};

// Helper function to get program badge icon
export const getProgramIcon = (program: string): IconName => {
  const programIcons: { [key: string]: IconName } = {
    beginner: 'Sprout',
    intermediate: 'Zap',
    advanced: 'Flame'
  };
  
  return programIcons[program] || 'Sprout';
};

// Helper function to get milestone icon
export const getMilestoneIcon = (milestone: string): IconName => {
  const milestoneIcons: { [key: string]: IconName } = {
    'Week 1 Complete': 'Target',
    '7 Day Streak': 'Flame', 
    'Halfway Point': 'Mountain',
    'Level 5': 'Star',
    'Achievement': 'Trophy',
    'Progress': 'TrendingUp',
    'Launch': 'Rocket'
  };
  
  return milestoneIcons[milestone] || 'Target';
}; 