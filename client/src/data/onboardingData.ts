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
    title: "Feeling drained by 3pm?",
    subtitle: "Low energy is killing your confidence and performance",
    description: "When your testosterone is low, energy crashes become your daily reality. You're not lazy - your hormones are working against you.",
    image: "💤",
    gradient: "from-red-600 to-orange-500"
  },
  {
    id: 2, 
    title: "Lost your edge?",
    subtitle: "That drive and motivation you used to have seems gone",
    description: "Low T doesn't just affect your body - it crushes your mental strength, confidence, and ambition. You know you're capable of more.",
    image: "⚡",
    gradient: "from-orange-600 to-yellow-500"
  },
  {
    id: 3,
    title: "Clothes getting tighter?",
    subtitle: "Stubborn belly fat that won't budge no matter what you try",
    description: "Low testosterone makes your body store fat and lose muscle. Diet and exercise feel pointless when your hormones are sabotaging you.",
    image: "💪",
    gradient: "from-blue-600 to-purple-500"
  }
];

export const QUICK_QUIZ_QUESTIONS = [
  {
    id: 'ageRange',
    question: "What's your age?",
    subtitle: "We'll customize your approach based on where you are in life",
    options: [
      { value: '18-24', label: '18-24', subtitle: 'Peak potential years' },
      { value: '25-34', label: '25-34', subtitle: 'Career building phase' },
      { value: '35-44', label: '35-44', subtitle: 'Prime achievement years' },
      { value: '45-54', label: '45-54', subtitle: 'Experienced leader' },
      { value: '55+', label: '55+', subtitle: 'Wisdom and mastery' }
    ]
  },
  {
    id: 'sleepQuality',
    question: "How often do you struggle with poor sleep?",
    subtitle: "Quality sleep is crucial for testosterone production",
    options: [
      { value: '0-1', label: '0-1 nights per week', subtitle: 'Sleep champion' },
      { value: '2-3', label: '2-3 nights per week', subtitle: 'Occasional issues' },
      { value: '4-5', label: '4-5 nights per week', subtitle: 'Regular problems' },
      { value: '6-7', label: '6-7 nights per week', subtitle: 'Constant struggle' }
    ]
  },
  {
    id: 'exerciseFrequency',
    question: "How often do you exercise per week?",
    subtitle: "Strength training is key for natural testosterone boost",
    options: [
      { value: '0', label: 'Never', subtitle: 'Fresh start needed' },
      { value: '1-2', label: '1-2 days', subtitle: 'Getting started' },
      { value: '3-4', label: '3-4 days', subtitle: 'Good foundation' },
      { value: '5+', label: '5+ days', subtitle: 'Serious athlete' }
    ]
  },
  {
    id: 'primaryGoal',
    question: "What's your main goal?",
    subtitle: "We'll focus your program on what matters most to you",
    options: [
      { value: 'confidence', label: 'Build unshakeable confidence', subtitle: 'Mental strength focus' },
      { value: 'energy', label: 'Boost energy & drive', subtitle: 'Vitality optimization' },
      { value: 'strength', label: 'Get stronger & leaner', subtitle: 'Physical transformation' },
      { value: 'performance', label: 'Peak performance', subtitle: 'All-around excellence' },
      { value: 'testosterone', label: 'Optimize testosterone naturally', subtitle: 'Hormone optimization' }
    ]
  }
];

export const LIFESTYLE_SLIDERS = [
  {
    id: 'waistCircumference',
    title: 'Waist Measurement',
    subtitle: 'Belly fat is a key indicator of low testosterone',
    min: 28,
    max: 50,
    default: 34,
    unit: 'inches',
    icon: '📏',
    gradient: 'from-green-500 to-blue-500'
  },
  {
    id: 'stressLevel',
    title: 'Daily Stress Level',
    subtitle: 'Chronic stress crushes testosterone production',
    min: 1,
    max: 10,
    default: 5,
    unit: '/10',
    icon: '😤',
    gradient: 'from-yellow-500 to-red-500'
  },
  {
    id: 'dailySteps',
    title: 'Average Daily Steps',
    subtitle: 'Movement is medicine for hormone health',
    min: 1000,
    max: 15000,
    default: 5000,
    unit: 'steps',
    icon: '👟',
    gradient: 'from-purple-500 to-pink-500'
  }
];

export const PERSONALIZATION_TOGGLES = [
  {
    id: 'circadianRhythm',
    title: 'Energy Peak',
    leftLabel: 'Morning Person',
    rightLabel: 'Night Owl',
    leftIcon: '🌅',
    rightIcon: '🌙',
    leftValue: 'morning',
    rightValue: 'evening',
    description: 'When do you feel most energized and productive?'
  },
  {
    id: 'activityLocation',
    title: 'Workout Style',
    leftLabel: 'Indoor Training',
    rightLabel: 'Outdoor Adventures',
    leftIcon: '🏋️',
    rightIcon: '🏃',
    leftValue: 'indoor',
    rightValue: 'outdoor',
    description: 'Where do you prefer to build your strength?'
  },
  {
    id: 'socialPreference',
    title: 'Training Approach',
    leftLabel: 'Solo Warrior',
    rightLabel: 'Team Player',
    leftIcon: '🗡️',
    rightIcon: '🤝',
    leftValue: 'solo',
    rightValue: 'group',
    description: 'How do you prefer to tackle challenges?'
  },
  {
    id: 'intensityApproach',
    title: 'Growth Style',
    leftLabel: 'High Intensity',
    rightLabel: 'Steady Build',
    leftIcon: '🔥',
    rightIcon: '🌱',
    leftValue: 'high',
    rightValue: 'gentle',
    description: 'How do you prefer to build new habits?'
  }
];

export const SOCIAL_PROOF_TESTIMONIALS = [
  {
    id: 1,
    name: "Marcus T.",
    age: 28,
    location: "Denver, CO",
    result: "Lost 15 lbs, gained serious confidence",
    quote: "I went from feeling like a shell of myself to absolutely crushing it at work and in the gym. My energy is through the roof.",
    beforeAfter: "🔄",
    timeframe: "8 weeks",
    avatar: "👨‍💼"
  },
  {
    id: 2,
    name: "Jake R.",
    age: 35,
    location: "Austin, TX", 
    result: "Stronger than ever, wife noticed the difference",
    quote: "Finally feel like the man I'm supposed to be. The program doesn't just change your body - it changes how you show up in life.",
    beforeAfter: "💪",
    timeframe: "12 weeks",
    avatar: "👨‍🔧"
  },
  {
    id: 3,
    name: "David K.",
    age: 42,
    location: "Seattle, WA",
    result: "Down 2 belt sizes, energy of a 25-year-old",
    quote: "I thought feeling tired and soft was just part of getting older. This program proved me completely wrong.",
    beforeAfter: "⚡",
    timeframe: "16 weeks", 
    avatar: "👨‍💻"
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