import { Button } from "@/components/ui/button";
import { ArrowLeft, CheckCircle, Target, Zap } from "lucide-react";
import { ProgramType } from "@/types";

interface ProgramSelectorProps {
  currentProgram: 'beginner' | 'intermediate' | 'advanced';
  onProgramSelect: (program: 'beginner' | 'intermediate' | 'advanced') => void;
  onBack: () => void;
}

const PROGRAMS: ProgramType[] = [
  {
    id: 'beginner',
    name: 'Beginner',
    description: 'Perfect for starting your wellness journey',
    dailyTaskRange: '2-4 tasks',
    targetAudience: 'New to fitness and wellness',
    duration: 63
  },
  {
    id: 'intermediate',
    name: 'Intermediate',
    description: 'Ready to challenge yourself further',
    dailyTaskRange: '3-5 tasks',
    targetAudience: 'Some fitness experience',
    duration: 63
  },
  {
    id: 'advanced',
    name: 'Advanced',
    description: 'Maximum intensity for peak performance',
    dailyTaskRange: '4-7 tasks',
    targetAudience: 'Experienced fitness enthusiasts',
    duration: 63
  }
];

const getProgramIcon = (programId: string) => {
  switch (programId) {
    case 'beginner': return Target;
    case 'intermediate': return CheckCircle;
    case 'advanced': return Zap;
    default: return Target;
  }
};

export function ProgramSelector({ currentProgram, onProgramSelect, onBack }: ProgramSelectorProps) {
  return (
    <div className="min-h-screen text-white pb-20" style={{ backgroundColor: '#111827' }}>
      {/* Header */}
      <div className="bg-gradient-to-br from-red-900 via-red-800 to-orange-800 px-6 pt-16 pb-8">
        <div className="flex items-center mb-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={onBack}
            className="text-white hover:bg-white/10 mr-4"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-2xl font-bold text-white">Change Program</h1>
        </div>
        
        <p className="text-white/80 text-center">
          Switching programs will reset your progress and start fresh from Day 1
        </p>
      </div>

      {/* Program Options */}
      <div className="px-6 py-8 space-y-4">
        {PROGRAMS.map((program) => {
          const Icon = getProgramIcon(program.id);
          const isSelected = program.id === currentProgram;
          
          return (
            <div
              key={program.id}
              className={`relative rounded-xl border p-6 transition-all ${
                isSelected
                  ? 'border-red-500 bg-red-500/10'
                  : 'border-gray-600 bg-gray-800 hover:border-gray-500'
              }`}
            >
              {isSelected && (
                <div className="absolute top-4 right-4">
                  <CheckCircle className="w-6 h-6 text-red-500" />
                </div>
              )}
              
              <div className="flex items-start space-x-4">
                <div className={`p-3 rounded-lg ${
                  program.id === 'beginner' ? 'bg-blue-500/20 text-blue-400' :
                  program.id === 'intermediate' ? 'bg-green-500/20 text-green-400' :
                  'bg-orange-500/20 text-orange-400'
                }`}>
                  <Icon className="w-6 h-6" />
                </div>
                
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-white mb-1">
                    {program.name}
                  </h3>
                  <p className="text-gray-300 mb-3">
                    {program.description}
                  </p>
                  
                  <div className="space-y-2 text-sm text-gray-400">
                    <div className="flex justify-between">
                      <span>Daily Tasks:</span>
                      <span>{program.dailyTaskRange}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Duration:</span>
                      <span>{program.duration} days</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Best For:</span>
                      <span>{program.targetAudience}</span>
                    </div>
                  </div>
                  
                  {!isSelected && (
                    <Button
                      onClick={() => onProgramSelect(program.id)}
                      className="mt-4 w-full bg-red-600 hover:bg-red-700 text-white"
                    >
                      Switch to {program.name}
                    </Button>
                  )}
                  
                  {isSelected && (
                    <div className="mt-4 text-center text-red-400 font-medium">
                      Currently Active
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
      
      {/* Warning */}
      <div className="px-6 pb-8">
        <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
          <p className="text-yellow-300 text-sm text-center">
            ⚠️ Switching programs will permanently delete your current progress and start you at Day 1 of the new program.
          </p>
        </div>
      </div>
    </div>
  );
}