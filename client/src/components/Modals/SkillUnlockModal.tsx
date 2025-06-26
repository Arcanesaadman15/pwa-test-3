import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Share2, Instagram, MessageCircle, Download, Copy, Trophy, Star, CheckCircle, Target } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Icon, getCategoryIcon } from '@/lib/iconUtils';

interface SkillUnlockModalProps {
  isOpen: boolean;
  onClose: () => void;
  skill: any;
  isNewUnlock?: boolean;
  userStats?: {
    name: string;
    level: number;
    currentStreak: number;
    totalTasks: number;
  };
}

// Helper function to convert task IDs to readable names
function getTaskDisplayName(taskId: string): string {
  const taskNames: Record<string, string> = {
    'sleep_7h': 'Sleep ≥ 7 hours',
    'walk_10k_steps': 'Walk 10,000 steps', 
    'walk_30min': '30 min Brisk Walk',
    'brisk_walk_30m': '30 min Brisk Walk',
    'steps_10k': 'Walk 10,000 steps',
    'protein_target': 'Hit Protein Target',
    'morning_sun_15min': '15 min Morning Sunlight',
    'sunlight_15min': '15 min Morning Sunlight',
    'mindfulness_10min': '10 min Mindfulness',
    'mindfulness_10m': '10 min Mindfulness',
    'yoga_stretch_15min': '15 min Yoga Stretch',
    'yoga_stretch_15m': '15 min Yoga Stretch',
    'cold_shower_30s': '30s Cold Shower',
    'chair_squats': 'Chair Squats',
    'breath_posture_5min': '5 min Breath & Posture',
    'breath_posture_5m': '5 min Breath & Posture',
    'mobility_20min': '20 min Mobility',
    'bodyweight_circuit': 'Bodyweight Strength Circuit',
    'bw_strength_circuit': 'Bodyweight Strength Circuit',
    'full_body_workout': 'Full Body Workout',
    'heavy_leg_day': 'Heavy Leg Day',
    'plyometric_jumps': 'Plyometric Jump Set',
    'plyo_jump_set': 'Plyometric Jump Set',
    'hiit_sprints': 'HIIT Sprints',
    'loaded_carry': 'Loaded Carry'
  };
  
  return taskNames[taskId] || taskId.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
}

