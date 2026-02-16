"use client";

import { useState, ChangeEvent, MouseEvent } from "react";
import AdminRoute from "@/components/AdminRoute";
import { AdminSidebar } from "@/components/AdminSidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Plus, Save, Trash2, FileText, CheckSquare, Layers, 
  ChevronRight, X, Globe, Lock, Layout, List, Edit3, 
  Image as ImageIcon, UploadCloud 
} from "lucide-react";
import { useParams } from "next/navigation";
import { toast } from "sonner";

// TIPE DATA
interface QuizItem {
  id: string;
  question: string;
  options: { id: string; text: string; isCorrect: boolean }[];
}

interface StoryPage {
  id: string;
  type: "story" | "quiz";
  title: string;
  content: string;
  image?: string | null; 
  
  // Field Kuis
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

interface StoryData {
  id: string;
  title: string;
  status: "draft" | "published"; 
  preTest: QuizItem[];
  chapters: Chapter[];
  postTest: QuizItem[];
}

export default function StoryEditor() {
  const params = useParams();
  
  // Data Default
  const [story, setStory] = useState<StoryData>({
    id: params.id as string,
    title: "Judul Cerita Baru",
    status: "draft", 
    preTest: [],
    chapters: [
      { 
        id: "ch1", 
        title: "Chapter 1", 
        pages: [] 
      }
    ],
    postTest: []
  });

  // UI Default States
  const [activeMode, setActiveMode] = useState<"pre-test" | "post-test" | "chapter">("chapter");
  const [activeChapterId, setActiveChapterId] = useState<string>(story.chapters[0]?.id || "");
  const [activePageId, setActivePageId] = useState<string | null>(null);
  const [mobileTab, setMobileTab] = useState<"structure" | "list" | "editor">("structure");

  const currentChapter = story.chapters.find(c => c.id === activeChapterId);
  const currentPage = currentChapter?.pages.find(p => p.id === activePageId);

  // HANDLERS untuk chapter
  const handleAddChapter = () => {
    const newChapter: Chapter = {
      id: Date.now().toString(),
      title: `Chapter ${story.chapters.length + 1}`,
      pages: []
    };
    setStory({ ...story, chapters: [...story.chapters, newChapter] });
    setActiveChapterId(newChapter.id);
    setActiveMode("chapter");
    setActivePageId(null);
    setMobileTab("list");
  };

  const handleDeleteChapter = (chId: string) => {
    if (confirm("Hapus chapter ini beserta isinya?")) {
        setStory({ ...story, chapters: story.chapters.filter(c => c.id !== chId) });
        if (activeChapterId === chId) setActiveChapterId(story.chapters[0]?.id || "");
    }
  };

  // HANDLERS untuk pre-test & post-test
  const handleAddTestQuestion = (target: "pre" | "post") => {
    const newQ: QuizItem = {
      id: Date.now().toString(),
      question: "",
      options: [{ id: "0", text: "", isCorrect: true }, { id: "1", text: "", isCorrect: false }, { id: "2", text: "", isCorrect: false }, { id: "3", text: "", isCorrect: false }]
    };
    if (target === "pre") setStory({ ...story, preTest: [...story.preTest, newQ] });
    else setStory({ ...story, postTest: [...story.postTest, newQ] });
  };

  const updateTestQuestion = (target: "pre" | "post", qId: string, field: string, val: string) => {
    const list = target === "pre" ? story.preTest : story.postTest;
    const newList = list.map(q => q.id === qId ? { ...q, [field]: val } : q);
    if (target === "pre") setStory({ ...story, preTest: newList });
    else setStory({ ...story, postTest: newList });
  };

  const updateTestOption = (target: "pre" | "post", qId: string, optIdx: number, val: string) => {
    const list = target === "pre" ? story.preTest : story.postTest;
    const newList = list.map(q => {
        if (q.id === qId) {
            const newOpts = [...q.options];
            newOpts[optIdx].text = val;
            return { ...q, options: newOpts };
        }
        return q;
    });
    if (target === "pre") setStory({ ...story, preTest: newList });
    else setStory({ ...story, postTest: newList });
  };

  const setTestCorrectAnswer = (target: "pre" | "post", qId: string, optIdx: number) => {
    const list = target === "pre" ? story.preTest : story.postTest;
    const newList = list.map(q => {
        if (q.id === qId) {
            const newOpts = q.options.map((o, i) => ({ ...o, isCorrect: i === optIdx }));
            return { ...q, options: newOpts };
        }
        return q;
    });
    if (target === "pre") setStory({ ...story, preTest: newList });
    else setStory({ ...story, postTest: newList });
  };

  const deleteTestQuestion = (target: "pre" | "post", qId: string) => {
    if (target === "pre") setStory({ ...story, preTest: story.preTest.filter(q => q.id !== qId) });
    else setStory({ ...story, postTest: story.postTest.filter(q => q.id !== qId) });
  };


  // HANDLERS untuk halaman story/kuis dalam chapter
  const handleAddPage = (type: "story" | "quiz") => {
    if (!activeChapterId) return;
    const newPage: StoryPage = {
      id: Date.now().toString(),
      type,
      title: type === "story" ? "Halaman Baru" : "Kuis Baru",
      content: "",
      image: null, // Init image
      quizOptions: type === 'quiz' ? ["", "", "", ""] : undefined,
      quizAns: type === 'quiz' ? 0 : undefined,
      quizFeedback: type === 'quiz' ? { correct: "Jawaban Benar!", incorrect: "Kurang Tepat." } : undefined
    };

    setStory(prev => ({
      ...prev,
      chapters: prev.chapters.map(c => 
        c.id === activeChapterId ? { ...c, pages: [...c.pages, newPage] } : c
      )
    }));
    setActivePageId(newPage.id);
    setMobileTab("editor"); 
  };

  const updatePage = (field: keyof StoryPage, val: any) => {
    if (!activeChapterId || !activePageId) return;
    setStory(prev => ({
        ...prev,
        chapters: prev.chapters.map(c => 
            c.id === activeChapterId ? {
                ...c,
                pages: c.pages.map(p => p.id === activePageId ? { ...p, [field]: val } : p)
            } : c
        )
    }));
  };

  // Logic Upload Gambar
  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // 1. Validasi Ukuran (2MB = 2 * 1024 * 1024 bytes)
    if (file.size > 2 * 1024 * 1024) {
      toast.error("Ukuran file terlalu besar! Maksimal 2MB.");
      e.target.value = ""; // Reset input
      return;
    }

    // 2. Simulasi Upload (Create Object URL untuk Preview)
    const imageUrl = URL.createObjectURL(file);
    updatePage('image', imageUrl);
    toast.success("Gambar berhasil diunggah!");
  };

