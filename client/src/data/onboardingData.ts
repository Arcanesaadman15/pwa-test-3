// Onboarding data structure and content for energy/confidence focused men
export interface OnboardingData {
  // Quick Quiz responses
  ageRange: string;
  sleepQuality: string;
  exerciseFrequency: string;
  primaryGoal: string;
  
  // Lifestyle Sliders
  waistCircumference: number;
  stressLevel: number;
  dailySteps: number;
  
  // Personalization Toggles
  circadianRhythm: 'morning' | 'evening';
  activityLocation: 'indoor' | 'outdoor';
  socialPreference: 'solo' | 'group';
  intensityApproach: 'high' | 'gentle';
  
  // Recommended program
  recommendedProgram: 'beginner' | 'intermediate' | 'advanced';
  
  // Completion status
  completedAt?: Date;
}

export const PROBLEM_SPOTLIGHT_SLIDES = [
  {
    id: 1,
    title: "Ready to Feel Like Your Best Self Again?",
    subtitle: "Natural Habits Can Support Your Energy and Vitality",
    description: "That fatigue and fading drive don't have to be your new normal. Thousands of men have found their edge through natural lifestyle changes. Your journey to feeling better starts now.",
    image: "💤",
    gradient: "from-red-600 to-orange-500"
  },
  {
    id: 2, 
    title: "Remember when you had DRIVE?",
    subtitle: "That unstoppable energy and confidence can return",
    description: "You used to walk into rooms with presence. Now you feel invisible. That fire in your belly can be rekindled through consistent, natural habits. Here's the truth: every single day you wait, it gets harder to get back. Today you start reclaiming your edge.",
    image: "⚡",
    gradient: "from-orange-600 to-yellow-500"
  },
  {
    id: 3,
    title: "Tired of carrying extra weight?",
    subtitle: "That belly fat isn't just about appearance - it affects how you feel",
    description: "Excess weight can impact your energy and confidence. It's often a cycle: low energy leads to poor habits, poor habits lead to weight gain. Breaking this cycle isn't about willpower - it's about strategy. And we've cracked the code.",
    image: "🔥",
    gradient: "from-blue-600 to-purple-500"
  },
  {
    id: 4,
    title: "Your relationships matter to you",
    subtitle: "She remembers the confident man she fell for",
    description: "You can feel when something's missing. The spark dims when your energy fades. When confidence turns to self-doubt. When strength becomes softness. You want to be your best self again. And deep down, you know you can be.",
    image: "💔",
    gradient: "from-purple-600 to-pink-500"
  }
];

export const QUICK_QUIZ_QUESTIONS = [
  {
    id: 'ageRange',
    question: "How Old Are You Really Feeling?",
    subtitle: "Energy and vitality naturally change over time. Let's pinpoint your starting point for improvement.",
    options: [
      { value: '18-24', label: '18-24', subtitle: 'Peak years - lock in your advantage before the decline' },
      { value: '25-34', label: '25-34', subtitle: 'Decline just started - perfect timing to fight back' },
      { value: '35-44', label: '35-44', subtitle: 'Your body is betraying you - time to take control' },
      { value: '45-54', label: '45-54', subtitle: 'Critical years - reclaim what you\'ve lost' },
      { value: '55+', label: '55+', subtitle: 'Prove that age is just a number' }
    ]
  },
  {
    id: 'sleepQuality',
    question: "How's your sleep honestly?",
    subtitle: "Poor sleep significantly impacts energy and recovery. Quality sleep is essential for feeling your best.",
    options: [
      { value: '0-1', label: 'I sleep like a rock', subtitle: 'You\'re ahead of 90% of men' },
      { value: '2-3', label: 'Few bad nights per week', subtitle: 'Your energy levels are suffering' },
      { value: '4-5', label: 'Tossing and turning most nights', subtitle: 'Serious energy impact happening' },
      { value: '6-7', label: 'Sleep is a nightmare', subtitle: 'Emergency intervention needed' }
    ]
  },
  {
    id: 'exerciseFrequency',
    question: "How often do you actually exercise?",
    subtitle: "Be brutally honest. Your body knows when you're lying to yourself.",
    options: [
      { value: '0', label: 'Exercise? What exercise?', subtitle: 'Your energy could use a boost' },
      { value: '1-2', label: '1-2 times when I have to', subtitle: 'Barely surviving, not thriving' },
      { value: '3-4', label: '3-4 times consistently', subtitle: 'Building good momentum' },
      { value: '5+', label: '5+ times - I\'m serious', subtitle: 'You understand what it takes' }
    ]
  },
  {
    id: 'primaryGoal',
    question: "What do you want back most?",
    subtitle: "Think about who you were at your best. What would change your life the most?",
    options: [
      { value: 'confidence', label: 'Unshakeable confidence', subtitle: 'Command respect in any room' },
      { value: 'energy', label: 'All-day energy & drive', subtitle: 'Feel unstoppable again' },
      { value: 'strength', label: 'Physical strength & presence', subtitle: 'Be the strong man others look up to' },
      { value: 'attraction', label: 'Sexual attraction & magnetism', subtitle: 'Rekindle that spark and desire' },
      { value: 'vitality', label: 'Just feeling energized again', subtitle: 'Complete energy transformation' }
    ]
  }
];

