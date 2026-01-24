"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import AdminRoute from "@/components/AdminRoute";
import { AdminSidebar } from "@/components/AdminSidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Plus, 
  GripVertical, 
  Save, 
  ArrowLeft, 
  Settings, 
  Image as ImageIcon, 
  Mic 
} from "lucide-react";

interface TimelineCard {
  id: string;
  type: "story" | "quiz";
  title: string;
}

export default function StoryFlowEditor() {
  const params = useParams(); // Mengambil ID dari URL
  
  // State Data Timeline
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
        <main className="ml-64 flex-1 flex flex-col h-screen overflow-hidden">
          {/* Header */}
          <div className="bg-white border-b border-gray-200 px-8 py-4 flex-none z-10">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Link href="/admin/stories">
                  <Button variant="ghost" size="icon" title="Back to Stories">
                    <ArrowLeft className="w-5 h-5 text-gray-500" />
                  </Button>
                </Link>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    Story Flow Editor
                  </h1>
                  <p className="text-gray-500 text-sm mt-0.5">
                    Editing ID: <span className="font-mono text-green-600 font-medium">{params.id}</span>
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                {/* Tombol ke halaman Metadata/Settings */}
                <Link href={`/admin/stories/${params.id}/settings`}>
                  <Button variant="ghost" size="icon" title="Story Settings">
                    <Settings className="w-5 h-5 text-gray-500" />
                  </Button>
                </Link>
                
                <Button variant="outline" className="border-gray-300 hover:bg-gray-100 gap-2">
                  <Save className="w-4 h-4" /> Save Draft
                </Button>
                <Button className="bg-green-600 hover:bg-emerald-700 text-white">
                  Publish Story
                </Button>
              </div>
            </div>
          </div>

          {/* Editor Layout Area */}
          <div className="flex-1 flex overflow-hidden">
            
            {/* Left Sidebar - Timeline */}
            <div className="w-80 bg-white border-r border-gray-200 flex flex-col flex-none">
              {/* Timeline Header */}
              <div className="px-6 py-4 border-b border-gray-200 bg-gray-50/50">
                <h2 className="text-sm font-bold text-gray-700 uppercase tracking-wider">
                  Chapter Timeline
                </h2>
              </div>

              {/* Timeline Cards List */}
              <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
                {timeline.map((card) => (
                  <button
                    key={card.id}
                    onClick={() => setSelectedCard(card)}
                    className={`w-full p-4 rounded-lg border-2 transition-all text-left group relative ${
                      selectedCard?.id === card.id
                        ? card.type === "story"
                          ? "border-blue-500 bg-blue-50 shadow-sm"
                          : "border-orange-500 bg-orange-50 shadow-sm"
                        : "border-gray-100 bg-white hover:border-gray-300 hover:shadow-sm"
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      <GripVertical className="w-5 h-5 text-gray-300 mt-1 cursor-grab active:cursor-grabbing" />
                      <div className="flex-1 min-w-0">
                        <div
                          className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide mb-1.5 ${
                            card.type === "story"
                              ? "bg-blue-100 text-blue-700"
                              : "bg-orange-100 text-orange-700"
                          }`}
                        >
                          {card.type === "story" ? "Story Page" : "Quiz Session"}
                        </div>
                        <p className="font-semibold text-gray-900 text-sm truncate">
                          {card.title}
                        </p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>

              {/* Add Buttons */}
              <div className="p-4 border-t border-gray-200 bg-gray-50 space-y-2">
                <button
                  onClick={handleAddStoryPage}
                  className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-white border border-blue-200 text-blue-700 rounded-lg hover:bg-blue-50 hover:border-blue-300 font-medium transition-colors text-sm shadow-sm"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Story Page</span>
                </button>
                <button
                  onClick={handleAddQuizSession}
                  className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-white border border-orange-200 text-orange-700 rounded-lg hover:bg-orange-50 hover:border-orange-300 font-medium transition-colors text-sm shadow-sm"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Quiz Session</span>
                </button>
              </div>
            </div>

            {/* Right Main Area - Editor Canvas */}
            <div className="flex-1 overflow-y-auto bg-gray-50/50 p-8">
              {selectedCard ? (
                <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-sm border border-gray-200 p-8 min-h-[600px]">
                  <h3 className="text-2xl font-bold text-gray-900 mb-8 border-b border-gray-100 pb-4">
                    {isStoryPage ? "📝 Edit Story Content" : "❓ Edit Quiz Question"}
                  </h3>

                  {isStoryPage ? (
                    // --- FORM EDITOR CERITA ---
                    <div className="space-y-8">
                      {/* Title */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Page Title
                        </label>
                        <Input
                          type="text"
                          defaultValue={selectedCard.title}
                          placeholder="Enter page title"
                          className="text-lg font-medium"
                        />
                      </div>

                      {/* Upload Image */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Illustration Image
                        </label>
                        <div className="border-2 border-dashed border-gray-300 rounded-xl p-10 text-center hover:border-green-500 hover:bg-green-50 transition-all cursor-pointer group">
                          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-green-100 transition-colors">
                            <ImageIcon className="w-8 h-8 text-gray-400 group-hover:text-green-600" />
                          </div>
                          <p className="text-gray-900 font-medium">
                            Drag and drop your illustration
                          </p>
                          <p className="text-gray-500 text-sm mt-1">
                            or click to browse file
                          </p>
                        </div>
                      </div>

                      {/* Story Text */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Narrative Text
                        </label>
                        <textarea
                          placeholder="Write your story narrative (2-3 paragraphs)..."
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none min-h-[200px] text-base leading-relaxed resize-y"
                        ></textarea>
                      </div>

                      {/* Audio Upload */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Audio Narration (Optional)
                        </label>
                        <div className="flex items-center justify-center border border-gray-300 rounded-lg p-6 bg-gray-50 hover:bg-white hover:border-gray-400 transition-colors cursor-pointer border-dashed gap-3">
                          <div className="w-10 h-10 bg-white rounded-full border flex items-center justify-center">
                            <Mic className="w-5 h-5 text-gray-600" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900">Upload Voiceover</p>
                            <p className="text-xs text-gray-500">MP3 or WAV (Max 10MB)</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    // --- FORM EDITOR KUIS ---
                    <div className="space-y-8">
                      {/* Quiz Title */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Quiz Title
                        </label>
                        <Input
                          type="text"
                          defaultValue={selectedCard.title}
                          placeholder="Enter quiz title"
                          className="text-lg font-medium"
                        />
                      </div>

                      {/* Question */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Question
                        </label>
                        <textarea
                          placeholder="Enter your question here..."
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none min-h-[100px] text-lg resize-y"
                        ></textarea>
                      </div>

                      {/* Options */}
                      <div className="space-y-4">
                         <label className="block text-sm font-medium text-gray-700">
                          Answer Options (Select correct answer)
                        </label>
                        {["A", "B", "C", "D"].map((option) => (
                          <div key={option} className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors group focus-within:ring-1 focus-within:ring-green-500">
                            <div className="flex items-center h-5">
                              <input
                                type="radio"
                                name="correct_answer"
                                id={`option_${option}`}
                                className="w-5 h-5 text-green-600 border-gray-300 focus:ring-green-500 cursor-pointer"
                              />
                            </div>
                            <span className="font-bold text-gray-400 w-6 group-hover:text-gray-600">{option}.</span>
                            <Input
                              placeholder={`Enter answer for option ${option}`}
                              className="flex-1 border-0 bg-transparent shadow-none focus-visible:ring-0 p-0 text-gray-900 placeholder:text-gray-400"
                            />
                          </div>
                        ))}
                      </div>

                      {/* Feedback */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Feedback/Explanation
                        </label>
                        <textarea
                          placeholder="Provide explanation why the answer is correct..."
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none min-h-[100px] text-sm bg-blue-50/50"
                        ></textarea>
                      </div>
                    </div>
                  )}

                  {/* Bottom Action Buttons */}
                  <div className="mt-12 pt-6 border-t border-gray-100 flex justify-end gap-4">
                    <Button
                      variant="outline"
                      className="border-gray-300 hover:bg-gray-50"
                    >
                      Discard Changes
                    </Button>
                    <Button className="bg-green-600 hover:bg-emerald-700 text-white px-8">
                      Save Changes
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-gray-400">
                  <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mb-4 text-3xl">
                    👈
                  </div>
                  <p className="text-lg font-medium">Select a chapter from the timeline to start editing</p>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </AdminRoute>
  );
}