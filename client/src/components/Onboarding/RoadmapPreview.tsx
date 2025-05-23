import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { CheckCircle, Calendar, Trophy, Target } from "lucide-react";

interface RoadmapPreviewProps {
  onComplete: () => void;
}

export function RoadmapPreview({ onComplete }: RoadmapPreviewProps) {
  const phases = [
    {
      week: "Week 1-2",
      title: "Foundation Building",
      icon: Target,
      description: "Establish core habits and routines",
      highlights: ["Sleep optimization", "Basic movement", "Nutrition foundations"]
    },
    {
      week: "Week 3-5",
      title: "Momentum Phase",
      icon: Calendar,
      description: "Accelerate your progress",
      highlights: ["Strength building", "Recovery protocols", "Habit stacking"]
    },
    {
      week: "Week 6-9",
      title: "Peak Performance",
      icon: Trophy,
      description: "Maximize your testosterone potential",
      highlights: ["Advanced techniques", "Skill mastery", "Peak optimization"]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 text-white">
      <div className="container mx-auto px-4 py-8 max-w-md">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl font-bold mb-4">Your 63-Day Transformation</h1>
          <p className="text-gray-300">Here's exactly how we'll optimize your testosterone and confidence</p>
        </motion.div>

        <div className="space-y-6 mb-8">
          {phases.map((phase, index) => {
            const IconComponent = phase.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.2 }}
                className="bg-white/10 rounded-xl p-6 backdrop-blur-lg border border-white/20"
              >
                <div className="flex items-start space-x-4">
                  <div className="bg-blue-500/20 rounded-lg p-3">
                    <IconComponent className="w-6 h-6 text-blue-400" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="text-sm font-medium text-blue-300">{phase.week}</span>
                      <CheckCircle className="w-4 h-4 text-green-400" />
                    </div>
                    <h3 className="text-lg font-bold mb-2">{phase.title}</h3>
                    <p className="text-gray-300 text-sm mb-3">{phase.description}</p>
                    <ul className="space-y-1">
                      {phase.highlights.map((highlight, i) => (
                        <li key={i} className="text-sm text-gray-400 flex items-center">
                          <span className="w-1 h-1 bg-blue-400 rounded-full mr-2"></span>
                          {highlight}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6 }}
          className="bg-gradient-to-r from-green-500/20 to-blue-500/20 rounded-xl p-6 mb-8 border border-green-400/30"
        >
          <h3 className="text-xl font-bold mb-3 text-center">🎯 What You'll Achieve</h3>
          <div className="grid grid-cols-2 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-green-400">+40%</div>
              <div className="text-sm text-gray-300">Testosterone Boost</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-blue-400">+65%</div>
              <div className="text-sm text-gray-300">Energy Increase</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-purple-400">-50%</div>
              <div className="text-sm text-gray-300">Stress Reduction</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-yellow-400">+80%</div>
              <div className="text-sm text-gray-300">Confidence Gain</div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <Button
            onClick={onComplete}
            size="lg"
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 
                     text-white font-semibold py-4 text-lg rounded-xl shadow-xl hover:shadow-2xl 
                     transform hover:scale-105 transition-all duration-200"
          >
            See Success Stories →
          </Button>
        </motion.div>
      </div>
    </div>
  );
}