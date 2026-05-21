"use client";

import { useState } from "react";
import AdminRoute from "@/components/AdminRoute";
import { AdminSidebar } from "@/components/AdminSidebar";
import { ShieldCheck, UserPlus, Save, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

export default function AdminSettings() {
  const [newAdmin, setNewAdmin] = useState({ name: "", email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);

  const handleCreateAdmin = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validasi sederhana
    if (!newAdmin.name || !newAdmin.email || !newAdmin.password) {
      toast.error("Gagal", { description: "Semua kolom wajib diisi!" });
      return;
    }

    // Simulasi pembuatan akun (Nanti dihubungkan ke API/Backend)
    toast.success("Berhasil!", {
      description: `Akun admin untuk ${newAdmin.name} berhasil dibuat.`,
    });

    // Reset Form
    setNewAdmin({ name: "", email: "", password: "" });
  };

  return (
    <AdminRoute>
      <div className="flex min-h-screen bg-gray-50">
        <AdminSidebar />

        <main className="flex-1 md:ml-64 pt-16 md:pt-0 transition-all duration-300">
          
          <div className="bg-white border-b border-gray-200 px-4 py-6 md:px-8">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Pengaturan</h1>
            <p className="text-gray-600 mt-1 text-sm md:text-base">
              Atur hak akses dan konfigurasi sistem EpoStory.
            </p>
          </div>

          <div className="p-4 md:p-8 max-w-4xl">
            {/* Form Pembuatan Admin */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="bg-gray-900 px-6 py-4 flex items-center gap-3">
                <ShieldCheck className="w-6 h-6 text-green-400" />
                <h2 className="text-lg font-bold text-white">Tambahkan Administrator Baru</h2>
              </div>
              
              <div className="p-6 md:p-8">
                <p className="text-gray-600 text-sm mb-6">
                  Akun yang dibuat di sini akan memiliki akses penuh ke Dashboard Admin, pembuatan cerita, dan analisis data reponden.
                </p>

                <form onSubmit={handleCreateAdmin} className="space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Nama Lengkap Admin</label>
                      <Input 
                        placeholder="Contoh: Taufik dobleh" 
                        value={newAdmin.name}
                        onChange={(e) => setNewAdmin({...newAdmin, name: e.target.value})}
                        className="bg-gray-50 focus:bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Alamat Email (Login)</label>
                      <Input 
                        type="email" 
                        placeholder="admin@stis.ac.id" 
                        value={newAdmin.email}
                        onChange={(e) => setNewAdmin({...newAdmin, email: e.target.value})}
                        className="bg-gray-50 focus:bg-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Password Akun</label>
                    <div className="relative">
                      <Input
                        type={showPassword ? "text" : "password"}
                        placeholder="Minimal 8 karakter rahasia"
                        value={newAdmin.password}
                        onChange={(e) => setNewAdmin({...newAdmin, password: e.target.value})}
                        className="bg-gray-50 focus:bg-white pr-10"
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

                  <div className="pt-4 flex justify-end">
                    <Button type="submit" className="bg-gray-900 hover:bg-gray-800 gap-2">
                      <UserPlus className="w-4 h-4" /> Daftarkan Admin
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          </div>

        </main>
      </div>
    </AdminRoute>
  );
}