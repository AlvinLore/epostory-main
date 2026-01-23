"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AdminRoute({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        router.push("/login");
      } else if (user.role !== "admin") { // Pastikan user object punya properti 'role'
        router.push("/dashboard"); // Redirect user biasa ke dashboard mereka
      }
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return <div className="flex h-screen items-center justify-center">Loading Admin Panel...</div>;
  }

  // Hanya render jika user adalah admin
  return user?.role === "admin" ? <>{children}</> : null;
}