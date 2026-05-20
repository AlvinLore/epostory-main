"use client";

import AdminRoute from "@/components/AdminRoute";
import { AdminSidebar } from "@/components/AdminSidebar";
import { BarChart3 } from "lucide-react";

export default function AdminAnalytics() {
  return (
    <AdminRoute>
      <div className="flex min-h-screen bg-gray-50">
        <AdminSidebar />

        {/* Main Content */}
        <main className="flex-1 md:ml-64 pt-16 md:pt-0 transition-all duration-300">
          
          {/* Header */}
          <div className="bg-white border-b border-gray-200 px-4 py-6 md:px-8">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Analisis</h1>
            <p className="text-gray-600 mt-1 text-sm md:text-base">
              Lihat keterlibatan pengguna dan statistik pembelajaran
            </p>
          </div>

          {/* Content */}
          <div className="p-4 md:p-8">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 md:p-12 text-center">
              
              {/* Icon Container Responsive */}
              <div className="w-16 h-16 md:w-20 md:h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4 md:mb-6 transition-all">
                <BarChart3 className="w-8 h-8 md:w-10 md:h-10 text-green-600" />
              </div>
              
              <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">
                Analisis
              </h2>
              <p className="text-sm md:text-base text-gray-600 max-w-md mx-auto leading-relaxed">
                Menu Analisis sedang dalam tahap pengembangan.
              </p>
            </div>
          </div>
        </main>
      </div>
    </AdminRoute>
  );
}