"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Home, BookOpen, Trophy, User } from "lucide-react";

// Menu Navigasi untuk User Biasa
const navItems = [
  { label: "Beranda", path: "/dashboard", icon: Home },
  { label: "Ceritaku", path: "/storybooks", icon: BookOpen },
  { label: "Pencapaian", path: "/achievements", icon: Trophy },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <>
      {/* --- Sidebar Dekstop --- */}
      <aside className="hidden md:fixed md:left-0 md:top-0 md:h-screen md:w-64 md:bg-white md:border-r md:border-gray-200 md:shadow-sm md:flex md:flex-col z-50">
        
        {/* Header */}
        <div className="px-6 py-8 flex-shrink-0">
          <Link href="/dashboard" className="inline-block group">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 bg-green-600 rounded-xl group-hover:bg-green-700 transition-colors shadow-sm">
                <span className="text-white font-bold text-lg">E</span>
              </div>
              <div className="text-lg font-bold text-gray-900">EpoStory</div>
            </div>
          </Link>
        </div>

        {/* Main Navigation */}
        <nav className="flex-1 space-y-2 px-3">
          {navItems.map((item) => {
            const isActive = pathname === item.path;
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                href={item.path}
                className={cn(
                  "flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 font-medium",
                  isActive
                    ? "bg-green-50 text-green-700 border-l-4 border-green-600"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                )}
              >
                <Icon className={cn("w-5 h-5", isActive ? "text-green-600" : "text-gray-400")} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Link Profil */}
        <div className="p-4 border-t border-gray-100">
          <Link
            href="/profile"
            className={cn(
              "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors border border-transparent",
              pathname === "/profile"
                ? "bg-green-50 text-green-700 border-green-100"
                : "hover:bg-gray-50 text-gray-700 hover:border-gray-200"
            )}
          >
            <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
              <User className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-semibold">Profil</p>
              <p className="text-xs text-gray-500">Periksa Akun</p>
            </div>
          </Link>
        </div>
      </aside>


      {/* --- Navigasi Mobile --- */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-2 py-2 flex justify-around items-center z-50 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
        {navItems.map((item) => {
          const isActive = pathname === item.path;
          const Icon = item.icon;
          return (
            <Link
              key={item.path}
              href={item.path}
              className={cn(
                "flex flex-col items-center justify-center p-2 rounded-lg transition-colors w-16",
                isActive ? "text-green-600" : "text-gray-400 hover:text-gray-600"
              )}
            >
              <Icon className={cn("w-6 h-6 mb-1", isActive && "fill-current")} />
              <span className="text-[10px] font-medium">{item.label}</span>
            </Link>
          );
        })}

        {/* Ikon Profil Mobile */}
        <Link
          href="/profile"
          className={cn(
            "flex flex-col items-center justify-center p-2 rounded-lg transition-colors w-16",
            pathname === "/profile" ? "text-green-600" : "text-gray-400 hover:text-gray-600"
          )}
        >
          <User className={cn("w-6 h-6 mb-1", pathname === "/profile" && "fill-current")} />
          <span className="text-[10px] font-medium">Profile</span>
        </Link>
      </nav>
      
      {/* Spacer untuk Mobile agar konten tidak tertutup navbar bawah */}
      <div className="md:hidden h-20" /> 
    </>
  );
}