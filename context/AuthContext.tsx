"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

interface User {
  id: string;
  email: string;
  name: string;
  role: "user" | "admin";
  gender?: "Laki-laki" | "Perempuan" | "";
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<User>;
  register: (name: string, email: string, password: string, gender: "Laki-laki" | "Perempuan" | "") => Promise<User>;
  changePassword: (oldPassword: string, newPassword: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Dummy
const DUMMY_USER = {
  id: "1",
  email: "demo@epostory.com",
  password: "demo123",
  name: "Alex Sitompul Panjaitan",
  role: "user" as const,
  gender: "Laki-laki" as const
};

const DUMMY_ADMIN = {
  id: "2",
  email: "admin@epostory.com",
  password: "admin123",
  name: "Admin User",
  role: "admin" as const,
  gender: "Laki-laki" as const
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // FUNGSI HELPER: Mengambil atau membuat "Database" pengguna di localStorage (Hanya untuk simulasi, bukan untuk produksi)
  const getUsersDB = () => {
    if (typeof window !== "undefined") {
      const storedDB = localStorage.getItem("epostory_users_db");
      if (storedDB) return JSON.parse(storedDB);
      
      // Jika belum ada, buat baru dengan data dummy
      const initialDB = [DUMMY_USER, DUMMY_ADMIN];
      localStorage.setItem("epostory_users_db", JSON.stringify(initialDB));
      return initialDB;
    }
    return [DUMMY_USER, DUMMY_ADMIN];
  };

  const saveUsersDB = (db: any[]) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("epostory_users_db", JSON.stringify(db));
    }
  };

  // Cek apakah user sudah login saat aplikasi dimuat
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedUser = localStorage.getItem("epostory_user");
      if (storedUser) {
        try {
          setUser(JSON.parse(storedUser));
        } catch (error) {
          console.error("Failed to parse stored user:", error);
          localStorage.removeItem("epostory_user");
        }
      }
      setIsLoading(false);
    }
  }, []);

  // LOGIN
  const login = async (email: string, password: string) => {
    return new Promise<User>((resolve, reject) => {
      setTimeout(() => {
        const db = getUsersDB();
        const foundUser = db.find((u: any) => u.email === email && u.password === password);

        if (foundUser) {
          const userData: User = {
            id: foundUser.id,
            email: foundUser.email,
            name: foundUser.name,
            role: foundUser.role,
            gender: foundUser.gender
          };
          setUser(userData);
          localStorage.setItem("epostory_user", JSON.stringify(userData));
          resolve(userData);
        } else {
          reject(new Error("Email atau password salah"));
        }
      }, 500);
    });
  };

  // REGISTER
  const register = async (name: string, email: string, password: string, gender: "Laki-laki" | "Perempuan" | "") => {
    return new Promise<User>((resolve, reject) => {
      setTimeout(() => {
        const db = getUsersDB();
        
        // Cek email sudah ada atau belum
        if (db.some((u: any) => u.email === email)) {
          reject(new Error("Email sudah terdaftar. Silakan gunakan email lain."));
          return;
        }

        const newUser = {
          id: Date.now().toString(), // Generate ID unik pakai waktu
          email,
          password,
          name,
          role: "user" as const, // Default user biasa
          gender
        };

        db.push(newUser);
        saveUsersDB(db);

        // Login otomatis setelah daftar
        const userData: User = { id: newUser.id, email: newUser.email, name: newUser.name, role: newUser.role, gender: newUser.gender };
        setUser(userData);
        localStorage.setItem("epostory_user", JSON.stringify(userData));
        resolve(userData);
      }, 600);
    });
  };

  // FUNGSI GANTI PASSWORD
  const changePassword = async (oldPassword: string, newPassword: string) => {
    return new Promise<void>((resolve, reject) => {
      setTimeout(() => {
        if (!user) {
          reject(new Error("Anda belum login"));
          return;
        }

        const db = getUsersDB();
        const userIndex = db.findIndex((u: any) => u.id === user.id);

        if (userIndex === -1) {
          reject(new Error("Akun tidak ditemukan di database"));
          return;
        }

        // Validasi password lama
        if (db[userIndex].password !== oldPassword) {
          reject(new Error("Password saat ini salah"));
          return;
        }

        // Update password baru
        db[userIndex].password = newPassword;
        saveUsersDB(db);
        resolve();
      }, 500);
    });
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("epostory_user");
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, changePassword, logout }}>
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