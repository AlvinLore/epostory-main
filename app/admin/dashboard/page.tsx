"use client";

import AdminRoute from "@/components/AdminRoute";
import { AdminSidebar } from "@/components/AdminSidebar";
import { Button } from "@/components/ui/button";
import { BarChart3, BookOpen, Users } from "lucide-react";
import Link from "next/link"; // Menggunakan next/link

export default function AdminDashboardPage() {
  const stats = [
    {
      label: "Total Stories",
      value: "24",
      icon: BookOpen,
      color: "bg-blue-100 text-blue-600",
    },
    {
      label: "Active Users",
      value: "342",
      icon: Users,
      color: "bg-green-100 text-green-600", // Mengganti eco-green ke warna standar Tailwind (jika eco-green belum ada di config)
    },
    {
      label: "Total Quizzes Taken",
      value: "1,542",
      icon: BarChart3,
      color: "bg-orange-100 text-orange-600",
    },
  ];

  const recentActivities = [
    {
      title: "New Story Created",
      description: 'Chapter 1: "Climate Change Basics"',
      timestamp: "2 hours ago",
    },
    {
      title: "User Completed Quiz",
      description: "Alex Johnson scored 85% on Chapter 2 Quiz",
      timestamp: "4 hours ago",
    },
    {
      title: "Story Updated",
      description: 'Chapter 3: "Sustainable Solutions" published',
      timestamp: "1 day ago",
    },
    {
      title: "User Registration",
      description: "5 new students registered",
      timestamp: "2 days ago",
    },
  ];

  return (
    <AdminRoute>
      <div className="flex min-h-screen bg-gray-50">
        {/* Sidebar dipanggil di sini */}
        <AdminSidebar />

        {/* Main Content dengan margin kiri agar tidak tertutup Sidebar */}
        <main className="ml-64 flex-1">
          {/* Header */}
          <div className="bg-white border-b border-gray-200 px-8 py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
                <p className="text-gray-600 mt-1">
                  Welcome back! Here's what's happening with EpoStory today.
                </p>
              </div>
              <Link href="/admin/stories/create">
                <Button className="bg-green-600 hover:bg-green-700 text-white">
                  + Create New Storybook
                </Button>
              </Link>
            </div>
          </div>

          {/* Content */}
          <div className="p-8">
            {/* Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {stats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <div
                    key={index}
                    className="bg-white rounded-lg shadow p-6 flex items-start space-x-4"
                  >
                    <div className={`p-3 rounded-lg ${stat.color}`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-gray-600 text-sm">{stat.label}</p>
                      <p className="text-3xl font-bold text-gray-900 mt-1">
                        {stat.value}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Main Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Recent Activities */}
              <div className="lg:col-span-2">
                <div className="bg-white rounded-lg shadow">
                  <div className="px-6 py-4 border-b border-gray-200">
                    <h2 className="text-lg font-bold text-gray-900">
                      Recent Activities
                    </h2>
                  </div>
                  <div className="divide-y divide-gray-200">
                    {recentActivities.map((activity, index) => (
                      <div key={index} className="px-6 py-4 hover:bg-gray-50">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-semibold text-gray-900">
                              {activity.title}
                            </h3>
                            <p className="text-sm text-gray-600 mt-1">
                              {activity.description}
                            </p>
                          </div>
                          <span className="text-xs text-gray-500 whitespace-nowrap ml-4">
                            {activity.timestamp}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Quick Actions & Status */}
              <div className="space-y-6">
                {/* Quick Actions */}
                <div className="bg-white rounded-lg shadow p-6">
                  <h2 className="text-lg font-bold text-gray-900 mb-4">
                    Quick Actions
                  </h2>
                  <div className="space-y-3">
                    <Link href="/admin/stories" className="block">
                      <button className="w-full px-4 py-3 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 font-medium text-sm transition-colors text-left">
                        Manage Stories
                      </button>
                    </Link>
                    <Link href="/admin/analytics" className="block">
                      <button className="w-full px-4 py-3 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 font-medium text-sm transition-colors text-left">
                        View Analytics
                      </button>
                    </Link>
                    <Link href="/admin/stories/create" className="block">
                      <button className="w-full px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium text-sm transition-colors text-left">
                        Create Story
                      </button>
                    </Link>
                    <Link href="/admin/settings" className="block">
                      <button className="w-full px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 font-medium text-sm transition-colors text-left">
                        Settings
                      </button>
                    </Link>
                  </div>
                </div>

                {/* System Status */}
                <div className="bg-white rounded-lg shadow p-6">
                  <h2 className="text-lg font-bold text-gray-900 mb-4">
                    System Status
                  </h2>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">API Status</span>
                      <span className="inline-block px-2 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded">
                        Operational
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Database</span>
                      <span className="inline-block px-2 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded">
                        Connected
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Storage</span>
                      <span className="inline-block px-2 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded">
                        Healthy
                      </span>
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