// Onboarding data structure and content for testosterone/confidence focused men
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
    title: "Feeling like half the man you used to be?",
    subtitle: "Your body betrayed you, but there's a way back",
    description: "You see it in the mirror every morning. That gut, those tired eyes, the way clothes don't fit right. You're not lazy or weak - your hormones hijacked your life. But thousands of men just like you have reclaimed their power.",
    image: "💤",
    gradient: "from-red-600 to-orange-500"
  },
  {
    id: 2, 
    title: "Remember when you had DRIVE?",
    subtitle: "That unstoppable energy and confidence isn't gone forever",
    description: "You used to walk into rooms with presence. Now you feel invisible. That fire in your belly? Low testosterone snuffed it out. But here's the truth: every single day you wait, it gets harder to get back. Today you start reclaiming your edge.",
    image: "⚡",
    gradient: "from-orange-600 to-yellow-500"
  },
  {
    id: 3,
    title: "Tired of your gut making decisions?",
    subtitle: "That belly fat isn't just embarrassing - it's stealing your manhood",
    description: "Every pound of belly fat produces estrogen and crushes testosterone. It's a vicious cycle: low T creates fat, fat kills T. Breaking this cycle isn't about willpower - it's about strategy. And we've cracked the code.",
    image: "🔥",
    gradient: "from-blue-600 to-purple-500"
  },
  {
    id: 4,
    title: "Your wife/partner notices the difference",
    subtitle: "She remembers the man she fell for - and misses him",
    description: "She doesn't say it, but you feel it. The spark dimmed when your energy died. When confidence turned to self-doubt. When strength became softness. She wants her man back. And deep down, so do you.",
    image: "💔",
    gradient: "from-purple-600 to-pink-500"
  }
];

export const QUICK_QUIZ_QUESTIONS = [
  {
    id: 'ageRange',
    question: "What's your age?",
    subtitle: "Your testosterone decline started earlier than you think - but it's reversible",
    options: [
      { value: '18-24', label: '18-24', subtitle: 'Prime years - maximize now' },
      { value: '25-34', label: '25-34', subtitle: 'Decline starts here - fight back' },
      { value: '35-44', label: '35-44', subtitle: 'Critical intervention time' },
      { value: '45-54', label: '45-54', subtitle: 'Reclaim your prime' },
      { value: '55+', label: '55+', subtitle: 'Prove age is just a number' }
    ]
  },
  {
    id: 'sleepQuality',
    question: "How often do you toss and turn at night?",
    subtitle: "Poor sleep cuts testosterone by 15% every single night",
    options: [
      { value: '0-1', label: 'Sleep like a baby', subtitle: 'Rare - you\'re winning' },
      { value: '2-3', label: '2-3 bad nights per week', subtitle: 'T-levels taking a hit' },
      { value: '4-5', label: '4-5 restless nights', subtitle: 'Serious hormone damage' },
      { value: '6-7', label: 'Can barely sleep anymore', subtitle: 'Emergency intervention needed' }
    ]
  },
  {
    id: 'exerciseFrequency',
    question: "How often do you actually move your body?",
    subtitle: "Be honest - your testosterone is counting on this truth",
    options: [
      { value: '0', label: 'I avoid physical activity', subtitle: 'T-levels in freefall' },
      { value: '1-2', label: '1-2 times when forced', subtitle: 'Bare minimum survival' },
      { value: '3-4', label: '3-4 times consistently', subtitle: 'Building momentum' },
      { value: '5+', label: '5+ times - I\'m committed', subtitle: 'Serious about change' }
    ]
  },
  {
    id: 'primaryGoal',
    question: "What do you miss most about the old you?",
    subtitle: "This isn't about fitness - it's about reclaiming who you were meant to be",
    options: [
      { value: 'confidence', label: 'That unshakeable confidence', subtitle: 'Walk tall again' },
      { value: 'energy', label: 'Boundless energy & drive', subtitle: 'Feel alive again' },
      { value: 'strength', label: 'Physical strength & respect', subtitle: 'Command presence' },
      { value: 'attraction', label: 'Being desired by your partner', subtitle: 'Rekindle the spark' },
      { value: 'testosterone', label: 'Just feeling like a MAN again', subtitle: 'Total masculine revival' }
    ]
  }
];