// New conversion-focused commitment questions instead of misleading personalization
export const COMMITMENT_QUESTIONS = [
  {
    id: 'problemAwareness',
    question: "How would you describe where you're at right now?",
    subtitle: "Your honesty here determines everything that comes next",
    options: [
      { 
        value: 'denial', 
        label: 'I don\'t really see a problem', 
        subtitle: 'Maybe this isn\'t for you yet',
        scoreModifier: -2
      },
      { 
        value: 'aware', 
        label: 'I know things need to change', 
        subtitle: 'Awareness is the first step to power',
        scoreModifier: 0
      },
      { 
        value: 'frustrated', 
        label: 'I\'m fed up with feeling this way', 
        subtitle: 'Frustration becomes fuel for transformation',
        scoreModifier: 1
      },
      { 
        value: 'desperate', 
        label: 'I\'ll do whatever it takes to change', 
        subtitle: 'This commitment level guarantees success',
        scoreModifier: 2
      }
    ]
  },
  {
    id: 'actionCommitment',
    question: "What's stopped you from fixing this before now?",
    subtitle: "Understanding your barriers is key to breaking through them",
    options: [
      { 
        value: 'time', 
        label: 'I don\'t have time for complex routines', 
        subtitle: 'We\'ll make it simple and sustainable',
        scoreModifier: 0
      },
      { 
        value: 'money', 
        label: 'I\'ve wasted money on things that don\'t work', 
        subtitle: 'This investment will pay for itself',
        scoreModifier: 1
      },
      { 
        value: 'willpower', 
        label: 'I start strong but always quit', 
        subtitle: 'Systems beat willpower every time',
        scoreModifier: 0
      },
      { 
        value: 'knowledge', 
        label: 'I don\'t know what actually works', 
        subtitle: 'We\'ll give you the exact roadmap',
        scoreModifier: 1
      }
    ]
  },
  {
    id: 'investmentReadiness',
    question: "How much is feeling like a real man worth to you?",
    subtitle: "Think about the cost of staying weak for another year",
    options: [
      { 
        value: 'free', 
        label: 'I only try free stuff', 
        subtitle: 'Free gets you exactly what you pay for',
        scoreModifier: -1
      },
      { 
        value: 'minimal', 
        label: 'Maybe $50 if it actually works', 
        subtitle: 'Smart investment in your future self',
        scoreModifier: 1
      },
      { 
        value: 'serious', 
        label: '$50-100 for real results', 
        subtitle: 'You understand true value',
        scoreModifier: 2
      },
      { 
        value: 'whatever', 
        label: 'Whatever it takes - I\'m done being weak', 
        subtitle: 'This mindset changes everything',
        scoreModifier: 3
      }
    ]
  },
  {
    id: 'urgencyLevel',
    question: "When do you want to start feeling powerful again?",
    subtitle: "Every day you wait, it gets harder to turn things around",
    options: [
      { 
        value: 'someday', 
        label: 'Someday when life slows down', 
        subtitle: 'Someday never comes for most men',
        scoreModifier: -2
      },
      { 
        value: 'soon', 
        label: 'In a few months maybe', 
        subtitle: 'Soon becomes never for 90% of men',
        scoreModifier: -1
      },
      { 
        value: 'now', 
        label: 'I need to start right now', 
        subtitle: 'Now is the only moment you control',
        scoreModifier: 2
      },
      { 
        value: 'yesterday', 
        label: 'I should have started years ago', 
        subtitle: 'Today is the best day to begin again',
        scoreModifier: 3
      }
    ]
  }
];

export const LIFESTYLE_SLIDERS = [
  {
    id: 'waistCircumference',
    title: 'Honest Waist Measurement',
    subtitle: 'Waist circumference affects energy and confidence. Measure where your waist is widest for accuracy.',
    min: 28,
    max: 50,
    default: 38,
    unit: 'inches',
    icon: '📏',
    gradient: 'from-green-500 to-red-500'
  },
  {
    id: 'stressLevel',
    title: 'How Overwhelmed Do You Feel?',
    subtitle: 'Stress hormones drain your energy and vitality. If you\'re always "on," your energy suffers.',
    min: 1,
    max: 10,
    default: 7,
    unit: '/10',
    icon: '😤',
    gradient: 'from-yellow-500 to-red-500'
  },
  {
    id: 'dailySteps',
    title: 'Daily Movement Reality Check',
    subtitle: 'Car to chair to couch? Your body needs movement to maintain energy. Be brutally honest.',
    min: 1000,
    max: 15000,
    default: 3500,
    unit: 'steps',
    icon: '🚶',
    gradient: 'from-red-500 to-green-500'
  }
];