  const handleRemoveImage = () => {
    updatePage('image', null);
  };

  // Handler Opsi Kuis
  const updateQuizOption = (optIdx: number, val: string) => {
    if (!currentPage || !currentPage.quizOptions) return;
    const newOpts = [...currentPage.quizOptions];
    newOpts[optIdx] = val;
    updatePage('quizOptions', newOpts);
  };

  const updateQuizFeedback = (type: 'correct' | 'incorrect', val: string) => {
    if (!currentPage || !currentPage.quizFeedback) return;
    updatePage('quizFeedback', { ...currentPage.quizFeedback, [type]: val });
  };

  const handleDeletePage = (pId: string) => {
     if(confirm("Hapus halaman ini?")) {
        setStory(prev => ({
            ...prev,
            chapters: prev.chapters.map(c => c.id === activeChapterId ? { ...c, pages: c.pages.filter(p => p.id !== pId) } : c)
        }));
        if(activePageId === pId) setActivePageId(null);
     }
  };

  const handleSave = () => {
    console.log("FINAL JSON:", JSON.stringify(story, null, 2));
    toast.success(`Cerita berhasil disimpan sebagai ${story.status.toUpperCase()}!`);
  };

  return (
    <AdminRoute>
      <div className="flex h-screen bg-gray-50 overflow-hidden">
        {/* Sidebar Admin (Hidden Mobile) */}
        <div className="hidden md:block">
            <AdminSidebar />
        </div>

        <main className="flex-1 md:ml-64 flex flex-col h-screen w-full">
          
          {/* HEADER */}
          <div className="bg-white border-b border-gray-200 px-4 md:px-6 py-3 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shadow-sm z-20 shrink-0">
            <div className="flex flex-col w-full md:w-auto">
              <span className="text-[10px] text-gray-400 uppercase tracking-widest font-bold flex items-center gap-1">
                 Story Editor <ChevronRight className="w-3 h-3"/> {activeMode}
              </span>
              <Input 
                value={story.title} 
                onChange={(e: ChangeEvent<HTMLInputElement>) => setStory({...story, title: e.target.value})}
                className="text-lg md:text-xl font-bold border-none px-0 h-8 focus-visible:ring-0 bg-transparent w-full md:w-96"
                placeholder="Judul Cerita..."
              />
            </div>

            <div className="flex items-center gap-2 w-full md:w-auto">
                <div className="relative">
                    <select 
                        value={story.status}
                        onChange={(e) => setStory({...story, status: e.target.value as "draft" | "published"})}
                        className={`appearance-none h-9 pl-9 pr-8 rounded-md text-sm font-medium border focus:ring-2 focus:ring-offset-1 cursor-pointer transition-all ${
                            story.status === 'published' 
                            ? 'bg-green-50 border-green-200 text-green-700 focus:ring-green-500' 
                            : 'bg-gray-50 border-gray-200 text-gray-600 focus:ring-gray-400'
                        }`}
                    >
                        <option value="draft">Draf (Pribadi)</option>
                        <option value="published">Terbit (Publik)</option>
                    </select>
                    <div className="absolute left-2.5 top-2.5 pointer-events-none">
                        {story.status === 'published' ? <Globe className="w-4 h-4 text-green-600"/> : <Lock className="w-4 h-4 text-gray-500"/>}
                    </div>
                </div>

                <Button onClick={handleSave} className="bg-green-600 hover:bg-green-700 gap-2 flex-1 md:flex-none">
                    <Save className="w-4 h-4" /> <span className="hidden md:inline">Simpan</span>
                </Button>
            </div>
          </div>

          {/* CONTENT AREA */}
          <div className="flex-1 flex overflow-hidden relative">
            
            {/* 1. KOLOM STRUKTUR */}
            <div className={`${mobileTab === 'structure' ? 'flex' : 'hidden'} md:flex flex-col w-full md:w-72 bg-white border-r border-gray-200 overflow-y-auto`}>
              <div className="p-4 space-y-6">
                <div>
                  <h3 className="text-xs font-bold text-gray-400 uppercase mb-2 px-2">Asesmen Global</h3>
                  <div className="space-y-1">
                    <button
                      onClick={() => { setActiveMode("pre-test"); setActivePageId(null); setMobileTab("list"); }}
                      className={`w-full text-left px-3 py-3 rounded-md text-sm font-medium flex items-center gap-3 transition-colors ${activeMode === 'pre-test' ? 'bg-orange-50 text-orange-700 border border-orange-200' : 'text-gray-600 hover:bg-gray-50 border border-transparent'}`}
                    >
                      <CheckSquare className="w-4 h-4" /> Pre-Test
                      <span className="ml-auto text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">{story.preTest.length}</span>
                    </button>
                    <button
                      onClick={() => { setActiveMode("post-test"); setActivePageId(null); setMobileTab("list"); }}
                      className={`w-full text-left px-3 py-3 rounded-md text-sm font-medium flex items-center gap-3 transition-colors ${activeMode === 'post-test' ? 'bg-purple-50 text-purple-700 border border-purple-200' : 'text-gray-600 hover:bg-gray-50 border border-transparent'}`}
                    >
                      <FileText className="w-4 h-4" /> Post-Test
                      <span className="ml-auto text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">{story.postTest.length}</span>
                    </button>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center px-2 mb-2">
                    <h3 className="text-xs font-bold text-gray-400 uppercase">Daftar Chapter</h3>
                    <Button variant="ghost" size="icon" className="h-6 w-6 hover:bg-blue-50 hover:text-blue-600" onClick={handleAddChapter}><Plus className="w-3 h-3"/></Button>
                  </div>
                  <div className="space-y-1">
                    {story.chapters.map((chapter, idx) => (
                      <div key={chapter.id} className="group relative">
                          <button
                            onClick={() => { setActiveMode("chapter"); setActiveChapterId(chapter.id); setActivePageId(null); setMobileTab("list"); }}
                            className={`w-full text-left px-3 py-3 rounded-md text-sm font-medium flex items-center gap-3 transition-all ${activeMode === 'chapter' && activeChapterId === chapter.id ? "bg-blue-50 text-blue-700 border border-blue-200 shadow-sm" : "text-gray-600 hover:bg-gray-50 border border-transparent"}`}
                          >
                            <div className={`w-6 h-6 rounded flex items-center justify-center text-xs border font-bold ${activeMode === 'chapter' && activeChapterId === chapter.id ? 'bg-white border-blue-200 text-blue-600' : 'bg-gray-50 text-gray-400'}`}>
                              {idx + 1}
                            </div>
                            <span className="truncate flex-1">{chapter.title}</span>
                          </button>
                          <button onClick={(e: MouseEvent<HTMLButtonElement>) => { e.stopPropagation(); handleDeleteChapter(chapter.id); }} className="absolute right-2 top-3 md:opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 transition-opacity">
                            <X className="w-3 h-3" />
                          </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* 2. KOLOM TENGAH */}
            <div className={`${mobileTab === 'list' ? 'flex' : 'hidden'} md:flex flex-col w-full md:w-80 bg-gray-50 border-r border-gray-200 overflow-y-auto`}>
                {activeMode !== 'chapter' ? (
                    <div className="p-4 space-y-4">
                        <div className={`p-4 rounded-lg border text-sm ${activeMode === 'pre-test' ? 'bg-orange-100 border-orange-200 text-orange-800' : 'bg-purple-100 border-purple-200 text-purple-800'}`}>
                            Mode: <b>{activeMode === 'pre-test' ? 'Pre-Test' : 'Post-Test'}</b>
                        </div>
                        {(activeMode === 'pre-test' ? story.preTest : story.postTest).map((q, idx) => (
                            <div key={q.id} className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm relative group">
                                <div className="flex justify-between mb-2">
                                    <span className="text-xs font-bold text-gray-400">SOAL {idx + 1}</span>
                                    <button onClick={() => deleteTestQuestion(activeMode === 'pre-test' ? 'pre' : 'post', q.id)} className="text-red-400 hover:text-red-600"><Trash2 className="w-3 h-3"/></button>
                                </div>
                                <Input value={q.question} onChange={(e: ChangeEvent<HTMLInputElement>) => updateTestQuestion(activeMode === 'pre-test' ? 'pre' : 'post', q.id, 'question', e.target.value)} placeholder="Tulis pertanyaan..." className="mb-3 font-medium border-gray-200 focus:border-blue-500" />
                                <div className="space-y-2">
                                    {q.options.map((opt, i) => (
                                        <div key={opt.id} className="flex items-center gap-2">
                                            <input type="radio" name={`correct-${q.id}`} checked={opt.isCorrect} onChange={() => setTestCorrectAnswer(activeMode === 'pre-test' ? 'pre' : 'post', q.id, i)} className="accent-green-600 cursor-pointer w-4 h-4 shrink-0" />
                                            <Input value={opt.text} onChange={(e: ChangeEvent<HTMLInputElement>) => updateTestOption(activeMode === 'pre-test' ? 'pre' : 'post', q.id, i, e.target.value)} placeholder={`Opsi ${String.fromCharCode(65 + i)}`} className="h-8 text-sm" />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                        <Button onClick={() => handleAddTestQuestion(activeMode === 'pre-test' ? 'pre' : 'post')} variant="outline" className="w-full border-dashed h-12"><Plus className="w-4 h-4 mr-2" /> Tambah Soal</Button>
                    </div>
                ) : (
                    currentChapter && (
                        <div className="p-4 space-y-4">
                            <div className="bg-white p-4 rounded-lg border border-blue-200 shadow-sm">
                                <label className="text-[10px] font-bold text-blue-500 uppercase">Judul Chapter</label>
                                <Input value={currentChapter.title} onChange={(e: ChangeEvent<HTMLInputElement>) => setStory(prev => ({...prev, chapters: prev.chapters.map(c => c.id === activeChapterId ? {...c, title: e.target.value} : c)}))} className="font-bold border-none px-0 h-auto focus-visible:ring-0 text-gray-800" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-400 uppercase px-1">Timeline Halaman</label>
                                {currentChapter.pages.map((page, idx) => (
                                    <div key={page.id} onClick={() => { setActivePageId(page.id); setMobileTab("editor"); }} className={`p-3 bg-white border rounded-lg cursor-pointer hover:shadow-md transition-all flex items-center gap-3 group ${activePageId === page.id ? 'ring-2 ring-blue-500 border-blue-500 z-10' : 'border-gray-200'}`}>
                                        <div className={`w-6 h-6 rounded flex items-center justify-center text-[10px] font-bold border shrink-0 ${page.type === 'story' ? 'bg-blue-50 text-blue-600 border-blue-100' : 'bg-yellow-50 text-yellow-600 border-yellow-100'}`}>{page.type === 'story' ? 'S' : 'Q'}</div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-0.5">{page.type}</p>
                                            <p className="text-sm font-medium truncate">{page.title}</p>
                                        </div>
                                        <button onClick={(e: MouseEvent<HTMLButtonElement>) => {e.stopPropagation(); handleDeletePage(page.id)}} className="md:opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 p-1"><Trash2 className="w-3 h-3"/></button>
                                        {activePageId === page.id && <ChevronRight className="w-4 h-4 text-blue-500"/>}
                                    </div>
                                ))}
                            </div>
                            <div className="grid grid-cols-2 gap-2 pt-2">
                                <Button onClick={() => handleAddPage('story')} variant="outline" size="sm" className="text-blue-600 border-blue-200 hover:bg-blue-50 h-10">+ Story</Button>
                                <Button onClick={() => handleAddPage('quiz')} variant="outline" size="sm" className="text-yellow-600 border-yellow-200 hover:bg-yellow-50 h-10">+ Quiz</Button>
                            </div>
                        </div>
                    )
                )}
            </div>

            {/* 3. KOLOM KANAN (EDITOR) */}
            <div className={`${mobileTab === 'editor' ? 'flex' : 'hidden'} md:flex flex-1 bg-white p-4 md:p-8 overflow-y-auto`}>
               {activeMode === 'chapter' && currentPage ? (
                   <div className="w-full max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20 md:pb-0">
                       <div className="mb-6 flex items-center gap-3 pb-4 border-b">
                           <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${currentPage.type === 'story' ? 'bg-blue-100 text-blue-700' : 'bg-yellow-100 text-yellow-700'}`}>
                               {currentPage.type === 'story' ? 'Story Page' : 'Intermezzo Quiz'}
                           </span>
                           <span className="text-gray-400">|</span>
                           <span className="text-sm text-gray-500">ID: {currentPage.id}</span>
                       </div>

                       <div className="space-y-6">
                           <div>
                               <label className="block text-sm font-medium text-gray-700 mb-1">Judul Halaman</label>
                               <Input value={currentPage.title} onChange={(e: ChangeEvent<HTMLInputElement>) => updatePage('title', e.target.value)} className="text-lg font-bold" />
                           </div>

                           {/* FITUR UPLOAD GAMBAR (HANYA UNTUK STORY) */}
                           {currentPage.type === 'story' && (
                             <div className="bg-gray-50 border-2 border-dashed border-gray-200 rounded-xl p-6 text-center hover:bg-gray-100 transition-colors">
                                <label className="block text-sm font-bold text-gray-500 mb-2">Ilustrasi Cerita (Opsional)</label>
                                
                                {currentPage.image ? (
                                  <div className="relative group inline-block">
                                    <img src={currentPage.image} alt="Preview" className="h-48 object-cover rounded-lg shadow-md border" />
                                    <button 
                                      onClick={handleRemoveImage}
                                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-md hover:bg-red-600 transition-colors"
                                    >
                                      <X className="w-4 h-4" />
                                    </button>
                                  </div>
                                ) : (
                                  <div>
                                    <label htmlFor="image-upload" className="cursor-pointer flex flex-col items-center justify-center gap-2">
                                      <div className="bg-white p-3 rounded-full shadow-sm">
                                        <UploadCloud className="w-6 h-6 text-blue-500" />
                                      </div>
                                      <span className="text-sm text-blue-600 font-medium hover:underline">Klik untuk upload gambar</span>
                                      <span className="text-xs text-gray-400">Maks. 2MB (JPG, PNG)</span>
                                    </label>
                                    <input 
                                      id="image-upload" 
                                      type="file" 
                                      accept="image/*" 
                                      className="hidden" 
                                      onChange={handleImageUpload}
                                    />
                                  </div>
                                )}
                             </div>
                           )}

                           <div>
                               <label className="block text-sm font-medium text-gray-700 mb-1">{currentPage.type === 'story' ? 'Isi Cerita' : 'Pertanyaan Kuis'}</label>
                               <textarea 
                                   value={currentPage.content} 
                                   onChange={(e: ChangeEvent<HTMLTextAreaElement>) => updatePage('content', e.target.value)}
                                   className="flex min-h-[150px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-y"
                                   placeholder={currentPage.type === 'story' ? "Tulis narasi cerita disini..." : "Tulis pertanyaan kuis..."}
                               />
                           </div>

                           {/* FORM QUIZ/KUIS */}
                           {currentPage.type === 'quiz' && (
                               <div className="bg-yellow-50/50 border border-yellow-100 rounded-xl p-4 md:p-6 space-y-6">
                                   <div>
                                       <label className="block text-sm font-bold text-gray-700 mb-3 uppercase tracking-wider">Opsi Jawaban</label>
                                       <div className="space-y-3">
                                           {currentPage.quizOptions?.map((opt, i) => (
                                               <div key={i} className="flex items-center gap-3">
                                                   <input type="radio" name="quiz-ans" checked={currentPage.quizAns === i} onChange={() => updatePage('quizAns', i)} className="w-4 h-4 accent-green-600 cursor-pointer shrink-0" title="Tandai sebagai jawaban benar" />
                                                   <div className="flex-1">
                                                       <Input value={opt} onChange={(e: ChangeEvent<HTMLInputElement>) => updateQuizOption(i, e.target.value)} placeholder={`Opsi ${String.fromCharCode(65 + i)}`} className={`bg-white ${currentPage.quizAns === i ? 'border-green-500 ring-1 ring-green-500' : ''}`} />
                                                   </div>
                                               </div>
                                           ))}
                                       </div>
                                       <p className="text-xs text-gray-500 mt-2 ml-7">* Pilih radio button untuk menentukan kunci jawaban.</p>
                                   </div>
                                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                       <div>
                                           <label className="block text-xs font-bold text-green-700 mb-1">Feedback Benar</label>
                                           <textarea value={currentPage.quizFeedback?.correct} onChange={(e: ChangeEvent<HTMLTextAreaElement>) => updateQuizFeedback('correct', e.target.value)} className="flex min-h-[80px] w-full rounded-md border border-green-200 bg-green-50 px-3 py-2 text-sm placeholder:text-green-700/50 focus:outline-none focus:ring-2 focus:ring-green-500" placeholder="Pujian jika jawaban benar..." />
                                       </div>
                                       <div>
                                           <label className="block text-xs font-bold text-red-700 mb-1">Feedback Salah</label>
                                           <textarea value={currentPage.quizFeedback?.incorrect} onChange={(e: ChangeEvent<HTMLTextAreaElement>) => updateQuizFeedback('incorrect', e.target.value)} className="flex min-h-[80px] w-full rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm placeholder:text-red-700/50 focus:outline-none focus:ring-2 focus:ring-red-500" placeholder="Penjelasan jika jawaban salah..." />
                                       </div>
                                   </div>
                               </div>
                           )}
                       </div>
                   </div>
               ) : (
                   <div className="h-full flex flex-col items-center justify-center text-gray-300 p-8 text-center">
                       <Layers className="w-16 h-16 mb-4 opacity-20" />
                       <p className="text-lg font-medium text-gray-400">Tab ini untuk mengedit story/kuis chapter.</p>
                       <Button variant="outline" className="mt-4 md:hidden" onClick={() => setMobileTab('list')}>Buka Daftar</Button>
                   </div>
               )}
            </div>
          </div>

          {/* MOBILE TAB BAR */}
          <div className="md:hidden border-t border-gray-200 bg-white flex justify-around p-2 pb-safe z-30 shrink-0">
             <button onClick={() => setMobileTab("structure")} className={`flex flex-col items-center p-2 rounded-lg w-full transition-colors ${mobileTab === 'structure' ? 'text-blue-600 bg-blue-50' : 'text-gray-400 hover:bg-gray-50'}`}><Layout className="w-5 h-5 mb-1" /><span className="text-[10px] font-bold">STRUKTUR</span></button>
             <button onClick={() => setMobileTab("list")} className={`flex flex-col items-center p-2 rounded-lg w-full transition-colors ${mobileTab === 'list' ? 'text-blue-600 bg-blue-50' : 'text-gray-400 hover:bg-gray-50'}`}><List className="w-5 h-5 mb-1" /><span className="text-[10px] font-bold">DAFTAR</span></button>
             <button onClick={() => setMobileTab("editor")} className={`flex flex-col items-center p-2 rounded-lg w-full transition-colors ${mobileTab === 'editor' ? 'text-blue-600 bg-blue-50' : 'text-gray-400 hover:bg-gray-50'}`}><Edit3 className="w-5 h-5 mb-1" /><span className="text-[10px] font-bold">EDITOR</span></button>
          </div>

        </main>
      </div>
    </AdminRoute>
  );
}