import { motion } from 'framer-motion';
import { OnboardingData } from '@/data/onboardingData';
import { Button } from '@/components/ui/button';

interface RoadmapPreviewProps {
  data: Partial<OnboardingData>;
  onComplete: () => void;
}

export function RoadmapPreview({ data, onComplete }: RoadmapPreviewProps) {
  const program = data.recommendedProgram || 'beginner';

  const getProgramPhases = () => {
    switch (program) {
      case 'advanced':
        return [
          {
            phase: 1,
            title: 'Optimization Foundation',
            days: '1-21',
            description: 'Perfect your core habits: sleep, nutrition, and strength training',
            tasks: ['Advanced strength protocols', 'Precision nutrition tracking', 'Sleep optimization'],
            color: 'from-red-500 to-orange-500'
          },
          {
            phase: 2,
            title: 'Peak Performance',
            days: '22-42',
            description: 'Maximize testosterone production through high-intensity protocols',
            tasks: ['HIIT sprint training', 'Cold therapy mastery', 'Stress management'],
            color: 'from-orange-500 to-yellow-500'
          },
          {
            phase: 3,
            title: 'Elite Mastery',
            days: '43-63',
            description: 'Achieve peak masculine vitality and unshakeable confidence',
            tasks: ['Advanced recovery protocols', 'Mindfulness mastery', 'Lifestyle optimization'],
            color: 'from-yellow-500 to-green-500'
          }
        ];
      case 'intermediate':
        return [
          {
            phase: 1,
            title: 'Solid Foundation',
            days: '1-21',
            description: 'Build consistent habits across all core areas',
            tasks: ['Regular strength training', 'Consistent sleep schedule', 'Protein optimization'],
            color: 'from-blue-500 to-purple-500'
          },
          {
            phase: 2,
            title: 'Accelerated Growth',
            days: '22-42',
            description: 'Increase intensity and see real testosterone improvements',
            tasks: ['Progressive overload training', 'Cold exposure therapy', 'Stress reduction'],
            color: 'from-purple-500 to-pink-500'
          },
          {
            phase: 3,
            title: 'Confident Transformation',
            days: '43-63',
            description: 'Lock in your new identity as a high-testosterone man',
            tasks: ['Advanced protocols', 'Habit mastery', 'Confidence building'],
            color: 'from-pink-500 to-red-500'
          }
        ];
      default:
        return [
          {
            phase: 1,
            title: 'Foundation Building',
            days: '1-21',
            description: 'Start with simple, sustainable habits that build momentum',
            tasks: ['7+ hours sleep', 'Daily walking', 'Basic strength exercises'],
            color: 'from-green-500 to-blue-500'
          },
          {
            phase: 2,
            title: 'Momentum & Growth',
            days: '22-42',
            description: 'Add intensity and see your confidence start to soar',
            tasks: ['Strength training', 'Protein optimization', 'Stress management'],
            color: 'from-blue-500 to-purple-500'
          },
          {
            phase: 3,
            title: 'Transformation Complete',
            days: '43-63',
            description: 'Become the confident, energetic man you were meant to be',
            tasks: ['Advanced protocols', 'Cold therapy', 'Peak performance'],
            color: 'from-purple-500 to-pink-500'
          }
        ];
    }
  };

  const phases = getProgramPhases();

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
          Your 63-Day Transformation Journey
        </h1>
        <p className="text-lg text-gray-400 capitalize">
          {program} Program - Personalized for your goals
        </p>
      </motion.div>

      {/* Program Overview */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.6 }}
        className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 mb-8 border border-gray-700"
      >
        <div className="text-center">
          <div className="text-5xl font-bold text-white mb-2">63</div>
          <div className="text-lg text-gray-400 mb-4">Days to Peak Testosterone</div>
          <p className="text-gray-300 leading-relaxed">
            Your personalized program is designed to naturally optimize your testosterone levels,
            boost your energy, and build unshakeable confidence through proven, science-backed methods.
          </p>
        </div>
      </motion.div>

      {/* Three Phases */}
      <div className="space-y-6 mb-8">
        {phases.map((phase, index) => (
          <motion.div
            key={phase.phase}
            initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 + index * 0.2, duration: 0.6 }}
            className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 border border-gray-700 overflow-hidden relative"
          >
            {/* Phase gradient accent */}
            <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${phase.color}`} />
            
            <div className="flex items-start space-x-4">
              {/* Phase number */}
              <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${phase.color} flex items-center justify-center flex-shrink-0`}>
                <span className="text-white font-bold text-xl">{phase.phase}</span>
              </div>
              
              <div className="flex-1">
                {/* Phase header */}
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xl font-bold text-white">{phase.title}</h3>
                  <span className="text-sm text-gray-400 bg-gray-700 px-3 py-1 rounded-full">
                    Days {phase.days}
                  </span>
                </div>
                
                {/* Description */}
                <p className="text-gray-300 mb-4 leading-relaxed">
                  {phase.description}
                </p>
                
                {/* Tasks preview */}
                <div className="space-y-2">
                  <div className="text-sm font-medium text-gray-400 mb-2">Key Activities:</div>
                  {phase.tasks.map((task, taskIndex) => (
                    <div key={taskIndex} className="flex items-center text-sm text-gray-300">
                      <span className="w-2 h-2 bg-blue-500 rounded-full mr-3 flex-shrink-0" />
                      {task}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Expected Results */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2, duration: 0.6 }}
        className="bg-gradient-to-br from-green-900/20 to-blue-900/20 rounded-2xl p-6 mb-8 border border-green-800/30"
      >
        <h3 className="text-lg font-bold text-green-400 mb-4 text-center">
          Expected Results After 63 Days
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { icon: '⚡', result: 'Sustained energy throughout the day' },
            { icon: '💪', result: 'Increased muscle mass and strength' },
            { icon: '🧠', result: 'Sharper focus and mental clarity' },
            { icon: '😴', result: 'Deep, restorative sleep every night' },
            { icon: '🔥', result: 'Higher libido and vitality' },
            { icon: '🎯', result: 'Unshakeable confidence and drive' }
          ].map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.4 + index * 0.1, duration: 0.4 }}
              className="flex items-center space-x-3 text-gray-300"
            >
              <span className="text-xl">{item.icon}</span>
              <span>{item.result}</span>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* CTA */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.8, duration: 0.6 }}
        className="text-center"
      >
        <Button
          onClick={onComplete}
          size="lg"
          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 
                   text-white font-bold px-12 py-4 text-lg rounded-xl shadow-xl hover:shadow-2xl 
                   transform hover:scale-105 transition-all duration-200"
        >
          I'm Ready to Start This Journey →
        </Button>
        <p className="text-sm text-gray-500 mt-4">
          See why thousands of men trust PeakForge for their transformation
        </p>
      </motion.div>
    </div>
  );
}