export const PERSONALIZATION_TOGGLES = [
  {
    id: 'circadianRhythm',
    title: 'When do you feel strongest?',
    description: 'Your natural energy patterns matter for vitality optimization',
    leftValue: 'morning',
    leftLabel: 'Morning',
    leftIcon: '🌅',
    rightValue: 'evening',
    rightLabel: 'Evening',
    rightIcon: '🌙'
  },
  {
    id: 'activityLocation',
    title: 'Where do you prefer to train?',
    description: 'Both work - we\'ll optimize for your preference',
    leftValue: 'indoor',
    leftLabel: 'Indoor',
    leftIcon: '🏠',
    rightValue: 'outdoor',
    rightLabel: 'Outdoor',
    rightIcon: '🌳'
  },
  {
    id: 'socialPreference',
    title: 'How do you stay motivated?',
    description: 'Your success style determines the best approach',
    leftValue: 'solo',
    leftLabel: 'Solo',
    leftIcon: '🎯',
    rightValue: 'group',
    rightLabel: 'Group',
    rightIcon: '👥'
  },
  {
    id: 'intensityApproach',
    title: 'Your ideal training style?',
    description: 'Both build energy and strength - choose what you\'ll stick to',
    leftValue: 'high',
    leftLabel: 'High Intensity',
    leftIcon: '⚡',
    rightValue: 'gentle',
    rightLabel: 'Steady Progress',
    rightIcon: '🌊'
  }
];

export const SOCIAL_PROOF_TESTIMONIALS = [
  {
    id: 1,
    name: "Marcus T.",
    age: 32,
    location: "Detroit, MI",
    result: "Lost 28 lbs, confidence transformed",
    quote: "I was 40 pounds overweight, exhausted by 2pm daily, and my wife barely looked at me. 8 weeks later? I feel like a completely different man. My confidence is through the roof, and our marriage is better than our honeymoon.",
    beforeAfter: "🔄",
    timeframe: "8 weeks",
    avatar: "👨‍🔧",
    startingPoint: "Overweight truck driver, size 42 pants, constant fatigue"
  },
  {
    id: 2,
    name: "Jake R.",
    age: 38,
    location: "Phoenix, AZ", 
    result: "Down 3 pant sizes, energy way up",
    quote: "I thought being tired and soft was just 'getting older.' Bullshit. This program showed me I was living at 30% capacity. Now I'm stronger than I was at 25. My kids actually brag about their dad being strong.",
    beforeAfter: "💪",
    timeframe: "12 weeks",
    avatar: "👨‍💼",
    startingPoint: "Desk job, 245 lbs, couldn't play with kids without getting winded"
  },
  {
    id: 3,
    name: "David K.",
    age: 44,
    location: "Columbus, OH",
    result: "Lost 35 lbs, sleeping through the night, energy restored",
    quote: "I was embarrassed to take my shirt off in front of my own wife. Now she can't stop touching my shoulders. But the real win? I respect myself again. I look in the mirror and see a man worth being proud of.",
    beforeAfter: "⚡",
    timeframe: "16 weeks", 
    avatar: "👨‍💻",
    startingPoint: "Software dev, 50-inch waist, hadn't seen morning erections in years"
  },
  {
    id: 4,
    name: "Carlos M.",
    age: 29,
    location: "San Antonio, TX",
    result: "Gained 15 lbs of muscle, confidence unstoppable",
    quote: "I was the 'funny fat guy' at work. Always cracking jokes to deflect from how I felt about myself. Now people ask ME for advice. My whole life changed when I decided to stop being a victim of my own body.",
    beforeAfter: "🦾",
    timeframe: "10 weeks",
    avatar: "👨‍🍳",
    startingPoint: "Restaurant manager, 38% body fat, avoided mirrors"
  }
];

export const SUCCESS_STATS = {
  totalUsers: "15,000+",
  avgWeightLoss: "12 lbs",
  avgEnergyIncrease: "73%",
  completionRate: "89%",
  satisfactionScore: "4.8/5"
};

