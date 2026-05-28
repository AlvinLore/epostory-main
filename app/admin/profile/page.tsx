"use client";

import { useState, useEffect } from "react";
import AdminRoute from "@/components/AdminRoute";
import { AdminSidebar } from "@/components/AdminSidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/context/AuthContext";
import { LogOut, Save, UserCircle, Lock, KeyRound } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function AdminProfile() {
  const { user, logout, changePassword } = useAuth();
  const router = useRouter();

  // State untuk form profile
  const [formData, setFormData] = useState({
    fullName: "Admin",
    email: "admin@epostory.com",
    role: "admin"
  });

  // State untuk form ganti password
  const [passwords, setPasswords] = useState({
    current: "",
    new: "",
    confirm: ""
  });
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        fullName: user.name || "Admin",
        email: user.email || "admin@epostory.com",
        role: user.role || "admin"
      });
    }
  }, [user]);

  const handleSaveProfile = () => {
    toast.success("Profil Diperbarui", {
      description: "Perubahan profil admin sukses disimpan (Simulasi frontend)."
    });
  };

  const handleSavePassword = async () => {
    if (!passwords.current || !passwords.new || !passwords.confirm) {
      toast.error("Gagal", { description: "Harap isi semua kolom password." });
      return;
    }
    if (passwords.new !== passwords.confirm) {
      toast.error("Gagal", { description: "Password baru dan konfirmasi tidak cocok." });
      return;
    }

    setIsChangingPassword(true);
    try {
      await changePassword(passwords.current, passwords.new);
      toast.success("Berhasil", { description: "Password Admin telah diperbarui." });
      setPasswords({ current: "", new: "", confirm: "" });
    } catch (error: any) {
      toast.error("Gagal Mengubah Password", { description: error.message });
    } finally {
      setIsChangingPassword(false);
    }
  };

  const handleLogout = () => {
    logout();
    router.push("/");
    toast.info("Berhasil logout dari mode Admin");
  };

  return (
    <AdminRoute>
      <div className="flex min-h-screen bg-gray-50">
        <AdminSidebar />

        <main className="flex-1 md:ml-64 pt-16 md:pt-0 transition-all duration-300">
          {/* Header */}
          <div className="bg-white border-b border-gray-200 px-4 py-6 md:px-8">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Profil Administrator</h1>
            <p className="text-gray-600 mt-1 text-sm md:text-base">
              Kelola akun sistem Anda
            </p>
          </div>

          <div className="p-4 md:p-8">
            <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
              
              {/* Kolom Kiri */}
              <div className="lg:col-span-1 space-y-6">
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-24 bg-blue-50 z-0"></div>
                  <div className="relative z-10 w-28 h-28 rounded-full bg-white p-1 mx-auto mb-4 shadow-sm">
                      <div className="w-full h-full rounded-full bg-gradient-to-br from-blue-600 to-indigo-800 flex items-center justify-center text-white text-4xl font-bold">
                        {formData.fullName.charAt(0).toUpperCase()}
                      </div>
                  </div>
                  <div className="relative z-10">
                      <h2 className="text-xl font-bold text-gray-900">{formData.fullName}</h2>
                      <p className="text-gray-500 text-sm mb-4">{formData.email}</p>
                      <span className="inline-block px-4 py-1.5 bg-blue-100 text-blue-800 text-xs font-bold uppercase tracking-wider rounded-full border border-blue-200">
                        Admin
                      </span>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                  <h3 className="text-sm font-semibold text-gray-900 mb-4">Aksi Akun</h3>
                  <Button 
                      onClick={handleLogout}
                      variant="destructive" 
                      className="w-full gap-2 bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700 border border-red-100 shadow-none"
                  >
                      <LogOut className="w-4 h-4" /> Keluar dari Admin
                  </Button>
                </div>
              </div>

              {/* Kolom Kanan */}
              <div className="lg:col-span-2 space-y-6">
                
                {/* Form 1: Edit Profile */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 md:p-8">
                  <div className="flex items-center justify-between mb-6 border-b pb-4">
                      <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                        <UserCircle className="w-5 h-5 text-gray-500"/> Data Admin
                      </h3>
                  </div>

                  <div className="space-y-5">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Nama Administrator</label>
                      <Input 
                        value={formData.fullName} 
                        onChange={(e) => setFormData({...formData, fullName: e.target.value})} 
                        className="rounded-lg border-gray-300 focus-visible:ring-blue-500" 
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Alamat Email Sistem</label>
                      <Input 
                        type="email" 
                        value={formData.email} 
                        onChange={(e) => setFormData({...formData, email: e.target.value})} 
                        className="rounded-lg border-gray-300 bg-gray-50" 
                        disabled 
                      />
                      <p className="text-xs text-gray-400 mt-1">*Email login administrator bersifat tetap.</p>
                    </div>
                    
                    <div className="pt-2 flex justify-end">
                      <Button onClick={handleSaveProfile} className="bg-blue-600 hover:bg-blue-700 text-white px-8 gap-2">
                        <Save className="w-4 h-4" /> Simpan Perubahan
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Form 2: Ganti Password */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 md:p-8">
                  <div className="flex items-center justify-between mb-6 border-b pb-4">
                      <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                        <Lock className="w-5 h-5 text-gray-500"/> Update Password
                      </h3>
                  </div>

                  <div className="space-y-5">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Password Admin Saat Ini</label>
                      <Input 
                        type="password" 
                        placeholder="Masukkan password lama"
                        value={passwords.current} 
                        onChange={(e) => setPasswords({...passwords, current: e.target.value})} 
                        className="focus-visible:ring-blue-500"
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Password Baru</label>
                        <Input 
                          type="password" 
                          placeholder="Minimal 6 karakter"
                          value={passwords.new} 
                          onChange={(e) => setPasswords({...passwords, new: e.target.value})} 
                          className="focus-visible:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Konfirmasi Password Baru</label>
                        <Input 
                          type="password" 
                          placeholder="Ulangi password baru"
                          value={passwords.confirm} 
                          onChange={(e) => setPasswords({...passwords, confirm: e.target.value})} 
                          className="focus-visible:ring-blue-500"
                        />
                      </div>
                    </div>
                    
                    <div className="pt-2 flex justify-end">
                      <Button 
                        onClick={handleSavePassword} 
                        disabled={isChangingPassword}
                        variant="outline"
                        className="border-gray-300 text-gray-700 hover:bg-gray-50 hover:text-blue-600 px-8 gap-2"
                      >
                        <KeyRound className="w-4 h-4" /> {isChangingPassword ? "Memproses..." : "Perbarui Keamanan"}
                      </Button>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </main>
      </div>
    </AdminRoute>
  );
}