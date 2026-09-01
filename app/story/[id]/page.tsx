"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ChevronLeft, ChevronRight, CheckCircle2, XCircle, Trophy, Lightbulb, BookOpen, AlertCircle, FileText, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { CldImage } from "next-cloudinary";
import { useAuth } from "@/context/AuthContext";

//DEFINISI TIPE DATA
interface StoryPage {
  id: string;
  type: "story" | "quiz";
  title: string;
  content: string; 
  image?: string | null;
  quizOptions?: { id: string; text: string; feedback: string }[];
  quizAns?: string;
}

interface Chapter {
  id: string;
  title: string;
  pages: StoryPage[];
}

type GlobalPhase = "pre-test" | "chapter" | "post-test" | "completed";

export default function SmartStoryPlayer() {
  const router = useRouter();
  const params = useParams();
  const { user } = useAuth();
  const userId = user?.id || "";

  //STATE DATA DARI DATABASE
  const [storyData, setStoryData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  //STATE ALUR
  const [phase, setPhase] = useState<GlobalPhase>("chapter");
  const [currentChapterIndex, setCurrentChapterIndex] = useState(0);
  const [currentPageIndex, setCurrentPageIndex] = useState(0);

  //State Test
  const [testIndex, setTestIndex] = useState(0);
  const [testAnswers, setTestAnswers] = useState<Record<string, number>>({});
  const [scores, setScores] = useState<{ pre: number | null, post: number | null, quiz: number | null }>({ pre: null, post: null, quiz: null });

  //State Inline Kuis
  const [inlineQuizSelection, setInlineQuizSelection] = useState<string | null>(null);
  const [inlineQuizFeedback, setInlineQuizFeedback] = useState<"correct" | "incorrect" | null>(null);
  
  //Track Kuis Selesai - Disimpan sebagai Record opsi yang dipilih
  const [answeredQuizzes, setAnsweredQuizzes] = useState<Record<string, string>>({});

  //MENARIK DATA CERITA & PROGRESS DARI DATABASE
  useEffect(() => {
    const fetchStoryAndProgress = async () => {
      if (!userId || !params.id) return; // Tunggu hingga auth user tersedia

      try {
        //1. Fetch Data Cerita
        const res = await fetch(`/api/stories/${params.id}`);
        const result = await res.json();

        if (result.success && result.data.status === 'published') {
          const dbData = result.data;
          
          const formattedData = {
            id: dbData.id,
            title: dbData.title,
            isFeedbackEnabled: dbData.is_feedback_enabled ?? true,
            preTest: dbData.test_items.filter((a: any) => a.type === 'PRE_TEST').map((a: any) => ({
              id: a.id, q: a.question,
              options: a.test_options.map((o: any) => o.text), 
              ans: a.test_options.findIndex((o: any) => o.is_correct)
            })),
            chapters: dbData.chapters.map((c: any) => ({
              id: c.id, title: c.title,
              pages: c.pages.map((p: any) => ({
                id: p.id,
                type: p.type,
                title: p.title,
                content: p.content,
                image: p.image,
                quizOptions: p.type === 'quiz' ? p.page_quiz_options.map((qo: any) => ({ 
                    id: qo.id, //Ambil ID opsi dari database
                    text: qo.text,
                    feedback: qo.feedback 
                })) : undefined,
                quizAns: p.type === 'quiz' ? p.page_quiz_options.find((qo: any) => qo.is_correct)?.id : undefined
              }))
            })),
            postTest: dbData.test_items.filter((a: any) => a.type === 'POST_TEST').map((a: any) => ({
              id: a.id, q: a.question,
              options: a.test_options.map((o: any) => o.text), 
              ans: a.test_options.findIndex((o: any) => o.is_correct)
            }))
          };

          setStoryData(formattedData);

          //2. Fetch Progress User dari Database
          const progRes = await fetch(`/api/progress?userId=${userId}&storyId=${params.id}`);
          const progResult = await progRes.json();
          
          //Penyesuaian jika API mengembalikan array atau object tunggal
          const progressData = Array.isArray(progResult.data) ? progResult.data[0] : progResult.data;

          if (progressData) {
             setScores({
               pre: progressData.pre_test_score !== undefined ? progressData.pre_test_score : null,
               post: progressData.post_test_score !== undefined ? progressData.post_test_score : null,
               quiz: progressData.intermezzo_quiz_score !== undefined ? progressData.intermezzo_quiz_score : null
             });
          }

          if (progressData && progressData.quiz_answers) {
             const memory = JSON.parse(progressData.quiz_answers);
             setPhase(memory.phase || "chapter");
             setCurrentChapterIndex(memory.chapterIndex || 0);
             setCurrentPageIndex(memory.pageIndex || 0);
             setAnsweredQuizzes(memory.answeredQuizzes || {});
             
             if (memory.testAnswers && memory.phase?.includes('test')) {
                 setTestAnswers(memory.testAnswers);
                 setTestIndex(Object.keys(memory.testAnswers).length);
             }
             
             if (memory.chapterIndex > 0 || memory.pageIndex > 0 || memory.phase !== 'pre-test') {
                 toast.success("Melanjutkan cerita dari posisi terakhir...");
             }
          } else {
             //Mulai dari awal jika tidak ada progress di database
             setPhase(formattedData.preTest.length > 0 ? "pre-test" : "chapter");
          }

        } else {
          toast.error("Cerita belum diterbitkan atau tidak ditemukan.");
          router.push('/dashboard');
        }
      } catch (error) {
        toast.error("Gagal memuat cerita");
      } finally {
        setIsLoading(false);
      }
    };

    fetchStoryAndProgress();
  }, [params.id, userId, router]);

  //FUNGSI MENYIMPAN KE DATABASE (DIPANGGIL SETIAP PINDAH HALAMAN)
  const saveProgressToDB = async (
    newPhase: GlobalPhase, 
    newCh: number, 
    newPg: number, 
    newScores: any, 
    newAnswered: Record<string, string>
  ) => {
    if (!userId || !storyData) return null;

    const memory = {
      phase: newPhase,
      chapterIndex: newCh,
      pageIndex: newPg,
      answeredQuizzes: newAnswered
    };

    // Hitung progres berdasarkan jumlah halaman absolut
    let totalPages = 0;
    let currentPageAbsolute = 0;

    storyData.chapters.forEach((ch: any, cIdx: number) => {
        ch.pages.forEach((pg: any, pIdx: number) => {
            totalPages++;
            if (cIdx < newCh || (cIdx === newCh && pIdx <= newPg)) {
                currentPageAbsolute++;
            }
        });
    });

    let percentage = Math.round((currentPageAbsolute / totalPages) * 100);
    
    //Jangan izinkan 100% jika phase belum benar-benar 'completed'
    if (newPhase !== 'completed' && percentage >= 100) {
        percentage = 99;
    }

    try {
      const res = await fetch('/api/progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          storyId: params.id as string,
          progressPercentage: newPhase === 'completed' ? 100 : percentage,
          isCompleted: newPhase === 'completed',
          quiz_answers: JSON.stringify(memory),
          preTestScore: newScores.pre,
          postTestScore: newScores.post
        })
      });
      const data = await res.json();
      
      if (data?.newlyEarnedBadges && data.newlyEarnedBadges.length > 0) {
        data.newlyEarnedBadges.forEach((badge: any) => {
          toast.success(
            <div className="flex flex-col items-center text-center gap-2">
               <Trophy className="w-10 h-10 text-yellow-500 animate-bounce" />
               <p className="font-bold text-gray-900">Achievement Unlocked!</p>
               <p className="font-semibold text-green-700">{badge.name}</p>
               <p className="text-xs text-gray-600">{badge.description}</p>
            </div>, 
            { duration: 6000 }
          );
        });
      }
      return data;
    } catch (err) {
      console.error("Gagal menyimpan progress ke database", err);
      return null;
    }
  };

  //Reset state lokal atau munculkan jawaban sebelumnya saat pindah halaman
  useEffect(() => {
    if (!storyData || !storyData.chapters[currentChapterIndex]) return;
    
    const currentPageData = storyData.chapters[currentChapterIndex].pages[currentPageIndex];
    const quizId = currentPageData.id; 
    const savedAnswerIdx = answeredQuizzes[quizId];

    if (currentPageData.type === 'quiz' && savedAnswerIdx !== undefined) {
        //Kuis sudah pernah dijawab, munculkan memori jawaban
        const correctAns = currentPageData.quizAns;
        setInlineQuizSelection(savedAnswerIdx);
        setInlineQuizFeedback(savedAnswerIdx === correctAns ? "correct" : "incorrect");
    } else {
        setInlineQuizSelection(null);
        setInlineQuizFeedback(null);
    }
  }, [currentChapterIndex, currentPageIndex, answeredQuizzes, storyData]);

  //LOGIC HANDLERS UNTUK TES PRE/POST
  const handleTestSubmit = async (type: "pre" | "post") => {
    const questions = type === "pre" ? storyData.preTest : storyData.postTest;
    let rawScore = 0;
    questions.forEach((q: any, idx: number) => {
      if (testAnswers[idx] === q.ans) rawScore += 1;
    });

    const percentageScore = questions.length > 0 ? (rawScore / questions.length) * 100 : 0;
    const newScores = { ...scores, [type]: percentageScore };
    setScores(newScores);
    toast.success(`${type === 'pre' ? 'Pre-Test' : 'Post-Test'} Selesai! Skor: ${Number(percentageScore.toFixed(2))}`);

    setTestAnswers({});
    setTestIndex(0);

    const nextPhase: GlobalPhase = type === "pre" ? "chapter" : "completed";
    setPhase(nextPhase);
    
    //Simpan progres ke database
    const result = await saveProgressToDB(nextPhase, currentChapterIndex, currentPageIndex, newScores, answeredQuizzes);

    if (result?.data?.intermezzo_quiz_score !== undefined && result.data.intermezzo_quiz_score !== null) {
        setScores(prev => ({ ...prev, quiz: result.data.intermezzo_quiz_score }));
    }
  };

  const handleTestNext = (type: "pre" | "post") => {
     setTestIndex(prev => prev + 1);
  };

  const handleInlineQuizSelect = (optId: string) => {
    if (inlineQuizFeedback !== null) return; 
    setInlineQuizSelection(optId);
    
    const currentPageData = storyData.chapters[currentChapterIndex].pages[currentPageIndex];
    const quizId = currentPageData.id;
    const newAnswered = { ...answeredQuizzes, [quizId]: optId };
    setAnsweredQuizzes(newAnswered);
    
    saveProgressToDB(phase, currentChapterIndex, currentPageIndex, scores, newAnswered);
    
    const correctAns = currentPageData.quizAns;
    if (optId === correctAns) {
      setInlineQuizFeedback("correct");
    } else {
      setInlineQuizFeedback("incorrect");
    }
  };

  //Navigasi halaman lanjut
  const handleNextPage = () => {
    const currentPage = storyData.chapters[currentChapterIndex].pages[currentPageIndex];
    const quizId = currentPage.id;
    
    //Blokir jika kuis belum dijawab
    if (currentPage.type === 'quiz' && answeredQuizzes[quizId] === undefined) {
      toast.warning("Silakan jawab kuis terlebih dahulu!");
      return;
    }

    let nextCh = currentChapterIndex;
    let nextPg = currentPageIndex + 1;
    let isFinished = false;

    if (nextCh >= storyData.chapters.length - 1 && nextPg >= storyData.chapters[nextCh].pages.length) {
        isFinished = true;
    } else if (nextPg >= storyData.chapters[nextCh].pages.length) {
        nextCh++;
        nextPg = 0;
    }

    if (isFinished) {
        toast.info("Semua Chapter Selesai! Melanjutkan ke Post-Test...");
        const nextPhase: GlobalPhase = storyData.postTest.length > 0 ? "post-test" : "completed";
        
        setTimeout(async () => {
            setPhase(nextPhase);
            const result = await saveProgressToDB(nextPhase, currentChapterIndex, currentPageIndex, scores, answeredQuizzes);
            
            if (nextPhase === "completed" && result?.data?.intermezzo_quiz_score !== undefined && result.data.intermezzo_quiz_score !== null) {
                setScores(prev => ({ ...prev, quiz: result.data.intermezzo_quiz_score }));
            }
        }, 1500); 
    } else {
        if (nextCh !== currentChapterIndex) {
            toast.info("Chapter Selesai! Masuk ke Chapter berikutnya...");
            setTimeout(() => {
                setCurrentChapterIndex(nextCh);
                setCurrentPageIndex(nextPg);
                saveProgressToDB(phase, nextCh, nextPg, scores, answeredQuizzes);
            }, 1000);
        } else {
            setCurrentChapterIndex(nextCh);
            setCurrentPageIndex(nextPg);
            saveProgressToDB(phase, nextCh, nextPg, scores, answeredQuizzes);
        }
    }
  };

  const handlePrevPage = () => {
    let prevCh = currentChapterIndex;
    let prevPg = currentPageIndex - 1;

    if (prevPg < 0) {
        prevCh--;
        if (prevCh < 0) return; 
        prevPg = storyData.chapters[prevCh].pages.length - 1;
    }

    setCurrentChapterIndex(prevCh);
    setCurrentPageIndex(prevPg);
    saveProgressToDB(phase, prevCh, prevPg, scores, answeredQuizzes);
  };

  const canGoBack = () => {
    if (!storyData) return false;
    if (currentChapterIndex === 0 && currentPageIndex === 0) return false; 
    return true;
  };

  const calculateProgress = () => {
    const currentChapter = storyData.chapters[currentChapterIndex];
    const totalPages = currentChapter?.pages.length || 1;
    return ((currentPageIndex + 1) / totalPages) * 100;
  };

  //LOADING SCREEN
  if (isLoading || !storyData) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <Loader2 className="w-12 h-12 animate-spin text-green-600 mb-4" />
        <p className="text-gray-500 font-medium font-serif">Mempersiapkan buku cerita...</p>
      </div>
    );
  }

  const currentChapter = storyData.chapters[currentChapterIndex];
  const currentPage = currentChapter?.pages[currentPageIndex];

  //RENDERERS 
  const renderTest = (type: "pre" | "post") => {
    const questions = type === "pre" ? storyData.preTest : storyData.postTest;
    const currentQ = questions[testIndex];
    const isLast = testIndex === questions.length - 1;
    const hasAnswered = testAnswers[testIndex] !== undefined;

    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center p-4">
        <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl border border-gray-100 p-8 animate-in fade-in zoom-in duration-300">
            <div className="mb-6 flex justify-between items-center border-b pb-4">
            <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                {type === 'pre' ? <CheckCircle2 className="text-orange-500"/> : <FileText className="text-purple-500"/>}
                {type === 'pre' ? 'Pre-Test' : 'Post-Test'}
            </h2>
            <span className="bg-gray-100 px-3 py-1 rounded-full text-xs font-bold text-gray-500">Soal {testIndex + 1}/{questions.length}</span>
            </div>
            
            <h3 className="text-xl font-medium mb-6 text-gray-800">{currentQ.q}</h3>
            
            <div className="space-y-3 mb-8">
            {currentQ.options.map((opt: string, idx: number) => (
                <button
                key={idx}
                disabled={hasAnswered} 
                onClick={() => setTestAnswers({...testAnswers, [testIndex]: idx})}
                className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                    testAnswers[testIndex] === idx 
                    ? "border-green-500 bg-green-50 text-green-700 font-bold" 
                    : hasAnswered 
                      ? "border-gray-200 bg-gray-50 opacity-60 cursor-not-allowed" 
                      : "border-gray-100 hover:border-gray-300 hover:bg-gray-50"
                }`}
                >
                {opt}
                </button>
            ))}
            </div>

            <Button 
            className="w-full bg-green-600 hover:bg-green-700 h-12 text-lg"
            disabled={!hasAnswered}
            onClick={() => isLast ? handleTestSubmit(type) : handleTestNext(type)}
            >
            {isLast ? "Selesaikan Tes" : "Selanjutnya"}
            </Button>
        </div>
      </div>
    );
  };

  const renderChapterContent = () => {
    const isQuizPage = currentPage.type === 'quiz';
    const quizId = currentPage.id;
    const isLocked = answeredQuizzes[quizId] !== undefined;

    return (
      <div className="min-h-screen bg-gray-900 flex flex-col h-screen overflow-hidden">
        
        {/* HEADER */}
        <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between flex-shrink-0 z-20 shadow-sm">
            <button onClick={() => router.push("/dashboard")} className="text-gray-600 hover:text-green-600 flex items-center gap-2 transition-colors">
                <ArrowLeft className="w-4 h-4" /> <span className="text-sm font-bold hidden md:inline">Exit</span>
            </button>
            
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

            <div className="w-10"></div>
        </div>

        {/* MAIN CONTENT SPLIT */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
            
            {/* AREA KIRI: VISUAL */}
            <div className={`flex-1 flex items-center justify-center p-6 relative overflow-hidden ${isQuizPage ? 'bg-indigo-50' : 'bg-gray-100'}`}>
                <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle, #000 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
                
                <div key={currentPageIndex} className="text-center z-10 animate-in zoom-in duration-500 w-full flex flex-col items-center">
                    <div className="mb-6 filter drop-shadow-xl flex justify-center w-full">
                        {isQuizPage ? (
                            <div className="bg-white p-6 rounded-full shadow-lg">
                                <AlertCircle className="w-16 h-16 md:w-24 md:h-24 text-indigo-500 animate-pulse" />
                            </div>
                        ) : currentPage.image ? (
                            <div className="relative h-[40vh] w-auto md:h-auto md:w-[70%] max-w-md aspect-square rounded-2xl overflow-hidden shadow-2xl border-4 border-white/80">
                                <CldImage 
                                    width={800}
                                    height={800}
                                    src={currentPage.image} 
                                    alt={currentPage.title} 
                                    className="w-full h-full object-cover" 
                                />
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

            {/* AREA KANAN: KONTEN */}
            <div className={`${isQuizPage ? 'h-[75vh]' : 'h-[50vh]'} md:h-auto md:w-[500px] bg-white border-l border-gray-200 flex flex-col shadow-2xl z-10 transition-all duration-300`}>
            
                <div className="flex-1 overflow-y-auto p-6 md:p-8">
                    
                    <div className="flex items-center gap-2 mb-4">
                        <span className={`px-3 py-1 rounded-md text-[10px] md:text-xs font-bold uppercase ${isQuizPage ? 'bg-indigo-100 text-indigo-700' : 'bg-green-100 text-green-700'}`}>
                            {isQuizPage ? 'Uji Pemahaman' : 'Cerita'}
                        </span>
                    </div>

                    <div key={currentPageIndex} className="animate-in slide-in-from-right-4 fade-in duration-300">
                        <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-4 font-serif">{currentPage.title}</h2>
                        
                        {!isQuizPage && (
                            <p className="text-gray-700 leading-8 text-base md:text-lg font-serif">
                                {currentPage.content}
                            </p>
                        )}

                        {isQuizPage && currentPage.quizOptions && (
                            <div className="space-y-3 mt-4">
                                <p className="text-gray-800 font-medium text-lg mb-4">{currentPage.content}</p>
                                
                                {isLocked && (
                                   <div className="text-xs font-bold text-green-600 bg-green-50 p-2 rounded mb-3 flex items-center gap-2">
                                       <CheckCircle2 className="w-4 h-4"/> Kuis ini sudah Anda selesaikan.
                                   </div>
                                )}

                                {currentPage.quizOptions.map((opt: any, idx: number) => {
                                    let btnClass = "border-gray-200 hover:border-indigo-300 hover:bg-indigo-50";
                                    
                                    if (inlineQuizSelection === opt.id) {
                                         if (storyData?.isFeedbackEnabled) {
                                            if (inlineQuizFeedback === 'correct') btnClass = "border-green-500 bg-green-50 text-green-700 font-bold";
                                            else if (inlineQuizFeedback === 'incorrect') btnClass = "border-red-500 bg-red-50 text-red-700 font-bold";
                                            else btnClass = "border-indigo-500 bg-indigo-50 text-indigo-700";
                                        } else {
                                            btnClass = "border-indigo-500 bg-indigo-50 text-indigo-700 font-bold";
                                        }
                                    } else if (isLocked) {
                                        btnClass = "border-gray-200 bg-gray-50 opacity-50 cursor-not-allowed";
                                    }

                                    return (
                                        <button
                                            key={opt.id}
                                            onClick={() => handleInlineQuizSelect(opt.id)}
                                            disabled={inlineQuizFeedback !== null || isLocked}
                                            className={`w-full p-4 rounded-xl border-2 text-left text-sm md:text-base transition-all duration-200 flex justify-between items-center ${btnClass}`}
                                        >
                                            {opt.text}
                                            {storyData?.isFeedbackEnabled && inlineQuizSelection === opt.id && inlineQuizFeedback === 'correct' && <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0 ml-2"/>}
                                            {storyData?.isFeedbackEnabled && inlineQuizSelection === opt.id && inlineQuizFeedback === 'incorrect' && <XCircle className="w-5 h-5 text-red-600 shrink-0 ml-2"/>}
                                        </button>
                                    )
                                })}

                                {storyData?.isFeedbackEnabled && inlineQuizFeedback && inlineQuizSelection !== null && (
                                    (() => {
                                      const selectedOpt = currentPage.quizOptions.find((o: any) => o.id === inlineQuizSelection);
                                      //Jika Admin sudah menghapus opsi ini dari database, jangan render kotak feedback
                                      if (!selectedOpt) return null;
                                      return (
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
                                                          {selectedOpt.feedback}
                                                      </p>
                                                  </div>
                                              </div>
                                          </div>
                                      );
                                  })()
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* NAVIGASI BAWAH */}
                <div className="p-6 border-t border-gray-100 bg-gray-50/80 backdrop-blur flex space-x-3">
                    <Button
                        onClick={handlePrevPage}
                        disabled={!canGoBack()}
                        variant="ghost"
                        className={`flex-1 text-gray-500 hover:text-gray-900 ${!canGoBack() ? 'opacity-0 pointer-events-none' : ''}`}
                    >
                        <ChevronLeft className="w-4 h-4 mr-1" /> Kembali
                    </Button>
                    
                    <Button
                        onClick={handleNextPage}
                        disabled={isQuizPage && inlineQuizSelection === null && !isLocked} 
                        className={`flex-1 shadow-md text-white transition-all h-12 text-base ${
                            isQuizPage && !isLocked
                            ? 'bg-indigo-600 hover:bg-indigo-700' 
                            : 'bg-green-600 hover:bg-emerald-700'
                        }`}
                    >
                        {currentPageIndex === currentChapter.pages.length - 1 && currentChapterIndex === storyData.chapters.length - 1 ? (
                            <span className="flex items-center gap-2">Selesai <Trophy className="w-4 h-4"/></span>
                        ) : (
                            <span className="flex items-center gap-2">
                                {isQuizPage && inlineQuizSelection === null && !isLocked ? "Jawab Kuis" : "Selanjutnya"} 
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

  //MAIN RETURN
  if (phase === "completed") {
    return (
      <div className="min-h-screen bg-green-50 flex items-center justify-center p-4">
        <div className="bg-white p-8 md:p-12 rounded-3xl shadow-xl text-center max-w-lg w-full">
          <Trophy className="w-24 h-24 text-yellow-500 mx-auto mb-6 animate-bounce" />
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Petualangan Selesai!</h1>
          <p className="text-gray-500 mb-8">Terima kasih telah ikut belajar.</p>
          
          <div className="grid grid-cols-3 gap-3 md:gap-4 mb-8">
             <div className="bg-orange-50 p-4 md:p-5 rounded-2xl border border-orange-100 flex flex-col justify-center">
                <p className="text-[10px] md:text-xs text-orange-500 uppercase font-bold mb-1">Pre-Test</p>
                <p className="text-2xl md:text-3xl font-bold text-orange-700">{scores.pre !== null ? Number(scores.pre.toFixed(2)) : "-"}</p>
             </div>
             <div className="bg-indigo-50 p-4 md:p-5 rounded-2xl border border-indigo-100 flex flex-col justify-center">
                <p className="text-[10px] md:text-xs text-indigo-500 uppercase font-bold mb-1">Kuis Cerita</p>
                <p className="text-2xl md:text-3xl font-bold text-indigo-700">{scores.quiz !== null ? Number(scores.quiz.toFixed(2)) : "-"}</p>
             </div>
             <div className="bg-purple-50 p-4 md:p-5 rounded-2xl border border-purple-100 flex flex-col justify-center">
                <p className="text-[10px] md:text-xs text-purple-500 uppercase font-bold mb-1">Post-Test</p>
                <p className="text-2xl md:text-3xl font-bold text-purple-700">{scores.post !== null ? Number(scores.post.toFixed(2)) : "-"}</p>
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

  return renderTest(phase === 'pre-test' ? 'pre' : 'post');
}