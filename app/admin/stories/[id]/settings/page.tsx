"use client";

import { useState } from "react";
import AdminRoute from "@/components/AdminRoute";
import { AdminSidebar } from "@/components/AdminSidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Edit2, Plus, ArrowLeft, Image as ImageIcon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface Chapter {
  id: string;
  number: number;
  title: string;
}

export default function StorybookMetadata() {
  const router = useRouter();
  
  // State Form
  const [formData, setFormData] = useState({
    title: "",
    synopsis: "",
    ageGroup: "8-12",
    difficulty: "beginner",
  });

  // Dummy Chapters (Kosong untuk mode create)
  const [chapters, setChapters] = useState<Chapter[]>([]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = () => {
    // Simulasi Save -> Redirect ke Editor
    // Di real app, ini akan POST ke API
    const newId = Date.now().toString(); 
    router.push(`/admin/stories/${newId}/editor`);
  };

  return (
    <AdminRoute>
      <div className="flex min-h-screen bg-gray-50">
        <AdminSidebar />

        {/* Main Content */}
        {/* Responsive margin (md:ml-64) & padding top (pt-16) untuk mobile */}
        <main className="flex-1 md:ml-64 pt-16 md:pt-0 transition-all duration-300">
          
          {/* Header */}
          <div className="bg-white border-b border-gray-200 px-4 py-6 md:px-8">
            <div className="flex items-center gap-4">
                 <Link href="/admin/stories" className="p-2 -ml-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors">
                    <ArrowLeft className="w-5 h-5"/>
                 </Link>
                 <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                    New Storybook Metadata
                    </h1>
                    <p className="text-gray-600 mt-1 text-sm md:text-base">
                    Configure story details, cover image, and initial settings
                    </p>
                 </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-4 md:p-8">
            <div className="max-w-4xl mx-auto">
              
              {/* Cover Image Section */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 md:p-8 mb-6 md:mb-8">
                <h2 className="text-base md:text-lg font-bold text-gray-900 mb-4 md:mb-6 flex items-center gap-2">
                  <ImageIcon className="w-5 h-5 text-gray-500" /> Book Cover
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                  {/* Upload Area */}
                  <div>
                    <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-green-500 hover:bg-green-50/50 transition-all cursor-pointer aspect-[3/4] flex flex-col items-center justify-center group">
                      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4 group-hover:bg-green-100 transition-colors">
                        <span className="text-3xl group-hover:scale-110 transition-transform">📚</span>
                      </div>
                      <p className="text-gray-900 font-medium text-sm md:text-base">
                        Click or drag to upload cover
                      </p>
                      <p className="text-gray-500 text-xs mt-2">
                        Portrait ratio (3:4) recommended
                      </p>
                      <p className="text-gray-400 text-xs mt-1">
                        JPG, PNG (Max 5MB)
                      </p>
                    </div>
                  </div>

                  {/* Live Preview */}
                  <div>
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-3">
                      Live Preview
                    </p>
                    <div className="bg-gradient-to-br from-green-600 to-emerald-800 rounded-xl aspect-[3/4] flex items-center justify-center text-white shadow-lg relative overflow-hidden">
                      {/* Decorative Circles */}
                      <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-10 -mt-10 blur-2xl"></div>
                      <div className="absolute bottom-0 left-0 w-24 h-24 bg-black/10 rounded-full -ml-5 -mb-5 blur-xl"></div>
                      
                      <div className="text-center px-6 relative z-10 w-full">
                        <div className="text-5xl md:text-6xl mb-4 drop-shadow-md">🌍</div>
                        <h3 className="font-bold text-xl md:text-2xl leading-tight mb-2 drop-shadow-md line-clamp-3">
                          {formData.title || "Untitled Story"}
                        </h3>
                        <p className="text-green-100 text-xs md:text-sm font-medium">
                            By EpoStory Team
                        </p>
                        
                        {/* Badges Preview */}
                        <div className="flex justify-center gap-2 mt-4">
                             <span className="px-2 py-0.5 bg-black/20 rounded text-[10px] font-bold uppercase">{formData.difficulty}</span>
                             <span className="px-2 py-0.5 bg-black/20 rounded text-[10px] font-bold uppercase">{formData.ageGroup} Years</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Story Details Section */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 md:p-8 mb-6 md:mb-8">
                <h2 className="text-base md:text-lg font-bold text-gray-900 mb-4 md:mb-6">
                  Story Details
                </h2>

                <div className="space-y-6">
                  {/* Story Title */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Story Title
                    </label>
                    <Input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      placeholder="e.g. The Guardians of the Forest"
                      className="rounded-lg border-gray-300 focus:ring-green-500"
                    />
                  </div>

                  {/* Synopsis */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Synopsis / Description
                    </label>
                    <textarea
                      name="synopsis"
                      value={formData.synopsis}
                      onChange={handleInputChange}
                      placeholder="Enter a brief description of the story..."
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none min-h-[120px] text-sm transition-shadow"
                    ></textarea>
                  </div>

                  {/* Grid for Age & Difficulty */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Target Age Group */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Target Age Group
                      </label>
                      <select
                        name="ageGroup"
                        value={formData.ageGroup}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none text-sm bg-white"
                      >
                        <option value="4-6">4-6 years (Early Childhood)</option>
                        <option value="6-8">6-8 years (Lower Primary)</option>
                        <option value="8-12">8-12 years (Upper Primary)</option>
                        <option value="12-16">12-16 years (Secondary)</option>
                      </select>
                    </div>

                    {/* Difficulty Level */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Difficulty Level
                      </label>
                      <select
                        name="difficulty"
                        value={formData.difficulty}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none text-sm bg-white"
                      >
                        <option value="beginner">Beginner (Simple words)</option>
                        <option value="intermediate">Intermediate (Standard)</option>
                        <option value="advanced">Advanced (Complex topics)</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col-reverse sm:flex-row items-center justify-end gap-3 mb-10 pt-4 border-t border-gray-200">
                <Button
                  variant="ghost"
                  onClick={() => router.back()}
                  className="w-full sm:w-auto text-gray-500 hover:text-gray-900"
                >
                  Cancel
                </Button>
                <Button 
                    onClick={handleSave}
                    className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white shadow-md gap-2"
                >
                  Save & Continue to Editor <Edit2 className="w-4 h-4" />
                </Button>
              </div>

            </div>
          </div>
        </main>
      </div>
    </AdminRoute>
  );
}