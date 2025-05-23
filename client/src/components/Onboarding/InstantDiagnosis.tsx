import { motion } from 'framer-motion';
import { generatePersonalizedInsights, calculateRecommendedProgram, OnboardingData } from '@/data/onboardingData';
import { Button } from '@/components/ui/button';

interface InstantDiagnosisProps {
  data: Partial<OnboardingData>;
  onComplete: (data: { recommendedProgram: 'beginner' | 'intermediate' | 'advanced' }) => void;
}

export function InstantDiagnosis({ data, onComplete }: InstantDiagnosisProps) {
  const insights = generatePersonalizedInsights(data);
  const recommendedProgram = calculateRecommendedProgram(data);

  const handleContinue = () => {
    onComplete({ recommendedProgram });
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'from-green-500 to-emerald-600';
    if (score >= 60) return 'from-yellow-500 to-amber-600';
    if (score >= 40) return 'from-orange-500 to-red-500';
    return 'from-red-500 to-red-700';
  };

  const getScoreText = (score: number) => {
    if (score >= 80) return 'Strong Foundation';
    if (score >= 60) return 'Good Potential';
    if (score >= 40) return 'Room for Growth';
    return 'Major Opportunity';
  };

  const getProgramDescription = (program: string) => {
    switch (program) {
      case 'advanced':
        return 'You\'re ready for the most challenging testosterone optimization protocol. Expect rapid, dramatic results.';
      case 'intermediate':
        return 'You have a solid foundation. This program will elevate your testosterone and confidence to the next level.';
      default:
        return 'Perfect starting point to build unshakeable habits and naturally boost your testosterone from the ground up.';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black px-6 py-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-8"
      >
        <h1 className="text-3xl font-bold text-white mb-2">
          Your Testosterone Assessment
        </h1>
        <p className="text-lg text-gray-400">
          Based on your responses, here's your personalized analysis
        </p>
      </motion.div>

      {/* Wellness Score */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3, duration: 0.6 }}
        className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-3xl p-8 mb-8 border border-gray-700"
      >
        <div className="text-center mb-6">
          <div className="relative w-32 h-32 mx-auto mb-4">
            {/* Score circle */}
            <div className="w-32 h-32 rounded-full bg-gray-700 flex items-center justify-center relative overflow-hidden">
              <motion.div
                className={`absolute inset-0 rounded-full bg-gradient-to-br ${getScoreColor(insights.wellnessScore)}`}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.5, duration: 0.8, ease: "easeOut" }}
                style={{
                  clipPath: `polygon(50% 50%, 50% 0%, ${50 + (insights.wellnessScore / 100) * 50}% 0%, 100% 100%, 0% 100%)`
                }}
              />
              <div className="relative z-10 text-center">
                <div className="text-3xl font-bold text-white">{insights.wellnessScore}</div>
                <div className="text-xs text-gray-300">SCORE</div>
              </div>
            </div>
          </div>
          <h3 className="text-xl font-bold text-white mb-2">{getScoreText(insights.wellnessScore)}</h3>
          <p className="text-gray-400">Current testosterone optimization potential</p>
        </div>
      </motion.div>

      {/* Key Areas to Address */}
      {insights.keyAreas.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="bg-gradient-to-br from-red-900/20 to-orange-900/20 rounded-2xl p-6 mb-8 border border-red-800/30"
        >
          <h3 className="text-lg font-bold text-red-400 mb-4 flex items-center">
            <span className="mr-2">⚠️</span>
            Priority Areas Crushing Your T-Levels
          </h3>
          <div className="space-y-2">
            {insights.keyAreas.map((area, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.8 + index * 0.1, duration: 0.4 }}
                className="flex items-center text-gray-300"
              >
                <span className="w-2 h-2 bg-red-500 rounded-full mr-3"></span>
                {area}
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Personalized Insights */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9, duration: 0.6 }}
        className="bg-gradient-to-br from-blue-900/20 to-purple-900/20 rounded-2xl p-6 mb-8 border border-blue-800/30"
      >
        <h3 className="text-lg font-bold text-blue-400 mb-4 flex items-center">
          <span className="mr-2">💡</span>
          Your Personalized Game Plan
        </h3>
        <div className="space-y-3">
          {insights.insights.map((insight, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.1 + index * 0.1, duration: 0.4 }}
              className="text-gray-300 leading-relaxed"
            >
              <span className="text-blue-400 mr-2">•</span>
              {insight}
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Program Recommendation */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.4, duration: 0.6 }}
        className="bg-gradient-to-br from-green-900/20 to-emerald-900/20 rounded-2xl p-6 mb-8 border border-green-800/30"
      >
        <h3 className="text-lg font-bold text-green-400 mb-4 flex items-center">
          <span className="mr-2">🎯</span>
          Recommended Program
        </h3>
        <div className="bg-gray-800/50 rounded-xl p-4 mb-4">
          <div className="text-2xl font-bold text-white mb-2 capitalize">
            {recommendedProgram} Program
          </div>
          <p className="text-gray-300 leading-relaxed">
            {getProgramDescription(recommendedProgram)}
          </p>
        </div>
        <p className="text-sm text-gray-400">
          {insights.recommendation}
        </p>
      </motion.div>

      {/* CTA */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.7, duration: 0.6 }}
        className="text-center"
      >
        <Button
          onClick={handleContinue}
          size="lg"
          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 
                   text-white font-bold px-12 py-4 text-lg rounded-xl shadow-xl hover:shadow-2xl 
                   transform hover:scale-105 transition-all duration-200"
        >
          Show Me My 63-Day Journey →
        </Button>
        <p className="text-sm text-gray-500 mt-4">
          See exactly how you'll transform your testosterone and confidence
        </p>
      </motion.div>
    </div>
  );
}