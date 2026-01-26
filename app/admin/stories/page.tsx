"use client";

import AdminRoute from "@/components/AdminRoute";
import { AdminSidebar } from "@/components/AdminSidebar";
import { Button } from "@/components/ui/button";
import { Edit2, Trash2, BarChart3, Users, BookOpen, Plus } from "lucide-react";
import Link from "next/link";

interface Story {
  id: string;
  number: number;
  title: string;
  pages: number;
  status: "draft" | "published";
  lastUpdated: string;
  thumbnail?: string;
  conditional?: string;
}

export default function StoryManagement() {
  const stories: Story[] = [
    {
      id: "1",
      number: 1,
      title: "Chapter 1: Apa Itu Polusi Udara?",
      pages: 10,
      status: "published",
      lastUpdated: "2024-01-20",
      thumbnail: "🌍",
      conditional: "none",
    },
    {
      id: "2",
      number: 2,
      title: "Chapter 2: Dampak Polusi Udara",
      pages: 4,
      status: "published",
      lastUpdated: "2024-01-18",
      thumbnail: "🌡️",
      conditional: "1",
    },
    {
      id: "3",
      number: 3,
      title: "Chapter 3: Mengurangi Polusi Udara",
      pages: 6,
      status: "draft",
      lastUpdated: "2024-01-15",
      thumbnail: "♻️",
      conditional: "2",
    },
  ];

  const stats = [
    { label: "Total Cerita", value: "3", icon: BookOpen, color: "blue" },
    { label: "Active Users", value: "342", icon: Users, color: "green" },
    { label: "Total Cerita Dikerjakan", value: "67", icon: BarChart3, color: "orange" },
  ];

  return (
    <AdminRoute>
      <div className="flex min-h-screen bg-gray-50">
        <AdminSidebar />

        {/* Main Content */}
        <main className="flex-1 md:ml-64 pt-16 md:pt-0 transition-all duration-300">
          
          {/* Header */}
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

          {/* Content */}
          <div className="p-4 md:p-8">
            
            {/* Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-6 md:mb-8">
              {stats.map((stat, index) => {
                const Icon = stat.icon;
                
                // Logic warna dinamis berdasarkan Tailwind classes
                let colorClasses = "";
                if (stat.color === "blue") colorClasses = "bg-blue-100 text-blue-600";
                else if (stat.color === "green") colorClasses = "bg-green-100 text-green-600";
                else if (stat.color === "orange") colorClasses = "bg-orange-100 text-orange-600";

                return (
                  <div
                    key={index}
                    className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 md:p-6 flex items-start space-x-3 md:space-x-4 hover:shadow-md transition-all"
                  >
                    <div className={`p-2 md:p-3 rounded-lg ${colorClasses} flex-shrink-0`}>
                      <Icon className="w-5 h-5 md:w-6 md:h-6" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-gray-500 text-xs md:text-sm font-medium">{stat.label}</p>
                      <p className="text-2xl md:text-3xl font-bold text-gray-900 mt-1">
                        {stat.value}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Data Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              {/* Table Header */}
              <div className="px-4 md:px-6 py-4 border-b border-gray-100 bg-gray-50/50">
                <h2 className="text-base md:text-lg font-bold text-gray-900">
                  All Stories ({stories.length})
                </h2>
              </div>

              {/* Table Wrapper untuk Horizontal Scroll di Mobile */}
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-3 md:px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                        Cover
                      </th>
                      <th className="px-3 md:px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                        Judul
                      </th>
                      {/* Hidden di Mobile */}
                      <th className="hidden sm:table-cell px-3 md:px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                        Halaman
                      </th>
                      <th className="px-3 md:px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      {/* Hidden di Tablet/Mobile */}
                      <th className="hidden md:table-cell px-3 md:px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                        Updated
                      </th>
                      <th className="px-3 md:px-6 py-3 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">
                        Aksi
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {stories.map((story) => (
                      <tr key={story.id} className="hover:bg-gray-50 transition-colors">
                        
                        {/* Cover Image */}
                        <td className="px-3 md:px-6 py-4 whitespace-nowrap">
                          <div className="w-10 h-10 md:w-12 md:h-12 bg-gray-100 rounded-lg flex items-center justify-center text-xl shadow-sm border border-gray-200">
                            {story.thumbnail}
                          </div>
                        </td>

                        {/* Judul */}
                        <td className="px-3 md:px-6 py-4">
                          <span className="font-semibold text-gray-900 text-xs md:text-sm block max-w-[150px] md:max-w-none truncate">
                            {story.title}
                          </span>
                        </td>

                        {/* Halaman (Responsive Hidden) */}
                        <td className="hidden sm:table-cell px-3 md:px-6 py-4 whitespace-nowrap">
                          <span className="text-gray-600 text-xs md:text-sm">{story.pages} Scenes</span>
                        </td>

                        {/* Status */}
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

                        {/* Updated (Responsive Hidden) */}
                        <td className="hidden md:table-cell px-3 md:px-6 py-4 whitespace-nowrap">
                          <span className="text-gray-500 text-xs md:text-sm">
                            {new Date(story.lastUpdated).toLocaleDateString()}
                          </span>
                        </td>

                        {/* Aksi */}
                        <td className="px-3 md:px-6 py-4 whitespace-nowrap text-right">
                          <div className="flex items-center justify-end space-x-2">
                            {/* Edit Link menuju settings cerita */}
                            <Link href={`/admin/stories/${story.id}/settings`}>
                                <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Edit Story">
                                <Edit2 className="w-4 h-4" />
                                </button>
                            </Link>
                            <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Delete Story">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="px-4 md:px-6 py-4 border-t border-gray-100 bg-gray-50/30 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <span className="text-xs md:text-sm text-gray-500 text-center md:text-left">
                  Menunjukkan 1-3 dari 3 cerita
                </span>
                <div className="flex items-center justify-center space-x-2">
                  <button className="px-3 py-1.5 border border-gray-200 rounded-md hover:bg-white text-xs md:text-sm text-gray-600 disabled:opacity-50">
                    Sebelumnya
                  </button>
                  <button className="px-3 py-1.5 bg-green-600 text-white rounded-md text-xs md:text-sm shadow-sm">
                    1
                  </button>
                  <button className="px-3 py-1.5 border border-gray-200 rounded-md hover:bg-white text-xs md:text-sm text-gray-600">
                    2
                  </button>
                  <button className="px-3 py-1.5 border border-gray-200 rounded-md hover:bg-white text-xs md:text-sm text-gray-600">
                    Selanjutnya
                  </button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </AdminRoute>
  );
}