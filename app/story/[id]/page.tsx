"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ChevronLeft, ChevronRight, CheckCircle2, XCircle, Trophy, Lightbulb, BookOpen, AlertCircle, FileText } from "lucide-react";
import { toast } from "sonner";

// DEFINISI TIPE DATA
interface StoryPage {
  type: "story" | "quiz";
  title: string;
  content: string; 
  quizOptions?: string[];
  quizAns?: number;
  quizFeedback?: {
    correct: string;
    incorrect: string;
  };
}

interface Chapter {
  id: string;
  title: string;
  pages: StoryPage[];
}

// DATA DUMMY
const STORY_DATA = {
  id: "story-1",
  title: "Petualangan Udara Bersih",
  // PRE-TEST
  preTest: [
    { id: "pre1", q: "Apa singkatan dari ISPU?", options: ["Indeks Standar Pencemar Udara", "Ikatan Sarjana Pencinta Udara", "Instalasi Saluran Pipa Udara"], ans: 0 },
    { id: "pre2", q: "Manakah yang BUKAN sumber polusi udara?", options: ["Asap Kendaraan", "Pembakaran Sampah", "Menanam Pohon"], ans: 2 }
  ],
  // CHAPTERS
  chapters: [
    {
      id: "ch1",
      title: "Chapter 1: Kota Kelabu",
      pages: [
        { 
          type: "story", 
          title: "Pagi yang Berkabut", 
          content: "Pagi itu, Maya membuka jendela kamarnya. Bukan sinar matahari cerah yang menyapanya, melainkan kabut tipis berwarna kelabu yang membuat gedung-gedung tinggi di kejauhan tampak samar. 'Uhuk.. uhuk..,' Maya terbatuk kecil saat menghirup udara pagi itu." 
        },
        { 
          type: "quiz", 
          title: "Kuis Kilat: Identifikasi Masalah", 
          content: "Menurutmu, kenapa langit Jakarta terlihat berwarna kelabu padahal tidak mendung?", 
          quizOptions: ["Karena kabut air alami dari laut", "Karena tumpukan polusi asap kendaraan (Smog)", "Karena efek lensa kamera"],
          quizAns: 1, 
          quizFeedback: {
            correct: "Tepat sekali! Itu disebut Smog (Smoke + Fog), campuran asap polusi dan kabut yang berbahaya bagi pernapasan.",
            incorrect: "Kurang tepat. Kabut alami biasanya putih bersih dan sejuk. Kabut kelabu ini mengandung partikel jahat dari asap kendaraan."
          }
        },
        { 
          type: "story", 
          title: "Berangkat Sekolah", 
          content: "Ibu menghampiri Maya dan memberinya masker. 'Pakai ini ya, Nak. Kualitas udara hari ini sedang tidak sehat,' kata Ibu sambil menunjukkan aplikasi ISPU di ponselnya yang berwarna merah. Maya mengangguk dan berjanji akan mencari tahu cara membuat udara kembali bersih." 
        }
      ]
    } as Chapter,
    {
      id: "ch2",
      title: "Chapter 2: Misi Penyelamatan",
      pages: [
        { 
          type: "story", 
          title: "Ide Cemerlang", 
          content: "Di sekolah, Maya mengajak teman-temannya untuk memulai gerakan 'Satu Anak Satu Pohon'. Mereka percaya bahwa pohon adalah filter udara alami terbaik yang bisa mereka tanam sendiri." 
        },
        {
           type: "quiz",
           title: "Kuis Kilat: Solusi",
           content: "Apa fungsi utama pohon dalam mengurangi polusi udara?",
           quizOptions: ["Menyerap Karbondioksida & menghasilkan Oksigen", "Membuat jalanan menjadi macet", "Menarik petir saat hujan"],
           quizAns: 0,
           quizFeedback: {
             correct: "Benar! Pohon bertindak sebagai paru-paru kota yang menyerap gas jahat dan memberikan kita udara segar.",
             incorrect: "Salah. Pohon justru membantu membersihkan udara, bukan menyebabkan macet atau menarik petir sembarangan."
           }
        },
        {
          type: "story",
          title: "Akhir Petualangan",
          content: "Berkat usaha Maya dan teman-temannya, sekolah mereka menjadi lebih hijau. Udara di sekitar sekolah terasa lebih sejuk. Maya tersenyum, langkah kecil ini adalah awal dari perubahan besar untuk Jakarta."
        }
      ]
    } as Chapter
  ],
  // POST-TEST
  postTest: [
    { id: "post1", q: "Tindakan apa yang paling tepat dilakukan saat kualitas udara buruk?", options: ["Berolahraga lari di jalan raya", "Menggunakan masker saat keluar rumah", "Membakar sampah daun kering"], ans: 1 },
    { id: "post2", q: "Apa nama partikel debu halus yang berbahaya bagi paru-paru?", options: ["PM2.5", "H2O", "CO2"], ans: 0 }
  ]
};

