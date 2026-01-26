"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft, CheckCircle2 } from "lucide-react";

export default function QuizResult() {
  const router = useRouter();
  
  // Data Dummy Skor
  const score = 80;
  const maxScore = 100;

  // Generate posisi confetti hanya sekali saat komponen dimuat (untuk mencegah Hydration Error)
  const [confettiParticles] = useState(() => 
    [...Array(20)].map((_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      delay: `${Math.random() * 0.5}s`,
      opacity: Math.random() * 0.7,
    }))
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-100 to-emerald-100 relative overflow-hidden flex items-center justify-center">
      
      {/* Confetti Animation Layer */}
      <div className="absolute inset-0 pointer-events-none">
        {confettiParticles.map((particle) => (
          <div
            key={particle.id}
            className="absolute w-2 h-2 bg-green-500 rounded-full animate-bounce"
            style={{
              left: particle.left,
              top: particle.top,
              animationDelay: particle.delay,
              opacity: particle.opacity,
            }}
          ></div>
        ))}
      </div>

      {/* Main Content Container */}
      <div className="w-full max-w-2xl px-4 py-8 relative z-10">
        
        {/* Header Button (Floating) */}
        <div className="absolute top-0 left-0 p-4 md:p-0 md:-mt-12 md:ml-4">
            <button
            onClick={() => router.push("/dashboard")}
            className="flex items-center space-x-2 text-gray-600 hover:text-green-700 transition-colors bg-white/50 backdrop-blur-sm px-3 py-1.5 rounded-full border border-white/60 shadow-sm"
            >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm font-bold">Back to Dashboard</span>
            </button>
        </div>

        {/* Celebration Title */}
        <div className="text-center mb-8 animate-in slide-in-from-bottom-4 fade-in duration-700">
          <div className="text-7xl mb-4 animate-bounce filter drop-shadow-md">🎉</div>
          <h1 className="text-3xl md:text-5xl font-bold text-gray-900 mb-2 tracking-tight">
            Quiz Complete!
          </h1>
          <p className="text-lg text-gray-700 font-medium">
            Great job on finishing the quiz!
          </p>
        </div>

        {/* Score Card */}
        <div className="bg-white/90 backdrop-blur-md rounded-3xl shadow-2xl p-8 md:p-12 mb-8 text-center border border-white/50 animate-in zoom-in-95 duration-500">
          
          <div className="mb-6">
            <div className="text-6xl font-black text-green-600 mb-2 tracking-tighter">
              {score}
            </div>
            <p className="text-xl text-gray-500 font-medium uppercase tracking-wide">out of {maxScore}</p>
          </div>

          {/* Circular Progress Bar */}
          <div className="mt-8 mb-6">
            <div className="flex justify-center">
              <div className="relative w-40 h-40">
                {/* Background Circle */}
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 120 120">
                  <circle
                    cx="60"
                    cy="60"
                    r="54"
                    fill="none"
                    stroke="#f3f4f6"
                    strokeWidth="8"
                  />
                  {/* Foreground Circle (Animated) */}
                  <circle
                    cx="60"
                    cy="60"
                    r="54"
                    fill="none"
                    stroke="#16a34a" /* green-600 */
                    strokeWidth="8"
                    strokeDasharray={`${(score / maxScore) * 339.29} 339.29`}
                    strokeLinecap="round"
                    className="transition-all duration-1000 ease-out"
                  />
                </svg>
                {/* Center Text */}
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-3xl font-bold text-green-700">
                    {Math.round((score / maxScore) * 100)}%
                  </span>
                  <span className="text-xs text-gray-400 font-bold uppercase">Accuracy</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Analysis Box */}
        <div className="bg-blue-50 border-2 border-blue-100 rounded-2xl p-6 md:p-8 mb-8 animate-in slide-in-from-bottom-8 fade-in duration-700 delay-150">
          <div className="flex items-start space-x-4">
            <div className="bg-blue-100 p-2 rounded-full">
                <CheckCircle2 className="w-6 h-6 text-blue-600 flex-shrink-0" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-1">
                Performance Analysis
              </h3>
              <p className="text-gray-700 leading-relaxed text-sm md:text-base">
                Great job! You understand the basics of air pollution. 
                Consider reviewing <strong>Chapter 2</strong> to strengthen your knowledge about respiratory health impacts.
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 animate-in slide-in-from-bottom-8 fade-in duration-700 delay-200">
          <Button
            onClick={() => router.back()} // Kembali ke soal untuk review
            variant="outline"
            className="w-full py-6 rounded-xl border-2 border-gray-300 hover:border-green-600 hover:bg-green-50 hover:text-green-700 font-bold text-gray-600 transition-all"
          >
            Review Answers
          </Button>
          <Button
            onClick={() => router.push("/dashboard")}
            className="w-full bg-green-600 hover:bg-emerald-700 text-white py-6 rounded-xl font-bold shadow-lg hover:shadow-green-200 transition-all"
          >
            Back to Dashboard
          </Button>
        </div>
        
      </div>
    </div>
  );
}