"use client";

import { useState } from "react";
import AdminRoute from "@/components/AdminRoute";
import { AdminSidebar } from "@/components/AdminSidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, GripVertical, Save, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";

interface TimelineCard {
  id: string;
  type: "story" | "quiz";
  title: string;
}

export default function StoryFlowEditor() {
  const params = useParams(); // Mengambil ID dari URL
  const [timeline, setTimeline] = useState<TimelineCard[]>([
    { id: "1", type: "story", title: "Page 1: Introduction" },
    { id: "2", type: "quiz", title: "Quiz 1: Understanding Basics" },
    { id: "3", type: "story", title: "Page 2: Deep Dive" },
  ]);
  const [selectedCard, setSelectedCard] = useState<TimelineCard | null>(
    timeline[0]
  );

  const handleAddStoryPage = () => {
    const newCard: TimelineCard = {
      id: Date.now().toString(),
      type: "story",
      title: `Page ${timeline.length + 1}`,
    };
    setTimeline([...timeline, newCard]);
    setSelectedCard(newCard);
  };

  const handleAddQuizSession = () => {
    const newCard: TimelineCard = {
      id: Date.now().toString(),
      type: "quiz",
      title: `Quiz ${timeline.filter((c) => c.type === "quiz").length + 1}`,
    };
    setTimeline([...timeline, newCard]);
    setSelectedCard(newCard);
  };

  const isStoryPage = selectedCard?.type === "story";

  return (
    <AdminRoute>
      <div className="flex min-h-screen bg-gray-50">
        <AdminSidebar />

        {/* Main Content */}
        <main className="flex-1 md:ml-64 pt-16 md:pt-0 flex flex-col h-screen overflow-hidden transition-all duration-300">
          
          {/* Header */}
          <div className="bg-white border-b border-gray-200 px-4 py-4 md:px-8 flex-shrink-0">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="flex items-center gap-3">
                 <Link href="/admin/stories" className="md:hidden p-2 -ml-2 text-gray-500">
                    <ArrowLeft className="w-5 h-5"/>
                 </Link>
                 <div>
                    <h1 className="text-xl md:text-2xl font-bold text-gray-900 flex items-center gap-2">
                        Edit Cerita <span className="text-gray-400 font-normal text-base hidden md:inline">| Chapter {params.id}</span>
                    </h1>
                    <p className="text-gray-500 text-xs md:text-sm">
                        Edit dan susun alur cerita interaktif Anda di sini.
                    </p>
                 </div>
              </div>
              <div className="flex items-center gap-2 md:gap-3">
                <Button variant="outline" className="text-xs md:text-sm border-gray-300">
                  Simpan Draft
                </Button>
                <Button className="bg-green-600 hover:bg-green-700 text-white text-xs md:text-sm gap-2">
                  <Save className="w-4 h-4" /> Publikasikan Perubahan
                </Button>
              </div>
            </div>
          </div>

          {/* Editor Area (Split View) */}
          <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
            
            {/* Sidebar kiri - Timeline */}
            <div className="w-full md:w-80 bg-white border-b md:border-b-0 md:border-r border-gray-200 flex flex-col flex-shrink-0 h-1/3 md:h-full">
              
              {/* Timeline Header */}
              <div className="px-4 py-3 border-b border-gray-100 bg-gray-50/50">
                <h2 className="text-sm font-bold text-gray-700 uppercase tracking-wide">
                  Timeline
                </h2>
              </div>

              {/* Timeline Cards List */}
              <div className="flex-1 overflow-y-auto p-3 space-y-2">
                {timeline.map((card) => (
                  <button
                    key={card.id}
                    onClick={() => setSelectedCard(card)}
                    className={`w-full p-3 rounded-lg border transition-all text-left group relative ${
                      selectedCard?.id === card.id
                        ? card.type === "story"
                          ? "border-blue-500 bg-blue-50 ring-1 ring-blue-500"
                          : "border-orange-500 bg-orange-50 ring-1 ring-orange-500"
                        : "border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <GripVertical className="w-4 h-4 text-gray-300 group-hover:text-gray-500 cursor-move" />
                      <div className="min-w-0">
                        <div className={`inline-flex px-1.5 py-0.5 rounded text-[10px] font-bold uppercase mb-1 ${
                            card.type === "story" ? "bg-blue-100 text-blue-700" : "bg-orange-100 text-orange-700"
                        }`}>
                            {card.type}
                        </div>
                        <p className="text-sm font-semibold text-gray-900 truncate">
                          {card.title}
                        </p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>

              {/* Tombol penambah cerita dan kuis */}
              <div className="p-3 border-t border-gray-200 grid grid-cols-2 gap-2 bg-gray-50">
                <button
                  onClick={handleAddStoryPage}
                  className="flex flex-col items-center justify-center p-2 bg-white border border-blue-200 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors text-xs font-medium"
                >
                  <Plus className="w-4 h-4 mb-1" />
                  + Story
                </button>
                <button
                  onClick={handleAddQuizSession}
                  className="flex flex-col items-center justify-center p-2 bg-white border border-orange-200 text-orange-600 rounded-lg hover:bg-orange-50 transition-colors text-xs font-medium"
                >
                  <Plus className="w-4 h-4 mb-1" />
                  + Quiz
                </button>
              </div>
            </div>

            {/* Main Area Kanan - Form Editor */}
            <div className="flex-1 overflow-y-auto bg-gray-50 p-4 md:p-8 h-2/3 md:h-full">
              {selectedCard ? (
                <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-sm border border-gray-200 p-6 md:p-8">
                  <div className="flex items-center justify-between mb-6">
                     <h3 className="text-lg md:text-xl font-bold text-gray-900">
                        Edit {isStoryPage ? "Konten Cerita" : "Pertanyaan Kuis"}
                     </h3>
                     <span className="text-xs text-gray-400 font-mono">ID: {selectedCard.id}</span>
                  </div>

                  {isStoryPage ? (
                    // --- STORY PAGE FORM ---
                    <div className="space-y-6">
                      {/* Title */}
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Judul Halaman
                        </label>
                        <Input
                          type="text"
                          defaultValue={selectedCard.title}
                          className="bg-gray-50 border-gray-300 focus:bg-white transition-colors"
                        />
                      </div>

                      {/* Image Upload */}
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Gambar Ilustrasi
                        </label>
                        <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-green-500 hover:bg-green-50/30 transition-all cursor-pointer group">
                          <div className="text-4xl mb-3 opacity-50 group-hover:opacity-100 group-hover:scale-110 transition-all">🖼️</div>
                          <p className="text-sm font-medium text-gray-900">
                            Click to upload or drag and drop
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            SVG, PNG, JPG or GIF (max. 3MB)
                          </p>
                        </div>
                      </div>

                      {/* Story Text */}
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Teks Narasi
                        </label>
                        <textarea
                          placeholder="Tulis narasi disini..."
                          className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent min-h-[150px] text-sm bg-gray-50 focus:bg-white transition-colors resize-y"
                        ></textarea>
                      </div>
                    </div>
                  ) : (
                    // --- QUIZ FORM ---
                    <div className="space-y-6">
                      {/* Quiz Title */}
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Judul Sesi
                        </label>
                        <Input
                          type="text"
                          defaultValue={selectedCard.title}
                          className="bg-gray-50 border-gray-300"
                        />
                      </div>

                      {/* Question */}
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Pertanyaan
                        </label>
                        <textarea
                          placeholder="Tulis pertanyaanmu disini..."
                          className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 min-h-[100px] text-sm bg-gray-50 resize-y"
                        ></textarea>
                      </div>

                      {/* Options Grid */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {["A", "B", "C", "D"].map((opt) => (
                            <div key={opt} className="relative">
                                <label className="text-xs font-bold text-gray-500 mb-1 block">Opsi {opt}</label>
                                <div className="flex items-center">
                                    <input type="radio" name="correct_opt" className="w-4 h-4 text-orange-600 mr-2 focus:ring-orange-500" />
                                    <Input placeholder={`Jawaban ${opt}`} className="flex-1 text-sm" />
                                </div>
                            </div>
                        ))}
                      </div>
                      
                      {/* Feedback */}
                      <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
                        <label className="block text-sm font-semibold text-blue-800 mb-2">
                          Penjelasan (Feedback)
                        </label>
                        <textarea
                          placeholder="Jelaskan mengapa jawaban ini benar..."
                          className="w-full p-3 border border-blue-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-400 min-h-[80px]"
                        ></textarea>
                      </div>
                    </div>
                  )}

                  {/* Footer Actions */}
                  <div className="mt-8 pt-6 border-t border-gray-100 flex justify-end gap-3">
                    <Button variant="ghost" className="text-red-500 hover:text-red-700 hover:bg-red-50">
                        Hapus Kartu
                    </Button>
                    <Button className="bg-green-600 text-white hover:bg-green-700 shadow-sm">
                        Simpan Perubahan
                    </Button>
                  </div>

                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-gray-400">
                  <div className="text-6xl mb-4">👈</div>
                  <p className="text-lg font-medium">Select an item from the timeline to edit</p>
                </div>
              )}
            </div>

          </div>
        </main>
      </div>
    </AdminRoute>
  );
}