type GlobalPhase = "pre-test" | "chapter" | "post-test" | "completed";

export default function SmartStoryPlayer() {
  const router = useRouter();

  // STATE
  const [phase, setPhase] = useState<GlobalPhase>(
    STORY_DATA.preTest.length > 0 ? "pre-test" : "chapter"
  );
  
  const [currentChapterIndex, setCurrentChapterIndex] = useState(0);
  const [currentPageIndex, setCurrentPageIndex] = useState(0);

  // State Test
  const [testIndex, setTestIndex] = useState(0);
  const [testAnswers, setTestAnswers] = useState<Record<string, number>>({});
  const [scores, setScores] = useState({ pre: 0, post: 0 });

  // State Inline Kuis
  const [inlineQuizSelection, setInlineQuizSelection] = useState<number | null>(null);
  const [inlineQuizFeedback, setInlineQuizFeedback] = useState<"correct" | "incorrect" | null>(null);
  
  // Track Kuis Selesai (Completed)
  const [completedQuizzes, setCompletedQuizzes] = useState<Set<string>>(new Set());

  // Reset state lokal saat pindah halaman baru
  useEffect(() => {
    const quizId = `${currentChapterIndex}-${currentPageIndex}`;
    if (!completedQuizzes.has(quizId)) {
        setInlineQuizSelection(null);
        setInlineQuizFeedback(null);
    }
  }, [currentChapterIndex, currentPageIndex, completedQuizzes]);

  const currentChapter = STORY_DATA.chapters[currentChapterIndex];
  const currentPage = currentChapter?.pages[currentPageIndex];

  // LOGIC HANDLERS
  const handleTestSubmit = (type: "pre" | "post") => {
    const questions = type === "pre" ? STORY_DATA.preTest : STORY_DATA.postTest;
    let score = 0;
    questions.forEach((q, idx) => {
      if (testAnswers[idx] === q.ans) score += 1;
    });

    setScores(prev => ({ ...prev, [type]: score }));
    toast.success(`${type === 'pre' ? 'Pre-Test' : 'Post-Test'} Selesai! Skor: ${score}`);

    setTestAnswers({});
    setTestIndex(0);

    if (type === "pre") {
      setPhase("chapter");
    } else {
      setPhase("completed");
    }
  };

  const handleInlineQuizSelect = (idx: number) => {
    if (inlineQuizFeedback) return; 
    setInlineQuizSelection(idx);
    
    // Mark completed
    const quizId = `${currentChapterIndex}-${currentPageIndex}`;
    setCompletedQuizzes(prev => new Set(prev).add(quizId));
    
    if (idx === currentPage.quizAns) {
      setInlineQuizFeedback("correct");
    } else {
      setInlineQuizFeedback("incorrect");
    }
  };

  // Logika "lewati kuis yang sudah selesai" di Next Page
  const handleNextPage = () => {
    const quizId = `${currentChapterIndex}-${currentPageIndex}`;
    
    // Blokir jika kuis belum dijawab DAN belum ada di daftar completed
    if (currentPage.type === 'quiz' && !completedQuizzes.has(quizId)) {
      toast.warning("Silakan jawab kuis terlebih dahulu!");
      return;
    }

    let nextCh = currentChapterIndex;
    let nextPg = currentPageIndex + 1;
    let foundValidPage = false;
    let isFinished = false;

    // Loop untuk mencari halaman valid berikutnya (melewati kuis yang sudah selesai)
    while (!foundValidPage) {
        const chapter = STORY_DATA.chapters[nextCh];
        if (!chapter) {
            isFinished = true;
            break;
        }
        if (nextPg >= chapter.pages.length) {
            nextCh++;
            nextPg = 0;
            continue; 
        }

        const targetPage = STORY_DATA.chapters[nextCh].pages[nextPg];
        const targetId = `${nextCh}-${nextPg}`;

        // SKIP jika tipe quiz DAN sudah selesai
        if (targetPage.type === 'quiz' && completedQuizzes.has(targetId)) {
            nextPg++; 
        } else {
            foundValidPage = true;
        }
    }

    if (isFinished) {
        toast.info("Semua Chapter Selesai! Melanjutkan ke Post-Test...");
        if (STORY_DATA.postTest.length > 0) {
            setTimeout(() => setPhase("post-test"), 1500); 
        } else {
            setPhase("completed");
        }
    } else {
        if (nextCh !== currentChapterIndex) {
            toast.info("Chapter Selesai! Masuk ke Chapter berikutnya...");
            setTimeout(() => {
                setCurrentChapterIndex(nextCh);
                setCurrentPageIndex(nextPg);
            }, 1000);
        } else {
            setCurrentChapterIndex(nextCh);
            setCurrentPageIndex(nextPg);
        }
    }
  };

  // Navigasi kembali untuk skip kuis
  const handlePrevPage = () => {
    let prevCh = currentChapterIndex;
    let prevPg = currentPageIndex - 1;
    let foundValidPage = false;

    while (!foundValidPage) {
        if (prevPg < 0) {
            prevCh--;
            if (prevCh < 0) return; 
            prevPg = STORY_DATA.chapters[prevCh].pages.length - 1;
        }
        const targetPage = STORY_DATA.chapters[prevCh].pages[prevPg];
        // Selalu skip kuis saat mundur
        if (targetPage.type === 'quiz') {
            prevPg--; 
        } else {
            foundValidPage = true;
        }
    }

    setCurrentChapterIndex(prevCh);
    setCurrentPageIndex(prevPg);
  };

  const canGoBack = () => {
    if (currentPage.type === 'quiz') return false; 
    if (currentChapterIndex === 0 && currentPageIndex === 0) return false; 
    return true;
  };

  // Hitung Progress untuk Header
  const calculateProgress = () => {
    // Estimasi progress sederhana berdasarkan posisi halaman dalam chapter
    const totalPages = currentChapter?.pages.length || 1;
    return ((currentPageIndex + 1) / totalPages) * 100;
  };

  // RENDERERS 
  const renderTest = (type: "pre" | "post") => {
    const questions = type === "pre" ? STORY_DATA.preTest : STORY_DATA.postTest;
    const currentQ = questions[testIndex];
    const isLast = testIndex === questions.length - 1;

    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center p-4">
        <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
            <div className="mb-6 flex justify-between items-center border-b pb-4">
            <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                {type === 'pre' ? <CheckCircle2 className="text-orange-500"/> : <FileText className="text-purple-500"/>}
                {type === 'pre' ? 'Pre-Test' : 'Post-Test'}
            </h2>
            <span className="bg-gray-100 px-3 py-1 rounded-full text-xs font-bold text-gray-500">Soal {testIndex + 1}/{questions.length}</span>
            </div>
            
            <h3 className="text-xl font-medium mb-6 text-gray-800">{currentQ.q}</h3>
            
            <div className="space-y-3 mb-8">
            {currentQ.options.map((opt, idx) => (
                <button
                key={idx}
                onClick={() => setTestAnswers({...testAnswers, [testIndex]: idx})}
                className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                    testAnswers[testIndex] === idx 
                    ? "border-green-500 bg-green-50 text-green-700 font-bold" 
                    : "border-gray-100 hover:border-gray-300 hover:bg-gray-50"
                }`}
                >
                {opt}
                </button>
            ))}
            </div>

            <Button 
            className="w-full bg-green-600 hover:bg-green-700 h-12 text-lg"
            disabled={testAnswers[testIndex] === undefined}
            onClick={() => isLast ? handleTestSubmit(type) : setTestIndex(prev => prev + 1)}
            >
            {isLast ? "Selesaikan Tes" : "Selanjutnya"}
            </Button>
        </div>
      </div>
    );
  };

  const renderChapterContent = () => {
    const isQuizPage = currentPage.type === 'quiz';

    return (
      <div className="min-h-screen bg-gray-900 flex flex-col h-screen overflow-hidden">
        
        {/* HEADER */}
        <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between flex-shrink-0 z-20 shadow-sm">
            <button onClick={() => router.push("/dashboard")} className="text-gray-600 hover:text-green-600 flex items-center gap-2 transition-colors">
                <ArrowLeft className="w-4 h-4" /> <span className="text-sm font-bold hidden md:inline">Exit</span>
            </button>
            
            {/* Progress Bar Dinamis */}
            <div className="flex flex-col items-center w-1/2 md:w-1/3">
                <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div 
                        className="h-full bg-green-600 transition-all duration-500" 
                        style={{ width: `${calculateProgress()}%` }}
                    ></div>
                </div>
                <p className="text-[10px] text-gray-500 mt-1 uppercase tracking-wider font-semibold">
                    {currentChapter.title}
                </p>
            </div>

            <div className="w-10"></div> {/* Spacer */}
        </div>

        {/* MAIN CONTENT SPLIT */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
            
            {/* AREA KIRI: VISUAL (Responsif: Atas di Mobile, Kiri di Desktop) */}
            <div className={`flex-1 flex items-center justify-center p-6 relative overflow-hidden ${isQuizPage ? 'bg-indigo-50' : 'bg-gray-100'}`}>
                {/* Background Decoration */}
                <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle, #000 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
                
                <div className="text-center z-10 animate-in zoom-in duration-500">
                    <div className="mb-6 filter drop-shadow-xl flex justify-center">
                        {isQuizPage ? (
                            <div className="bg-white p-6 rounded-full shadow-lg">
                                <AlertCircle className="w-16 h-16 md:w-24 md:h-24 text-indigo-500 animate-pulse" />
                            </div>
                        ) : (
                            <BookOpen className="w-20 h-20 md:w-32 md:h-32 text-green-600 opacity-80" />
                        )}
                    </div>
                    {isQuizPage && (
                        <div className="bg-white/80 backdrop-blur px-6 py-2 rounded-full shadow-sm text-indigo-600 font-bold border border-indigo-100 inline-block text-sm md:text-base">
                            Kuis Interaktif
                        </div>
                    )}
                </div>
            </div>

            {/* AREA KANAN: KONTEN (Responsif: Bawah di Mobile) */}
            <div className="h-[60vh] md:h-auto md:w-[500px] bg-white border-l border-gray-200 flex flex-col shadow-2xl z-10 transition-all duration-300">
            
                <div className="flex-1 overflow-y-auto p-6 md:p-8">
                    
                    {/* Header Halaman */}
                    <div className="flex items-center gap-2 mb-4">
                        <span className={`px-3 py-1 rounded-md text-[10px] md:text-xs font-bold uppercase ${isQuizPage ? 'bg-indigo-100 text-indigo-700' : 'bg-green-100 text-green-700'}`}>
                            {isQuizPage ? 'Uji Pemahaman' : 'Cerita'}
                        </span>
                    </div>

                    <div className="animate-in slide-in-from-right-4 fade-in duration-300">
                        <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-4 font-serif">{currentPage.title}</h2>
                        
                        {/* Tampilan Cerita */}
                        {!isQuizPage && (
                            <p className="text-gray-700 leading-8 text-base md:text-lg font-serif">
                                {currentPage.content}
                            </p>
                        )}

                        {/* Tampilan Kuis */}
                        {isQuizPage && currentPage.quizOptions && (
                            <div className="space-y-3 mt-4">
                                <p className="text-gray-800 font-medium text-lg mb-4">{currentPage.content}</p>
                                
                                {currentPage.quizOptions.map((opt, idx) => {
                                    // Logic Style Button Kuis
                                    let btnClass = "border-gray-200 hover:border-indigo-300 hover:bg-indigo-50";
                                    if (inlineQuizSelection === idx) {
                                        if (inlineQuizFeedback === 'correct') btnClass = "border-green-500 bg-green-50 text-green-700 font-bold";
                                        else if (inlineQuizFeedback === 'incorrect') btnClass = "border-red-500 bg-red-50 text-red-700 font-bold";
                                        else btnClass = "border-indigo-500 bg-indigo-50 text-indigo-700";
                                    }

                                    return (
                                        <button
                                            key={idx}
                                            onClick={() => handleInlineQuizSelect(idx)}
                                            disabled={inlineQuizFeedback !== null}
                                            className={`w-full p-4 rounded-xl border-2 text-left text-sm md:text-base transition-all duration-200 flex justify-between items-center ${btnClass}`}
                                        >
                                            {opt}
                                            {inlineQuizSelection === idx && inlineQuizFeedback === 'correct' && <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0 ml-2"/>}
                                            {inlineQuizSelection === idx && inlineQuizFeedback === 'incorrect' && <XCircle className="w-5 h-5 text-red-600 shrink-0 ml-2"/>}
                                        </button>
                                    )
                                })}

                                {/* Kotak Feedback */}
                                {inlineQuizFeedback && (
                                    <div className={`mt-6 p-5 rounded-xl border text-sm animate-in slide-in-from-bottom-2 ${
                                        inlineQuizFeedback === 'correct'
                                        ? 'bg-green-50 border-green-200 text-green-900' 
                                        : 'bg-red-50 border-red-200 text-red-900'
                                    }`}>
                                        <div className="flex items-start gap-3">
                                            <div className={`p-2 rounded-full ${inlineQuizFeedback === 'correct' ? 'bg-green-100' : 'bg-red-100'}`}>
                                                {inlineQuizFeedback === 'correct'
                                                    ? <Trophy className="w-5 h-5 text-green-600" />
                                                    : <Lightbulb className="w-5 h-5 text-red-600" />
                                                }
                                            </div>
                                            <div>
                                                <p className="font-bold text-base mb-1">
                                                    {inlineQuizFeedback === 'correct' ? "Jawaban Benar!" : "Kurang Tepat"}
                                                </p>
                                                <p className="leading-relaxed opacity-90">
                                                    {inlineQuizFeedback === 'correct' ? currentPage.quizFeedback?.correct : currentPage.quizFeedback?.incorrect}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                </div>

                {/* NAVIGASI BAWAH */}
                <div className="p-6 border-t border-gray-100 bg-gray-50/80 backdrop-blur flex space-x-3">
                    {/* Tombol Back */}
                    <Button
                        onClick={handlePrevPage}
                        disabled={!canGoBack()}
                        variant="ghost"
                        className={`flex-1 text-gray-500 hover:text-gray-900 ${!canGoBack() ? 'opacity-0 pointer-events-none' : ''}`}
                    >
                        <ChevronLeft className="w-4 h-4 mr-1" /> Kembali
                    </Button>
                    
                    {/* Tombol Next */}
                    <Button
                        onClick={handleNextPage}
                        disabled={isQuizPage && inlineQuizSelection === null} 
                        className={`flex-1 shadow-md text-white transition-all h-12 text-base ${
                            isQuizPage
                            ? 'bg-indigo-600 hover:bg-indigo-700' 
                            : 'bg-green-600 hover:bg-emerald-700'
                        }`}
                    >
                        {currentPageIndex === currentChapter.pages.length - 1 && currentChapterIndex === STORY_DATA.chapters.length - 1 ? (
                            <span className="flex items-center gap-2">Selesai <Trophy className="w-4 h-4"/></span>
                        ) : (
                            <span className="flex items-center gap-2">
                                {isQuizPage && inlineQuizSelection === null ? "Jawab Kuis" : "Selanjutnya"} 
                                <ChevronRight className="w-4 h-4" />
                            </span>
                        )}
                    </Button>
                </div>

            </div>
        </div>
      </div>
    );
  };

  // MAIN RETURN
  if (phase === "completed") {
    return (
      <div className="min-h-screen bg-green-50 flex items-center justify-center p-4">
        <div className="bg-white p-8 md:p-12 rounded-3xl shadow-xl text-center max-w-lg w-full">
          <Trophy className="w-24 h-24 text-yellow-500 mx-auto mb-6 animate-bounce" />
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Petualangan Selesai!</h1>
          <p className="text-gray-500 mb-8">Terima kasih telah ikut belajar.</p>
          
          <div className="grid grid-cols-2 gap-4 mb-8">
             <div className="bg-orange-50 p-5 rounded-2xl border border-orange-100">
                <p className="text-xs text-orange-500 uppercase font-bold mb-1">Skor Pre-Test</p>
                <p className="text-4xl font-bold text-orange-700">{scores.pre}</p>
             </div>
             <div className="bg-purple-50 p-5 rounded-2xl border border-purple-100">
                <p className="text-xs text-purple-500 uppercase font-bold mb-1">Skor Post-Test</p>
                <p className="text-4xl font-bold text-purple-700">{scores.post}</p>
             </div>
          </div>

          <Button onClick={() => router.push('/dashboard')} variant="outline" className="w-full py-6">Kembali ke Dashboard</Button>
        </div>
      </div>
    );
  }

  if (phase === "chapter") {
    return renderChapterContent();
  }

  // Pre/Post Test Renderer
  return renderTest(phase === 'pre-test' ? 'pre' : 'post');
}