"use client";

import { useState, ChangeEvent, MouseEvent, useEffect } from "react";
import AdminRoute from "@/components/AdminRoute";
import { AdminSidebar } from "@/components/AdminSidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Plus, Save, Trash2, FileText, CheckSquare, Layers, 
  ChevronRight, X, Globe, Lock, Layout, List, Edit3, 
  Image as ImageIcon, UploadCloud, Award, ExternalLink, Loader2
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";

//TIPE DATA
interface TestItem {
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
  quizOptions?: { text: string; feedback: string }[];
  quizAns?: number;
}

interface Chapter {
  id: string;
  title: string;
  pages: StoryPage[];
}

interface StoryData {
  id: string;
  number: string;
  title: string;
  status: "draft" | "published";
  coverImage?: string | null;
  certificateImage?: string | null;
  preTest: TestItem[];
  chapters: Chapter[];
  postTest: TestItem[];
}

export default function StoryEditor() {
  const params = useParams();
  const router = useRouter();
  
  //State Loading
  const [isFetching, setIsFetching] = useState(true);

  //Data Default
  const [story, setStory] = useState<StoryData>({
    id: params.id as string,
    number: "",
    title: "Memuat...",
    status: "draft", 
    coverImage: null,
    certificateImage: null,
    preTest: [],
    chapters: [],
    postTest: []
  });

  //UI Default
  const [activeMode, setActiveMode] = useState<"settings" | "pre-test" | "post-test" | "chapter">("settings");
  const [activeChapterId, setActiveChapterId] = useState<string>("");
  const [activePageId, setActivePageId] = useState<string | null>(null);
  const [mobileTab, setMobileTab] = useState<"structure" | "list" | "editor">("structure");

  //Menarik data
  useEffect(() => {
    const fetchStoryData = async () => {
      try {
        const res = await fetch(`/api/stories/${params.id}`);
        const result = await res.json();
        
        if (result.success) {
          const dbData = result.data;
          
          setStory({
            id: dbData.id,
            number: dbData.number || "",
            title: dbData.title,
            status: dbData.status || "draft",
            coverImage: dbData.cover_image,
            certificateImage: dbData.certificate_image,
            preTest: dbData.test_items.filter((a: any) => a.type === 'PRE_TEST').map((a: any) => ({
              id: a.id, question: a.question,
              options: a.test_options.map((o: any) => ({ id: o.id, text: o.text, isCorrect: o.is_correct }))
            })),
            postTest: dbData.test_items.filter((a: any) => a.type === 'POST_TEST').map((a: any) => ({
              id: a.id, question: a.question,
              options: a.test_options.map((o: any) => ({ id: o.id, text: o.text, isCorrect: o.is_correct }))
            })),
            chapters: dbData.chapters.map((c: any) => ({
              id: c.id, title: c.title,
              pages: c.pages.map((p: any) => ({
                id: p.id, type: p.type, title: p.title, content: p.content || "", image: p.image,
                quizAns: p.type === 'quiz' ? p.page_quiz_options.findIndex((qo: any) => qo.is_correct) : undefined,
                quizOptions: p.type === 'quiz' ? p.page_quiz_options.map((qo: any) => ({ text: qo.text, feedback: qo.feedback || "" })) : undefined
              }))
            }))
          });

          if (dbData.chapters.length > 0) setActiveChapterId(dbData.chapters[0].id);
        } else {
          toast.error("Gagal memuat cerita", { description: result.message });
          router.push('/admin/stories'); 
        }
      } catch (error) {
        toast.error("Ralat Sistem", { description: "Gagal terhubung ke server." });
      } finally {
        setIsFetching(false);
      }
    };

    if (params.id) fetchStoryData();
  }, [params.id, router]);

  //FUNGSI UPLOAD KE CLOUDINARY
  const uploadToCloudinary = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('file', file);
    
    //Memanggil dari .env.local
    const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;

    if (!uploadPreset || !cloudName) {
      throw new Error("Konfigurasi Cloudinary belum diatur di file .env.local");
    }

    formData.append('upload_preset', uploadPreset); 
    formData.append('cloud_name', cloudName); 

    const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) throw new Error("Gagal mengunggah gambar ke Cloudinary.");
    const data = await response.json();
    return data.secure_url; 
  };

  //Fitur Menyimpan Data
  const handleSave = () => {
    //Validasi
    if (!story.number.trim() || !story.title.trim()) {
      toast.error("Data Tidak Lengkap", { description: "Nomor dan Judul cerita tidak boleh kosong." });
      return;
    }

    const savePromise = new Promise(async (resolve, reject) => {
      try {
        const payload = {
          number: story.number,
          title: story.title,
          status: story.status,
          coverImage: story.coverImage,
          certificateImage: story.certificateImage,
          preTest: story.preTest,
          postTest: story.postTest,
          chapters: story.chapters
        };

        const res = await fetch(`/api/stories/${story.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        const result = await res.json();
        if (result.success) resolve(result);
        else reject(new Error(result.message));
      } catch (error) {
        reject(error);
      }
    });

    toast.promise(savePromise, {
      loading: 'Menyimpan cerita...',
      success: `Cerita "${story.title}" berhasil disimpan!`,
      error: (err: any) => `${err.message}`,
    });
  };

  const currentChapter = story.chapters.find(c => c.id === activeChapterId);
  const currentPage = currentChapter?.pages.find(p => p.id === activePageId);

  //HANDLER CLOUDINARY
  const handleStoryMediaUpload = async (e: ChangeEvent<HTMLInputElement>, field: 'coverImage' | 'certificateImage') => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) { toast.error("Ukuran maksimal 2MB."); e.target.value = ""; return; }
    
    const uploadPromise = uploadToCloudinary(file).then((imageUrl) => {
      setStory(prev => ({ ...prev, [field]: imageUrl }));
    });

    toast.promise(uploadPromise, {
      loading: `Mengunggah ${field === 'coverImage' ? 'Cover' : 'Sertifikat'} ke server...`,
      success: `${field === 'coverImage' ? 'Cover' : 'Sertifikat'} berhasil diunggah!`,
      error: "Gagal mengunggah gambar."
    });
  };

  const handleImageUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) { toast.error("Maksimal 2MB."); e.target.value = ""; return; }
    
    const uploadPromise = uploadToCloudinary(file).then((imageUrl) => {
      updatePage('image', imageUrl); 
    });

    toast.promise(uploadPromise, {
      loading: 'Mengunggah gambar ilustrasi ke server...',
      success: 'Gambar berhasil diunggah!',
      error: "Gagal mengunggah gambar."
    });
  };

  const handleRemoveStoryMedia = (field: 'coverImage' | 'certificateImage') => {
    setStory(prev => ({ ...prev, [field]: null }));
  };

  const handleAddChapter = () => {
    const newChapter: Chapter = { id: Date.now().toString(), title: `Chapter ${story.chapters.length + 1}`, pages: [] };
    setStory({ ...story, chapters: [...story.chapters, newChapter] });
    setActiveChapterId(newChapter.id); setActiveMode("chapter"); setActivePageId(null); setMobileTab("list");
  };

  const handleDeleteChapter = (chId: string) => {
    if (confirm("Hapus chapter ini beserta isinya?")) {
        setStory({ ...story, chapters: story.chapters.filter(c => c.id !== chId) });
        if (activeChapterId === chId) setActiveChapterId(story.chapters[0]?.id || "");
    }
  };

  const handleAddTestQuestion = (target: "pre" | "post") => {
    const newQ: TestItem = {
      id: Date.now().toString(), question: "",
      options: [ { id: "0", text: "", isCorrect: true }, { id: "1", text: "", isCorrect: false }, { id: "2", text: "", isCorrect: false }, { id: "3", text: "", isCorrect: false }, { id: "4", text: "", isCorrect: false } ]
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
            const newOpts = [...q.options]; newOpts[optIdx].text = val;
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

  const handleAddPage = (type: "story" | "quiz") => {
    if (!activeChapterId) return;
    const newPage: StoryPage = {
      id: Date.now().toString(), type, title: type === "story" ? "Halaman Baru" : "Kuis Baru", content: "", image: null,
      quizOptions: type === 'quiz' ? [ { text: "", feedback: "" }, { text: "", feedback: "" }, { text: "", feedback: "" }, { text: "", feedback: "" }, { text: "", feedback: "" } ] : undefined,
      quizAns: type === 'quiz' ? 0 : undefined
    };
    setStory(prev => ({
      ...prev, chapters: prev.chapters.map(c => c.id === activeChapterId ? { ...c, pages: [...c.pages, newPage] } : c)
    }));
    setActivePageId(newPage.id); setMobileTab("editor"); 
  };

  const updatePage = (field: keyof StoryPage, val: any) => {
    if (!activeChapterId || !activePageId) return;
    setStory(prev => ({
        ...prev, chapters: prev.chapters.map(c => c.id === activeChapterId ? { ...c, pages: c.pages.map(p => p.id === activePageId ? { ...p, [field]: val } : p) } : c)
    }));
  };

  const updateQuizOption = (optIdx: number, field: 'text' | 'feedback', val: string) => {
    if (!currentPage || !currentPage.quizOptions) return;
    const newOpts = [...currentPage.quizOptions];
    newOpts[optIdx] = { ...newOpts[optIdx], [field]: val };
    updatePage('quizOptions', newOpts);
  };

  const handleDeletePage = (pId: string) => {
     if(confirm("Hapus halaman ini?")) {
        setStory(prev => ({ ...prev, chapters: prev.chapters.map(c => c.id === activeChapterId ? { ...c, pages: c.pages.filter(p => p.id !== pId) } : c) }));
        if(activePageId === pId) setActivePageId(null);
     }
  };

  //UI Loading
  if (isFetching) {
    return (
      <AdminRoute>
        <div className="flex h-screen items-center justify-center bg-gray-50">
           <div className="text-center">
              <Loader2 className="w-10 h-10 animate-spin text-green-600 mx-auto mb-4" />
              <h2 className="text-lg font-bold text-gray-700">Membuka Editor...</h2>
              <p className="text-gray-500 text-sm">Menarik struktur cerita dari database</p>
           </div>
        </div>
      </AdminRoute>
    );
  }

  return (
    <AdminRoute>
      <div className="flex h-screen bg-gray-50 overflow-hidden">
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
            
            {/* 1. KOLOM STRUKTUR (SIDEBAR KIRI) */}
            <div className={`${mobileTab === 'structure' ? 'flex' : 'hidden'} md:flex flex-col w-full md:w-72 bg-white border-r border-gray-200 overflow-y-auto`}>
              <div className="p-4 space-y-6">
                
                {/* PENGATURAN UMUM */}
                <div>
                  <h3 className="text-xs font-bold text-gray-400 uppercase mb-2 px-2">Pengaturan Umum</h3>
                  <button
                    onClick={() => { setActiveMode("settings"); setActivePageId(null); setMobileTab("editor"); }}
                    className={`w-full text-left px-3 py-3 rounded-md text-sm font-medium flex items-center gap-3 transition-colors ${activeMode === 'settings' ? 'bg-indigo-50 text-indigo-700 border border-indigo-200 shadow-sm' : 'text-gray-600 hover:bg-gray-50 border border-transparent'}`}
                  >
                    <FileText className="w-4 h-4" /> Info, Cover, Sertifikat
                  </button>
                </div>

                {/* Pretest-Posttest */}
                <div>
                  <h3 className="text-xs font-bold text-gray-400 uppercase mb-2 px-2">Asesmen Global</h3>
                  <div className="space-y-1">
                    <button
                      onClick={() => { setActiveMode("pre-test"); setActivePageId(null); setMobileTab("list"); }}
                      className={`w-full text-left px-3 py-3 rounded-md text-sm font-medium flex items-center gap-3 transition-colors ${activeMode === 'pre-test' ? 'bg-orange-50 text-orange-700 border border-orange-200 shadow-sm' : 'text-gray-600 hover:bg-gray-50 border border-transparent'}`}
                    >
                      <CheckSquare className="w-4 h-4" /> Pre-Test
                      <span className="ml-auto text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">{story.preTest.length}</span>
                    </button>
                    <button
                      onClick={() => { setActiveMode("post-test"); setActivePageId(null); setMobileTab("list"); }}
                      className={`w-full text-left px-3 py-3 rounded-md text-sm font-medium flex items-center gap-3 transition-colors ${activeMode === 'post-test' ? 'bg-purple-50 text-purple-700 border border-purple-200 shadow-sm' : 'text-gray-600 hover:bg-gray-50 border border-transparent'}`}
                    >
                      <FileText className="w-4 h-4" /> Post-Test
                      <span className="ml-auto text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">{story.postTest.length}</span>
                    </button>
                  </div>
                </div>

                {/* Chapter */}
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

            {/* 2. KOLOM TENGAH (PRE-TEST, POST-TEST, CHAPTER PAGES) */}
            <div className={`${mobileTab === 'list' ? 'flex' : 'hidden'} ${activeMode === 'settings' ? 'md:hidden' : 'md:flex'} flex-col w-full md:w-80 bg-gray-50 border-r border-gray-200 overflow-y-auto`}>
                {activeMode !== 'chapter' && activeMode !== 'settings' ? (
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
                ) : activeMode === 'chapter' && currentChapter ? (
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
                ) : null}
            </div>

            {/* 3. KOLOM KANAN (EDITOR / SETTINGS) */}
            <div className={`${mobileTab === 'editor' ? 'flex' : 'hidden'} md:flex flex-1 bg-white p-4 md:p-8 overflow-y-auto`}>
               
               {/* TAMPILAN MODE PENGATURAN UMUM */}
               {activeMode === 'settings' ? (
                   <div className="w-full max-w-3xl mx-auto animate-in fade-in duration-500 pb-20 md:pb-0">
                       <div className="mb-6 flex items-center gap-3 pb-4 border-b">
                           <span className="px-2 py-1 rounded text-xs font-bold uppercase bg-indigo-100 text-indigo-700">
                               Pengaturan Utama Cerita
                           </span>
                       </div>

                       <div className="space-y-8">
                           
                           {/* INFO UTAMA (JUDUL & NOMOR) */}
                           <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 md:p-8">
                               <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                                   <FileText className="w-5 h-5 text-gray-500" /> Informasi Utama
                               </h3>
                               <div className="space-y-5">
                                   <div>
                                       <label className="block text-sm font-medium text-gray-700 mb-1">Judul Cerita</label>
                                       <Input 
                                           value={story.title} 
                                           onChange={(e) => setStory({...story, title: e.target.value})} 
                                           placeholder="Masukkan judul cerita..."
                                           className="font-medium bg-gray-50 focus:bg-white"
                                       />
                                   </div>
                                   <div>
                                       <label className="block text-sm font-medium text-gray-700 mb-1">Nomor Cerita (ID Unik)</label>
                                       <Input 
                                           value={story.number} 
                                           onChange={(e) => setStory({...story, number: e.target.value})} 
                                           placeholder="Contoh: PU1"
                                           className="uppercase font-medium bg-gray-50 focus:bg-white"
                                       />
                                       <p className="text-xs text-gray-500 mt-2">
                                           *Nomor ini digunakan sebagai ID rujukan sistem. Harus unik dan tidak boleh sama dengan cerita lain.
                                       </p>
                                   </div>
                               </div>
                           </div>

                           {/* UPLOAD COVER */}
                           <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 md:p-8">
                             <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                                 <ImageIcon className="w-5 h-5 text-gray-500" /> Cover Image Cerita
                             </h3>
                             <p className="text-sm text-gray-500 mb-6">Gambar ini akan ditampilkan sebagai sampul cerita di halaman Dashboard. Rasio yang disarankan adalah 3:4 (Portrait).</p>
                             
                             {story.coverImage ? (
                                 <div className="relative inline-block">
                                    <img src={story.coverImage} alt="Cover Preview" className="h-64 md:h-80 object-cover rounded-xl shadow-md border border-gray-200" />
                                    <button onClick={() => handleRemoveStoryMedia('coverImage')} className="absolute -top-3 -right-3 bg-red-500 text-white rounded-full p-2 shadow-md hover:bg-red-600 transition-colors">
                                      <X className="w-4 h-4" />
                                    </button>
                                 </div>
                             ) : (
                                 <label className="border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center p-10 text-center hover:bg-indigo-50 hover:border-indigo-400 transition-all cursor-pointer">
                                    <UploadCloud className="w-10 h-10 text-indigo-500 mb-4" />
                                    <span className="text-base font-bold text-indigo-600">Klik untuk upload Cover</span>
                                    <span className="text-sm text-gray-400 mt-1">Maks. 2MB (JPG, PNG)</span>
                                    <input type="file" accept="image/*" className="hidden" onChange={(e) => handleStoryMediaUpload(e, 'coverImage')} />
                                 </label>
                             )}
                           </div>

                           {/* UPLOAD SERTIFIKAT */}
                           <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 md:p-8">
                             <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                                 <Award className="w-5 h-5 text-gray-500" /> Template Sertifikat Mentah
                             </h3>
                             
                             <div className="bg-amber-50 border border-amber-200 rounded-lg p-5 mb-6">
                                <p className="text-sm text-amber-800 font-bold mb-1">Panduan Pembuatan Sertifikat:</p>
                                <p className="text-sm text-amber-700 mb-3 leading-relaxed">
                                  Unggah desain sertifikat yang **sudah ada judul ceritanya**, namun biarkan area **Nama Responden** dan **Predikat/Nilai** kosong. Sistem EpoStory akan mengisi teks dinamis tersebut secara otomatis di atas gambar.
                                </p>
                                <a 
                                  href="https://canva.link/q3sd7z9sqdb8t0m" 
                                  target="_blank" 
                                  rel="noreferrer" 
                                  className="inline-flex items-center gap-2 px-3 py-1.5 bg-amber-100 text-amber-800 rounded-md text-sm font-bold hover:bg-amber-200 transition-colors"
                                >
                                    <ExternalLink className="w-4 h-4" /> Template Canva Sertifikat
                                </a>
                             </div>
                             
                             {story.certificateImage ? (
                                 <div className="relative w-full max-w-2xl">
                                    <img src={story.certificateImage} alt="Certificate Preview" className="w-full aspect-[1.414/1] object-cover rounded-xl shadow-md border border-gray-200" />
                                    <button onClick={() => handleRemoveStoryMedia('certificateImage')} className="absolute -top-3 -right-3 bg-red-500 text-white rounded-full p-2 shadow-md hover:bg-red-600 transition-colors">
                                      <X className="w-4 h-4" />
                                    </button>
                                 </div>
                             ) : (
                                 <label className="border-2 border-dashed border-gray-300 rounded-xl aspect-[1.414/1] max-w-2xl flex flex-col items-center justify-center p-8 text-center hover:bg-amber-50 hover:border-amber-400 transition-all cursor-pointer">
                                    <UploadCloud className="w-10 h-10 text-amber-500 mb-4" />
                                    <span className="text-base font-bold text-amber-600">Klik untuk upload Sertifikat</span>
                                    <span className="text-sm text-gray-500 mt-1">Gunakan resolusi tinggi dengan rasio Lanskap Kertas A4</span>
                                    <span className="text-xs text-gray-400 mt-2">Maks. 2MB (JPG, PNG)</span>
                                    <input type="file" accept="image/*" className="hidden" onChange={(e) => handleStoryMediaUpload(e, 'certificateImage')} />
                                 </label>
                             )}
                           </div>
                       </div>
                   </div>
               ) : activeMode === 'chapter' && currentPage ? (
                   /* TAMPILAN EDITOR PAGE (STORY / QUIZ) */
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

                           {currentPage.type === 'story' && (
                             <div className="bg-gray-50 border-2 border-dashed border-gray-200 rounded-xl p-6 text-center hover:bg-gray-100 transition-colors">
                                <label className="block text-sm font-bold text-gray-500 mb-2">Ilustrasi Cerita (Opsional)</label>
                                
                                {currentPage.image ? (
                                  <div className="relative group inline-block">
                                    <img src={currentPage.image} alt="Preview" className="h-48 object-cover rounded-lg shadow-md border" />
                                    <button 
                                      onClick={() => updatePage('image', null)}
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
                                      <span className="text-sm text-blue-600 font-medium hover:underline">Klik untuk upload gambar ilustrasi</span>
                                      <span className="text-xs text-gray-400">Maks. 2MB (JPG, PNG)</span>
                                    </label>
                                    <input id="image-upload" type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
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

                           {currentPage.type === 'quiz' && (
                            <div className="bg-yellow-50/50 border border-yellow-100 rounded-xl p-4 md:p-6 space-y-6">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-3 uppercase tracking-wider">
                                        Opsi Jawaban & Feedback Spesifik
                                    </label>
                                    <div className="space-y-4">
                                        {currentPage.quizOptions?.map((opt, i) => (
                                            <div key={i} className={`flex items-start gap-3 p-4 border rounded-xl bg-white transition-all ${currentPage.quizAns === i ? 'border-green-400 ring-1 ring-green-400' : 'border-gray-200'}`}>
                                                <input 
                                                    type="radio" 
                                                    name="quiz-ans" 
                                                    checked={currentPage.quizAns === i} 
                                                    onChange={() => updatePage('quizAns', i)} 
                                                    className="mt-3 w-4 h-4 accent-green-600 cursor-pointer shrink-0" 
                                                    title="Tandai sebagai jawaban benar" 
                                                />
                                                <div className="flex-1 space-y-3">
                                                    <Input
                                                      value={opt.text} 
                                                      onChange={(e: ChangeEvent<HTMLInputElement>) => updateQuizOption(i, 'text', e.target.value)} 
                                                      placeholder={`Opsi ${String.fromCharCode(65 + i)}`} 
                                                      className={`bg-white ${currentPage.quizAns === i ? 'font-semibold border-green-200 bg-green-50/30' : ''}`} 
                                                    />
                                                    <Input
                                                      value={opt.feedback} 
                                                      onChange={(e: ChangeEvent<HTMLInputElement>) => updateQuizOption(i, 'feedback', e.target.value)} 
                                                      placeholder="Penjelasan (feedback) jika opsi ini dipilih..." 
                                                      className="bg-gray-50 text-sm h-9"
                                                    />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    <p className="text-xs text-gray-500 mt-2 ml-7">* Pilih radio button untuk menentukan kunci jawaban.</p>
                                </div>
                            </div>
                        )}
                       </div>
                   </div>
               ) : (
                   <div className="h-full flex flex-col items-center justify-center text-gray-300 p-8 text-center">
                       <Layers className="w-16 h-16 mb-4 opacity-20" />
                       <p className="text-lg font-medium text-gray-400">Pilih menu di samping untuk mulai mengedit.</p>
                       <Button variant="outline" className="mt-4 md:hidden" onClick={() => setMobileTab('structure')}>Buka Struktur</Button>
                   </div>
               )}
            </div>
          </div>

          {/* MOBILE TAB BAR */}
          <div className="md:hidden border-t border-gray-200 bg-white flex justify-around p-2 pb-safe z-30 shrink-0">
             <button onClick={() => setMobileTab("structure")} className={`flex flex-col items-center p-2 rounded-lg w-full transition-colors ${mobileTab === 'structure' ? 'text-blue-600 bg-blue-50' : 'text-gray-400 hover:bg-gray-50'}`}><Layout className="w-5 h-5 mb-1" /><span className="text-[10px] font-bold">MENU</span></button>
             {activeMode !== 'settings' && (
                 <button onClick={() => setMobileTab("list")} className={`flex flex-col items-center p-2 rounded-lg w-full transition-colors ${mobileTab === 'list' ? 'text-blue-600 bg-blue-50' : 'text-gray-400 hover:bg-gray-50'}`}><List className="w-5 h-5 mb-1" /><span className="text-[10px] font-bold">DAFTAR</span></button>
             )}
             <button onClick={() => setMobileTab("editor")} className={`flex flex-col items-center p-2 rounded-lg w-full transition-colors ${mobileTab === 'editor' ? 'text-blue-600 bg-blue-50' : 'text-gray-400 hover:bg-gray-50'}`}><Edit3 className="w-5 h-5 mb-1" /><span className="text-[10px] font-bold">EDITOR</span></button>
          </div>

        </main>
      </div>
    </AdminRoute>
  );
}