"use client";

import { useState, useEffect } from "react";
import { Sidebar } from "@/components/Sidebar";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Lock, Clock, PlayCircle, Loader2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link"; 
import { CldImage } from "next-cloudinary";
import { toast } from "sonner";

export default function UserDashboard() {
  const { user } = useAuth();
  const userName = user?.name ? user.name.split(" ")[0] : "Learner";

  //State untuk menyimpan data asli dari Database
  const [stories, setStories] = useState<any[]>([]);
  const [inProgressStory, setInProgressStory] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  //Menarik data cerita
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const res = await fetch('/api/stories');
        const result = await res.json();

        if (result.success) {
          //Hanya ambil cerita yang sudah "published"
          const publishedStories = result.data.filter((s: any) => s.status === "published");

          //Gabungkan data cerita dengan memori progres (LocalStorage) siswa
          const enrichedStories = publishedStories.map((story: any, index: number) => {
             const savedMemory = localStorage.getItem(`epostory_progress_${story.id}`);
             let userStatus = "available"; //default
             let userProgress = 0;

             if (savedMemory) {
                const memory = JSON.parse(savedMemory);
                if (memory.phase === 'completed') {
                    userStatus = "completed";
                    userProgress = 100;
                } else {
                    userStatus = "in_progress";
                    //Estimasi progress
                    userProgress = memory.chapterIndex > 0 ? 50 : 25; 
                }
             }

             return {
                ...story,
                displayNumber: index + 1, //Nomor urut tampilan
                userStatus,
                userProgress
             };
          });

          setStories(enrichedStories);

          //Cari 1 cerita yang sedang dibaca untuk ditaruh di kotak "Lanjutkan Perjalananmu"
          const inProg = enrichedStories.find((s: any) => s.userStatus === "in_progress");
          if (inProg) {
             setInProgressStory(inProg);
          }
        }
      } catch (error) {
        toast.error("Gagal memuat daftar cerita.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar />

      {/* Main Content */}
      <main className="flex-1 md:ml-64 pb-24 md:pb-8">
        
        {/* Header (Hero Section) */}
        <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white p-6 md:p-10 shadow-sm">
          <div className="max-w-4xl">
            <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-3">
              Halo, {userName}! 👋
            </h1>
            <p className="text-green-100 mt-2 text-sm md:text-base">
              Lanjutkan misimu menyelamatkan lingkungan?
            </p>
          </div>
        </div>

        {/* Content Area */}
        <div className="p-6 md:p-8 max-w-6xl">
          
          {isLoading ? (
             <div className="py-20 flex flex-col items-center justify-center text-gray-400">
                <Loader2 className="w-10 h-10 animate-spin text-green-500 mb-4" />
                <p>Memuat perpustakaan cerita...</p>
             </div>
          ) : (
            <>
              {/* Section: Continue (Hanya Muncul jika ada cerita In Progress) */}
              <section className="mb-10">
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Clock className="w-5 h-5 text-green-600" /> Lanjutkan Perjalananmu
                </h2>
                
                {inProgressStory ? (
                  <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 md:p-8 hover:shadow-md transition-shadow">
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-5">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <span className="bg-blue-100 text-blue-700 text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wide">
                              Dalam Progres
                          </span>
                        </div>
                        <h3 className="text-lg md:text-xl font-bold text-gray-900">
                          {inProgressStory.title}
                        </h3>
                        <p className="text-sm text-gray-600 mt-1">
                          Kamu sudah membuat kemajuan! Lanjutkan ceritanya.
                        </p>
                      </div>
                      <Link href={`/story/${inProgressStory.id}`}>
                          <Button className="bg-green-600 hover:bg-emerald-700 text-white shadow-sm w-full md:w-auto gap-2">
                          <PlayCircle className="w-4 h-4" /> Lanjutkan
                          </Button>
                      </Link>
                    </div>

                    {/* Progress Bar */}
                    <div className="mt-2 bg-gray-50 p-4 rounded-lg border border-gray-100">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-700">
                          Progres Saat Ini
                        </span>
                        <span className="text-sm font-bold text-green-600">
                          {inProgressStory.userProgress}%
                        </span>
                      </div>
                      <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-green-600 rounded-full transition-all duration-700 ease-out relative overflow-hidden"
                          style={{ width: `${inProgressStory.userProgress}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="bg-white rounded-xl shadow-sm border border-dashed border-gray-300 p-8 text-center">
                      <p className="text-gray-500 mb-4">Kamu belum memiliki cerita yang sedang dibaca saat ini.</p>
                  </div>
                )}
              </section>

              {/* Section: Chapter Library */}
              <section>
                <h2 className="text-xl font-bold text-gray-900 mb-4">
                  Cerita yang Tersedia
                </h2>
                
                {stories.length === 0 ? (
                    <div className="bg-gray-50 p-8 rounded-xl border text-center text-gray-500">
                        Belum ada cerita yang dipublikasikan oleh Admin.
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {stories.map((story) => (
                        <Link href={`/story/${story.id}`} key={story.id}>
                            <div className="group relative rounded-xl border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-lg bg-white hover:-translate-y-1 cursor-pointer">
                            
                            {/* Chapter Cover */}
                            <div className="w-full h-40 flex items-center justify-center text-5xl font-bold relative bg-gradient-to-br from-green-500 to-emerald-700 text-white">
                                {story.cover_image ? (
                                    <CldImage 
                                        width={400} 
                                        height={300} 
                                        src={story.cover_image} 
                                        alt={story.title} 
                                        className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity" 
                                    />
                                ) : (
                                    <span>{story.displayNumber}</span>
                                )}
                                
                                {/* Overlay Gelap jika sudah selesai */}
                                {story.userStatus === "completed" && (
                                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center backdrop-blur-[1px]">
                                        <CheckCircle2 className="w-12 h-12 text-white/90" />
                                    </div>
                                )}
                            </div>

                            {/* Card Content */}
                            <div className="p-5">
                                <h3 className="font-bold text-gray-900 line-clamp-1 mb-3 group-hover:text-green-700 transition-colors">
                                {story.title}
                                </h3>

                                <div className="flex items-center justify-between">
                                {/* Status */}
                                {story.userStatus === "completed" && (
                                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-md border border-green-200">
                                    <CheckCircle2 className="w-3.5 h-3.5" /> Selesai
                                    </span>
                                )}
                                {story.userStatus === "in_progress" && (
                                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-blue-50 text-blue-700 text-xs font-bold rounded-md border border-blue-100">
                                    <Clock className="w-3.5 h-3.5" /> Dalam Progres
                                    </span>
                                )}
                                {story.userStatus === "available" && (
                                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-gray-100 text-gray-600 text-xs font-bold rounded-md border border-gray-200">
                                    Mulai Baca
                                    </span>
                                )}

                                {/* Icon Play Hover */}
                                <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-green-600 group-hover:text-white transition-all">
                                    <PlayCircle className="w-5 h-5" />
                                </div>
                                </div>
                            </div>
                            </div>
                        </Link>
                    ))}
                    </div>
                )}
              </section>
            </>
          )}

        </div>
      </main>
    </div>
  );
}