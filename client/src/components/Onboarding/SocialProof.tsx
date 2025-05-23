import { motion } from 'framer-motion';
import { SOCIAL_PROOF_TESTIMONIALS, SUCCESS_STATS } from '@/data/onboardingData';
import { Button } from '@/components/ui/button';

interface SocialProofProps {
  onComplete: () => void;
}

export function SocialProof({ onComplete }: SocialProofProps) {
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
          Real Men. Real Results.
        </h1>
        <p className="text-lg text-gray-400">
          See how others have transformed their testosterone and confidence
        </p>
      </motion.div>

      {/* Success Stats */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.6 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
      >
        {[
          { label: 'Active Users', value: SUCCESS_STATS.totalUsers, icon: '👥' },
          { label: 'Avg Weight Loss', value: SUCCESS_STATS.avgWeightLoss, icon: '⚖️' },
          { label: 'Energy Boost', value: SUCCESS_STATS.avgEnergyIncrease, icon: '⚡' },
          { label: 'Satisfaction', value: SUCCESS_STATS.satisfactionScore, icon: '⭐' }
        ].map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 + index * 0.1, duration: 0.5 }}
            className="bg-gray-800/50 rounded-xl p-4 text-center border border-gray-700"
          >
            <div className="text-2xl mb-2">{stat.icon}</div>
            <div className="text-xl font-bold text-white mb-1">{stat.value}</div>
            <div className="text-xs text-gray-400">{stat.label}</div>
          </motion.div>
        ))}
      </motion.div>

      {/* Testimonials */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.6 }}
        className="space-y-6 mb-8"
      >
        {SOCIAL_PROOF_TESTIMONIALS.map((testimonial, index) => (
          <motion.div
            key={testimonial.id}
            initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1 + index * 0.2, duration: 0.6 }}
            className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 border border-gray-700"
          >
            {/* User Info */}
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mr-4">
                <span className="text-xl">{testimonial.avatar}</span>
              </div>
              <div>
                <div className="font-semibold text-white">{testimonial.name}</div>
                <div className="text-sm text-gray-400">
                  Age {testimonial.age} • {testimonial.location}
                </div>
              </div>
              <div className="ml-auto text-right">
                <div className="text-lg">{testimonial.beforeAfter}</div>
                <div className="text-xs text-gray-400">{testimonial.timeframe}</div>
              </div>
            </div>

            {/* Result Highlight */}
            <div className="bg-gradient-to-r from-green-900/30 to-blue-900/30 rounded-xl p-3 mb-4 border border-green-800/30">
              <div className="text-green-400 font-semibold text-sm mb-1">RESULT:</div>
              <div className="text-white font-medium">{testimonial.result}</div>
            </div>

            {/* Quote */}
            <blockquote className="text-gray-300 italic leading-relaxed">
              "{testimonial.quote}"
            </blockquote>

            {/* Rating */}
            <div className="flex items-center mt-4">
              {[...Array(5)].map((_, i) => (
                <span key={i} className="text-yellow-400 text-lg">⭐</span>
              ))}
              <span className="text-gray-400 ml-2 text-sm">Verified Review</span>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Completion Rate */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.8, duration: 0.6 }}
        className="bg-gradient-to-br from-purple-900/20 to-blue-900/20 rounded-2xl p-6 mb-8 border border-purple-800/30"
      >
        <h3 className="text-lg font-bold text-purple-400 mb-4 text-center">
          Why PeakForge Works
        </h3>
        <div className="text-center">
          <div className="text-4xl font-bold text-white mb-2">{SUCCESS_STATS.completionRate}</div>
          <div className="text-purple-400 font-medium mb-4">Program Completion Rate</div>
          <p className="text-gray-300 leading-relaxed">
            Unlike other programs with 30-40% completion rates, PeakForge's gamified approach 
            and personalized system keeps men engaged and motivated throughout their entire transformation.
          </p>
        </div>
      </motion.div>

      {/* CTA */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2.1, duration: 0.6 }}
        className="text-center"
      >
        <Button
          onClick={onComplete}
          size="lg"
          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 
                   text-white font-bold px-12 py-4 text-lg rounded-xl shadow-xl hover:shadow-2xl 
                   transform hover:scale-105 transition-all duration-200"
        >
          I'm Ready to Join Them →
        </Button>
        <p className="text-sm text-gray-500 mt-4">
          Start your transformation today with thousands of other men
        </p>
      </motion.div>
    </div>
  );
}