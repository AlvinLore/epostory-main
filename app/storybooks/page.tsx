"use client";

import { Sidebar } from "@/components/Sidebar";
import { Button } from "@/components/ui/button";
import { ArrowRight, BookOpen, Star, History } from "lucide-react";
import Link from "next/link";

export default function MyStorybooks() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />

      {/* Main Content */}
      <main className="md:ml-64 pb-24 md:pb-8">
        
        {/* Header Banner */}
        <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white p-6 md:p-10 shadow-sm">
          <div className="max-w-4xl">
            <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-3">
              <BookOpen className="w-8 h-8" /> Ceritaku
            </h1>
            <p className="text-green-100 mt-2 text-sm md:text-base">
              Jelajahi dan kelola histori ceritamu
            </p>
          </div>
        </div>

        {/* Content Area */}
        <div className="p-6 md:p-8">
          <div className="max-w-5xl mx-auto">
            
            {/* Main Placeholder Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center mb-10">
              <div className="mb-8">
                <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-6xl">📚</span>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-3">
                  Histori sedang dibangun...
                </h2>
                <p className="text-gray-600 max-w-md mx-auto leading-relaxed">
                  Saat ini histori atau koleksi masih dalam tahap pembangunan
                </p>
              </div>

              <Link href="/dashboard">
                <Button className="bg-green-600 hover:bg-emerald-700 text-white gap-2 px-8 py-6 h-auto text-lg shadow-sm hover:shadow-md transition-all">
                  <span>Kembali ke Beranda</span>
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}