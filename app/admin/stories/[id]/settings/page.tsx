"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import AdminRoute from "@/components/AdminRoute";
import { AdminSidebar } from "@/components/AdminSidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Edit2, UploadCloud, ArrowLeft, BookOpen } from "lucide-react";
import { toast } from "sonner";

interface Chapter {
  id: string;
  number: number;
  title: string;
}

export default function StorybookMetadata() {
  const params = useParams(); // Mengambil ID cerita dari URL
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);

  // Data Dummy (Pre-filled seolah-olah mengambil dari database berdasarkan params.id)
  const [formData, setFormData] = useState({
    title: "Chapter 1: Air Pollution Basics",
    synopsis: "Learn about the different types of air pollution and their sources in urban environments.",
    ageGroup: "8-12",
    difficulty: "beginner",
  });

  const [chapters, setChapters] = useState<Chapter[]>([
    { id: "1", number: 1, title: "The Smoke" },
    { id: "2", number: 2, title: "The Solution" },
    { id: "3", number: 3, title: "Taking Action" },
  ]);

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
    setIsSaving(true);
    // Simulasi proses simpan ke server
    setTimeout(() => {
      setIsSaving(false);
      toast.success("Settings Saved", {
        description: "Story metadata has been successfully updated.",
      });
      // Opsional: Kembali ke halaman editor setelah save
      // router.push(`/admin/stories/${params.id}/editor`);
    }, 1000);
  };

  return (
    <AdminRoute>
      <div className="flex min-h-screen bg-gray-50">
        <AdminSidebar />

        {/* Main Content */}
        <main className="ml-64 flex-1">
          {/* Header */}
          <div className="bg-white border-b border-gray-200 px-8 py-6 sticky top-0 z-10">
            <div className="flex items-center gap-4">
              <Link href="/admin/stories">
                <Button variant="ghost" size="icon">
                  <ArrowLeft className="w-5 h-5 text-gray-500" />
                </Button>
              </Link>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Storybook Metadata
                </h1>
                <p className="text-gray-600 mt-1">
                  Configure story details, cover image, and chapter information for ID: <span className="font-mono text-green-600">{params.id}</span>
                </p>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-8">
            <div className="max-w-4xl mx-auto">
              
              {/* Cover Image Section */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-8 mb-8">
                <h2 className="text-lg font-bold text-gray-900 mb-6">
                  Book Cover
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Upload Area */}
                  <div>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-green-600 hover:bg-green-50 transition-colors cursor-pointer aspect-[3/4] flex items-center justify-center group">
                      <div>
                        <div className="text-6xl mb-3 group-hover:scale-110 transition-transform">📚</div>
                        <p className="text-gray-600 font-medium group-hover:text-green-700">
                          Drag and drop your cover image
                        </p>
                        <p className="text-gray-500 text-sm mt-1">
                          Portrait aspect ratio recommended
                        </p>
                        <p className="text-gray-500 text-sm">
                          JPG, PNG (Max 5MB)
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Preview */}
                  <div>
                    <p className="text-sm font-semibold text-gray-700 mb-3">
                      Preview
                    </p>
                    <div className="bg-gradient-to-br from-green-600 to-emerald-600 rounded-lg aspect-[3/4] flex items-center justify-center text-white shadow-md">
                      <div className="text-center p-6">
                        <div className="text-6xl mb-3">📚</div>
                        <p className="font-bold text-lg leading-tight">
                          {formData.title || "Your Story Title"}
                        </p>
                        <p className="text-xs text-green-100 mt-2 line-clamp-3">
                          {formData.synopsis}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Story Details Section */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-8 mb-8">
                <h2 className="text-lg font-bold text-gray-900 mb-6">
                  Story Details
                </h2>

                <div className="space-y-6">
                  {/* Story Title */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      Story Title
                    </label>
                    <Input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      placeholder="Enter story title"
                      className="rounded-lg border-gray-300"
                    />
                  </div>

                  {/* Synopsis */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      Synopsis/Description
                    </label>
                    <textarea
                      name="synopsis"
                      value={formData.synopsis}
                      onChange={handleInputChange}
                      placeholder="Enter a brief description of the story"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600 min-h-32 text-sm"
                    ></textarea>
                  </div>

                  {/* Grid for Age & Difficulty */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Target Age Group */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-2">
                        Target Age Group
                      </label>
                      <select
                        name="ageGroup"
                        value={formData.ageGroup}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600 bg-white"
                      >
                        <option value="4-6">4-6 years</option>
                        <option value="6-8">6-8 years</option>
                        <option value="8-12">8-12 years</option>
                        <option value="12-16">12-16 years</option>
                        <option value="16+">16+ years</option>
                      </select>
                    </div>

                    {/* Difficulty Level */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-2">
                        Difficulty Level
                      </label>
                      <select
                        name="difficulty"
                        value={formData.difficulty}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600 bg-white"
                      >
                        <option value="beginner">Beginner</option>
                        <option value="intermediate">Intermediate</option>
                        <option value="advanced">Advanced</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              {/* Chapters Section */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-8 mb-8">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-lg font-bold text-gray-900">
                    Chapters ({chapters.length})
                  </h2>
                  <Link href={`/admin/stories/${params.id}/editor`}>
                    <Button variant="ghost" size="sm" className="text-green-600 hover:text-green-700 hover:bg-green-50">
                        Go to Editor <BookOpen className="w-4 h-4 ml-2"/>
                    </Button>
                  </Link>
                </div>

                <div className="space-y-3">
                  {chapters.map((chapter) => (
                    <div
                      key={chapter.id}
                      className="flex items-center justify-between p-4 bg-gray-50 border border-gray-100 rounded-lg hover:border-green-200 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-white border border-gray-200 rounded-full flex items-center justify-center text-xs font-bold text-gray-500">
                          {chapter.number}
                        </div>
                        <p className="font-semibold text-gray-900">
                          {chapter.title}
                        </p>
                      </div>
                      <Link href={`/admin/stories/${params.id}/editor`}>
                        <Button variant="ghost" size="icon" className="text-blue-600 hover:bg-blue-50">
                          <Edit2 className="w-4 h-4" />
                        </Button>
                      </Link>
                    </div>
                  ))}
                </div>

                {/* Add Chapter Button */}
                <button 
                  onClick={() => toast.info("Please use the Story Editor to add new chapters")}
                  className="mt-6 w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-green-600 hover:text-green-600 hover:bg-green-50 font-medium transition-colors"
                >
                  + Add Chapter (Go to Editor)
                </button>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end space-x-3 mb-8">
                <Link href="/admin/stories">
                  <Button
                    variant="outline"
                    className="border-gray-300 hover:bg-gray-100"
                  >
                    Cancel
                  </Button>
                </Link>
                <Button 
                  onClick={handleSave}
                  disabled={isSaving}
                  className="bg-green-600 hover:bg-emerald-700 text-white min-w-[120px]"
                >
                  {isSaving ? "Saving..." : "Save Settings"}
                </Button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </AdminRoute>
  );
}