import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Star, Quote, Users, Target, TrendingUp } from "lucide-react";
import { SOCIAL_PROOF_TESTIMONIALS, SUCCESS_STATS } from "@/data/onboardingData";
import { Icon } from '@/lib/iconUtils';

interface SocialProofProps {
  onComplete: () => void;
}

export function SocialProof({ onComplete }: SocialProofProps) {
  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-2xl mx-auto px-4 pt-8 pb-24">
        
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center">
              <Users className="w-8 h-8 text-white" />
            </div>
          </div>
          
          <motion.h1 
            className="text-3xl md:text-5xl font-bold mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            Join the
            <br />
            <span className="text-orange-500">Brotherhood</span>
          </motion.h1>
          
          <motion.p 
            className="text-lg md:text-xl text-gray-300 mb-8 leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            50,000+ men have reclaimed their power. You're next.
          </motion.p>
        </div>

        {/* Success Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-3 gap-6 mb-16"
        >
          <div className="text-center">
            <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center mx-auto mb-3">
              <Target className="w-6 h-6 text-blue-400" />
            </div>
            <div className="text-2xl font-bold text-blue-400 mb-1">50K+</div>
            <div className="text-sm text-gray-300">Men Rebuilt</div>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center mx-auto mb-3">
              <TrendingUp className="w-6 h-6 text-green-400" />
            </div>
            <div className="text-2xl font-bold text-green-400 mb-1">+47%</div>
            <div className="text-sm text-gray-300">T-Boost Avg</div>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-yellow-500/20 rounded-lg flex items-center justify-center mx-auto mb-3">
              <Star className="w-6 h-6 text-yellow-400" />
            </div>
            <div className="text-2xl font-bold text-yellow-400 mb-1">92%</div>
            <div className="text-sm text-gray-300">Feel Like Men Again</div>
          </div>
        </motion.div>

        {/* Testimonials */}
        <div className="space-y-6 mb-16">
          {[
            {
              name: "Marcus Rodriguez",
              age: "42",
              image: "/images/marcus.png",
              quote: "Lost 30 lbs and gained my confidence back. My wife says I'm like the man she married again.",
              result: "↗ 38% T-boost, Lost 30 lbs"
            },
            {
              name: "Jake Thompson", 
              age: "38",
              image: "/images/jake.png",
              quote: "Morning wood returned after 6 weeks. Haven't felt this energetic in years. Game changer.",
              result: "↗ 52% T-boost, Energy restored"
            },
            {
              name: "Carlos Martinez",
              age: "35",
              image: "/images/carlos.png", 
              quote: "Finally sleeping through the night. Lost the dad bod and feel like a warrior again.",
              result: "↗ 41% T-boost, Better sleep"
            }
          ].map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + index * 0.1 }}
              className="bg-gray-900 border border-gray-700 rounded-2xl p-6"
            >
              <div className="flex items-start space-x-4">
                <img 
                  src={testimonial.image}
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full object-cover flex-shrink-0"
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
                    <Quote className="absolute -top-2 -left-2 w-6 h-6 text-orange-400/30" />
                    <p className="text-gray-300 text-sm italic pl-4 mb-3">{testimonial.quote}</p>
                  </div>
                  <div className="text-xs text-orange-400 font-medium">
                    {testimonial.result}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Trust Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="bg-gray-900 border border-gray-700 rounded-2xl p-6 mb-16 text-center"
        >
          <h3 className="font-semibold mb-2 flex items-center gap-2">
            <Icon name="Dumbbell" size={20} className="text-orange-500" />
            Real Men, Real Results
          </h3>
          <p className="text-sm text-gray-300">
            No gimmicks, no shortcuts - just the natural methods that actually work
          </p>
        </motion.div>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0 }}
          className="text-center"
        >
          <Button
            onClick={onComplete}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-6 text-lg rounded-xl transition-all duration-200 hover:scale-105 max-w-md mx-auto min-h-[60px] active:scale-95"
          >
            I'm Ready to Reclaim My Power →
          </Button>
          
          {/* Mobile safe area */}
          <div className="h-6 mt-4" />
        </motion.div>
      </div>
    </div>
  );
}