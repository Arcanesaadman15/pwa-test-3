import { useState } from 'react';
import { Share2, Download, Trophy, Flame, Target, Instagram, MessageCircle, Twitter, Facebook, Link, Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Icon, getAchievementIcon } from '@/lib/iconUtils';

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  unlockedAt: Date;
  type: 'streak' | 'completion' | 'milestone' | 'skill';
}

interface AchievementShareProps {
  achievement: Achievement;
  userStats: {
    name: string;
    level: number;
    currentStreak: number;
    totalTasks: number;
  };
  onClose: () => void;
}

export function AchievementShare({ achievement, userStats, onClose }: AchievementShareProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [showShareOptions, setShowShareOptions] = useState(false);

  const generateShareImage = async (): Promise<string> => {
    return new Promise((resolve, reject) => {
      try {
        // Create a canvas element for the share image
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d')!;
        
        // Set canvas size for Instagram-friendly square format
        canvas.width = 1080;
        canvas.height = 1080;
        
        // Background gradient
        const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
        gradient.addColorStop(0, '#1f2937');
        gradient.addColorStop(1, '#111827');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Draw achievement content
        ctx.textAlign = 'center';
        ctx.fillStyle = '#ffffff';
        
        // Title
        ctx.font = 'bold 64px system-ui';
        ctx.fillText('🏆 Achievement Unlocked!', canvas.width / 2, 200);
        
        // Achievement name
        ctx.font = 'bold 48px system-ui';
        ctx.fillStyle = achievement.color;
        ctx.fillText(achievement.title, canvas.width / 2, 320);
        
        // Achievement icon (large emoji)
        ctx.font = '160px system-ui';
        ctx.fillText(achievement.icon, canvas.width / 2, 500);
        
        // Description
        ctx.font = '32px system-ui';
        ctx.fillStyle = '#d1d5db';
        ctx.fillText(achievement.description, canvas.width / 2, 600);
        
        // User stats
        ctx.font = 'bold 28px system-ui';
        ctx.fillStyle = '#ffffff';
        ctx.fillText(`${userStats.name} • Level ${userStats.level}`, canvas.width / 2, 720);
        
        // Additional stats
        ctx.font = '24px system-ui';
        ctx.fillStyle = '#9ca3af';
        ctx.fillText(`${userStats.currentStreak} day streak • ${userStats.totalTasks} tasks completed`, canvas.width / 2, 780);
        
        // PeakForge branding
        ctx.font = 'bold 36px system-ui';
        ctx.fillStyle = '#3b82f6';
        ctx.fillText('PeakForge • Wellness Journey', canvas.width / 2, 920);
        
        // Convert to data URL
        const dataUrl = canvas.toDataURL('image/png');
        resolve(dataUrl);
        
      } catch (error) {
        reject(error);
      }
    });
  };

  const downloadImage = async () => {
    setIsGenerating(true);
    
    try {
      const dataUrl = await generateShareImage();
      
      // Create download link
      const a = document.createElement('a');
      a.href = dataUrl;
      a.download = `peakforge-achievement-${achievement.title.replace(/\s+/g, '-').toLowerCase()}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      
    } catch (error) {
      console.error('Failed to generate share image:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const shareToInstagram = async () => {
    try {
      const dataUrl = await generateShareImage();
      
      // Convert data URL to blob
      const response = await fetch(dataUrl);
      const blob = await response.blob();
      
      if (navigator.canShare && navigator.canShare({ files: [new File([blob], 'achievement.png', { type: 'image/png' })] })) {
        // Use Web Share API with file
        const file = new File([blob], 'achievement.png', { type: 'image/png' });
        await navigator.share({
          title: `I just unlocked "${achievement.title}" in PeakForge!`,
          text: `${achievement.description} 🏆`,
          files: [file]
        });
      } else {
        // Fallback: Open Instagram app (mobile) or website
        const text = encodeURIComponent(`I just unlocked "${achievement.title}" in PeakForge! ${achievement.description} 🏆`);
        const instagramUrl = `instagram://camera`;
        const webUrl = `https://www.instagram.com/`;
        
        // Try to open Instagram app first (mobile)
        window.location.href = instagramUrl;
        
        // Fallback to web after a delay
        setTimeout(() => {
          window.open(webUrl, '_blank');
        }, 1000);
      }
    } catch (error) {
      console.error('Failed to share to Instagram:', error);
      // Fallback to download
      downloadImage();
    }
  };

  const shareToWhatsApp = () => {
    const text = encodeURIComponent(`🏆 I just unlocked "${achievement.title}" in PeakForge!\n\n${achievement.description}\n\nLevel ${userStats.level} • ${userStats.currentStreak} day streak\n\nJoin me on this wellness journey! 💪`);
    const whatsappUrl = `https://wa.me/?text=${text}`;
    window.open(whatsappUrl, '_blank');
  };

  const shareToTwitter = () => {
    const text = encodeURIComponent(`🏆 Just unlocked "${achievement.title}" in @PeakForge!\n\n${achievement.description}\n\nLevel ${userStats.level} • ${userStats.currentStreak} day streak 💪\n\n#PeakForge #WellnessJourney #Achievement`);
    const twitterUrl = `https://twitter.com/intent/tweet?text=${text}`;
    window.open(twitterUrl, '_blank');
  };

  const shareToFacebook = () => {
    const text = encodeURIComponent(`I just unlocked "${achievement.title}" in PeakForge! ${achievement.description}`);
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${window.location.origin}&quote=${text}`;
    window.open(facebookUrl, '_blank');
  };

  const copyToClipboard = async () => {
    const shareText = `🏆 I just unlocked "${achievement.title}" in PeakForge!\n\n${achievement.description}\n\nLevel ${userStats.level} • ${userStats.currentStreak} day streak\n\nJoin me on this wellness journey! 💪\n\n${window.location.origin}`;
    
    try {
      await navigator.clipboard.writeText(shareText);
      alert('✅ Share text copied to clipboard!');
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
    }
  };

  const nativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `I just unlocked "${achievement.title}" in PeakForge!`,
          text: `${achievement.description} 🏆\n\nLevel ${userStats.level} • ${userStats.currentStreak} day streak`,
          url: window.location.origin
        });
      } catch (error) {
        console.error('Failed to share:', error);
      }
    } else {
      // Show share options if native share isn't available
      setShowShareOptions(!showShareOptions);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl p-6 max-w-md w-full border border-gray-200 shadow-2xl">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="text-6xl mb-4">{achievement.icon}</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">{achievement.title}</h2>
          <p className="text-gray-600">{achievement.description}</p>
        </div>

        {/* Achievement Details */}
        <div className="bg-gray-50 rounded-xl p-4 mb-6">
                      <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <Icon 
                  name={getAchievementIcon(achievement.type)} 
                  size={24} 
                  className="text-blue-500" 
                />
                <span className="text-gray-900 font-medium">Achievement Details</span>
              </div>
            <Badge variant="outline" className="text-gray-600 border-gray-300">
              {achievement.type}
            </Badge>
          </div>
          
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <div className="text-gray-500">Unlocked</div>
              <div className="text-gray-900 font-medium">{achievement.unlockedAt.toLocaleDateString()}</div>
            </div>
            <div>
              <div className="text-gray-500">Your Level</div>
              <div className="text-gray-900 font-medium">{userStats.level}</div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          {/* Primary Share Button */}
          <Button
            onClick={nativeShare}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-3"
          >
            <Share2 className="w-4 h-4 mr-2" />
            Share Achievement
          </Button>
          
          {/* Social Media Quick Actions */}
          <div className="grid grid-cols-2 gap-2">
            <Button
              onClick={shareToWhatsApp}
              variant="outline"
              className="border-green-200 text-green-700 hover:bg-green-50"
            >
              <MessageCircle className="w-4 h-4 mr-2" />
              WhatsApp
            </Button>
            
            <Button
              onClick={shareToInstagram}
              variant="outline"
              className="border-pink-200 text-pink-700 hover:bg-pink-50"
            >
              <Instagram className="w-4 h-4 mr-2" />
              Instagram
            </Button>
          </div>
          
          {/* Show More Options */}
          {(showShareOptions || !navigator.share) && (
            <div className="grid grid-cols-2 gap-2">
              <Button
                onClick={shareToTwitter}
                variant="outline"
                className="border-blue-200 text-blue-700 hover:bg-blue-50"
              >
                <Twitter className="w-4 h-4 mr-2" />
                Twitter
              </Button>
              
              <Button
                onClick={shareToFacebook}
                variant="outline"
                className="border-blue-200 text-blue-700 hover:bg-blue-50"
              >
                <Facebook className="w-4 h-4 mr-2" />
                Facebook
              </Button>
              
              <Button
                onClick={copyToClipboard}
                variant="outline"
                className="border-gray-200 text-gray-700 hover:bg-gray-50"
              >
                <Copy className="w-4 h-4 mr-2" />
                Copy Text
              </Button>
              
              <Button
                onClick={downloadImage}
                disabled={isGenerating}
                variant="outline"
                className="border-gray-200 text-gray-700 hover:bg-gray-50"
              >
                <Download className="w-4 h-4 mr-2" />
                {isGenerating ? 'Creating...' : 'Download'}
              </Button>
            </div>
          )}
          
          <Button
            onClick={onClose}
            variant="ghost"
            className="w-full text-gray-500 hover:text-gray-700"
          >
            Close
          </Button>
        </div>
      </div>
    </div>
  );
} 