"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { Button } from "@/components/ui/button"; // Opsional: Menggunakan komponen Button kita
import { Home } from "lucide-react";

export default function NotFound() {
  const pathname = usePathname();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      pathname
    );
  }, [pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center p-8 bg-white rounded-2xl shadow-sm border border-gray-100 max-w-md w-full mx-4">
        {/* Ilustrasi Teks Sederhana */}
        <h1 className="text-8xl font-black text-gray-200 mb-4">404</h1>
        
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Oops! Page not found
        </h2>
        
        <p className="text-gray-600 mb-8">
            The page you are looking for doesn't exist or has been moved.
        </p>

        <Link href="/">
          <Button className="bg-green-600 hover:bg-emerald-700 text-white w-full py-6 text-lg shadow-green-200 shadow-lg">
            <Home className="w-5 h-5 mr-2" /> Return to Home
          </Button>
        </Link>
        
        {/* Debug Info (Opsional, hanya muncul jika pathname ada) */}
        {pathname && (
            <p className="mt-8 text-xs text-gray-400 font-mono">
                Requested path: {pathname}
            </p>
        )}
      </div>
    </div>
  );
}