"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

interface User {
  id: string;
  email: string;
  name: string;
  role: "user" | "admin";
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<User>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Dummy user data
const DUMMY_USER = {
  id: "1",
  email: "demo@epostory.com",
  password: "demo123",
  name: "Alex Johnson",
};

const DUMMY_ADMIN = {
  id: "2",
  email: "admin@epostory.com",
  password: "admin123",
  name: "Admin User",
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check if user is logged in on mount
  useEffect(() => {
    // Pastikan kode ini hanya jalan di browser
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

  const login = async (email: string, password: string) => {
    // Simulate API call delay
    return new Promise<User>((resolve, reject) => {
      setTimeout(() => {
        let userData: User | null = null;

        // Check admin credentials
        if (
          email === DUMMY_ADMIN.email &&
          password === DUMMY_ADMIN.password
        ) {
          userData = {
            id: DUMMY_ADMIN.id,
            email: DUMMY_ADMIN.email,
            name: DUMMY_ADMIN.name,
            role: "admin",
          };
        }
        // Check user credentials
        else if (
          email === DUMMY_USER.email &&
          password === DUMMY_USER.password
        ) {
          userData = {
            id: DUMMY_USER.id,
            email: DUMMY_USER.email,
            name: DUMMY_USER.name,
            role: "user",
          };
        }

        if (userData) {
          setUser(userData);
          localStorage.setItem("epostory_user", JSON.stringify(userData));
          resolve(userData);
        } else {
          reject(new Error("Invalid email or password"));
        }
      }, 500);
    });
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("epostory_user");
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout }}>
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