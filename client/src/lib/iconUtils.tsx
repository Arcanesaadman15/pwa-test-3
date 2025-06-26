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
  Droplets
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
  Clock
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