// Enhanced program recommendation logic - considers more factors and is less conservative
export function calculateRecommendedProgram(data: Partial<OnboardingData>): 'beginner' | 'intermediate' | 'advanced' {
  let score = 0;
  
  // Exercise frequency contributes most to program level
  if (data.exerciseFrequency === '0') score += 0;
  else if (data.exerciseFrequency === '1-2') score += 2; // Increased from 1
  else if (data.exerciseFrequency === '3-4') score += 3; // Increased from 2
  else if (data.exerciseFrequency === '5+') score += 4; // Increased from 3
  
  // Age affects starting intensity (less punitive for older users)
  if (data.ageRange === '18-24' || data.ageRange === '25-34') score += 1;
  else if (data.ageRange === '35-44') score += 0;
  else if (data.ageRange === '45-54') score += 0; // Changed from -1
  else score += 0; // Changed from -1 (55+ can still be intermediate/advanced)
  
  // Sleep quality affects readiness for intensity
  if (data.sleepQuality === '0-1') score += 1;
  else if (data.sleepQuality === '2-3') score += 0; // Added middle option
  else if (data.sleepQuality === '6-7') score -= 1;
  
  // Intensity preference (more weight given)
  if (data.intensityApproach === 'high') score += 2; // Increased from 1
  else if (data.intensityApproach === 'gentle') score += 0; // Changed from -1 (less punitive)
  
  // Consider primary goals for motivation level
  if (data.primaryGoal === 'strength') score += 1;
  else if (data.primaryGoal === 'vitality' || data.primaryGoal === 'energy') score += 1;
  
  // Consider lifestyle factors
  if (data.dailySteps && data.dailySteps >= 8000) score += 1;
  if (data.stressLevel && data.stressLevel <= 4) score += 1; // Low stress = can handle more
  if (data.waistCircumference && data.waistCircumference <= 34) score += 1; // Good shape = can handle more
  
  // More balanced thresholds
  if (score <= 1) return 'beginner';      // Very low activity/readiness
  else if (score <= 4) return 'intermediate'; // Most users with some activity
  else return 'advanced';                 // High activity + good indicators
}

// Generate personalized insights for Instant Diagnosis
export function generatePersonalizedInsights(data: Partial<OnboardingData>): {
  wellnessScore: number;
  keyAreas: string[];
  insights: string[];
  recommendation: string;
} {
  const insights: string[] = [];
  const keyAreas: string[] = [];
  let wellnessScore = 50; // Base score
  
  // Sleep analysis
  if (data.sleepQuality === '6-7') {
    keyAreas.push('Sleep Optimization');
    insights.push('Poor sleep is draining your energy. We\'ll fix this first.');
    wellnessScore -= 15;
  } else if (data.sleepQuality === '0-1') {
    insights.push('Your sleep is solid - great foundation for energy optimization.');
    wellnessScore += 10;
  }
  
  // Exercise analysis
  if (data.exerciseFrequency === '0') {
    keyAreas.push('Strength Building');
    insights.push('Strength training is an excellent natural energy booster. We\'ll start smart.');
    wellnessScore -= 20;
  } else if (data.exerciseFrequency === '5+') {
    insights.push('You\'re already active - we\'ll optimize your training for energy and vitality.');
    wellnessScore += 15;
  }
  
  // Stress analysis
  if (data.stressLevel && data.stressLevel >= 7) {
    keyAreas.push('Stress Management');
    insights.push('High stress is your energy\'s biggest enemy. We\'ll teach you to manage it.');
    wellnessScore -= 10;
  }
  
  // Waist analysis
  if (data.waistCircumference && data.waistCircumference >= 38) {
    keyAreas.push('Body Composition');
    insights.push('Excess belly fat impacts energy and confidence. We\'ll target this specifically.');
    wellnessScore -= 10;
  }
  
  // Goal-specific insights
  if (data.primaryGoal === 'confidence') {
    insights.push('Confidence comes from competence. We\'ll build both systematically.');
  } else if (data.primaryGoal === 'vitality') {
    insights.push('Smart choice. Natural vitality optimization changes everything - energy, mood, body composition.');
  } else if (data.primaryGoal === 'energy') {
    insights.push('All-day energy starts with the right habits. We\'ll build your energy foundation.');
  } else if (data.primaryGoal === 'strength') {
    insights.push('Physical strength builds mental strength. We\'ll develop both through proven methods.');
  } else if (data.primaryGoal === 'attraction') {
    insights.push('Attraction starts with self-respect and confidence. We\'ll help you become magnetic.');
  }
  
  const program = calculateRecommendedProgram(data);
  const recommendation = `Based on your profile, we recommend the ${program.charAt(0).toUpperCase() + program.slice(1)} Program to maximize your energy and confidence gains.`;
  
  return {
    wellnessScore: Math.max(20, Math.min(95, wellnessScore)),
    keyAreas,
    insights,
    recommendation
  };
}