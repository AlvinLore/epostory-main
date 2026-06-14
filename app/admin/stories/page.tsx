"use client";

import { useState, useEffect } from "react";
import AdminRoute from "@/components/AdminRoute";
import { AdminSidebar } from "@/components/AdminSidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Edit2, Trash2, BarChart3, Users, BookOpen, Plus, Loader2, Search } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

interface Story {
  id: string;
  number: string;
  title: string;
  status: "draft" | "published";
  updated_at: string;
  cover_image?: string | null;
}

export default function StoryManagement() {
  const [stories, setStories] = useState<Story[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  //STATE PENCARIAN, FILTER, PAGINASI
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "draft" | "published">("all"); // State baru untuk filter
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchStories();
  }, []);

  const fetchStories = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/stories");
      const result = await res.json();
      
      if (result.success) {
        setStories(result.data);
      } else {
        toast.error("Gagal", { description: "Gagal mengambil data cerita." });
      }
    } catch (error) {
      console.error("Error fetching stories:", error);
      toast.error("Ralat Server", { description: "Gagal terhubung ke database." });
    } finally {
      setIsLoading(false);
    }
  };

  //LOGIKA FILTER, PENCARIAN, PAGINASI
  const filteredStories = stories.filter(story => {
    //Cek kecocokan dengan pencarian judul/nomor
    const matchesSearch = story.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          story.number.toLowerCase().includes(searchQuery.toLowerCase());
    
    //Cek filter status
    const matchesStatus = statusFilter === "all" ? true : story.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.ceil(filteredStories.length / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentStories = filteredStories.slice(startIndex, startIndex + itemsPerPage);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1); 
  };

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setStatusFilter(e.target.value as "all" | "draft" | "published");
    setCurrentPage(1); //Kembali ke halaman 1 saat filter status diubah
  };

  const handleDelete = async (id: string, title: string) => {
    //Tampilkan peringatan
    if (!confirm(`Apakah Anda yakin ingin menghapus cerita "${title}"?`)) return;

    try {
      const res = await fetch(`/api/stories?id=${id}`, {
        method: "DELETE",
      });
      const result = await res.json();

      if (result.success) {
        toast.success("Berhasil", { description: "Cerita berhasil dihapus." });
        fetchStories();
      } else {
        toast.error("Gagal", { description: result.message });
      }
    } catch (error) {
      toast.error("Ralat Sistem", { description: "Gagal terhubung ke server." });
    }
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const stats = [
    { label: "Total Cerita", value: isLoading ? "-" : stories.length.toString(), icon: BookOpen, color: "blue" },
    { label: "Active Users", value: "342", icon: Users, color: "green" }, 
    { label: "Total Cerita Dikerjakan", value: "67", icon: BarChart3, color: "orange" }, 
  ];

  return (
    <AdminRoute>
      <div className="flex min-h-screen bg-gray-50">
        <AdminSidebar />

        <main className="flex-1 md:ml-64 pt-16 md:pt-0 transition-all duration-300">
          
          <div className="bg-white border-b border-gray-200 px-4 py-6 md:px-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                  Manajemen Cerita
                </h1>
                <p className="text-gray-600 mt-1 text-sm md:text-base">
                  Kelola cerita interaktif disini
                </p>
              </div>
              <Link href="/admin/stories/create">
                <Button className="bg-green-600 hover:bg-green-700 text-white w-full md:w-auto shadow-md gap-2">
                  <Plus className="w-4 h-4" /> Buat Cerita Baru
                </Button>
              </Link>
            </div>
          </div>

          <div className="p-4 md:p-8">
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-6 md:mb-8">
              {stats.map((stat, index) => {
                const Icon = stat.icon;
                let colorClasses = "";
                if (stat.color === "blue") colorClasses = "bg-blue-100 text-blue-600";
                else if (stat.color === "green") colorClasses = "bg-green-100 text-green-600";
                else if (stat.color === "orange") colorClasses = "bg-orange-100 text-orange-600";

                return (
                  <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 md:p-6 flex items-start space-x-3 md:space-x-4 hover:shadow-md transition-all">
                    <div className={`p-2 md:p-3 rounded-lg ${colorClasses} flex-shrink-0`}>
                      <Icon className="w-5 h-5 md:w-6 md:h-6" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-gray-500 text-xs md:text-sm font-medium">{stat.label}</p>
                      <p className="text-2xl md:text-3xl font-bold text-gray-900 mt-1">{stat.value}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              
              {/* HEADER TABEL */}
              <div className="px-4 md:px-6 py-4 border-b border-gray-100 bg-gray-50/50 flex flex-col md:flex-row justify-between items-center gap-4">
                <h2 className="text-base md:text-lg font-bold text-gray-900 whitespace-nowrap">
                  All Stories ({filteredStories.length})
                </h2>
                
                {/* Wrapper untuk Filter dan Search */}
                <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
                  
                  {/* Dropdown Filter Status */}
                  <select
                    value={statusFilter}
                    onChange={handleStatusChange}
                    className="w-full sm:w-auto rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-700 font-medium"
                  >
                    <option value="all">Semua Status</option>
                    <option value="draft">Draft (Belum Rilis)</option>
                    <option value="published">Published (Sudah Rilis)</option>
                  </select>

                  {/* Search Bar */}
                  <div className="relative w-full sm:w-72">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input 
                      type="text"
                      placeholder="Cari judul atau nomor..."
                      value={searchQuery}
                      onChange={handleSearchChange}
                      className="pl-9 bg-white text-sm"
                    />
                  </div>
                  
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-3 md:px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Cover</th>
                      <th className="px-3 md:px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Info Cerita</th>
                      <th className="px-3 md:px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="hidden md:table-cell px-3 md:px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Diperbarui</th>
                      <th className="px-3 md:px-6 py-3 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Aksi</th>
                    </tr>
                  </thead>
                  
                  <tbody className="divide-y divide-gray-100">
                    {isLoading ? (
                      <tr>
                        <td colSpan={5} className="py-10 text-center">
                          <Loader2 className="w-8 h-8 animate-spin text-green-600 mx-auto mb-2" />
                          <p className="text-sm text-gray-500">Memuat data cerita...</p>
                        </td>
                      </tr>
                    ) : currentStories.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="py-10 text-center text-gray-500 text-sm">
                          {searchQuery || statusFilter !== "all" 
                            ? "Tidak ada cerita yang cocok dengan filter dan pencarian Anda." 
                            : "Belum ada cerita yang dibuat."}
                        </td>
                      </tr>
                    ) : (
                      currentStories.map((story) => (
                        <tr key={story.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-3 md:px-6 py-4 whitespace-nowrap">
                            <div className="w-10 h-10 md:w-12 md:h-12 bg-gray-100 rounded-lg flex items-center justify-center text-xl shadow-sm border border-gray-200 overflow-hidden">
                              {story.cover_image ? (
                                <img src={story.cover_image} alt="cover" className="w-full h-full object-cover" />
                              ) : "📖"}
                            </div>
                          </td>

                          <td className="px-3 md:px-6 py-4">
                            <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-md mb-1 inline-block">
                              {story.number}
                            </span>
                            <span className="font-semibold text-gray-900 text-xs md:text-sm block max-w-[150px] md:max-w-none truncate">
                              {story.title}
                            </span>
                          </td>

                          <td className="px-3 md:px-6 py-4 whitespace-nowrap">
                            {story.status === "published" ? (
                              <span className="inline-flex items-center px-2.5 py-0.5 bg-green-100 text-green-700 text-xs font-bold rounded-full border border-green-200">
                                Published
                              </span>
                            ) : (
                              <span className="inline-flex items-center px-2.5 py-0.5 bg-yellow-100 text-yellow-700 text-xs font-bold rounded-full border border-yellow-200">
                                Draft
                              </span>
                            )}
                          </td>

                          <td className="hidden md:table-cell px-3 md:px-6 py-4 whitespace-nowrap">
                            <span className="text-gray-500 text-xs md:text-sm">
                              {new Date(story.updated_at).toLocaleDateString("id-ID", {
                                day: 'numeric', month: 'short', year: 'numeric'
                              })}
                            </span>
                          </td>

                          <td className="px-3 md:px-6 py-4 whitespace-nowrap text-right">
                            <div className="flex items-center justify-end space-x-2">
                              <Link href={`/admin/stories/${story.id}/editor`}>
                                  <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Edit Story">
                                  <Edit2 className="w-4 h-4" />
                                  </button>
                              </Link>
                              <button 
                                onClick={() => handleDelete(story.id, story.title)}
                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                title="Delete Story"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* FITUR PAGINASI (PAGINATION) */}
              {!isLoading && filteredStories.length > 0 && (
                <div className="px-4 md:px-6 py-4 border-t border-gray-100 bg-gray-50/30 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <span className="text-xs md:text-sm text-gray-500 text-center md:text-left">
                    Menunjukkan {startIndex + 1}-{Math.min(startIndex + itemsPerPage, filteredStories.length)} dari {filteredStories.length} cerita
                  </span>
                  
                  <div className="flex items-center justify-center space-x-2">
                    <button 
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="px-3 py-1.5 border border-gray-200 bg-white rounded-md hover:bg-gray-50 text-xs md:text-sm text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      Sebelumnya
                    </button>
                    
                    <span className="px-3 py-1.5 text-xs md:text-sm font-semibold text-gray-700">
                      Hal {currentPage} / {totalPages}
                    </span>

                    <button 
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="px-3 py-1.5 border border-gray-200 bg-white rounded-md hover:bg-gray-50 text-xs md:text-sm text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      Selanjutnya
                    </button>
                  </div>
                </div>
              )}

            </div>
          </div>
        </main>
      </div>
    </AdminRoute>
  );
}