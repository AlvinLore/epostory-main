"use client";

import { useState } from "react";
import { Sidebar } from "@/components/Sidebar";
import { Button } from "@/components/ui/button";
import { 
  BookOpen, Clock, PlayCircle, CheckCircle2, 
  ChevronDown, ChevronUp, Award, Download, X 
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";

//DUMMY DATA
const RECENT_STORIES = [
  {
    id: "1",
    title: "Petualangan Udara Bersih",
    progress: 100,
    lastRead: "2 jam yang lalu",
    image: "https://images.unsplash.com/photo-1534274988757-a28bf1a57c17?auto=format&fit=crop&q=80&w=800",
    certificateImage: "/Sertifikat Epostory 1.png",
    quizScore: 85
  },
  {
    id: "2",
    title: "Misteri Kabut Kelabu",
    progress: 45,
    lastRead: "Kemarin",
    image: "https://images.unsplash.com/photo-1584631483163-548c89fb4bc2?auto=format&fit=crop&q=80&w=800",
    certificateImage: "",
    quizScore: 0
  },
  {
    id: "3",
    title: "Pahlawan Tanpa Tanda Jasa",
    progress: 100,
    lastRead: "3 hari yang lalu",
    image: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&q=80&w=800",
    certificateImage: "",
    quizScore: 95
  }
];

export default function MyStorybooks() {
  const { user } = useAuth(); //Mengambil data
  
  //State untuk Toggle Buka/Tutup Sub-menu
  const [isContinueOpen, setIsContinueOpen] = useState(true);
  const [isCompletedOpen, setIsCompletedOpen] = useState(true);

  //State untuk Fitur Sertifikat
  const [selectedCert, setSelectedCert] = useState<typeof RECENT_STORIES[0] | null>(null);

  //Memisahkan data berdasarkan progress
  const continueStories = RECENT_STORIES.filter(s => s.progress < 100);
  const completedStories = RECENT_STORIES.filter(s => s.progress === 100);

  //Fungsi Konversi Nilai kuis ke Predikat
  const getPredicate = (score: number) => {
    if (score >= 90) return { grade: "A", label: "Sangat Baik", color: "text-green-600" };
    if (score >= 80) return { grade: "B", label: "Baik", color: "text-blue-600" };
    if (score >= 70) return { grade: "C", label: "Cukup", color: "text-yellow-600" };
    return { grade: "D", label: "Kurang", color: "text-red-600" };
  };

  //Fitur cetak bawaan browser
  const handlePrintCertificate = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* CSS KHUSUS PRINT*/}
      <style dangerouslySetInnerHTML={{__html: `
        @media print {
          /* Menyembunyikan semua elemen selain sertifikat */
          body * { visibility: hidden; }
          #certificate-container, #certificate-container * { visibility: visible; }

          /* Atur kertas ke A4 Landscape mutlak */
          @page { 
            size: A4 landscape; 
            margin: 0 !important;
          } 
          
          html, body {
            margin: 0 !important;
            padding: 0 !important;
            width: 100%;
            height: 100%;
          }

          /* Kunci Ukuran */
          #certificate-container { 
            position: fixed !important; 
            left: 0 !important; 
            top: 0 !important; 
            width: 100vw !important;
            height: 100vh !important;
            max-width: none !important;
            margin: 0 !important;
            padding: 0 !important;
            border: none !important;
            border-radius: 0 !important;
            box-shadow: none !important;
            background: white !important;
          }

          /* Tidak membiarkan ruang kosong */
          #certificate-container img {
            width: 100vw !important;
            height: 100vh !important;
            object-fit: cover !important; 
          }
          
          #certificate-container h2 {
            font-size: 2rem !important; /* Ukuran nama PDF */
          }
          #certificate-container .pdf-grade {
            font-size: 3.5rem !important; /* Ukuran predikat PDF */
          }
          
          .no-print { display: none !important; }
        }
      `}} />

      <Sidebar />

      {/* Main Content */}
      <main className="flex-1 md:ml-64 pb-24 md:pb-8">
        
        {/* HEADER BANNER */}
        <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white p-6 md:p-10 shadow-sm">
          <div className="max-w-4xl">
            <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-3">
              <BookOpen className="w-8 h-8" /> Ceritaku
            </h1>
            <p className="text-green-100 mt-2 text-sm md:text-base">
              Jelajahi dan kelola histori ceritamu
            </p>
          </div>
        </div>

        {/* Content Area */}
        <div className="p-4 md:p-8">
          <div className="max-w-6xl mx-auto space-y-8">
            
            {/* SUB MENU 1: CERITA BELUM SELESAI (CONTINUE) */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <button 
                onClick={() => setIsContinueOpen(!isContinueOpen)}
                className="w-full px-6 py-4 flex items-center justify-between bg-indigo-50/50 hover:bg-indigo-50 transition-colors border-b border-gray-100"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-indigo-100 rounded-lg"><Clock className="w-5 h-5 text-indigo-600"/></div>
                  <h2 className="text-xl font-bold text-gray-900">Belum Selesai</h2>
                  <span className="bg-indigo-100 text-indigo-700 text-xs px-2.5 py-0.5 rounded-full font-bold">
                    {continueStories.length}
                  </span>
                </div>
                {isContinueOpen ? <ChevronUp className="w-5 h-5 text-gray-500"/> : <ChevronDown className="w-5 h-5 text-gray-500"/>}
              </button>

              {isContinueOpen && (
                <div className="p-6 bg-gray-50/30">
                  {continueStories.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      {continueStories.map((story) => (
                        <div key={story.id} className="bg-white border border-gray-200 rounded-2xl overflow-hidden hover:shadow-xl transition-all group">
                          <div className="relative h-48 overflow-hidden">
                            <img src={story.image} alt={story.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"/>
                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                              <Link href={`/story/${story.id}`}>
                                <Button className="bg-white text-gray-900 hover:bg-gray-100 gap-2 rounded-full">
                                  <PlayCircle className="w-4 h-4"/> Lanjutkan
                                </Button>
                              </Link>
                            </div>
                          </div>
                          <div className="p-5">
                            <h3 className="font-bold text-lg text-gray-900 mb-3">{story.title}</h3>
                            <div className="space-y-2 mb-4">
                              <div className="flex justify-between text-sm">
                                <span className="text-gray-500 font-medium">Progress</span>
                                <span className="text-indigo-600 font-bold">{story.progress}%</span>
                              </div>
                              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                                <div className="h-full bg-indigo-600 rounded-full transition-all" style={{ width: `${story.progress}%` }}></div>
                              </div>
                            </div>
                            <p className="text-xs text-gray-400 flex items-center gap-1">
                              <Clock className="w-3 h-3"/> Terakhir dibaca: {story.lastRead}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500 font-medium">Tidak ada cerita yang sedang dibaca.</div>
                  )}
                </div>
              )}
            </div>

            {/* SUB MENU 2: CERITA SUDAH SELESAI (COMPLETED) */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <button 
                onClick={() => setIsCompletedOpen(!isCompletedOpen)}
                className="w-full px-6 py-4 flex items-center justify-between bg-green-50/50 hover:bg-green-50 transition-colors border-b border-gray-100"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-100 rounded-lg"><CheckCircle2 className="w-5 h-5 text-green-600"/></div>
                  <h2 className="text-xl font-bold text-gray-900">Selesai Dibaca</h2>
                  <span className="bg-green-100 text-green-700 text-xs px-2.5 py-0.5 rounded-full font-bold">
                    {completedStories.length}
                  </span>
                </div>
                {isCompletedOpen ? <ChevronUp className="w-5 h-5 text-gray-500"/> : <ChevronDown className="w-5 h-5 text-gray-500"/>}
              </button>

              {isCompletedOpen && (
                <div className="p-6 bg-gray-50/30">
                  {completedStories.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      {completedStories.map((story) => {
                        const pred = getPredicate(story.quizScore);
                        return (
                          <div key={story.id} className="bg-white border border-gray-200 rounded-2xl overflow-hidden hover:shadow-lg transition-all flex flex-col">
                            <div className="relative h-40">
                              <img src={story.image} alt={story.title} className="w-full h-full object-cover grayscale-[20%] opacity-90"/>
                              <div className="absolute top-3 right-3 bg-white/90 backdrop-blur px-3 py-1 rounded-full flex items-center gap-1.5 shadow-sm">
                                <CheckCircle2 className="w-4 h-4 text-green-600"/>
                                <span className="text-xs font-bold text-green-700">Tamat</span>
                              </div>
                            </div>
                            <div className="p-5 flex-1 flex flex-col">
                              <h3 className="font-bold text-lg text-gray-900 mb-1">{story.title}</h3>
                              <p className="text-sm text-gray-500 mb-4 flex-1">
                                Nilai Kuis: <span className={`font-bold ${pred.color}`}>{story.quizScore} (Predikat {pred.grade})</span>
                              </p>
                              
                              <Button 
                                onClick={() => setSelectedCert(story)}
                                variant="outline" 
                                className="w-full border-green-600 text-green-700 hover:bg-green-50 hover:text-green-800 gap-2 font-bold"
                              >
                                <Award className="w-4 h-4"/> Lihat Sertifikat
                              </Button>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500 font-medium">Anda belum menyelesaikan cerita apapun.</div>
                  )}
                </div>
              )}
            </div>

          </div>
        </div>
      </main>

      {/* Fitur Sertifikat */}
      {selectedCert && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/80 backdrop-blur-sm">
          
          <div className="bg-white rounded-3xl w-full max-w-4xl shadow-2xl overflow-hidden flex flex-col max-h-[95vh]">
            
            {/* Header Fitur Sertifikat */}
            <div className="px-6 py-4 border-b flex justify-between items-center bg-gray-50">
              <h3 className="font-bold text-lg flex items-center gap-2"><Award className="text-yellow-500 w-5 h-5"/> Sertifikat Kelulusan</h3>
              <button onClick={() => setSelectedCert(null)} className="p-2 hover:bg-gray-200 rounded-full transition-colors">
                <X className="w-5 h-5 text-gray-500"/>
              </button>
            </div>

            {/* Area Sertifikat */}
            <div className="p-4 md:p-8 overflow-y-auto bg-gray-200 flex justify-center items-start">

              {selectedCert.certificateImage ? (
                <div 
                  id="certificate-container" 
                  className="w-full max-w-3xl relative shadow-xl overflow-hidden border border-gray-300"
                >
                  {/* 1. Sertifikat Mentah */}
                  <img 
                    src={selectedCert.certificateImage}
                    alt={`Background Sertifikat ${selectedCert.title}`} 
                    className="w-full h-auto block"
                  />

                  {/* 2. Teks Dinamis */}
                  <div className="absolute inset-0 z-10r">

                    {/* DATA 1: NAMA RESPONDEN */}
                    <h2 className="absolute top-[38%] left-0 w-full transform -translate-y-1/2 text-center px-4 text-xs sm:text-sm md:text-lg lg:text-2xl font-bold text-gray-900 tracking-widest font-serif uppercase leading-none">
                      {user?.name || "Nama Responden"}
                    </h2>

                    {/* DATA 2: PREDIKAT KUIS */}
                    <div className={`pdf-grade absolute top-[61%] left-0 w-full transform -translate-y-1/2 text-center text-sm sm:text-base md:text-2xl lg:text-3xl font-bold font-serif leading-none ${getPredicate(selectedCert.quizScore).color}`}>
                      {getPredicate(selectedCert.quizScore).grade}
                    </div>

                  </div>
                </div>
              ) : (
                <div className="w-full max-w-md bg-white p-12 rounded-2xl text-center shadow-sm my-auto no-print">
                  <Award className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-700 font-bold text-lg mb-1">Sertifikat Belum Tersedia</p>
                  <p className="text-gray-500 text-sm">
                    Sertifikat belum dibuat untuk modul cerita ini.
                  </p>
                </div>
              )}
              </div>
              
            {/* Footer Fitur Sertifikat */}
            <div className="px-6 py-4 border-t bg-gray-50 flex justify-end gap-3 shrink-0 no-print">
              <Button onClick={() => setSelectedCert(null)} variant="ghost" className="text-gray-600 hover:text-gray-900">Tutup</Button>
              <Button onClick={handlePrintCertificate} className="bg-green-600 hover:bg-green-700 gap-2 shadow-md">
                <Download className="w-4 h-4"/> Simpan / Cetak PDF
              </Button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}