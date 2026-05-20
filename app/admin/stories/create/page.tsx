"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import AdminRoute from "@/components/AdminRoute";
import { AdminSidebar } from "@/components/AdminSidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Image as ImageIcon, Sparkles, Hash, Tag } from "lucide-react";

export default function CreateStoryPage() {
  const router = useRouter();
  
  // State Form
  const [formData, setFormData] = useState({
    number: "",       // Penomoran cerita selain id (misal: "1", "4")
    title: "",        // Judul cerita
    synopsis: "",     // Ringkasan
    topic: "",        // Topik (misal: "Air Pollution")
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCreate = () => {
    // Validasi sederhana
    if (!formData.title || !formData.number) return;

    // Simulasi Create ID Baru
    const newStoryId = Date.now().toString();
    
    // Redirect ke Editor
    router.push(`/admin/stories/${newStoryId}/editor`);
  };

  return (
    <AdminRoute>
      <div className="flex min-h-screen bg-gray-50">
        <AdminSidebar />

        {/* --- MAIN CONTENT WRAPPER --- */}
        <main className="flex-1 md:ml-64 pt-16 md:pt-0 transition-all duration-300">
          
          {/* Header Section */}
          <div className="bg-white border-b border-gray-200 px-4 py-6 md:px-8">
            <div className="flex items-center gap-3 md:gap-4">
               <Link 
                 href="/admin/stories" 
                 className="p-2 -ml-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors"
               >
                  <ArrowLeft className="w-5 h-5 md:w-6 md:h-6"/>
               </Link>
               <div>
                  <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                    Buat Cerita Baru
                  </h1>
                  <p className="text-gray-600 mt-1 text-sm md:text-base">
                    Susun cerita untuk pengalaman belajar yang menarik!
                  </p>
               </div>
            </div>
          </div>

          {/* Form Content */}
          <div className="p-4 md:p-8">
            <div className="max-w-5xl mx-auto">
              
              {/* Responsive Grid Layout */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8">
                
                {/* --- KOLOM KIRI: COVER IMAGE (4/12) --- */}
                <div className="lg:col-span-4 space-y-6">
                  <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <ImageIcon className="w-4 h-4 text-gray-500" /> Cover Image
                    </h3>
                    
                    {/* Upload Zone */}
                    <div className="border-2 border-dashed border-gray-300 rounded-xl aspect-[3/4] flex flex-col items-center justify-center p-4 text-center hover:bg-green-50 hover:border-green-500 transition-all cursor-pointer group">
                        <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                            <span className="text-2xl">📸</span>
                        </div>
                        <p className="text-sm font-medium text-gray-900">Upload Cover</p>
                        <p className="text-xs text-gray-500 mt-1">Portrait (3:4)</p>
                    </div>
                  </div>

                  <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
                    <h4 className="text-sm font-bold text-blue-800 mb-2 flex items-center gap-2">
                        <Sparkles className="w-3 h-3" /> Info
                    </h4>
                    <p className="text-xs text-blue-700 leading-relaxed">
                        Nomor Cerita menunjukkan penomoran selain id.
                    </p>
                  </div>
                </div>

                {/* --- KOLOM KANAN: FORM DETAILS (8/12) --- */}
                <div className="lg:col-span-8">
                   <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 md:p-8">
                      <h3 className="font-bold text-lg text-gray-900 mb-6">
                        Story Details
                      </h3>

                      <div className="space-y-5">
                        
                        {/* Baris 1: Number & Topic (Responsive Grid) */}
                        <div className="grid grid-cols-1 sm:grid-cols-12 gap-5">
                            {/* Input Number */}
                            <div className="sm:col-span-4">
                                <label className="block text-sm font-semibold text-gray-700 mb-1.5 flex items-center gap-1">
                                  <Hash className="w-3 h-3 text-gray-400" /> Nomor Cerita
                                </label>
                                <Input 
                                  name="number"
                                  type="number"
                                  value={formData.number}
                                  onChange={handleInputChange}
                                  placeholder="Contoh 4"
                                  className="font-mono"
                                />
                            </div>

                            {/* Input Topic */}
                            <div className="sm:col-span-8">
                                <label className="block text-sm font-semibold text-gray-700 mb-1.5 flex items-center gap-1">
                                  <Tag className="w-3 h-3 text-gray-400" /> Topik
                                </label>
                                <Input 
                                  name="topic"
                                  type="text"
                                  value={formData.topic}
                                  onChange={handleInputChange}
                                  placeholder="Contoh: Polusi Udara"
                                />
                            </div>
                        </div>

                        {/* Story Title */}
                        <div>
                           <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                             Judul Cerita
                           </label>
                           <Input 
                             name="title"
                             value={formData.title}
                             onChange={handleInputChange}
                             placeholder="Contoh: Dampak Polusi Udara"
                             className="py-6 text-base md:text-lg font-medium" 
                           />
                        </div>

                        {/* Synopsis */}
                        <div>
                           <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                             Sinopsis
                           </label>
                           <textarea 
                             name="synopsis"
                             value={formData.synopsis}
                             onChange={handleInputChange}
                             placeholder="Sinopsis dari cerita yang dibuat..."
                             className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none min-h-[120px] text-sm"
                           ></textarea>
                        </div>

                      </div>

                      {/* Footer Actions */}
                      <div className="mt-8 pt-6 border-t border-gray-100 flex flex-col-reverse sm:flex-row justify-end gap-3">
                         <Button 
                           variant="ghost" 
                           onClick={() => router.back()}
                           className="w-full sm:w-auto"
                         >
                            Batal
                         </Button>
                         <Button 
                           onClick={handleCreate}
                           disabled={!formData.title || !formData.number} // Validasi Judul & Nomor wajib
                           className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white shadow-md py-6 sm:py-2 text-base"
                         >
                            Buat & Mulai Edit
                         </Button>
                      </div>
                   </div>
                </div>

              </div>
            </div>
          </div>

        </main>
      </div>
    </AdminRoute>
  );
}