// New conversion-focused commitment questions instead of misleading personalization
export const COMMITMENT_QUESTIONS = [
  {
    id: 'problemAwareness',
    question: "Which statement resonates most with you right now?",
    subtitle: "Be honest - this is about more than just physical health",
    options: [
      { 
        value: 'denial', 
        label: 'I don\'t really have a problem', 
        subtitle: 'Maybe you\'re not ready yet',
        scoreModifier: -2
      },
      { 
        value: 'aware', 
        label: 'I know something needs to change', 
        subtitle: 'Awareness is the first step',
        scoreModifier: 0
      },
      { 
        value: 'frustrated', 
        label: 'I\'m tired of feeling this way', 
        subtitle: 'Frustration fuels transformation',
        scoreModifier: 1
      },
      { 
        value: 'desperate', 
        label: 'I\'m ready to do whatever it takes', 
        subtitle: 'This level of commitment changes everything',
        scoreModifier: 2
      }
    ]
  },
  {
    id: 'actionCommitment',
    question: "What's held you back from fixing this before?",
    subtitle: "Understanding your barriers helps us break through them",
    options: [
      { 
        value: 'time', 
        label: 'I don\'t have time for complicated routines', 
        subtitle: 'We\'ll make it simple',
        scoreModifier: 0
      },
      { 
        value: 'money', 
        label: 'I\'ve wasted money on things that don\'t work', 
        subtitle: 'This investment pays for itself',
        scoreModifier: 1
      },
      { 
        value: 'willpower', 
        label: 'I always lose motivation and quit', 
        subtitle: 'Systems beat willpower every time',
        scoreModifier: 0
      },
      { 
        value: 'knowledge', 
        label: 'I don\'t know what actually works', 
        subtitle: 'We\'ll give you the roadmap',
        scoreModifier: 1
      }
    ]
  },
  {
    id: 'investmentReadiness',
    question: "How much would reclaiming your masculine power be worth to you?",
    subtitle: "Think about the cost of staying where you are for another year",
    options: [
      { 
        value: 'free', 
        label: 'I only want free solutions', 
        subtitle: 'Free gets you what you pay for',
        scoreModifier: -1
      },
      { 
        value: 'minimal', 
        label: 'Under $50 if it really works', 
        subtitle: 'Smart investment in yourself',
        scoreModifier: 1
      },
      { 
        value: 'serious', 
        label: '$50-100 for proven results', 
        subtitle: 'You understand real value',
        scoreModifier: 2
      },
      { 
        value: 'whatever', 
        label: 'Whatever it takes - I\'m done being weak', 
        subtitle: 'This mindset guarantees success',
        scoreModifier: 3
      }
    ]
  },
  {
    id: 'urgencyLevel',
    question: "How urgent is this transformation for you?",
    subtitle: "The longer you wait, the harder it gets to turn things around",
    options: [
      { 
        value: 'someday', 
        label: 'Someday when I have more time', 
        subtitle: 'Someday never comes',
        scoreModifier: -2
      },
      { 
        value: 'soon', 
        label: 'In the next few months', 
        subtitle: 'Soon becomes never',
        scoreModifier: -1
      },
      { 
        value: 'now', 
        label: 'I need to start right now', 
        subtitle: 'Now is the only time that matters',
        scoreModifier: 2
      },
      { 
        value: 'yesterday', 
        label: 'I should have started years ago', 
        subtitle: 'Today is the best day to begin',
        scoreModifier: 3
      }
    ]
  }
];

