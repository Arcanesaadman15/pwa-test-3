import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Star, Quote } from "lucide-react";
import { SOCIAL_PROOF_TESTIMONIALS, SUCCESS_STATS } from "@/data/onboardingData";

interface SocialProofProps {
  onComplete: () => void;
}

export function SocialProof({ onComplete }: SocialProofProps) {
  return (
    <div className="fixed inset-0 bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 text-white overflow-y-auto">
      <div className="min-h-screen px-4 py-8">
        <div className="container mx-auto max-w-md">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <h1 className="text-3xl font-bold mb-4">Join 50,000+ Men</h1>
            <p className="text-gray-300">Who've already transformed their lives with PeakForge</p>
          </motion.div>

          {/* Success Stats */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-3 gap-4 mb-8"
          >
            <div className="text-center bg-white/10 rounded-xl p-4 backdrop-blur-lg">
              <div className="text-2xl font-bold text-blue-400">50K+</div>
              <div className="text-xs text-gray-300 mt-1">Active Users</div>
            </div>
            <div className="text-center bg-white/10 rounded-xl p-4 backdrop-blur-lg">
              <div className="text-2xl font-bold text-green-400">+40%</div>
              <div className="text-xs text-gray-300 mt-1">T-Level Boost</div>
            </div>
            <div className="text-center bg-white/10 rounded-xl p-4 backdrop-blur-lg">
              <div className="text-2xl font-bold text-yellow-400">93%</div>
              <div className="text-xs text-gray-300 mt-1">Success Rate</div>
            </div>
          </motion.div>

          {/* Testimonials */}
          <div className="space-y-6 mb-8">
            {SOCIAL_PROOF_TESTIMONIALS.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + index * 0.2 }}
                className="bg-white/10 rounded-xl p-6 backdrop-blur-lg border border-white/20"
              >
                <div className="flex items-start space-x-4">
                  <img 
                    src={testimonial.avatar} 
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h3 className="font-semibold">{testimonial.name}</h3>
                      <span className="text-sm text-gray-400">{testimonial.age}</span>
                    </div>
                    <div className="flex space-x-1 mb-3">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                    <div className="relative">
                      <Quote className="absolute -top-2 -left-2 w-6 h-6 text-blue-400/30" />
                      <p className="text-gray-300 text-sm italic pl-4">{testimonial.quote}</p>
                    </div>
                    <div className="mt-3 text-xs text-blue-300 font-medium">
                      {testimonial.result}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Trust Indicators */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="bg-gradient-to-r from-green-500/20 to-blue-500/20 rounded-xl p-4 mb-8 border border-green-400/30"
          >
            <div className="text-center">
              <h3 className="font-semibold mb-2">✅ Science-Backed Results</h3>
              <p className="text-sm text-gray-300">
                Developed with leading fitness experts and backed by clinical research
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.0 }}
            className="pb-8"
          >
            <Button
              onClick={onComplete}
              size="lg"
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 
                       text-white font-semibold py-4 text-lg rounded-xl shadow-xl hover:shadow-2xl 
                       transform hover:scale-105 transition-all duration-200"
            >
              Start My Transformation →
            </Button>
          </motion.div>
        </div>
      </div>
    </div>
  );
}