"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/context/AuthContext";
import { AlertCircle } from "lucide-react";
import { toast } from "sonner"; // Untuk notifikasi pop up

export default function LoginPage() {
  const navigate = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [activeField, setActiveField] = useState<"email" | "password" | null>(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const userData = await login(email, password);
      
      toast.success("Login Berhasil!", {
        description: `Selamat datang kembali, ${userData.name}`,
      });

      // Masuk berdasarkan role
      if (userData.role === "admin") {
        navigate.push("/admin/dashboard");
      } else {
        // role user biasa
        navigate.push("/dashboard");
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Login gagal. Coba lagi."
      );
      toast.error("Login Gagal", {
        description: "Periksa kembali email dan password Anda.",
      });
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
          <div className="mb-8">
            <svg
              viewBox="0 0 200 200"
              className="w-40 h-40 mx-auto text-white opacity-90"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              {/* Logo */}
              <circle cx="100" cy="60" r="30" />
              <path d="M 60 120 Q 50 100 60 80" />
              <path d="M 140 120 Q 150 100 140 80" />
              <rect x="30" y="140" width="40" height="50" />
              <rect x="130" y="150" width="40" height="40" />
              <line x1="20" y1="190" x2="180" y2="190" strokeWidth="2" />
            </svg>
          </div>
          <h1 className="text-4xl font-bold text-white mb-4">EpoStory</h1>
          <p className="text-lg text-white text-opacity-90">
            Learn through interactive environmental stories
          </p>
        </div>
      </div>

      {/* Sebelah Kanan - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center bg-gray-50 px-6 py-12">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden text-center mb-8">
            <h1 className="text-3xl font-bold text-green-600 mb-2">EpoStory</h1>
            <p className="text-sm text-gray-600">
              Learn through interactive stories
            </p>
          </div>

          {/* Card */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            {/* Logo */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-green-600 rounded-xl mb-4">
                <span className="text-white font-bold text-lg">E</span>
              </div>
            </div>

            <h2 className="text-2xl font-bold text-gray-900 text-center mb-2">
              Selamat Datang di EpoStory
            </h2>
            <p className="text-center text-gray-600 mb-8">Masuk ke akun anda</p>

            {/* Info Demo */}
            <div className="space-y-3 mb-6">
              {/* Akun User */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <p className="text-xs font-semibold text-blue-900 mb-2">
                  Learner Dummy Account:
                </p>
                <p className="text-xs text-blue-800">
                  Email: <span className="font-mono font-bold">demo@epostory.com</span>
                </p>
                <p className="text-xs text-blue-800">
                  Password: <span className="font-mono font-bold">demo123</span>
                </p>
              </div>

              {/* Akun Admin */}
              <div className="bg-green-50 border border-green-600 rounded-lg p-3">
                <p className="text-xs font-semibold text-green-600 mb-2">
                  Admin Dummy Account:
                </p>
                <p className="text-xs text-green-600">
                  Email: <span className="font-mono font-bold">admin@epostory.com</span>
                </p>
                <p className="text-xs text-green-600">
                  Password: <span className="font-mono font-bold">admin123</span>
                </p>
              </div>
            </div>

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
                <Input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => setActiveField("password")}
                  onBlur={() => setActiveField(null)}
                  className={`rounded-lg border-2 transition-colors ${
                    activeField === "password"
                      ? "border-blue-500 ring-2 ring-blue-200"
                      : "border-gray-300"
                  }`}
                />
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
            By logging in, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
      </div>
    </div>
  );
}