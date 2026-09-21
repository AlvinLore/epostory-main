"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/context/AuthContext";
import { AlertCircle, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner"; // Untuk notifikasi pop up

export default function LoginPage() {
  const navigate = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [activeField, setActiveField] = useState<"email" | "password" | null>(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const result = await login(email, password);
      
      // Cek apakah loginnya benar-benar sukses (bernilai true)
      if (result.success) {
        // Masuk berdasarkan role
        if (result.role === "admin") {
          navigate.push("/admin/dashboard");
        } else {
          navigate.push("/dashboard");
        }
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Login gagal. Coba lagi."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Sebelah Kiri - Ilustrasi */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-green-600 to-emerald-600 items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-72 h-72 bg-white rounded-full"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-white rounded-full opacity-5"></div>
        </div>
        <div className="relative z-10 text-center px-8">
          <div className="w-48 h-auto bg-white/10 rounded-[3rem] flex items-center justify-center p-6 mb-8 mx-auto shadow-2xl backdrop-blur-sm border border-white/20">
            <img src="/Logo EpoStory.png" alt="EpoStory" className="w-full h-full object-contain drop-shadow-xl" />
          </div>
          <p className="text-lg text-white text-opacity-90">
            Learn through interactive environmental stories
          </p>
        </div>
      </div>

      {/* Sebelah Kanan - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center bg-gray-50 px-6 py-12">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden text-center mb-1 flex flex-col items-center">
            <img src="/Logo EpoStory.png" alt="EpoStory" className="w-32 h-auto mb-2 drop-shadow-sm" />
          </div>

          {/* Card */}
          <div className="bg-white rounded-2xl shadow-lg p-8">

            <h2 className="text-2xl font-bold text-gray-900 text-center mb-2">
              Selamat Datang di EpoStory
            </h2>
            <p className="text-center text-gray-600 mb-8">Masuk ke akun anda</p>

            {/* Pesan Error */}
            {error && (
              <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-3 flex items-start space-x-3">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <Input
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onFocus={() => setActiveField("email")}
                  onBlur={() => setActiveField(null)}
                  className={`rounded-lg border-2 transition-colors ${
                    activeField === "email"
                      ? "border-blue-500 ring-2 ring-blue-200"
                      : "border-gray-300"
                  }`}
                />
              </div>

              {/* Password Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onFocus={() => setActiveField("password")}
                    onBlur={() => setActiveField(null)}
                    className={`rounded-lg border-2 transition-colors pr-10 ${
                      activeField === "password"
                        ? "border-blue-500 ring-2 ring-blue-200"
                        : "border-gray-300"
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Tombol Submit */}
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-green-600 hover:bg-emerald-700 text-white font-semibold py-3 rounded-lg mt-8 text-base disabled:opacity-50 disabled:cursor-not-allowed h-auto"
              >
                {isLoading ? "Logging in..." : "Mulai Perjalanan"}
              </Button>
            </form>

            {/* Create Account Link */}
            <div className="text-center mt-6">
              <p className="text-gray-600">
                Belum punya akun?{" "}
                <Link
                  href="/signup"
                  className="text-green-600 hover:text-emerald-700 font-semibold underline"
                >
                  Buat Akun
                </Link>
              </p>
            </div>
          </div>

          {/* Footer */}
          <p className="text-center text-xs text-gray-500 mt-8">
            Dengan mendaftar, Anda menyetujui bahwa data aktivitas dan hasil belajar Anda dapat digunakan semata-mata untuk keperluan penelitian.
          </p>
        </div>
      </div>
    </div>
  );
}