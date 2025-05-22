import { Button } from "@/components/ui/button";
import { ArrowRight, Target, Zap, Heart } from "lucide-react";

interface ProblemSpotlightProps {
  onNext: () => void;
}

export function ProblemSpotlight({ onNext }: ProblemSpotlightProps) {
  const problems = [
    {
      icon: Target,
      title: "Inconsistent Habits",
      description: "Starting strong but losing momentum after a few days",
      color: "text-red-400"
    },
    {
      icon: Zap,
      title: "Lack of Energy",
      description: "Feeling tired and unmotivated throughout the day",
      color: "text-yellow-400"
    },
    {
      icon: Heart,
      title: "Poor Sleep Quality",
      description: "Struggling with sleep patterns and recovery",
      color: "text-blue-400"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col">
      {/* Header */}
      <div className="bg-gradient-to-br from-red-900 via-orange-800 to-yellow-800 px-6 pt-16 pb-12">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white mb-4">
            The Problem
          </h1>
          <p className="text-xl text-orange-200 leading-relaxed">
            Most wellness apps fail because they treat symptoms, not the root cause
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 px-6 py-8 space-y-8">
        {/* Problem Cards */}
        <div className="space-y-4">
          {problems.map((problem, index) => (
            <div 
              key={index}
              className="bg-gray-800 rounded-2xl p-6 border border-gray-700 hover:border-gray-600 transition-all"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gray-700 rounded-full flex items-center justify-center">
                  <problem.icon className={`w-6 h-6 ${problem.color}`} />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-white mb-2">
                    {problem.title}
                  </h3>
                  <p className="text-gray-400 text-sm leading-relaxed">
                    {problem.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Solution Preview */}
        <div className="bg-gradient-to-r from-blue-900/50 to-purple-900/50 rounded-2xl p-6 border border-blue-500/30">
          <h3 className="text-xl font-bold text-white mb-3">
            🎯 Our Solution
          </h3>
          <p className="text-blue-200 text-sm leading-relaxed mb-4">
            PeakForge uses a science-backed 63-day system that builds habits gradually, 
            ensuring lasting change through progressive skill development and consistent practice.
          </p>
          <div className="flex items-center gap-2 text-blue-300 text-sm">
            <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
            <span>Proven methodology</span>
          </div>
          <div className="flex items-center gap-2 text-blue-300 text-sm mt-1">
            <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
            <span>Personalized approach</span>
          </div>
          <div className="flex items-center gap-2 text-blue-300 text-sm mt-1">
            <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
            <span>Sustainable results</span>
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-3xl font-bold text-green-400">63</div>
            <div className="text-xs text-gray-400">Days to Transform</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-400">5</div>
            <div className="text-xs text-gray-400">Wellness Categories</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-400">∞</div>
            <div className="text-xs text-gray-400">Lasting Impact</div>
          </div>
        </div>
      </div>

      {/* Action Button */}
      <div className="px-6 pb-8">
        <Button
          onClick={onNext}
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-4 rounded-2xl text-lg font-medium"
        >
          Start My Transformation
          <ArrowRight className="w-5 h-5 ml-2" />
        </Button>
      </div>
    </div>
  );
}