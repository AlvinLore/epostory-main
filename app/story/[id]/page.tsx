"use client";

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ChevronRight, ChevronLeft, CheckCircle2, XCircle, Trophy, Lightbulb } from "lucide-react";
import { toast } from "sonner";

// --- TIPE DATA ---
type ContentType = "story" | "quiz";

interface StoryItem {
  type: "story";
  image: string;
  title: string;
  text: string;
}

interface QuizItem {
  type: "quiz";
  question: string;
  options: { id: string; text: string; isCorrect: boolean }[];
  feedback: string;
}

type ContentItem = StoryItem | QuizItem;

export default function SmartStoryPlayer() {
  const router = useRouter();
  const params = useParams();
  
  // --- STATE ---
  const [currentIndex, setCurrentIndex] = useState(0);
  
  // State Khusus Kuis
  const [quizSelectedId, setQuizSelectedId] = useState<string | null>(null);
  const [quizIsAnswered, setQuizIsAnswered] = useState(false);
  const [quizIsCorrect, setQuizIsCorrect] = useState(false);

  // --- DATA DUMMY ---
  const contentQueue: ContentItem[] = [
    // HALAMAN 1: Cerita
    {
      type: "story",
      image: "🌍",
      title: "Pagi hari",
      text: "Saat matahari terbit di atas kota, Maya mengamati kabut tebal yang menyelimuti bangunan-bangunan. Dia mengetahui bahwa partikel-partikel kecil yang disebut PM2.5 adalah penyebab polusi ini.."
    },
    // HALAMAN 2: Cerita
    {
      type: "story",
      image: "🏭",
      title: "Penyebab Polusi",
      text: "Polusi berasal dari berbagai sumber: kendaraan, pabrik, dan pembakaran sampah. Aktivitas-aktivitas ini melepaskan partikel berbahaya ke udara yang kita hirup."
    },
    // HALAMAN 3: KUIS (Checkpoint 1)
    {
      type: "quiz",
      question: "Apa polutan utama yang disebutkan sejauh ini?",
      // PERUBAHAN 1: Feedback dibuat netral (penjelasan saja), status Benar/Salah dihandle UI
      feedback: "PM2.5 adalah partikel halus yang disebutkan dalam cerita sebagai penyebab kabut tebal, bukan sampah plastik atau air.",
      options: [
        { id: "a", text: "Sampah Plastik", isCorrect: false },
        { id: "b", text: "Partikel PM2.5", isCorrect: true },
        { id: "c", text: "Air Kotor", isCorrect: false },
      ]
    },
    // HALAMAN 4: Lanjut Cerita
    {
      type: "story",
      image: "🌳",
      title: "Aksi Maya",
      text: "Maya menyadari bahwa dia dapat membantu dengan menanam pohon dan menggunakan transportasi umum. Pohon bertindak sebagai penyaring alami untuk udara."
    },
    // HALAMAN 5: KUIS TERAKHIR
    {
      type: "quiz",
      question: "Bagaimana Maya bisa membantu mengurangi polusi?",
      feedback: "Pohon berfungsi sebagai penyaring udara alami yang menyerap polutan, sedangkan menambah mobil justru memperburuk polusi.",
      options: [
        { id: "a", text: "Dengan mengendarai lebih banyak mobil", isCorrect: false },
        { id: "b", text: "Dengan menanam pohon", isCorrect: true },
      ]
    }
  ];

  const currentItem = contentQueue[currentIndex];
  const isLastPage = currentIndex === contentQueue.length - 1;

  // --- LOGIC ---

  const handleNext = () => {
    // Jika sedang di Kuis dan belum jawab, tahan user
    if (currentItem.type === "quiz" && !quizIsAnswered) {
      toast.error("Silakan jawab kuis terlebih dahulu!");
      return;
    }

    if (currentIndex < contentQueue.length - 1) {
      // Reset state kuis untuk soal berikutnya
      setQuizSelectedId(null);
      setQuizIsAnswered(false);
      setQuizIsCorrect(false);
      
      setCurrentIndex((prev) => prev + 1);
    } else {
      // Selesai semua
      router.push("/dashboard");
      toast.success("Chapter Completed! 🎉");
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
      // Reset state kuis jika mundur (opsional)
      setQuizSelectedId(null);
      setQuizIsAnswered(false);
    }
  };

  const handleQuizAnswer = (option: { id: string; isCorrect: boolean }) => {
    if (quizIsAnswered) return;

    setQuizSelectedId(option.id);
    setQuizIsAnswered(true);
    setQuizIsCorrect(option.isCorrect);

    if (option.isCorrect) {
      toast.success("Jawaban Benar!");
    } else {
      toast.error("Jawaban Kurang Tepat.");
    }
  };

  // --- RENDERER ---

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col h-screen overflow-hidden">
      
      {/* HEADER */}
      <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between flex-shrink-0 z-20">
        <button onClick={() => router.push("/dashboard")} className="text-gray-600 hover:text-green-600 flex items-center gap-2">
          <ArrowLeft className="w-4 h-4" /> <span className="text-sm font-bold">Exit</span>
        </button>
        
        {/* Progress Bar Dinamis */}
        <div className="flex flex-col items-center w-1/3">
           <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <div 
                className="h-full bg-green-600 transition-all duration-500" 
                style={{ width: `${((currentIndex + 1) / contentQueue.length) * 100}%` }}
              ></div>
           </div>
           <p className="text-[10px] text-gray-500 mt-1 uppercase tracking-wider font-semibold">
             Tahap {currentIndex + 1} dari {contentQueue.length}
           </p>
        </div>

        <div className="w-10"></div> {/* Spacer */}
      </div>

      {/* MAIN CONTENT SPLIT */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        
        {/* AREA KIRI: VISUAL (Gambar Cerita / Ilustrasi Kuis) */}
        <div className={`flex-1 flex items-center justify-center p-6 relative overflow-hidden ${currentItem.type === 'quiz' ? 'bg-indigo-50' : 'bg-gray-100'}`}>
             {/* Background Decoration */}
             <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle, #000 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
             
             <div className="text-center z-10 animate-in zoom-in duration-500">
                <div className="text-9xl mb-6 filter drop-shadow-xl">
                    {currentItem.type === 'story' ? currentItem.image : '❓'}
                </div>
                {currentItem.type === 'quiz' && (
                    <div className="bg-white/80 backdrop-blur px-6 py-2 rounded-full shadow-sm text-indigo-600 font-bold border border-indigo-100">
                        
                    </div>
                )}
             </div>
        </div>

        {/* AREA KANAN: KONTEN (Teks Cerita / Soal Kuis) */}
        <div className="h-[60vh] md:h-auto md:w-[500px] bg-white border-l border-gray-200 flex flex-col shadow-2xl z-10 transition-all duration-300">
          
          <div className="flex-1 overflow-y-auto p-8">
            
            {/* --- LOGIKA TAMPILAN KONTEN --- */}
            {currentItem.type === "story" ? (
              // TAMPILAN CERITA
              <div className="animate-in slide-in-from-right-4 fade-in duration-300">
                <h2 className="text-2xl font-bold text-gray-900 mb-4 font-serif">{currentItem.title}</h2>
                <p className="text-gray-700 leading-8 text-lg font-serif">{currentItem.text}</p>
              </div>
            ) : (
              // TAMPILAN KUIS
              <div className="animate-in slide-in-from-right-4 fade-in duration-300">
                <div className="flex items-center gap-2 mb-4">
                    <span className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-md text-xs font-bold uppercase">Pemahaman</span>
                </div>
                <h2 className="text-xl font-bold text-gray-900 mb-6">{currentItem.question}</h2>
                
                <div className="space-y-3">
                  {currentItem.options.map((opt) => {
                    // Logic warna kuis
                    let btnClass = "border-gray-200 hover:border-indigo-300 hover:bg-indigo-50";
                    if (quizIsAnswered) {
                        if (opt.isCorrect) btnClass = "border-green-500 bg-green-50 text-green-700";
                        else if (quizSelectedId === opt.id) btnClass = "border-red-500 bg-red-50 text-red-700";
                        else btnClass = "border-gray-100 text-gray-400 opacity-50";
                    }

                    return (
                      <button
                        key={opt.id}
                        onClick={() => handleQuizAnswer(opt)}
                        disabled={quizIsAnswered}
                        className={`w-full p-4 rounded-xl border-2 text-left font-medium transition-all duration-200 flex justify-between items-center ${btnClass}`}
                      >
                        {opt.text}
                        {quizIsAnswered && opt.isCorrect && <CheckCircle2 className="w-5 h-5 text-green-600"/>}
                        {quizIsAnswered && !opt.isCorrect && quizSelectedId === opt.id && <XCircle className="w-5 h-5 text-red-600"/>}
                      </button>
                    )
                  })}
                </div>

                {/* Feedback Kuis */}
                {quizIsAnswered && (
                    <div className={`mt-6 p-5 rounded-xl border text-sm animate-in slide-in-from-bottom-2 ${
                        quizIsCorrect 
                        ? 'bg-green-50 border-green-200 text-green-900' 
                        : 'bg-red-50 border-red-200 text-red-900'
                    }`}>
                        <div className="flex items-start gap-3">
                            {/* Ikon */}
                            <div className={`p-2 rounded-full ${quizIsCorrect ? 'bg-green-100' : 'bg-red-100'}`}>
                                {quizIsCorrect 
                                    ? <Trophy className="w-5 h-5 text-green-600" />
                                    : <Lightbulb className="w-5 h-5 text-red-600" />
                                }
                            </div>
                            
                            {/* Teks Penjelasan */}
                            <div>
                                <p className="font-bold text-base mb-1">
                                    {quizIsCorrect ? "Jawaban Benar! 🎉" : "Kurang Tepat 😅"}
                                </p>
                                <p className="leading-relaxed opacity-90">
                                    {currentItem.feedback}
                                </p>
                            </div>
                        </div>
                    </div>
                )}
              </div>
            )}

          </div>

          {/* NAVIGASI BAWAH */}
          <div className="p-6 border-t border-gray-100 bg-gray-50/80 backdrop-blur">
            <div className="flex space-x-3">
              <Button
                onClick={handlePrevious}
                disabled={currentIndex === 0}
                variant="ghost"
                className="flex-1 text-gray-500 hover:text-gray-900"
              >
                <ChevronLeft className="w-4 h-4 mr-1" /> Kembali
              </Button>
              
              <Button
                onClick={handleNext}
                // Tombol Next Disabled jika Kuis belum dijawab
                disabled={currentItem.type === 'quiz' && !quizIsAnswered} 
                className={`flex-1 shadow-md ${
                  currentItem.type === 'quiz' 
                  ? 'bg-indigo-600 hover:bg-indigo-700' 
                  : 'bg-green-600 hover:bg-emerald-700'
                } text-white transition-all`}
              >
                {isLastPage ? (
                    <span className="flex items-center gap-2">Selesai <Trophy className="w-4 h-4"/></span>
                ) : (
                    <span className="flex items-center gap-2">
                        {currentItem.type === 'quiz' && !quizIsAnswered ? "Jawab untuk lanjut" : "Selanjutnya"} 
                        <ChevronRight className="w-4 h-4" />
                    </span>
                )}
              </Button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}