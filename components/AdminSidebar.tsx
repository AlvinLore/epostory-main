"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  BookOpen,
  BarChart3,
  Settings,
  LogOut,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";

const navItems = [
  { label: "Dashboard", path: "/admin/dashboard", icon: LayoutDashboard },
  { label: "Story Management", path: "/admin/stories", icon: BookOpen },
  { label: "User Analytics", path: "/admin/analytics", icon: BarChart3 },
  { label: "Settings", path: "/admin/settings", icon: Settings },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { logout } = useAuth();

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-gray-900 text-white flex flex-col shadow-xl z-50">
      {/* Logo Section */}
      <div className="px-6 py-8 border-b border-gray-800">
        <Link href="/admin/dashboard" className="inline-block">
          <div className="flex items-center gap-3">
            <div className="inline-flex items-center justify-center w-10 h-10 bg-green-600 rounded-lg">
              <span className="font-bold text-lg text-white">E</span>
            </div>
            <div>
              <div className="text-lg font-bold text-white leading-tight">EpoStory CMS</div>
              <div className="text-xs text-gray-400">Admin Panel</div>
            </div>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-8 space-y-2 overflow-y-auto">
        {navItems.map((item) => {
          // Cek apakah path saat ini sama dengan path menu
          const isActive = pathname === item.path;
          const Icon = item.icon;
          
          return (
            <Link
              key={item.path}
              href={item.path}
              className={cn(
                "flex items-center space-x-3 px-4 py-3 rounded-lg transition-all",
                isActive
                  ? "bg-green-600 text-white shadow-md"
                  : "text-gray-300 hover:bg-gray-800 hover:text-white"
              )}
            >
              <Icon className="w-5 h-5" />
              <span className="text-sm font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Logout Section */}
      <div className="px-4 py-6 border-t border-gray-800">
        <button
          onClick={() => {
            logout();
            router.push("/"); // Redirect ke home/login setelah logout
          }}
          className="flex items-center space-x-3 w-full px-4 py-3 text-red-400 hover:bg-red-900/20 hover:text-red-300 rounded-lg transition-colors"
        >
          <LogOut className="w-5 h-5" />
          <span className="text-sm font-medium">Logout</span>
        </button>
      </div>
    </aside>
  );
}