export function SkillUnlockModal({ isOpen, onClose, skill, isNewUnlock = false, userStats }: SkillUnlockModalProps) {
  const [showCelebration, setShowCelebration] = useState(false);
  const [showSharing, setShowSharing] = useState(false);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);

  useEffect(() => {
    if (isOpen && skill && isNewUnlock) {
      // Only show celebration animation for new unlocks
      setShowCelebration(true);
      // Then show main content
      setTimeout(() => setShowCelebration(false), 2000);
    } else {
      setShowCelebration(false);
    }
  }, [isOpen, skill, isNewUnlock]);

  if (!skill) return null;

  const generateShareImage = async (): Promise<string> => {
    return new Promise((resolve, reject) => {
      try {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d')!;
        
        // Instagram-friendly square format
        canvas.width = 1080;
        canvas.height = 1080;
        
        // Background gradient
        const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
        gradient.addColorStop(0, '#1f2937');
        gradient.addColorStop(1, '#111827');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Content
        ctx.textAlign = 'center';
        ctx.fillStyle = '#ffffff';
        
        // Title
        ctx.font = 'bold 64px system-ui';
        ctx.fillText(isNewUnlock ? '🏆 New Skill Unlocked!' : '📋 Skill Achievement', canvas.width / 2, 200);
        
        // Skill name
        ctx.font = 'bold 52px system-ui';
        ctx.fillStyle = skill.categoryColor || '#8b5cf6';
        ctx.fillText(skill.title || skill.name, canvas.width / 2, 320);
        
        // Use proper category icon emoji representation for canvas
        const getIconEmoji = (category: string) => {
          const emojiMap: { [key: string]: string } = {
            Physical: '💪',
            Nutrition: '🍎', 
            Sleep: '🌙',
            Mental: '🧠',
            Recovery: '🔄',
            Movement: '🏃',
            Mindfulness: '❤️',
            Training: '💪',
            'Explosive Training': '⚡',
            'Breath & Tension': '💨',
            Mind: '🧠'
          };
          return emojiMap[category] || '⭐';
        };
        
        // Skill icon - Use emoji representation
        ctx.font = '160px system-ui';
        ctx.fillText(getIconEmoji(skill.category), canvas.width / 2, 500);
        
        // Description
        ctx.font = '28px system-ui';
        ctx.fillStyle = '#d1d5db';
        const description = skill.description || 'New wellness skill achieved!';
        ctx.fillText(description, canvas.width / 2, 600);
        
        // User stats
        if (userStats) {
          ctx.font = 'bold 32px system-ui';
          ctx.fillStyle = '#ffffff';
          ctx.fillText(`${userStats.name} • Level ${userStats.level}`, canvas.width / 2, 720);
          
          ctx.font = '24px system-ui';
          ctx.fillStyle = '#9ca3af';
          ctx.fillText(`${userStats.currentStreak} day streak • ${userStats.totalTasks} tasks completed`, canvas.width / 2, 780);
        }
        
        // Branding
        ctx.font = 'bold 36px system-ui';
        ctx.fillStyle = '#3b82f6';
        ctx.fillText('PeakForge • Wellness Journey', canvas.width / 2, 920);
        
        resolve(canvas.toDataURL('image/png'));
      } catch (error) {
        reject(error);
      }
    });
  };

  const shareToInstagram = async () => {
    try {
      setIsGeneratingImage(true);
      const dataUrl = await generateShareImage();
      
      // Convert to blob
      const response = await fetch(dataUrl);
      const blob = await response.blob();
      
      if (navigator.canShare && navigator.canShare({ files: [new File([blob], 'skill.png', { type: 'image/png' })] })) {
        const file = new File([blob], 'skill-unlock.png', { type: 'image/png' });
        await navigator.share({
          title: `I just unlocked "${skill.title || skill.name}" in PeakForge!`,
          text: `New skill unlocked! 🏆`,
          files: [file]
        });
      } else {
        // Fallback: download image and open Instagram
        downloadImage(dataUrl);
        setTimeout(() => {
          const instagramUrl = `instagram://camera`;
          window.location.href = instagramUrl;
          setTimeout(() => window.open('https://www.instagram.com/', '_blank'), 1000);
        }, 500);
      }
    } catch (error) {
      console.error('Failed to share to Instagram:', error);
    } finally {
      setIsGeneratingImage(false);
    }
  };

  const shareToWhatsApp = async () => {
    try {
      setIsGeneratingImage(true);
      const dataUrl = await generateShareImage();
      
      // First download the image
      downloadImage(dataUrl);
      
      // Then open WhatsApp with text
      const text = encodeURIComponent(`🏆 Just unlocked a new skill in PeakForge!\n\n"${skill.title || skill.name}"\n\nJoin me on this wellness journey! 💪`);
      const whatsappUrl = `https://wa.me/?text=${text}`;
      
      setTimeout(() => {
        window.open(whatsappUrl, '_blank');
      }, 500);
      
    } catch (error) {
      console.error('Failed to share to WhatsApp:', error);
    } finally {
      setIsGeneratingImage(false);
    }
  };

  const downloadImage = async (dataUrl?: string) => {
    try {
      if (!dataUrl) {
        setIsGeneratingImage(true);
        dataUrl = await generateShareImage();
      }
      
      const a = document.createElement('a');
      a.href = dataUrl;
      a.download = `peakforge-skill-${(skill.title || skill.name).replace(/\s+/g, '-').toLowerCase()}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch (error) {
      console.error('Failed to download image:', error);
    } finally {
      setIsGeneratingImage(false);
    }
  };

  const nativeShare = async () => {
    try {
      setIsGeneratingImage(true);
      const dataUrl = await generateShareImage();
      const response = await fetch(dataUrl);
      const blob = await response.blob();
      
      if (navigator.canShare && navigator.canShare({ files: [new File([blob], 'skill.png', { type: 'image/png' })] })) {
        const file = new File([blob], 'skill-unlock.png', { type: 'image/png' });
          await navigator.share({
          title: `I just unlocked "${skill.title || skill.name}" in PeakForge!`,
          text: `New skill unlocked! Check out my progress 🏆`,
          files: [file]
        });
      } else {
        // Fallback to download
        downloadImage(dataUrl);
      }
    } catch (error) {
      console.error('Failed to share:', error);
    } finally {
      setIsGeneratingImage(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          {/* Celebration Animation - Only for new unlocks */}
          <AnimatePresence>
            {showCelebration && isNewUnlock && (
              <motion.div
                className="absolute inset-0 flex items-center justify-center"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.2 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
              >
                <div className="text-center">
        <motion.div
                    className="text-8xl mb-4"
                    animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.1, 1] }}
                    transition={{ duration: 0.8, repeat: 2 }}
                  >
                    🏆
                  </motion.div>
                  <motion.h2
                    className="text-4xl font-bold text-white"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    Skill Unlocked!
                  </motion.h2>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Main Modal */}
          <motion.div
            className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl relative max-h-[90vh] overflow-y-auto"
            initial={{ opacity: 0, scale: 0.8, y: 50 }}
            animate={{ 
              opacity: showCelebration ? 0 : 1, 
              scale: showCelebration ? 0.8 : 1,
              y: showCelebration ? 50 : 0
            }}
            exit={{ opacity: 0, scale: 0.8, y: 50 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors z-10"
            >
              <X className="w-5 h-5 text-gray-600" />
            </button>

            {/* Header */}
            <div className="text-center mb-6 pt-2">
              <motion.div
                className="w-20 h-20 rounded-full mx-auto mb-4 flex items-center justify-center"
                style={{ backgroundColor: skill.categoryColor ? `${skill.categoryColor}20` : '#f3f4f6' }}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              >
                <Icon 
                  name={getCategoryIcon(skill.category)} 
                  size={32} 
                  color={skill.categoryColor || '#8b5cf6'}
                />
              </motion.div>
          
              <motion.h2
                className="text-2xl font-bold text-gray-900 mb-2"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                {isNewUnlock ? '🎉 Skill Unlocked!' : '📋 Skill Details'}
              </motion.h2>
              
              <motion.h3
                className="text-xl font-semibold mb-2"
                style={{ color: skill.categoryColor || '#8b5cf6' }}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                {skill.title || skill.name}
              </motion.h3>
              
              <motion.p
                className="text-gray-600"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                {skill.description || 'You\'ve achieved a new milestone in your wellness journey!'}
              </motion.p>
            </div>

            {/* Skill Details */}
          <motion.div
              className="rounded-2xl p-4 mb-6"
              style={{ backgroundColor: skill.categoryColor ? `${skill.categoryColor}10` : '#f8fafc' }}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Star className="w-5 h-5" style={{ color: skill.categoryColor || '#8b5cf6' }} />
                  <span className="text-gray-900 font-medium">Skill Info</span>
                </div>
                <Badge 
                  variant="outline" 
                  className="border"
                  style={{ 
                    backgroundColor: skill.categoryColor ? `${skill.categoryColor}20` : '#f3f4f6',
                    color: skill.categoryColor || '#8b5cf6',
                    borderColor: skill.categoryColor || '#8b5cf6'
                  }}
                >
                  Level {skill.level || 1}
                </Badge>
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="text-gray-500">Category</div>
                  <div className="text-gray-900 font-medium flex items-center gap-2">
                    <Icon 
                      name={getCategoryIcon(skill.category)} 
                      size={16} 
                      color={skill.categoryColor || '#8b5cf6'}
                    />
                    {skill.category || 'Wellness'}
                  </div>
                </div>
                <div>
                  <div className="text-gray-500">Status</div>
                  <div className="text-gray-900 font-medium flex items-center gap-1">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    Unlocked
                  </div>
                </div>
            </div>
          </motion.div>

            {/* Requirements Section */}
            {skill.requirements && skill.requirements.length > 0 && (
              <motion.div
                className="bg-gray-50 rounded-2xl p-4 mb-6"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.7 }}
              >
                <div className="flex items-center gap-2 mb-3">
                  <Target className="w-5 h-5 text-green-600" />
                  <span className="text-gray-900 font-medium">Requirements Completed</span>
                </div>
          
          <div className="space-y-2">
                  {skill.requirements.map((req: any, index: number) => (
                    <div key={index} className="flex items-center gap-3 text-sm">
                      <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                      <span className="text-gray-700">
                        <span className="font-medium">{req.count}</span> × {getTaskDisplayName(req.taskId)}
                        {req.consecutive && <span className="text-orange-600 font-medium"> (consecutive)</span>}
                      </span>
                    </div>
                  ))}
                </div>
                
                {skill.requirements.length > 1 && (
                  <div className="mt-3 pt-3 border-t border-gray-200">
                    <span className="text-xs text-gray-500">
                      All requirements must be completed to unlock this skill
                    </span>
                  </div>
                )}
              </motion.div>
            )}

            {/* Action Buttons */}
            <motion.div
              className="space-y-3"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
              {!showSharing ? (
                <>
                  {/* Only show sharing for new unlocks */}
                  {isNewUnlock && (
                    <Button
                      onClick={() => setShowSharing(true)}
                      className="w-full text-white font-medium py-3 text-base"
                      style={{ backgroundColor: skill.categoryColor || '#8b5cf6' }}
                    >
                      <Share2 className="w-5 h-5 mr-2" />
                      Share My Achievement
            </Button>
                  )}
                  
            <Button 
              onClick={onClose}
              variant="outline"
              className="w-full bg-white text-gray-900 hover:bg-gray-100 border-gray-200 py-3"
            >
                    {isNewUnlock ? 'Continue Journey' : 'Close'}
                  </Button>
                </>
              ) : (
                <div className="space-y-3">
                  <div className="text-center mb-4">
                    <h4 className="text-lg font-semibold text-gray-900 mb-1">Share Your Success!</h4>
                    <p className="text-gray-600 text-sm">Show off your progress and inspire others</p>
                  </div>
                  
                  {/* Primary Share Options */}
                  <div className="grid grid-cols-2 gap-3">
                    <Button
                      onClick={shareToInstagram}
                      disabled={isGeneratingImage}
                      className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-medium py-3"
                    >
                      <Instagram className="w-4 h-4 mr-2" />
                      {isGeneratingImage ? 'Creating...' : 'Instagram'}
                    </Button>
                    
                    <Button
                      onClick={shareToWhatsApp}
                      disabled={isGeneratingImage}
                      className="bg-green-500 hover:bg-green-600 text-white font-medium py-3"
                    >
                      <MessageCircle className="w-4 h-4 mr-2" />
                      {isGeneratingImage ? 'Creating...' : 'WhatsApp'}
                    </Button>
                  </div>
                  
                  {/* Secondary Options */}
                  <div className="grid grid-cols-2 gap-3">
                    <Button
                      onClick={nativeShare}
                      disabled={isGeneratingImage}
                      variant="outline"
                      className="border-gray-200 text-gray-700 hover:bg-gray-50 py-3"
            >
                      <Share2 className="w-4 h-4 mr-2" />
                      More Apps
                    </Button>
                    
                    <Button
                      onClick={() => downloadImage()}
                      disabled={isGeneratingImage}
                      variant="outline"
                      className="border-gray-200 text-gray-700 hover:bg-gray-50 py-3"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Save Image
                    </Button>
                  </div>
                  
                  <Button
                    onClick={() => setShowSharing(false)}
                    variant="ghost"
                    className="w-full text-gray-500 hover:text-gray-700 py-2"
                  >
                    Back
            </Button>
          </div>
              )}
            </motion.div>
        </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
