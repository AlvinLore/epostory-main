"use client";

import AdminRoute from "@/components/AdminRoute";
import { AdminSidebar } from "@/components/AdminSidebar";
import { Button } from "@/components/ui/button";
import { Edit2, Trash2, BarChart3, Users, BookOpen, Plus } from "lucide-react";
import Link from "next/link";

interface Story {
  id: string;
  title: string;
  chapters: number;
  status: "draft" | "published";
  lastUpdated: string;
  thumbnail?: string;
}

export default function StoryManagement() {
  // Data Dummy untuk Tabel
  const stories: Story[] = [
    {
      id: "1",
      title: "Chapter 1: Air Pollution Basics",
      chapters: 5,
      status: "published",
      lastUpdated: "2024-01-20",
      thumbnail: "🌍",
    },
    {
      id: "2",
      title: "Chapter 2: Climate Change Impact",
      chapters: 4,
      status: "published",
      lastUpdated: "2024-01-18",
      thumbnail: "🌡️",
    },
    {
      id: "3",
      title: "Chapter 3: Sustainable Solutions",
      chapters: 6,
      status: "draft",
      lastUpdated: "2024-01-15",
      thumbnail: "♻️",
    },
    {
      id: "4",
      title: "Chapter 4: Global Actions",
      chapters: 3,
      status: "draft",
      lastUpdated: "2024-01-12",
      thumbnail: "🌐",
    },
    {
      id: "5",
      title: "Chapter 5: Your Role",
      chapters: 4,
      status: "published",
      lastUpdated: "2024-01-10",
      thumbnail: "👤",
    },
  ];

  // Data Statistik
  const stats = [
    { label: "Total Stories", value: "24", icon: BookOpen, color: "blue" },
    { label: "Active Users", value: "342", icon: Users, color: "green" },
    {
      label: "Total Quizzes",
      value: "1,542",
      icon: BarChart3,
      color: "orange",
    },
  ];

  return (
    <AdminRoute>
      <div className="flex min-h-screen bg-gray-50">
        <AdminSidebar />

        {/* Main Content */}
        <main className="ml-64 flex-1">
          {/* Header */}
          <div className="bg-white border-b border-gray-200 px-8 py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Story Management
                </h1>
                <p className="text-gray-600 mt-1">
                  Manage and create educational stories for the platform
                </p>
              </div>
              <Link href="/admin/stories/create">
                <Button className="bg-green-600 hover:bg-emerald-700 text-white gap-2">
                  <Plus className="w-4 h-4" /> Create New Storybook
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
                // Logika pewarnaan badge statistik
                const colorClasses = {
                  blue: "bg-blue-100 text-blue-600",
                  green: "bg-green-100 text-green-600",
                  orange: "bg-orange-100 text-orange-600",
                };

                return (
                  <div
                    key={index}
                    className="bg-white rounded-lg shadow p-6 flex items-start space-x-4"
                  >
                    <div
                      className={`p-3 rounded-lg ${
                        colorClasses[stat.color as keyof typeof colorClasses]
                      }`}
                    >
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

            {/* Data Table */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
              {/* Table Header */}
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-bold text-gray-900">
                  All Stories ({stories.length})
                </h2>
              </div>

              {/* Table */}
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Cover
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Title
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Chapters
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Last Updated
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {stories.map((story) => (
                      <tr key={story.id} className="hover:bg-gray-50 transition-colors">
                        {/* Cover Image */}
                        <td className="px-6 py-4">
                          <div className="w-12 h-16 bg-gray-100 border border-gray-200 rounded-lg flex items-center justify-center text-2xl shadow-sm">
                            {story.thumbnail}
                          </div>
                        </td>

                        {/* Title */}
                        <td className="px-6 py-4">
                          <span className="font-medium text-gray-900">
                            {story.title}
                          </span>
                        </td>

                        {/* Chapters */}
                        <td className="px-6 py-4">
                          <span className="text-gray-600 bg-gray-100 px-2 py-1 rounded text-sm">
                            {story.chapters} Ch
                          </span>
                        </td>

                        {/* Status */}
                        <td className="px-6 py-4">
                          {story.status === "published" ? (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              <span className="w-2 h-2 mr-1 bg-green-500 rounded-full"></span>
                              Published
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                              <span className="w-2 h-2 mr-1 bg-yellow-500 rounded-full"></span>
                              Draft
                            </span>
                          )}
                        </td>

                        {/* Last Updated */}
                        <td className="px-6 py-4">
                          <span className="text-gray-500 text-sm">
                            {new Date(story.lastUpdated).toLocaleDateString("id-ID", {
                              day: 'numeric', month: 'short', year: 'numeric'
                            })}
                          </span>
                        </td>

                        {/* Actions */}
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-3">
                            <button className="p-1 text-blue-600 hover:bg-blue-50 rounded transition-colors" title="Edit" >
                                <Edit2 className="w-4 h-4" />
                            </button>
                            <button className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors" title="Delete" >
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
              <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
                <span className="text-sm text-gray-600">
                  Showing 1 to 5 of 24 stories
                </span>
                <div className="flex items-center space-x-2">
                  <button className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50">
                    Previous
                  </button>
                  <button className="px-3 py-1 text-sm bg-green-600 text-white rounded-md shadow-sm">
                    1
                  </button>
                  <button className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50">
                    2
                  </button>
                  <button className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50">
                    Next
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