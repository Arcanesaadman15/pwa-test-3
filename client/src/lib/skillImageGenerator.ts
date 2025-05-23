// Skill unlock image generator for social sharing
import { UnlockedSkill } from '@/data/skillDefinitions';

export interface SkillImageOptions {
  skill: UnlockedSkill;
  userName?: string;
  appName?: string;
}

export class SkillImageGenerator {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;

  constructor() {
    this.canvas = document.createElement('canvas');
    this.canvas.width = 1080; // Perfect for Instagram & TikTok
    this.canvas.height = 1080; // Square format works everywhere
    this.ctx = this.canvas.getContext('2d')!;
  }

  async generateSkillImage(options: SkillImageOptions): Promise<string> {
    const { skill, userName = "PeakForge User", appName = "PeakForge" } = options;
    
    // Clear canvas
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
    // Create gradient background
    const gradient = this.ctx.createLinearGradient(0, 0, this.canvas.width, this.canvas.height);
    gradient.addColorStop(0, '#1a1a2e');
    gradient.addColorStop(0.5, '#16213e');
    gradient.addColorStop(1, '#0f3460');
    
    this.ctx.fillStyle = gradient;
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    
    // Add subtle pattern overlay
    this.addPatternOverlay();
    
    // Draw main content area
    this.drawMainCard(skill);
    
    // Add skill category icon
    this.drawCategoryIcon(skill);
    
    // Add text content
    this.drawTextContent(skill, userName, appName);
    
    // Add app branding
    this.drawAppBranding(appName);
    
    // Add achievement badge
    this.drawAchievementBadge(skill);
    
    return this.canvas.toDataURL('image/png', 0.95);
  }

  private addPatternOverlay() {
    // Add subtle dot pattern for texture
    this.ctx.fillStyle = 'rgba(255, 255, 255, 0.03)';
    for (let x = 20; x < this.canvas.width; x += 40) {
      for (let y = 20; y < this.canvas.height; y += 40) {
        this.ctx.beginPath();
        this.ctx.arc(x, y, 1, 0, Math.PI * 2);
        this.ctx.fill();
      }
    }
  }

  private drawMainCard(skill: UnlockedSkill) {
    // Draw main card background (square optimized)
    const margin = 40;
    const cardX = margin;
    const cardY = margin;
    const cardWidth = this.canvas.width - (margin * 2);
    const cardHeight = this.canvas.height - (margin * 2);
    
    // Card shadow
    this.ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
    this.ctx.fillRect(cardX + 5, cardY + 5, cardWidth, cardHeight);
    
    // Card background with rounded corners
    this.ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
    this.drawRoundedRect(cardX, cardY, cardWidth, cardHeight, 30);
    
    // Card border
    this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
    this.ctx.lineWidth = 3;
    this.ctx.stroke();
    
    // Category color accent (top bar)
    const categoryColors: Record<string, string> = {
      'Physical': '#3b82f6',
      'Nutrition': '#10b981',
      'Sleep': '#8b5cf6',
      'Mental': '#f59e0b',
      'Recovery': '#ef4444'
    };
    
    const accentColor = categoryColors[skill.category] || '#3b82f6';
    this.ctx.fillStyle = accentColor;
    this.drawRoundedRect(cardX, cardY, cardWidth, 12, 6);
  }

  private drawCategoryIcon(skill: UnlockedSkill) {
    // Draw large category icon (optimized for square format)
    this.ctx.font = 'bold 160px Arial';
    this.ctx.textAlign = 'center';
    this.ctx.textBaseline = 'middle';
    
    const centerX = this.canvas.width / 2;
    const iconY = 320; // Positioned higher in square format
    
    // Icon shadow
    this.ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
    this.ctx.fillText(skill.categoryIcon, centerX + 4, iconY + 4);
    
    // Main icon
    this.ctx.fillStyle = '#ffffff';
    this.ctx.fillText(skill.categoryIcon, centerX, iconY);
  }

