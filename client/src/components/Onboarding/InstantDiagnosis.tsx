import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, AlertTriangle, TrendingUp, Zap, Target, Heart } from "lucide-react";
import { OnboardingData } from "@/data/onboardingData";
import { Icon } from "@/lib/iconUtils";

interface InstantDiagnosisProps {
  data: Partial<OnboardingData>;
  onComplete: () => void;
}

export function InstantDiagnosis({ data, onComplete }: InstantDiagnosisProps) {
  // Calculate testosterone score based on user responses
  const calculateTestosteroneScore = () => {
    let score = 50; // Base score
    
    // Age factor - matching actual quiz values
    if (data.ageRange === "18-24") score += 15;
    else if (data.ageRange === "25-34") score += 10;
    else if (data.ageRange === "35-44") score += 5;
    else if (data.ageRange === "45-54") score -= 5;
    else if (data.ageRange === "55+") score -= 10;
    
    // Sleep quality - matching actual quiz values (0-1 = best, 6-7 = worst)
    if (data.sleepQuality === "0-1") score += 15;
    else if (data.sleepQuality === "2-3") score += 10;
    else if (data.sleepQuality === "4-5") score += 5;
    else if (data.sleepQuality === "6-7") score -= 10;
    
    // Exercise frequency - matching actual quiz values
    if (data.exerciseFrequency === "daily") score += 20;
    else if (data.exerciseFrequency === "weekly") score += 15;
    else if (data.exerciseFrequency === "monthly") score += 5;
    else if (data.exerciseFrequency === "rarely") score -= 15;
    
    // Primary goal boost
    if (data.primaryGoal === "muscle") score += 10;
    else if (data.primaryGoal === "energy") score += 5;
    else if (data.primaryGoal === "confidence") score += 8;
    
    // Stress level (inverted)
    const stressLevel = data.stressLevel || 5;
    score -= (stressLevel - 5) * 3;
    
    // Waist circumference
    const waist = data.waistCircumference || 32;
    if (waist < 32) score += 10;
    else if (waist > 40) score -= 15;
    else if (waist > 36) score -= 10;
    
    return Math.max(25, Math.min(95, score));
  };

  const testosteroneScore = calculateTestosteroneScore();
  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-400";
    if (score >= 60) return "text-orange-400";
    return "text-red-400";
  };

  const getScoreGradient = (score: number) => {
    if (score >= 80) return "from-green-400 to-green-500";
    if (score >= 60) return "from-orange-400 to-orange-500";
    return "from-red-400 to-red-500";
  };

  const getScoreStatus = (score: number) => {
    if (score >= 80) return { icon: CheckCircle, text: "Excellent", color: "text-green-400", bgGradient: "from-green-500/20 to-green-600/20" };
    if (score >= 60) return { icon: TrendingUp, text: "Good", color: "text-orange-400", bgGradient: "from-orange-500/20 to-orange-600/20" };
    return { icon: AlertTriangle, text: "Needs Improvement", color: "text-red-400", bgGradient: "from-red-500/20 to-red-600/20" };
  };

  const status = getScoreStatus(testosteroneScore);
  const StatusIcon = status.icon;

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Enhanced background effects */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          className="absolute top-20 right-10 w-64 h-64 bg-orange-500/10 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.3, 0.6, 0.3],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute bottom-20 left-10 w-48 h-48 bg-orange-500/5 rounded-full blur-2xl"
          animate={{
            scale: [0.8, 1.2, 0.8],
            opacity: [0.2, 0.5, 0.2],
            y: [0, -20, 0],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 3
          }}
        />
        <motion.div
          className="absolute top-1/2 left-1/2 w-32 h-32 bg-gray-500/5 rounded-full blur-xl"
          animate={{
            scale: [0.5, 1, 0.5],
            opacity: [0.1, 0.3, 0.1],
            x: [-50, 50, -50],
            y: [-25, 25, -25],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1
          }}
        />
      </div>

      {/* Scrollable content container with proper mobile-first spacing */}
      <div className="relative z-10 min-h-screen">
        {/* Mobile-first padding with safe areas */}
        <div className="px-4 py-8 sm:py-10 md:py-12 pb-24">
          <div className="container mx-auto max-w-md">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="text-center mb-8 md:mb-10"
            >
              <motion.h1 
                className="text-3xl md:text-4xl font-bold mb-4 md:mb-5"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2, duration: 0.6 }}
              >
                <span className="text-white">
                  Your Wake-Up Call
                </span>
              </motion.h1>
              <motion.p 
                className="text-gray-300 text-lg md:text-xl leading-relaxed px-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.6 }}
              >
                Here's the brutal truth about your testosterone - and exactly how to fix it
              </motion.p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8, ease: "easeOut" }}
              className={`bg-gray-900 border border-gray-700 rounded-2xl md:rounded-3xl p-6 md:p-8 mb-6 md:mb-8 relative overflow-hidden shadow-2xl`}
            >
              {/* Enhanced background shimmer */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0"
                animate={{ 
                  opacity: [0, 0.5, 0],
                  x: [-100, 400]
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 1
                }}
              />

              <div className="text-center mb-4 md:mb-6 relative z-10">
                <motion.div 
                  className="flex items-center justify-center mb-4 md:mb-6"
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: 0.6, type: "spring", stiffness: 200, damping: 15 }}
                >
                  <motion.div
                    className={`p-3 md:p-4 rounded-full bg-gradient-to-r ${getScoreGradient(testosteroneScore)} shadow-lg relative`}
                    animate={{ 
                      boxShadow: [
                        "0 0 0 0 rgba(59, 130, 246, 0.3)",
                        "0 0 0 20px rgba(59, 130, 246, 0)",
                        "0 0 0 0 rgba(59, 130, 246, 0)"
                      ]
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  >
                    <StatusIcon className="w-6 h-6 md:w-8 md:h-8 text-white" />
                  </motion.div>
                </motion.div>

                <motion.h2 
                  className="text-4xl md:text-5xl font-bold mb-3 md:mb-4"
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.8, type: "spring", stiffness: 200, damping: 20 }}
                >
                  <span className={`${getScoreColor(testosteroneScore)} relative`}>
                    {testosteroneScore}%
                    {/* Glow effect behind text */}
                    <motion.span
                      className={`absolute inset-0 bg-gradient-to-r ${getScoreGradient(testosteroneScore)} opacity-20 blur-lg`}
                      animate={{ opacity: [0.1, 0.3, 0.1] }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    >
                      {testosteroneScore}%
                    </motion.span>
                  </span>
                </motion.h2>

                <motion.p 
                  className="text-lg md:text-xl font-semibold mb-2 md:mb-3"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.0, duration: 0.6 }}
                >
                  <span className="bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent">
                    Masculine Power Level
                  </span>
                </motion.p>

                <motion.p 
                  className={`text-base md:text-lg font-bold ${status.color}`}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1.1, duration: 0.5 }}
                >
                  {status.text}
                </motion.p>
              </div>

              {/* Enhanced Progress Bar */}
              <motion.div 
                className="mb-4 md:mb-6"
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: "100%" }}
                transition={{ delay: 1.2, duration: 0.8 }}
              >
                <div className="relative">
                  <div className="h-3 md:h-4 bg-gray-700/60 rounded-full overflow-hidden backdrop-blur-sm border border-gray-600/50">
                    <motion.div
                      className={`h-full bg-gradient-to-r ${getScoreGradient(testosteroneScore)} rounded-full shadow-lg relative`}
                      initial={{ width: 0 }}
                      animate={{ width: `${testosteroneScore}%` }}
                      transition={{ delay: 1.4, duration: 1.2, ease: "easeOut" }}
                    >
                      {/* Progress bar shine effect */}
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent"
                        animate={{ x: [-100, 300] }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          ease: "easeInOut",
                          delay: 2
                        }}
                      />
                    </motion.div>
                  </div>
                  <div className="flex justify-between text-xs md:text-sm text-gray-400 mt-2">
                    <span>Low</span>
                    <span>Optimal</span>
                  </div>
                </div>
              </motion.div>

              {/* Enhanced Insights Section */}
              <AnimatePresence>
                <motion.div 
                  className="space-y-3 md:space-y-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.6, duration: 0.6 }}
                >
                  <motion.div 
                    className="bg-white/10 rounded-xl p-3 md:p-4 backdrop-blur-sm border border-white/20 relative overflow-hidden"
                    whileHover={{ scale: 1.02 }}
                    transition={{ type: "spring", stiffness: 300, damping: 25 }}
                  >
                    {/* Background pattern */}
                    <div className="absolute inset-0 opacity-5">
                      <div className="absolute top-2 left-2">
                        <Zap className="w-3 h-3 md:w-4 md:h-4" />
                      </div>
                      <div className="absolute bottom-2 right-2">
                        <Target className="w-3 h-3 md:w-4 md:h-4" />
                      </div>
                      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                        <Heart className="w-5 h-5 md:w-6 md:h-6" />
                      </div>
                    </div>

                    <motion.h3 
                      className="font-semibold mb-2 md:mb-3 flex items-center text-sm md:text-base"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 1.8, duration: 0.5 }}
                    >
                      <motion.span 
                        className="mr-2"
                        animate={{ rotate: [0, 10, -10, 0] }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          ease: "easeInOut"
                        }}
                      >
                        <Icon name="Flame" size={24} className="text-orange-500" />
                      </motion.span>
                      Your Personal Insights:
                    </motion.h3>
                    <ul className="text-xs md:text-sm space-y-1.5 md:space-y-2 text-gray-300 relative z-10">
                      {/* Sleep Quality Insights */}
                      {data.sleepQuality === "poor" && (
                        <motion.li 
                          className="flex items-start"
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 2.0, duration: 0.4 }}
                        >
                          <span className="mr-2 mt-0.5 text-sm">💤</span>
                          Poor sleep is significantly lowering your testosterone
                        </motion.li>
                      )}
                      {data.sleepQuality === "fair" && (
                        <motion.li 
                          className="flex items-start"
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 2.0, duration: 0.4 }}
                        >
                          <span className="mr-2 mt-0.5 text-sm">🛌</span>
                          Improving sleep quality could boost T-levels by 15-20%
                        </motion.li>
                      )}
                      {data.sleepQuality === "good" && (
                        <motion.li 
                          className="flex items-start"
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 2.0, duration: 0.4 }}
                        >
                          <span className="mr-2 mt-0.5 text-sm">✨</span>
                          Good sleep foundation - let's optimize further
                        </motion.li>
                      )}
                      
                      {/* Exercise Insights */}
                      {data.exerciseFrequency === "rarely" && (
                        <motion.li 
                          className="flex items-start"
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 2.2, duration: 0.4 }}
                        >
                          <Icon name="Dumbbell" size={16} className="mr-2 mt-0.5 text-orange-500" />
                          Adding regular exercise could increase testosterone by 40%
                        </motion.li>
                      )}
                      {data.exerciseFrequency === "weekly" && (
                        <motion.li 
                          className="flex items-start"
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 2.2, duration: 0.4 }}
                        >
                          <span className="mr-2 mt-0.5 text-sm">🏋️</span>
                          Your exercise routine is helping - more frequency = more gains
                        </motion.li>
                      )}
                      
                      {/* Stress Level Insights */}
                      {(data.stressLevel || 5) > 7 && (
                        <motion.li 
                          className="flex items-start"
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 2.4, duration: 0.4 }}
                        >
                          <Icon name="Zap" size={16} className="mr-2 mt-0.5 text-yellow-500" />
                          High stress is blocking testosterone production
                        </motion.li>
                      )}
                      {(data.stressLevel || 5) > 5 && (data.stressLevel || 5) <= 7 && (
                        <motion.li 
                          className="flex items-start"
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 2.4, duration: 0.4 }}
                        >
                          <Icon name="Heart" size={16} className="mr-2 mt-0.5 text-blue-500" />
                          Managing stress better will unlock significant T-gains
                        </motion.li>
                      )}
                      
                      {/* Waist Circumference Insights */}
                      {(data.waistCircumference || 32) > 40 && (
                        <motion.li 
                          className="flex items-start"
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 2.6, duration: 0.4 }}
                        >
                          <span className="mr-2 mt-0.5 text-sm">📏</span>
                          Reducing waist size will dramatically boost hormone levels
                        </motion.li>
                      )}
                      {(data.waistCircumference || 32) > 36 && (data.waistCircumference || 32) <= 40 && (
                        <motion.li 
                          className="flex items-start"
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 2.6, duration: 0.4 }}
                        >
                          <Icon name="Target" size={16} className="mr-2 mt-0.5 text-red-500" />
                          Body composition improvements will enhance testosterone
                        </motion.li>
                      )}
                      
                      <motion.li 
                        className="flex items-start"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 2.8, duration: 0.4 }}
                      >
                        <Icon name="Rocket" size={16} className="mr-2 mt-0.5 text-purple-500" />
                        Your {(data.recommendedProgram || 'beginner')} program is perfectly tailored for you
                      </motion.li>
                    </ul>
                  </motion.div>

                  <motion.div 
                    className="bg-gray-800 rounded-xl p-3 md:p-4 border border-orange-500/30 relative overflow-hidden"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 3.0, duration: 0.6 }}
                    whileHover={{ scale: 1.02 }}
                  >
                    {/* Background glow */}
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-orange-500/5 to-orange-500/10 blur-xl"
                      animate={{ opacity: [0.3, 0.6, 0.3] }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    />

                    <motion.h3 
                      className="font-semibold mb-1 md:mb-2 flex items-center relative z-10 text-sm md:text-base text-white"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 3.2, duration: 0.5 }}
                    >
                      <motion.span 
                        className="mr-2"
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{
                          duration: 1.5,
                          repeat: Infinity,
                          ease: "easeInOut"
                        }}
                      >
                        <Icon name="Target" size={24} className="text-blue-500" />
                      </motion.span>
                      Recommended Program:
                    </motion.h3>
                    <motion.p 
                      className="text-base md:text-lg font-bold text-orange-400 relative z-10"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 3.4, duration: 0.5 }}
                    >
                      {(data.recommendedProgram || 'beginner').charAt(0).toUpperCase() + (data.recommendedProgram || 'beginner').slice(1)} Track
                    </motion.p>
                    <motion.p 
                      className="text-xs md:text-sm text-gray-300 mt-1 relative z-10"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 3.6, duration: 0.5 }}
                    >
                      Personalized for your current fitness level and goals
                    </motion.p>
                  </motion.div>
                </motion.div>
              </AnimatePresence>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 3.8, duration: 0.6 }}
              className="mb-8 md:mb-12"
            >
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
              >
                <Button
                  onClick={onComplete}
                  size="lg"
                  className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 md:py-4 text-base md:text-lg rounded-xl shadow-xl hover:shadow-2xl 
                           transform transition-all duration-300 hover:scale-105 relative overflow-hidden min-h-[56px] touch-manipulation"
                >
                  {/* Button background shimmer */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0"
                    animate={{ 
                      opacity: [0, 0.5, 0],
                      x: [-100, 300]
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: 4
                    }}
                  />
                  <span className="relative z-10">See Your 63-Day Roadmap →</span>
                </Button>
              </motion.div>
            </motion.div>

            {/* Bottom spacing for mobile safe area and desktop comfort */}
            <div className="h-12 sm:h-16 md:h-20" />
          </div>
        </div>
      </div>
    </div>
  );
}