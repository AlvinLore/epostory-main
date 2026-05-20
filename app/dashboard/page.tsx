"use client";

import { useState } from "react";
import { Sidebar } from "@/components/Sidebar";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Lock, Clock, PlayCircle } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link"; //Untuk login cepat

export default function UserDashboard() {
  const { user } = useAuth();
  // Ambil nama depan, default "Learner"
  const userName = user?.name ? user.name.split(" ")[0] : "Learner";

  // Data Dummy Progress Belajar
  const [chapters] = useState([
    {
      id: 1,
      number: 1,
      title: "Chapter 1: Apa Itu Polusi Udara?",
      status: "completed",
      progress: 100,
    },
    {
      id: 2,
      number: 2,
      title: "Chapter 2: Dampak Polusi Udara",
      status: "in_progress",
      progress: 60,
    },
    {
      id: 3,
      number: 3,
      title: "Chapter 3: Mengurangi Polusi Udara",
      status: "locked",
      progress: 0,
    },
  ]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />

      {/* Main Content */}
      <main className="md:ml-64 pb-24 md:pb-8">
        
        {/* Header (Hero Section) */}
        <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white p-6 md:p-10 shadow-sm">
          <div className="flex items-center justify-between max-w-5xl mx-auto md:mx-0">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">
                Halo, {userName}! 👋
              </h1>
              <p className="text-green-100 mt-2 text-sm md:text-base">
                Lanjutkan misimu menyelamatkan lingkungan?
              </p>
            </div>
            {/* Avatar */}
            <div className="hidden md:flex items-center justify-center w-14 h-14 bg-white/20 rounded-full backdrop-blur-sm shadow-inner">
              <span className="text-2xl">👤</span>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="p-6 md:p-8 max-w-6xl">
          
          {/* Section: Continue */}
          <section className="mb-10">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Clock className="w-5 h-5 text-green-600" /> Lanjutkan Perjalananmu
            </h2>
            
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 md:p-8 hover:shadow-md transition-shadow">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-5">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="bg-blue-100 text-blue-700 text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wide">
                        Dalam Progres
                    </span>
                  </div>
                  <h3 className="text-lg md:text-xl font-bold text-gray-900">
                    {chapters[1].title}
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">
                    Kamu sudah membuat kemajuan! Lanjutkan.
                  </p>
                </div>
                <Button className="bg-green-600 hover:bg-emerald-700 text-white shadow-sm w-full md:w-auto gap-2">
                  <PlayCircle className="w-4 h-4" /> Lanjutkan
                </Button>
              </div>

              {/* Progress Bar */}
              <div className="mt-2 bg-gray-50 p-4 rounded-lg border border-gray-100">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">
                    Progres Saat Ini
                  </span>
                  <span className="text-sm font-bold text-green-600">
                    {chapters[1].progress}%
                  </span>
                </div>
                <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-green-600 rounded-full transition-all duration-700 ease-out relative overflow-hidden"
                    style={{ width: `${chapters[1].progress}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </section>

          {/* Section: Chapter Library (Grid) */}
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Cerita yang Tersedia
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {chapters.map((chapter) => (
                <div
                  key={chapter.id}
                  className={`group relative rounded-xl border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-lg ${
                    chapter.status === "locked"
                      ? "bg-gray-50 opacity-75 grayscale-[0.5]"
                      : "bg-white hover:-translate-y-1"
                  }`}
                >
                  {/* Chapter Cover (Placeholder) */}
                  <div
                    className={`w-full h-40 flex items-center justify-center text-5xl font-bold relative ${
                      chapter.status === "completed"
                        ? "bg-gradient-to-br from-green-500 to-emerald-700 text-white"
                        : chapter.status === "in_progress"
                          ? "bg-gradient-to-br from-blue-400 to-sky-300 text-white"
                          : "bg-gray-200 text-gray-400"
                    }`}
                  >
                    {chapter.number}
                    
                    {/* Icon untuk Locked/Completed */}
                    {chapter.status === "completed" && (
                        <div className="absolute inset-0 bg-black/10 flex items-center justify-center">
                            <CheckCircle2 className="w-12 h-12 text-white/80" />
                        </div>
                    )}
                     {chapter.status === "locked" && (
                        <div className="absolute inset-0 bg-gray-100/50 flex items-center justify-center backdrop-blur-[1px]">
                            <Lock className="w-10 h-10 text-gray-500" />
                        </div>
                    )}
                  </div>

                  {/* Card Content */}
                  <div className="p-5">
                    <h3 className="font-bold text-gray-900 line-clamp-1 mb-3 group-hover:text-green-700 transition-colors">
                      {chapter.title}
                    </h3>

                    <div className="flex items-center justify-between">
                      {/* Status */}
                      {chapter.status === "completed" && (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-md border border-green-200">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Selesai
                        </span>
                      )}
                      {chapter.status === "in_progress" && (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-blue-50 text-blue-700 text-xs font-bold rounded-md border border-blue-100">
                          <Clock className="w-3.5 h-3.5" /> Dalam Progres
                        </span>
                      )}
                      {chapter.status === "locked" && (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-gray-100 text-gray-600 text-xs font-bold rounded-md border border-gray-200">
                          <Lock className="w-3.5 h-3.5" /> Terkunci
                        </span>
                      )}

                      {/* Interaksi Tombol */}
                      {chapter.status !== "locked" && (
                         <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-green-600 group-hover:text-white transition-all">
                            <PlayCircle className="w-5 h-5" />
                         </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

        </div>
      </main>
    </div>
  );
}