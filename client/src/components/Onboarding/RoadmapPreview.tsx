import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { CheckCircle, Calendar, Trophy, Target, Flame } from "lucide-react";
import { Icon } from '@/lib/iconUtils';

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
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-2xl mx-auto px-4 pt-8 pb-24">
        
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center">
              <Flame className="w-8 h-8 text-white" />
            </div>
          </div>
          
          <motion.h1 
            className="text-3xl md:text-5xl font-bold mb-6 leading-tight"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            Your 63-Day
            <br />
            <span className="text-orange-500">Transformation</span>
          </motion.h1>
          
          <motion.p 
            className="text-lg md:text-xl text-gray-300 mb-8 leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            Here's exactly how we'll optimize your testosterone and confidence
          </motion.p>

          {/* Program Preview Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="mb-8"
          >
            <img 
              src="/images/program_preview_image.png"
              alt="63-Day Transformation Program Overview"
              className="w-full max-w-md mx-auto rounded-2xl shadow-2xl border border-gray-700"
            />
          </motion.div>
        </div>

        {/* Phases */}
        <div className="space-y-4 mb-12">
          {phases.map((phase, index) => {
            const IconComponent = phase.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-gray-900 border border-gray-700 rounded-2xl p-6"
              >
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-orange-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <IconComponent className="w-6 h-6 text-orange-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-3 mb-3">
                      <span className="text-sm font-medium text-orange-400">{phase.week}</span>
                      <CheckCircle className="w-4 h-4 text-green-400" />
                    </div>
                    <h3 className="text-xl font-bold mb-3">{phase.title}</h3>
                    <p className="text-gray-300 text-sm mb-4">{phase.description}</p>
                    <ul className="space-y-2">
                      {phase.highlights.map((highlight, i) => (
                        <li key={i} className="text-sm text-gray-400 flex items-center">
                          <div className="w-2 h-2 bg-orange-400 rounded-full mr-3 flex-shrink-0"></div>
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

        {/* Results Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-gray-900 border border-gray-700 rounded-2xl p-6 mb-12"
        >
          <div className="text-center mb-8">
            <h3 className="text-xl font-bold mb-6 text-center flex items-center justify-center gap-2">
              <Icon name="Target" size={24} className="text-blue-500" />
              What You'll Achieve
            </h3>
          </div>
          <div className="grid grid-cols-2 gap-4 text-center">
            <div>
              <div className="text-2xl md:text-3xl font-bold text-green-400 mb-2">+40%</div>
              <div className="text-sm text-gray-300">Testosterone Boost</div>
            </div>
            <div>
              <div className="text-2xl md:text-3xl font-bold text-blue-400 mb-2">+65%</div>
              <div className="text-sm text-gray-300">Energy Increase</div>
            </div>
            <div>
              <div className="text-2xl md:text-3xl font-bold text-purple-400 mb-2">-50%</div>
              <div className="text-sm text-gray-300">Stress Reduction</div>
            </div>
            <div>
              <div className="text-2xl md:text-3xl font-bold text-yellow-400 mb-2">+80%</div>
              <div className="text-sm text-gray-300">Confidence Gain</div>
            </div>
          </div>
        </motion.div>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="text-center"
        >
          <Button
            onClick={onComplete}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-4 text-lg rounded-xl transition-all duration-200 hover:scale-105 max-w-md mx-auto"
          >
            See Success Stories →
          </Button>
        </motion.div>

        {/* Mobile safe area */}
        <div className="h-6" />
      </div>
    </div>
  );
}