export const LIFESTYLE_SLIDERS = [
  {
    id: 'waistCircumference',
    title: 'Honest Waist Measurement',
    subtitle: 'Every inch over 34 cuts testosterone. Don\'t measure where your belt sits - measure where your gut actually is.',
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
    subtitle: 'Stress hormones are testosterone\'s biggest enemy. If you\'re always "on," your T is always "off."',
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
    subtitle: 'Car to chair to couch? Your body needs movement to produce testosterone. Be brutally honest.',
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
    description: 'Your natural energy patterns matter for testosterone optimization',
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
    description: 'Both build testosterone - choose what you\'ll stick to',
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
    result: "Lost 28 lbs, wife can't keep her hands off me",
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
    result: "Down 3 pant sizes, testosterone up 47%",
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
    result: "Lost 35 lbs, sleeping through the night, morning wood is back",
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

// Program recommendation logic
export function calculateRecommendedProgram(data: Partial<OnboardingData>): 'beginner' | 'intermediate' | 'advanced' {
  let score = 0;
  
  // Exercise frequency contributes most to program level
  if (data.exerciseFrequency === '0') score += 0;
  else if (data.exerciseFrequency === '1-2') score += 1;
  else if (data.exerciseFrequency === '3-4') score += 2;
  else if (data.exerciseFrequency === '5+') score += 3;
  
  // Age affects starting intensity
  if (data.ageRange === '18-24' || data.ageRange === '25-34') score += 1;
  else if (data.ageRange === '35-44') score += 0;
  else score -= 1;
  
  // Sleep quality affects readiness for intensity
  if (data.sleepQuality === '0-1') score += 1;
  else if (data.sleepQuality === '6-7') score -= 1;
  
  // Intensity preference
  if (data.intensityApproach === 'high') score += 1;
  else if (data.intensityApproach === 'gentle') score -= 1;
  
  // Determine program based on score
  if (score <= 0) return 'beginner';
  else if (score <= 2) return 'intermediate';
  else return 'advanced';
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
    insights.push('Poor sleep is destroying your testosterone. We\'ll fix this first.');
    wellnessScore -= 15;
  } else if (data.sleepQuality === '0-1') {
    insights.push('Your sleep is solid - great foundation for testosterone optimization.');
    wellnessScore += 10;
  }
  
  // Exercise analysis
  if (data.exerciseFrequency === '0') {
    keyAreas.push('Strength Building');
    insights.push('Strength training is the #1 natural testosterone booster. We\'ll start smart.');
    wellnessScore -= 20;
  } else if (data.exerciseFrequency === '5+') {
    insights.push('You\'re already active - we\'ll optimize your training for hormone health.');
    wellnessScore += 15;
  }
  
  // Stress analysis
  if (data.stressLevel && data.stressLevel >= 7) {
    keyAreas.push('Stress Management');
    insights.push('High stress is your testosterone\'s biggest enemy. We\'ll teach you to manage it.');
    wellnessScore -= 10;
  }
  
  // Waist analysis
  if (data.waistCircumference && data.waistCircumference >= 38) {
    keyAreas.push('Body Composition');
    insights.push('Belly fat produces estrogen and lowers T. We\'ll target this specifically.');
    wellnessScore -= 10;
  }
  
  // Goal-specific insights
  if (data.primaryGoal === 'confidence') {
    insights.push('Confidence comes from competence. We\'ll build both systematically.');
  } else if (data.primaryGoal === 'testosterone') {
    insights.push('Smart choice. Natural T optimization changes everything - energy, mood, body composition.');
  }
  
  const program = calculateRecommendedProgram(data);
  const recommendation = `Based on your profile, we recommend the ${program.charAt(0).toUpperCase() + program.slice(1)} Program to maximize your testosterone and confidence gains.`;
  
  return {
    wellnessScore: Math.max(20, Math.min(95, wellnessScore)),
    keyAreas,
    insights,
    recommendation
  };
}