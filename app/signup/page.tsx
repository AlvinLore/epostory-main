"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/context/AuthContext";
import { AlertCircle } from "lucide-react";

export default function SignupPage() {
  const navigate = useRouter();
  const { signup } = useAuth();
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    gender: ""
  });
  
  const [activeField, setActiveField] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    //Validasi dasar
    if (!formData.name || !formData.email || !formData.password) {
      setError("Harap isi semua kolom wajib.");
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setError("Password dan Konfirmasi Password tidak cocok.");
      return;
    }

    setIsLoading(true);

    try {
      const isSuccess = await signup(
        formData.name,
        formData.email,
        formData.password,
        formData.gender
      );

      if (isSuccess) {
        navigate.push("/login");
      }
    } catch (err) {
      setError("Terjadi kesalahan sistem. Coba lagi.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-row-reverse">
      {/* Sebelah Kanan - Ilustrasi */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-bl from-emerald-600 to-teal-700 items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 right-10 w-72 h-72 bg-white rounded-full"></div>
          <div className="absolute bottom-20 left-20 w-96 h-96 bg-white rounded-full opacity-5"></div>
        </div>
        <div className="relative z-10 text-center px-8">
          <h1 className="text-4xl font-bold text-white mb-4">Mulai Perjalananmu</h1>
          <p className="text-lg text-white text-opacity-90">
            Daftar sekarang dan jadilah bagian dari pahlawan lingkungan!
          </p>
        </div>
      </div>

      {/* Sebelah Kiri - Form Registrasi */}
      <div className="w-full lg:w-1/2 flex items-center justify-center bg-gray-50 px-6 py-12">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 text-center mb-2">
              Buat Akun Baru
            </h2>
            <p className="text-center text-gray-600 mb-8">Lengkapi data diri Anda</p>

            {error && (
              <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-3 flex items-start space-x-3">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nama Pengguna</label>
                <Input
                  type="text"
                  placeholder="Nama Lengkap"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  onFocus={() => setActiveField("name")}
                  onBlur={() => setActiveField(null)}
                  className={activeField === "name" ? "border-emerald-500 ring-2 ring-emerald-200" : ""}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <Input
                  type="email"
                  placeholder="contoh@email.com"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  onFocus={() => setActiveField("email")}
                  onBlur={() => setActiveField(null)}
                  className={activeField === "email" ? "border-emerald-500 ring-2 ring-emerald-200" : ""}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                  <Input
                    type="password"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                    onFocus={() => setActiveField("password")}
                    onBlur={() => setActiveField(null)}
                    className={activeField === "password" ? "border-emerald-500 ring-2 ring-emerald-200" : ""}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Konfirmasi</label>
                  <Input
                    type="password"
                    placeholder="••••••••"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                    onFocus={() => setActiveField("confirmPassword")}
                    onBlur={() => setActiveField(null)}
                    className={activeField === "confirmPassword" ? "border-emerald-500 ring-2 ring-emerald-200" : ""}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Jenis Kelamin (Opsional)</label>
                <select
                  value={formData.gender}
                  onChange={(e) => setFormData({...formData, gender: e.target.value})}
                  className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="" disabled>Pilih Jenis Kelamin</option>
                  <option value="L">Laki-laki</option>
                  <option value="P">Perempuan</option>
                </select>
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 rounded-lg mt-4 text-base h-auto"
              >
                {isLoading ? "Memproses..." : "Daftar Akun"}
              </Button>
            </form>

            <div className="text-center mt-6">
              <p className="text-gray-600">
                Sudah punya akun?{" "}
                <Link href="/login" className="text-emerald-600 hover:text-emerald-700 font-semibold underline">
                  Masuk di sini
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}