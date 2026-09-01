"use client";

import { useState, useEffect } from "react";
import { Sidebar } from "@/components/Sidebar";
import { Button } from "@/components/ui/button";
import { Trophy, Star, Zap, Award, ArrowRight, Loader2 } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

export default function Achievements() {
  const { user } = useAuth();
  const [stats, setStats] = useState({ completedCount: 0, totalStories: 0, completionPercentage: 0 });
  const [badges, setBadges] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user?.id) {
      fetchAchievements();
    }
  }, [user]);

  const fetchAchievements = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/achievements?userId=${user?.id}`);
      const result = await res.json();
      if (result.success) {
        setStats(result.data.stats);
        setBadges(result.data.badges);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const getBadgeIcon = (id: string) => {
    if (id.includes('STORY_01')) return Trophy;
    if (id.includes('STORY_03')) return Zap;
    if (id.includes('QUIZ')) return Star;
    if (id.includes('STREAK')) return Award;
    return Award;
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar />

      {/* Main Content */}
      <main className="flex-1 md:ml-64 pb-24 md:pb-8">
        
        {/* Header Banner */}
        <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white p-6 md:p-10 shadow-sm">
          <div className="max-w-4xl">
            <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-3">
              <Trophy className="w-8 h-8 text-yellow-300" /> Pencapaian
            </h1>
            <p className="text-green-100 mt-2 text-sm md:text-base">
              Lacak progres pembelajaran Anda dan buka lencana khusus
            </p>
          </div>
        </div>

        {/* Content Area */}
        <div className="p-6 md:p-8">
          <div className="max-w-5xl mx-auto">
            
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-20">
                <Loader2 className="w-10 h-10 text-green-600 animate-spin mb-4" />
                <p className="text-gray-500 font-medium">Memuat data pencapaian Anda...</p>
              </div>
              ) : (
              <>
                {/* Stats Section */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                  <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 text-center">
                    <div className="text-4xl font-bold text-green-600 mb-2">{stats.completedCount}</div>
                    <p className="text-gray-500 text-sm font-medium uppercase tracking-wide">Selesai</p>
                  </div>
                  <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 text-center">
                    <div className="text-4xl font-bold text-blue-600 mb-2">{stats.completionPercentage}%</div>
                    <p className="text-gray-500 text-sm font-medium uppercase tracking-wide">Persentase Selesai</p>
                  </div>
                  <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 text-center">
                    <div className="text-4xl font-bold text-orange-500 mb-2">{stats.totalStories}</div>
                    <p className="text-gray-500 text-sm font-medium uppercase tracking-wide">Total Cerita</p>
                  </div>
                </div>

                {/* Grid Achievements */}
                <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <Award className="w-5 h-5 text-green-600" /> Lencana Saya
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {badges.map((achievement) => {
                    const Icon = getBadgeIcon(achievement.id);
                    return (
                      <div
                        key={achievement.id}
                        className={`relative overflow-hidden rounded-xl p-6 flex items-start space-x-4 transition-all duration-300 border ${
                          achievement.unlocked
                            ? "bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-200 shadow-md transform hover:-translate-y-1"
                            : "bg-white border-gray-100 opacity-70 hover:opacity-100 grayscale-[0.5] hover:grayscale-0"
                        }`}
                      >
                        <div
                          className={`flex-shrink-0 p-4 rounded-full shadow-inner ${
                            achievement.unlocked
                              ? "bg-yellow-100 text-yellow-600"
                              : "bg-gray-100 text-gray-400"
                          }`}
                        >
                          <Icon className="w-8 h-8" />
                        </div>
                        <div className="flex-1 z-10">
                          <h3 className={`font-bold text-lg ${achievement.unlocked ? "text-gray-900" : "text-gray-600"}`}>
                            {achievement.title}
                          </h3>
                          <p className="text-sm text-gray-600 mt-1 leading-relaxed">
                            {achievement.description}
                          </p>
                          
                          {achievement.unlocked ? (
                            <div className="mt-3 inline-flex items-center px-3 py-1 bg-yellow-200 text-yellow-800 text-xs font-bold rounded-full shadow-sm">
                              <Trophy className="w-3 h-3 mr-1" /> Selesai
                            </div>
                          ) : (
                            <div className="mt-3 inline-flex items-center px-3 py-1 bg-gray-100 text-gray-500 text-xs font-bold rounded-full">
                              🔒 Terkunci
                            </div>
                          )}
                        </div>
                      {/* Background untuk unlock */}
                        {achievement.unlocked && (
                            <div className="absolute -right-6 -bottom-6 text-yellow-100 opacity-50 rotate-12">
                                <Icon className="w-32 h-32" />
                            </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </>
            )}

            {/* Aksi Beranda */}
            <div className="mt-12 text-center bg-gray-50 rounded-xl p-8 border border-dashed border-gray-300">
              <p className="text-gray-600 mb-6 font-medium">
                Terus belajar untuk membuka lebih banyak lencana dan tunjukkan progres Anda!
              </p>
              <Link href="/dashboard">
                <Button
                    className="bg-green-600 hover:bg-emerald-700 text-white gap-2 shadow-sm"
                >
                    <span>Kembali ke Beranda</span>
                    <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}