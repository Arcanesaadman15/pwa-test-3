import { useEffect } from "react";

interface SplashScreenProps {
  onNext: () => void;
}

export function SplashScreen({ onNext }: SplashScreenProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onNext();
    }, 3000);

    return () => clearTimeout(timer);
  }, [onNext]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-primary to-secondary text-white p-8">
      <div className="animate-pulse-soft mb-8">
        <div className="w-24 h-24 bg-white rounded-2xl flex items-center justify-center mb-4">
          <i className="fas fa-mountain text-4xl text-primary"></i>
        </div>
      </div>
      
      <h1 className="text-4xl font-bold mb-4">PeakForge</h1>
      <p className="text-xl text-center opacity-90 mb-12">
        Transform yourself, one day at a time
      </p>
      
      <div className="animate-bounce-gentle">
        <i className="fas fa-chevron-down text-2xl opacity-60"></i>
      </div>
    </div>
  );
}
