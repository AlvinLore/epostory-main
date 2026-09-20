"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  BookOpen,
  BarChart3,
  Settings,
  Menu,
  X,
  UserCircle,
} from "lucide-react";

const navItems = [
  { label: "Dashboard", path: "/admin/dashboard", icon: LayoutDashboard },
  { label: "Manajemen Cerita", path: "/admin/stories", icon: BookOpen },
  { label: "Analisis", path: "/admin/analytics", icon: BarChart3 },
  { label: "Pengaturan", path: "/admin/settings", icon: Settings },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* MOBILE HAMBURGER BUTTON */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 left-4 z-50 md:hidden p-2 rounded-lg bg-green-600 text-white hover:bg-green-700 transition-colors shadow-lg"
        aria-label="Toggle menu"
      >
        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* MOBILE OVERLAY (Background Gelap) */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* SIDEBAR CONTAINER */}
      <aside
        className={cn(
          "fixed left-0 top-0 h-screen w-64 bg-gray-900 text-white flex flex-col shadow-2xl z-50 transition-transform duration-300 ease-in-out",
          // Logika Responsif: Geser keluar layar di mobile jika tertutup
          isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        )}
      >
        {/* Logo Section */}
        <div className="px-6 py-8 border-b border-gray-800">
          <Link 
            href="/admin/dashboard" 
            className="inline-block group" 
            onClick={() => setIsOpen(false)}
          >
            <div className="flex items-center gap-3">
                <img src="/Logo EpoStory.png" alt="EpoStory Logo" className="w-10 h-auto rounded-xl" />
                <div>
                  <div className="text-lg font-bold text-white leading-none">EpoStory</div>
                  <div className="text-xs text-gray-400 mt-1">Admin Panel</div>
                </div>
              </div>
          </Link>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 px-4 py-8 space-y-2 overflow-y-auto custom-scrollbar">
          {navItems.map((item) => {
            // Cek apakah path aktif
            const isActive = pathname.startsWith(item.path);
            const Icon = item.icon;
            
            return (
              <Link
                key={item.path}
                href={item.path}
                onClick={() => setIsOpen(false)}
                className={cn(
                  "flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 group",
                  isActive
                    ? "bg-green-600 text-white shadow-md shadow-green-900/20"
                    : "text-gray-400 hover:bg-gray-800 hover:text-white"
                )}
              >
                <Icon className={cn("w-5 h-5 transition-colors", isActive ? "text-white" : "text-gray-400 group-hover:text-white")} />
                <span className="text-sm font-medium">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Link Profil */}
        <div className="p-4 border-t border-gray-800">
          <Link
            href="/admin/profile"
            onClick={() => setIsOpen(false)}
            className={cn(
              "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors border border-transparent",
              pathname === "/admin/profile"
                ? "bg-gray-800 text-green-400 border-gray-700"
                : "hover:bg-gray-800 text-gray-400 hover:border-gray-700 hover:text-white"
            )}
          >
            <div className="w-8 h-8 rounded-full bg-gray-800 border border-gray-700 flex items-center justify-center text-gray-400">
              <UserCircle className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-200">Profil Admin</p>
              <p className="text-xs text-gray-500">Periksa Akun</p>
            </div>
          </Link>
        </div>
      </aside>
    </>
  );
}