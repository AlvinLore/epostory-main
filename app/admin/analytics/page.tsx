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
        <main className="ml-64 flex-1">
          {/* Header */}
          <div className="bg-white border-b border-gray-200 px-8 py-6">
            <h1 className="text-3xl font-bold text-gray-900">User Analytics</h1>
            <p className="text-gray-600 mt-1">
              View user engagement and learning statistics
            </p>
          </div>

          {/* Content */}
          <div className="p-8">
            <div className="bg-white rounded-lg shadow p-12 text-center border border-gray-100">
              {/* Ikon dengan background lingkaran agar lebih cantik */}
              <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <BarChart3 className="w-10 h-10 text-green-600" />
              </div>
              
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                User Analytics
              </h2>
              <p className="text-gray-600 max-w-md mx-auto">
                Analytics dashboard is under development. Check back soon for
                detailed user engagement metrics and learning statistics.
              </p>
            </div>
          </div>
        </main>
      </div>
    </AdminRoute>
  );
}