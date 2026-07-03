"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { CldImage } from "next-cloudinary";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, CheckCircle, Loader2, Trophy } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext"; // Mengaktifkan AuthContext

export default function StoryReader() {
  const params = useParams();
  const router = useRouter();
  
  // Menggunakan user dari AuthContext
  const { user } = useAuth(); 
  const userId = user?.id || "";

  // State untuk menyimpan data dari API
  const [story, setStory] = useState<any>(null);
  const [flatPages, setFlatPages] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  
  // State untuk anti-cheat kuis dan pencatatan progres lokal
  const [completedPages, setCompletedPages] = useState<number[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);

  useEffect(() => {
    const fetchStory = async () => {
      try {
        // Menggunakan API /read/[id] yang hanya mengembalikan cerita 'published'
        const res = await fetch(`/api/read/${params.id}`);
        const result = await res.json();

        if (result.success) {
          setStory(result.data);
          
          // 1. Ratakan semua halaman dari berbagai chapter menjadi 1 array linear
          let allPages: any[] = [];
          result.data.chapters.forEach((chapter: any) => {
             allPages = [...allPages, ...chapter.pages];
          });
          setFlatPages(allPages);

          // 2. Cek memori LocalStorage (Apakah siswa pernah membaca cerita ini sebelumnya?)
          const savedMemory = localStorage.getItem(`epostory_progress_${params.id}`);
          if (savedMemory) {
             const memory = JSON.parse(savedMemory);
             setCurrentIndex(memory.lastIndex || 0);
             setCompletedPages(memory.completed || []);
             
             if (memory.lastIndex > 0) {
                 toast.success("Melanjutkan cerita dari halaman terakhir...");
             }
          }
        } else {
          toast.error("Cerita tidak ditemukan atau belum diterbitkan.");
          router.push('/dashboard');
        }
      } catch (error) {
        toast.error("Gagal memuat cerita");
      } finally {
        setIsLoading(false);
      }
    };

    fetchStory();
  }, [params.id, router]);

  // Fungsi menyimpan jejak ke LocalStorage
  const saveToMemory = (newIndex: number, newCompleted: number[]) => {
    localStorage.setItem(`epostory_progress_${params.id}`, JSON.stringify({
      lastIndex: newIndex,
      completed: newCompleted
    }));
  };

  // Fungsi menembak API Backend (Untuk persentase dan pemberian Badge)
  const syncProgressToDatabase = async (newIndex: number) => {
    // Pastikan user sudah login sebelum menyinkronkan progres
    if (!userId) return;

    const totalPages = flatPages.length;
    const progressPercentage = Math.round(((newIndex + 1) / totalPages) * 100);
    const isCompleted = newIndex === totalPages - 1;

    try {
      const res = await fetch('/api/progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: userId,
          storyId: params.id,
          progressPercentage,
          isCompleted
        })
      });
      
      const result = await res.json();
      
      // Jika tamat dan dapat Badge baru, munculkan notifikasi piala
      if (isCompleted && result.newBadge) {
        toast.success(
          <div className="flex flex-col items-center gap-2">
             <Trophy className="w-10 h-10 text-yellow-500" />
             <p className="font-bold">Lencana Terbuka!</p>
             <p className="text-sm">{result.newBadge}</p>
          </div>, 
          { duration: 5000 }
        );
      }
    } catch (error) {
      console.error("Gagal sinkronisasi progress");
    }
  };

  const handleNext = () => {
    const currentPage = flatPages[currentIndex];
    
    // VALIDASI KUIS: Jika ini halaman kuis, dan belum dikerjakan, wajib isi dulu
    const isAlreadyCompleted = completedPages.includes(currentIndex);
    if (currentPage.type === 'quiz' && !isAlreadyCompleted && selectedAnswer === null) {
        toast.warning("Silakan pilih jawaban terlebih dahulu!");
        return;
    }

    let newCompleted = [...completedPages];
    if (!isAlreadyCompleted) {
        newCompleted.push(currentIndex);
        setCompletedPages(newCompleted);
    }

    if (currentIndex < flatPages.length - 1) {
      const newIndex = currentIndex + 1;
      setCurrentIndex(newIndex);
      setSelectedAnswer(null); // Reset jawaban untuk halaman kuis selanjutnya
      saveToMemory(newIndex, newCompleted);
      syncProgressToDatabase(newIndex);
    } else {
        // Jika sudah halaman terakhir (tamat)
        syncProgressToDatabase(currentIndex);
        // Hapus memori agar bisa dibaca dari awal lagi nanti
        localStorage.removeItem(`epostory_progress_${params.id}`);
        toast.success("Selesai membaca cerita!");
        router.push('/dashboard');
    }
  };

  const handleBack = () => {
    if (currentIndex > 0) {
      const newIndex = currentIndex - 1;
      setCurrentIndex(newIndex);
      setSelectedAnswer(null);
      saveToMemory(newIndex, completedPages); // Tetap simpan posisi saat mundur
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <Loader2 className="w-12 h-12 animate-spin text-green-600 mb-4" />
        <p className="text-gray-500 font-medium">Mempersiapkan buku cerita...</p>
      </div>
    );
  }

  if (flatPages.length === 0) return <div className="p-8 text-center">Cerita ini belum memiliki isi.</div>;

  const currentPage = flatPages[currentIndex];
  // Cek apakah halaman ini (kuis) sudah pernah diselesaikan
  const isLocked = completedPages.includes(currentIndex);

  // MENCARI NAMA CHAPTER UNTUK DITAMPILKAN
  let currentChapterTitle = "";
  let pageCount = 0;
  for (const chapter of story?.chapters || []) {
      if (currentIndex < pageCount + chapter.pages.length) {
          currentChapterTitle = chapter.title;
          break;
      }
      pageCount += chapter.pages.length;
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center py-6 px-4">
       
       {/* Progress Bar Atas - MEMPERTAHANKAN DESAIN ASLI */}
       <div className="w-full max-w-2xl bg-white p-4 rounded-xl shadow-sm mb-6 flex items-center justify-between">
          <button onClick={() => router.push('/dashboard')} className="text-gray-400 hover:text-gray-600">
             <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex flex-col items-center flex-1 mx-4">
             <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-green-500 transition-all duration-500" 
                  style={{ width: `${((currentIndex + 1) / flatPages.length) * 100}%` }}
                ></div>
             </div>
             {/* Menambahkan kembali judul chapter seperti di desain sebelumnya */}
             <p className="text-[10px] text-gray-500 mt-1 uppercase tracking-wider font-semibold">
                {currentChapterTitle}
             </p>
          </div>
          <span className="text-xs font-bold text-gray-400">{currentIndex + 1} / {flatPages.length}</span>
       </div>

       {/* KONTEN HALAMAN - MEMPERTAHANKAN STRUKTUR CSS ASLI */}
       <div className="w-full max-w-2xl bg-white rounded-2xl shadow-md overflow-hidden min-h-[60vh] flex flex-col">
          
          {currentPage.type === 'story' ? (
              // TAMPILAN STORY
              <div className="flex-1 flex flex-col">
                  {currentPage.image && (
                     <div className="w-full bg-gray-50 border-b relative">
                         {/* MENGGUNAKAN CldImage */}
                         <CldImage 
                            width={800} 
                            height={600} 
                            src={currentPage.image} 
                            alt={currentPage.title || "Ilustrasi Cerita"}
                            className="w-full h-auto max-h-[40vh] object-contain"
                         />
                     </div>
                  )}
                  <div className="p-6 md:p-8 flex-1">
                      <h2 className="text-xl font-bold text-gray-800 mb-4">{currentPage.title}</h2>
                      <p className="text-gray-700 leading-relaxed whitespace-pre-wrap text-lg">
                          {currentPage.content}
                      </p>
                  </div>
              </div>
          ) : (
              // TAMPILAN QUIZ
              <div className="flex-1 p-6 md:p-8 flex flex-col justify-center">
                  <div className="inline-block bg-yellow-100 text-yellow-800 text-xs font-bold px-3 py-1 rounded-full mb-4 w-max">
                     Pertanyaan Intermezzo
                  </div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-8">{currentPage.content}</h2>
                  
                  {/* INDIKATOR KUNCI */}
                  {isLocked && (
                      <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-start gap-3 animate-in fade-in">
                          <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                          <div>
                              <p className="text-sm font-bold text-green-800">Sudah Dikerjakan</p>
                              <p className="text-sm text-green-700">Anda tidak dapat mengubah jawaban pada halaman ini.</p>
                          </div>
                      </div>
                  )}

                  <div className="space-y-3">
                      {/* Pastikan menggunakan page_quiz_options dari API baru */}
                      {currentPage.page_quiz_options?.map((opt: any, idx: number) => (
                          <button 
                             key={opt.id}
                             disabled={isLocked} // Kunci kuis jika sudah lewat
                             onClick={() => setSelectedAnswer(idx)}
                             className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                                 isLocked 
                                 ? 'opacity-60 cursor-not-allowed bg-gray-50 border-gray-200' 
                                 : selectedAnswer === idx 
                                   ? 'border-blue-500 bg-blue-50 text-blue-700 ring-4 ring-blue-100' 
                                   : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
                             }`}
                          >
                             <div className="flex items-center gap-3">
                                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold border ${selectedAnswer === idx ? 'bg-blue-500 text-white border-blue-500' : 'border-gray-300 text-gray-400'}`}>
                                    {String.fromCharCode(65 + idx)}
                                </div>
                                <span className={`font-medium ${selectedAnswer === idx ? 'text-blue-800' : 'text-gray-700'}`}>{opt.text}</span>
                             </div>
                          </button>
                      ))}
                  </div>
              </div>
          )}

          {/* NAVIGASI BAWAH */}
          <div className="p-4 bg-gray-50 border-t flex justify-between gap-4">
              <Button 
                 onClick={handleBack} 
                 disabled={currentIndex === 0}
                 variant="outline"
                 className="w-1/3 text-gray-500"
              >
                  Kembali
              </Button>
              <Button 
                 onClick={handleNext}
                 className="w-2/3 bg-green-600 hover:bg-green-700 text-white"
              >
                  {currentIndex === flatPages.length - 1 ? 'Selesaikan Cerita' : 'Selanjutnya'}
              </Button>
          </div>
       </div>
    </div>
  );
}