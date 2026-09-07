"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { toast } from "sonner";

//Definisi Tipe Data User sesuai Database MySQL
interface User {
  id: string;
  name: string;
  email: string;
  role: "user" | "admin";
  gender?: string;
  school?: string | null;
  semester?: number | null;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; role?: string }>;
  signup: (name: string, email: string, password: string, gender: string, school: string, semester: number, website?: string) => Promise<boolean>;
  logout: () => void;
  updateProfile: (name: string, gender: string, school: string, semester?: number | null) => Promise<boolean>;
  changePassword: (current: string, newPass: string) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  //Efek untuk mengecek sesi login di localStorage saat aplikasi pertama kali dimuat
  useEffect(() => {
    const storedUser = localStorage.getItem("epostory_user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        localStorage.removeItem("epostory_user");
      }
    }
    setLoading(false);
  }, []);

  //Fungsi Login
  const login = async (email: string, password: string): Promise<{ success: boolean; role?: string }> => {
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const result = await res.json();

      if (!res.ok || !result.success) {
        toast.error("Gagal Masuk", { description: result.message || "Email atau password salah." });
        return { success: false };
      }

      //Simpan data user ke state dan localStorage (Sesi Aman)
      setUser(result.data);
      localStorage.setItem("epostory_user", JSON.stringify(result.data));
      
      toast.success("Log masuk Berhasil", { description: `Selamat datang kembali, ${result.data.name}!` });
      return { success: true, role: result.data.role };
    } catch (error) {
      console.error("Login Error:", error);
      toast.error("Ralat Sistem", { description: "Gagal terhubung ke server." });
      return { success: false };
    }
  };

  //Fungsi Signup (Register)
  const signup = async (name: string, email: string, password: string, gender: string, school: string, semester: number, website: string = ""): Promise<boolean> => {
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, gender, school, semester, website }),
      });

      const result = await res.json();

      if (!res.ok || !result.success) {
        toast.error("Pendaftaran Gagal", { description: result.message || "Silakan periksa kembali data Anda." });
        return false;
      }

      toast.success("Pendaftaran Berhasil", { description: "Silakan log masuk menggunakan akun baru Anda." });
      return true;
    } catch (error) {
      console.error("Signup Error:", error);
      toast.error("Ralat Sistem", { description: "Gagal terhubung ke server." });
      return false;
    }
  };

  //Fungsi Logout
  const logout = () => {
    setUser(null);
    localStorage.removeItem("epostory_user");
    toast.info("Anda telah log keluar");
  };

  //Fungsi Update Profil
  const updateProfile = async (name: string, gender: string, school: string, semester?: number | null): Promise<boolean> => {
    if (!user) return false;
    try {
      const payload: any = { id: user.id, name, gender, school };
      if (semester !== undefined) payload.semester = semester;
      
      const res = await fetch("/api/auth/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = await res.json();
      
      if (!res.ok || !result.success) {
        toast.error("Gagal", { description: result.message || "Gagal memperbarui profil" });
        return false;
      }
      
      //Perbarui state lokal & localStorage
      const updatedUser: any = { ...user, name, gender, school };
      if (semester !== undefined) updatedUser.semester = semester;
      setUser(updatedUser);
      localStorage.setItem("epostory_user", JSON.stringify(updatedUser));

      return true;
    } catch (error: any) {
      toast.error("Ralat Sistem", { description: "Gagal terhubung ke server." });
      return false;
    }
  };

  //Fungsi Ganti Password
  const changePassword = async (current: string, newPass: string): Promise<boolean> => {
    if (!user) throw new Error("Tidak ada sesi user aktif");
    try {
      const res = await fetch("/api/auth/password", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: user.id, currentPassword: current, newPassword: newPass }),
      });
      const result = await res.json();
      
      if (!res.ok || !result.success) {
        throw new Error(result.message || "Gagal memperbarui password");
      }
      return true;
    } catch (error: any) {
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout, updateProfile, changePassword }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}