  private drawTextContent(skill: UnlockedSkill, userName: string, appName: string) {
    const centerX = this.canvas.width / 2;
    
    // "SKILL UNLOCKED!" text (positioned for square format)
    this.ctx.font = 'bold 40px Arial';
    this.ctx.textAlign = 'center';
    this.ctx.fillStyle = '#fbbf24';
    this.ctx.fillText('SKILL UNLOCKED!', centerX, 180);
    
    // Skill title (larger for impact)
    this.ctx.font = 'bold 56px Arial';
    this.ctx.fillStyle = '#ffffff';
    this.wrapText(skill.title, centerX, 500, 900, 65);
    
    // Skill description (positioned below icon)
    this.ctx.font = '28px Arial';
    this.ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
    this.wrapText(skill.description, centerX, 580, 900, 35);
    
    // Category and level
    this.ctx.font = 'bold 24px Arial';
    this.ctx.fillStyle = '#a855f7';
    this.ctx.fillText(`${skill.category} • Level ${skill.level}`, centerX, 700);
    
    // User achievement text
    this.ctx.font = '20px Arial';
    this.ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
    this.ctx.fillText(`${userName} achieved this milestone!`, centerX, 740);
  }

  private drawAppBranding(appName: string) {
    // App name at bottom (optimized for square)
    this.ctx.font = 'bold 28px Arial';
    this.ctx.textAlign = 'center';
    this.ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
    this.ctx.fillText(`Join ${appName} - Your Wellness Journey`, this.canvas.width / 2, this.canvas.height - 80);
    
    // App logo/icon (positioned for square format)
    this.ctx.font = '36px Arial';
    this.ctx.fillStyle = '#3b82f6';
    this.ctx.fillText('🏔️', this.canvas.width / 2 - 150, this.canvas.height - 75);
  }

  private drawAchievementBadge(skill: UnlockedSkill) {
    // Achievement badge in top right (optimized for square)
    const badgeX = this.canvas.width - 120;
    const badgeY = 120;
    const badgeRadius = 45;
    
    // Badge background
    this.ctx.fillStyle = '#fbbf24';
    this.ctx.beginPath();
    this.ctx.arc(badgeX, badgeY, badgeRadius, 0, Math.PI * 2);
    this.ctx.fill();
    
    // Badge border
    this.ctx.strokeStyle = '#ffffff';
    this.ctx.lineWidth = 4;
    this.ctx.stroke();
    
    // Badge icon
    this.ctx.font = 'bold 28px Arial';
    this.ctx.textAlign = 'center';
    this.ctx.fillStyle = '#1a1a2e';
    this.ctx.fillText('★', badgeX, badgeY + 10);
    
    // Level text
    this.ctx.font = 'bold 14px Arial';
    this.ctx.fillText(`LV.${skill.level}`, badgeX, badgeY + 30);
  }

  private drawRoundedRect(x: number, y: number, width: number, height: number, radius: number) {
    this.ctx.beginPath();
    this.ctx.moveTo(x + radius, y);
    this.ctx.lineTo(x + width - radius, y);
    this.ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    this.ctx.lineTo(x + width, y + height - radius);
    this.ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    this.ctx.lineTo(x + radius, y + height);
    this.ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    this.ctx.lineTo(x, y + radius);
    this.ctx.quadraticCurveTo(x, y, x + radius, y);
    this.ctx.closePath();
    this.ctx.fill();
  }

  private wrapText(text: string, x: number, y: number, maxWidth: number, lineHeight: number) {
    const words = text.split(' ');
    let line = '';
    let currentY = y;

    for (let n = 0; n < words.length; n++) {
      const testLine = line + words[n] + ' ';
      const metrics = this.ctx.measureText(testLine);
      const testWidth = metrics.width;
      
      if (testWidth > maxWidth && n > 0) {
        this.ctx.fillText(line, x, currentY);
        line = words[n] + ' ';
        currentY += lineHeight;
      } else {
        line = testLine;
      }
    }
    this.ctx.fillText(line, x, currentY);
  }
}

// Helper function to generate and download skill image
export async function generateAndShareSkillImage(skill: UnlockedSkill, userName?: string): Promise<void> {
  const generator = new SkillImageGenerator();
  const imageDataUrl = await generator.generateSkillImage({
    skill,
    userName,
    appName: "PeakForge"
  });

  // Convert to blob for sharing
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d')!;
  const img = new Image();
  
  return new Promise((resolve) => {
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
      
      canvas.toBlob((blob) => {
        if (blob && navigator.share) {
          navigator.share({
            title: `🎉 I unlocked ${skill.title}!`,
            text: `Just achieved "${skill.title}" in PeakForge! ${skill.description}`,
            files: [new File([blob], 'skill-unlock.png', { type: 'image/png' })]
          }).then(resolve).catch(resolve);
        } else {
          // Fallback: download the image
          const link = document.createElement('a');
          link.download = `peakforge-skill-${skill.id}.png`;
          link.href = imageDataUrl;
          link.click();
          resolve();
        }
      }, 'image/png', 0.95);
    };
    
    img.src = imageDataUrl;
  });
}