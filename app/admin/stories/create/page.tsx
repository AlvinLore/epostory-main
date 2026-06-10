"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import AdminRoute from "@/components/AdminRoute";
import { AdminSidebar } from "@/components/AdminSidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Image as ImageIcon, Sparkles, Hash, Tag } from "lucide-react";
import { toast } from "sonner";

export default function CreateStoryPage() {
  const router = useRouter();
  
  //State
  const [formData, setFormData] = useState({
    number: "",       // Penomoran cerita selain id (misal: "1", "4")
    title: "",        // Judul cerita
    synopsis: "",     // Ringkasan
    topic: "",        // Topik
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

  const [isLoading, setIsLoading] = useState(false);

  const handleCreate = async () => {
    //Validasi sederhana
    if (!formData.title || !formData.number) {
      toast.error("Data Tidak Lengkap", { description: "Nomor dan Judul cerita wajib diisi."});
      return;
    }

    setIsLoading(true);

    try {
      //Tambahkan data ke API Backend MySQL
      const res = await fetch("/api/stories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const result = await res.json();

      if (!res.ok || !result.success) {
        throw new Error(result.message || "Gagal menyimpan ke database");
      }

      toast.success("Cerita Berhasil Dibuat!", { description: "Mengarahkan ke editor..."});
      router.push(`/admin/stories/${result.data.id}/editor`);
      
    } catch (error: any) {
      toast.error("Ralat Sistem", { description: error.message });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AdminRoute>
      <div className="flex min-h-screen bg-gray-50">
        <AdminSidebar />

        {/* MAIN CONTENT WRAPPER*/}
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
            <div className="max-w-3xl mx-auto w-full">
              
               <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 md:p-8">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-3">
                    <h3 className="font-bold text-lg text-gray-900">
                      Detail Cerita
                    </h3>
                    <div className="bg-blue-50 border border-blue-100 rounded-lg p-2.5 text-xs text-blue-700 flex items-center gap-1.5 font-medium">
                        <Sparkles className="w-4 h-4" /> Cover & Sertifikat dapat diatur di dalam Editor.
                    </div>
                  </div>

                  <div className="space-y-6">
                    {/* Baris 1: Number & Topic */}
                    <div className="grid grid-cols-1 sm:grid-cols-12 gap-5">
                        <div className="sm:col-span-4">
                            <label className="block text-sm font-semibold text-gray-700 mb-1.5 flex items-center gap-1">
                              <Hash className="w-3 h-3 text-gray-400" /> Nomor Cerita (ID Buatan)
                            </label>
                            <Input 
                              name="number"
                              type="text"
                              value={formData.number}
                              onChange={handleInputChange}
                              placeholder="Contoh: PU1"
                              className="font-mono"
                            />
                        </div>

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
                       disabled={!formData.title || !formData.number || isLoading}
                       className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white shadow-md py-6 sm:py-2 text-base"
                     >
                        {isLoading ? "Memproses..." : "Buat & Buka Editor"}
                     </Button>
                  </div>
               </div>

            </div>
          </div>

        </main>
      </div>
    </AdminRoute>
  );
}