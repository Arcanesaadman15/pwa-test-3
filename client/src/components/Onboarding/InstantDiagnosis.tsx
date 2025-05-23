import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, AlertTriangle, TrendingUp } from "lucide-react";
import { OnboardingData } from "@/data/onboardingData";

interface InstantDiagnosisProps {
  data: Partial<OnboardingData>;
  onComplete: () => void;
}

export function InstantDiagnosis({ data, onComplete }: InstantDiagnosisProps) {
  // Calculate testosterone score based on user responses
  const calculateTestosteroneScore = () => {
    let score = 50; // Base score
    
    // Age factor
    if (data.ageRange === "18-25") score += 15;
    else if (data.ageRange === "26-35") score += 10;
    else if (data.ageRange === "36-45") score += 5;
    else if (data.ageRange === "46-55") score -= 5;
    else score -= 10;
    
    // Sleep quality
    if (data.sleepQuality === "excellent") score += 15;
    else if (data.sleepQuality === "good") score += 10;
    else if (data.sleepQuality === "fair") score += 5;
    else score -= 10;
    
    // Exercise frequency
    if (data.exerciseFrequency === "daily") score += 20;
    else if (data.exerciseFrequency === "weekly") score += 15;
    else if (data.exerciseFrequency === "monthly") score += 5;
    else score -= 15;
    
    // Stress level (inverted)
    const stressLevel = data.stressLevel || 5;
    score -= (stressLevel - 5) * 3;
    
    // Waist circumference
    const waist = data.waistCircumference || 32;
    if (waist < 32) score += 10;
    else if (waist > 40) score -= 15;
    else if (waist > 36) score -= 10;
    
    return Math.max(20, Math.min(100, score));
  };

  const testosteroneScore = calculateTestosteroneScore();
  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-400";
    if (score >= 60) return "text-yellow-400";
    return "text-red-400";
  };

  const getScoreStatus = (score: number) => {
    if (score >= 80) return { icon: CheckCircle, text: "Excellent", color: "text-green-400" };
    if (score >= 60) return { icon: TrendingUp, text: "Good", color: "text-yellow-400" };
    return { icon: AlertTriangle, text: "Needs Improvement", color: "text-red-400" };
  };

  const status = getScoreStatus(testosteroneScore);
  const StatusIcon = status.icon;

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 text-white overflow-y-auto">
      <div className="min-h-screen px-4 py-8">
        <div className="container mx-auto max-w-md">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <h1 className="text-3xl font-bold mb-4">Your Instant Diagnosis</h1>
            <p className="text-gray-300">Based on your responses, here's your personalized testosterone assessment</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-white/10 rounded-3xl p-8 mb-8 backdrop-blur-lg border border-white/20"
          >
            <div className="text-center mb-6">
              <div className="flex items-center justify-center mb-4">
                <StatusIcon className={`w-12 h-12 ${status.color}`} />
              </div>
              <h2 className="text-4xl font-bold mb-2">
                <span className={getScoreColor(testosteroneScore)}>{testosteroneScore}%</span>
              </h2>
              <p className="text-xl font-semibold mb-2">Testosterone Potential</p>
              <p className={`text-lg ${status.color}`}>{status.text}</p>
            </div>

            <div className="mb-6">
              <Progress value={testosteroneScore} className="h-3 mb-2" />
              <div className="flex justify-between text-sm text-gray-400">
                <span>Low</span>
                <span>Optimal</span>
              </div>
            </div>

            <div className="space-y-4">
              <div className="bg-white/5 rounded-xl p-4">
                <h3 className="font-semibold mb-2">🔥 Your Personal Insights:</h3>
                <ul className="text-sm space-y-1 text-gray-300">
                  {/* Sleep Quality Insights */}
                  {data.sleepQuality === "poor" && (
                    <li>• Poor sleep is significantly lowering your testosterone</li>
                  )}
                  {data.sleepQuality === "fair" && (
                    <li>• Improving sleep quality could boost T-levels by 15-20%</li>
                  )}
                  {data.sleepQuality === "good" && (
                    <li>• Good sleep foundation - let's optimize further</li>
                  )}
                  
                  {/* Exercise Insights */}
                  {data.exerciseFrequency === "rarely" && (
                    <li>• Adding regular exercise could increase testosterone by 40%</li>
                  )}
                  {data.exerciseFrequency === "weekly" && (
                    <li>• Your exercise routine is helping - more frequency = more gains</li>
                  )}
                  
                  {/* Stress Level Insights */}
                  {(data.stressLevel || 5) > 7 && (
                    <li>• High stress is blocking testosterone production</li>
                  )}
                  {(data.stressLevel || 5) > 5 && (data.stressLevel || 5) <= 7 && (
                    <li>• Managing stress better will unlock significant T-gains</li>
                  )}
                  
                  {/* Waist Circumference Insights */}
                  {(data.waistCircumference || 32) > 40 && (
                    <li>• Reducing waist size will dramatically boost hormone levels</li>
                  )}
                  {(data.waistCircumference || 32) > 36 && (data.waistCircumference || 32) <= 40 && (
                    <li>• Body composition improvements will enhance testosterone</li>
                  )}
                  
                  <li>• Your {(data.recommendedProgram || 'beginner')} program is perfectly tailored for you</li>
                </ul>
              </div>

              <div className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-xl p-4 border border-blue-400/30">
                <h3 className="font-semibold mb-2">🎯 Recommended Program:</h3>
                <p className="text-lg font-bold text-blue-300">
                  {(data.recommendedProgram || 'beginner').charAt(0).toUpperCase() + (data.recommendedProgram || 'beginner').slice(1)} Track
                </p>
                <p className="text-sm text-gray-300 mt-1">
                  Personalized for your current fitness level and goals
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="pb-8"
          >
            <Button
              onClick={onComplete}
              size="lg"
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 
                       text-white font-semibold py-4 text-lg rounded-xl shadow-xl hover:shadow-2xl 
                       transform hover:scale-105 transition-all duration-200"
            >
              See Your 63-Day Roadmap →
            </Button>
          </motion.div>
        </div>
      </div>
    </div>
  );
}