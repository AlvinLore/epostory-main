"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  BookOpen,
  BarChart3,
  Settings,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";

const navItems = [
  { label: "Dashboard", path: "/admin/dashboard", icon: LayoutDashboard },
  { label: "Manajemen Cerita", path: "/admin/stories", icon: BookOpen },
  { label: "Analisis", path: "/admin/analytics", icon: BarChart3 },
  { label: "Pengaturan", path: "/admin/settings", icon: Settings },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    logout();
    router.push("/");
    setIsOpen(false);
  };

  return (
    <>
      {/* --- MOBILE HAMBURGER BUTTON --- */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 left-4 z-50 md:hidden p-2 rounded-lg bg-green-600 text-white hover:bg-green-700 transition-colors shadow-lg"
        aria-label="Toggle menu"
      >
        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* --- MOBILE OVERLAY (Background Gelap) --- */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* --- SIDEBAR CONTAINER --- */}
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
                 <div className="inline-flex items-center justify-center w-10 h-10 bg-green-600 rounded-lg group-hover:bg-green-500 transition-colors shadow-lg shadow-green-900/20">
                    <span className="font-bold text-lg">E</span>
                 </div>
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

        {/* Logout Button */}
        <div className="px-4 py-6 border-t border-gray-800">
          <button
            onClick={handleLogout}
            className="flex items-center space-x-3 w-full px-4 py-3 text-red-400 hover:bg-red-900/20 hover:text-red-300 rounded-lg transition-colors group"
          >
            <LogOut className="w-5 h-5 group-hover:scale-110 transition-transform" />
            <span className="text-sm font-medium">Keluar</span>
          </button>
        </div>
      </aside>
    </>
  );
}