"use client";

import AdminRoute from "@/components/AdminRoute";
import { AdminSidebar } from "@/components/AdminSidebar";
import { Button } from "@/components/ui/button";
import { BarChart3, BookOpen, Users } from "lucide-react"; // Ikon cepat
import Link from "next/link"; // Link cepat

export default function AdminDashboard() {
  const stats = [
    {
      label: "Total Cerita",
      value: "3",
      icon: BookOpen,
      color: "bg-blue-100 text-blue-600",
    },
    {
      label: "User Aktif",
      value: "342",
      icon: Users,
      color: "bg-green-100 text-green-600",
    },
    {
      label: "Total Cerita Dikerjakan",
      value: "67",
      icon: BarChart3,
      color: "bg-orange-100 text-orange-600",
    },
  ];

  const recentActivities = [
    {
      title: "Update Story",
      description: '"Chapter 3: Mengurangi Polusi Udara" dipublikasikan',
      timestamp: "3 jam lalu",
    },
    {
      title: "Cerita Baru Ditambahkan",
      description: 'Chapter 3: Mengurangi Polusi Udara',
      timestamp: "1 hari lalu",
    },
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
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Dashboard</h1>
                <p className="text-gray-600 mt-1 text-sm md:text-base">
                  Selamat datang! Berikut rekapan EpoStory hari ini.
                </p>
              </div>
              <Link href="/admin/stories/create">
                <Button className="bg-green-600 hover:bg-green-700 text-white w-full md:w-auto shadow-md transition-all">
                  + Buat Cerita Baru
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
                return (
                  <div
                    key={index}
                    className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 md:p-6 flex items-start space-x-3 md:space-x-4 hover:shadow-md transition-shadow"
                  >
                    <div className={`p-2 md:p-3 rounded-lg ${stat.color} flex-shrink-0`}>
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

            {/* Main Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
              
              {/* Recent Activities */}
              <div className="lg:col-span-2">
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                  <div className="px-4 md:px-6 py-4 border-b border-gray-100 bg-gray-50/50">
                    <h2 className="text-base md:text-lg font-bold text-gray-900">
                      Aktivitas Sebelumnya
                    </h2>
                  </div>
                  <div className="divide-y divide-gray-100">
                    {recentActivities.map((activity, index) => (
                      <div key={index} className="px-4 md:px-6 py-4 hover:bg-gray-50 transition-colors">
                        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-2 md:gap-0">
                          <div className="min-w-0 flex-1">
                            <h3 className="font-semibold text-gray-900 text-sm md:text-base">
                              {activity.title}
                            </h3>
                            <p className="text-xs md:text-sm text-gray-500 mt-1">
                              {activity.description}
                            </p>
                          </div>
                          <span className="text-xs text-gray-400 flex-shrink-0 bg-gray-100 px-2 py-1 rounded-full whitespace-nowrap">
                            {activity.timestamp}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Quick Actions & System Status */}
              <div className="space-y-6">
                
                {/* Quick Actions Card */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 md:p-6">
                  <h2 className="text-base md:text-lg font-bold text-gray-900 mb-3 md:mb-4">
                    Aksi Cepat
                  </h2>
                  <div className="space-y-2 md:space-y-3">
                    <Link href="/admin/stories" className="block">
                      <button className="w-full px-4 py-3 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 font-medium text-xs md:text-sm transition-colors text-left flex items-center justify-between group">
                        <span>Atur Cerita</span>
                        <span className="opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                      </button>
                    </Link>
                    <Link href="/admin/analytics" className="block">
                      <button className="w-full px-4 py-3 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 font-medium text-xs md:text-sm transition-colors text-left flex items-center justify-between group">
                        <span>Lihat Analisis</span>
                        <span className="opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                      </button>
                    </Link>
                    <Link href="/admin/stories/create" className="block">
                      <button className="w-full px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium text-xs md:text-sm transition-colors text-left flex items-center justify-between shadow-sm hover:shadow group">
                        <span>Buat Cerita</span>
                        <span className="group-hover:translate-x-1 transition-transform">+</span>
                      </button>
                    </Link>
                    <Link href="/admin/settings" className="block">
                      <button className="w-full px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 font-medium text-xs md:text-sm transition-colors text-left flex items-center justify-between group">
                        <span>Pengaturan</span>
                        <span className="opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                      </button>
                    </Link>
                  </div>
                </div>

                {/* System Status Card */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 md:p-6">
                  <h2 className="text-base md:text-lg font-bold text-gray-900 mb-3 md:mb-4">
                    Status Sistem
                  </h2>
                  <div className="space-y-3">
                    {[
                      { label: "Database", status: "Terkoneksi", color: "bg-green-100 text-green-700" }
                    ].map((item, i) => (
                      <div key={i} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg transition-colors">
                        <span className="text-xs md:text-sm text-gray-600 font-medium">{item.label}</span>
                        <span className={`inline-block px-2.5 py-0.5 ${item.color} text-[10px] md:text-xs font-bold rounded-full uppercase tracking-wide`}>
                          {item.status}
                        </span>
                      </div>
                    ))}
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