import { useState, useEffect } from "react";
import { Gamepad2, Zap, Users, TrendingUp } from "lucide-react";

interface SplashScreenProps {
  onComplete: () => void;
}

export function SplashScreen({ onComplete }: SplashScreenProps) {
  const [currentStep, setCurrentStep] = useState(0);
  
  const steps = [
    { icon: Gamepad2, text: "Initializing PlayHub System...", color: "text-purple-500" },
    { icon: Zap, text: "Loading Gaming Stations...", color: "text-blue-500" },
    { icon: Users, text: "Preparing Customer Management...", color: "text-green-500" },
    { icon: TrendingUp, text: "Setting Up Analytics...", color: "text-orange-500" },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev >= steps.length - 1) {
          clearInterval(timer);
          setTimeout(onComplete, 800);
          return prev;
        }
        return prev + 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [onComplete, steps.length]);

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center z-50">
      <div className="text-center">
        {/* Logo Animation */}
        <div className="mb-8 animate-bounce">
          <div className="relative w-24 h-24 mx-auto">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full"></div>
            <div className="absolute inset-2 bg-gradient-to-r from-purple-900 to-blue-900 rounded-full flex items-center justify-center">
              <Gamepad2 className="w-8 h-8 text-white" />
            </div>
          </div>
        </div>

        {/* Title */}
        <h1 className="text-4xl font-bold text-white mb-2 animate-fade-in">
          PlayHub
        </h1>
        
        <p className="text-blue-200 text-lg mb-12 animate-fade-in-delayed">
          Gaming Center Management System
        </p>

        {/* Loading Steps */}
        <div className="space-y-6">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isActive = index === currentStep;
            const isCompleted = index < currentStep;
            
            return (
              <div
                key={index}
                className={`flex items-center justify-center space-x-4 transition-all duration-500 ${
                  isActive || isCompleted ? 'opacity-100' : 'opacity-30'
                } ${isActive ? 'scale-105' : 'scale-100'}`}
              >
                <div className={`relative ${step.color}`}>
                  <Icon className="w-6 h-6" />
                  {isCompleted && (
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-ping" />
                  )}
                </div>
                <span className={`text-white font-medium transition-all duration-300 ${
                  isActive ? 'text-lg' : 'text-base'
                }`}>
                  {step.text}
                </span>
                {isActive && (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                )}
              </div>
            );
          })}
        </div>

        {/* Progress Bar */}
        <div className="mt-12 w-64 mx-auto">
          <div className="h-2 bg-white/20 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-purple-500 to-blue-500 rounded-full transition-all duration-500"
              style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
            />
          </div>
          <p className="text-white/60 text-sm mt-2">
            {Math.round(((currentStep + 1) / steps.length) * 100)}% Complete
          </p>
        </div>

        {/* Version */}
        <p className="text-white/40 text-sm mt-8 animate-fade-in-slow">
          Version 1.0.0
        </p>
      </div>
    </div>
  );
}