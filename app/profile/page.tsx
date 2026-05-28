"use client";

import { useState, useEffect } from "react";
import { Sidebar } from "@/components/Sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/context/AuthContext";
import { LogOut, Save, UserCircle, Lock, KeyRound } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function ProfileSettings() {
  const { user, logout, changePassword } = useAuth();
  const router = useRouter();

  // State form profile
  const [formData, setFormData] = useState({
    fullName: "Learner",
    email: "learner@example.com",
    school: "STIS",
    gender: ""
  });

  // State form ganti password
  const [passwords, setPasswords] = useState({
    current: "",
    new: "",
    confirm: ""
  });
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        fullName: user.name || "Learner",
        email: user.email || "learner@example.com",
        gender: user.gender || ""
      }));
    }
  }, [user]);

  const handleSaveProfile = () => {
    toast.success("Profile Updated", {
      description: "Perubahanmu sukses disimpan (Simulasi frontend)."
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
      toast.success("Berhasil", { description: "Password Anda telah diperbarui." });
      // Reset form password
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
    toast.info("Berhasil logout");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />

      <main className="md:ml-64 pb-24 md:pb-8">
        <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white p-6 md:p-10 shadow-sm">
          <div className="max-w-5xl mx-auto">
            <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-3">
              <UserCircle className="w-8 h-8" /> Pengaturan Profil
            </h1>
            <p className="text-green-100 mt-2">Kelola akun personalmu dan keamanan</p>
          </div>
        </div>

        <div className="p-6 md:p-8">
          <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Kolom Kiri */}
            <div className="lg:col-span-1 space-y-6">
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-24 bg-green-50 z-0"></div>
                <div className="relative z-10 w-28 h-28 rounded-full bg-white p-1 mx-auto mb-4 shadow-sm">
                    <div className="w-full h-full rounded-full bg-gradient-to-br from-green-500 to-emerald-700 flex items-center justify-center text-white text-4xl font-bold">
                    {formData.fullName.charAt(0).toUpperCase()}
                    </div>
                </div>
                <div className="relative z-10">
                    <h2 className="text-xl font-bold text-gray-900">{formData.fullName}</h2>
                    <p className="text-gray-500 text-sm mb-4">{formData.email}</p>
                    <span className="inline-block px-4 py-1.5 bg-green-100 text-green-700 text-xs font-bold uppercase tracking-wider rounded-full border border-green-200">
                      {user?.role === "admin" ? "Administrator" : "Student"}
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
                    <LogOut className="w-4 h-4" /> Sign Out / Keluar
                </Button>
              </div>
            </div>

            {/* Kolom Kanan */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* Form 1: Edit Profile */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
                <div className="flex items-center justify-between mb-6 border-b pb-4">
                    <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                      <UserCircle className="w-5 h-5 text-gray-500"/> Data Diri
                    </h3>
                </div>

                <div className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Nama Lengkap</label>
                    <Input value={formData.fullName} onChange={(e) => setFormData({...formData, fullName: e.target.value})} className="rounded-lg border-gray-300" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Alamat Email</label>
                    <Input type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="rounded-lg border-gray-300" disabled />
                    <p className="text-xs text-gray-400 mt-1">*Email tidak dapat diubah</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Sekolah / Institusi</label>
                    <Input value={formData.school} onChange={(e) => setFormData({...formData, school: e.target.value})} className="rounded-lg border-gray-300" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Jenis Kelamin</label>
                    <select value={formData.gender} onChange={(e) => setFormData({...formData, gender: e.target.value})} className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm">
                      <option value="" disabled>Pilih Jenis Kelamin</option>
                      <option value="Laki-laki">Laki-laki</option>
                      <option value="Perempuan">Perempuan</option>
                    </select>
                  </div>
                  <div className="pt-2 flex justify-end">
                    <Button onClick={handleSaveProfile} className="bg-green-600 hover:bg-emerald-700 text-white px-8 gap-2">
                      <Save className="w-4 h-4" /> Simpan Profil
                    </Button>
                  </div>
                </div>
              </div>

              {/* Form 2: Ganti Password */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
                <div className="flex items-center justify-between mb-6 border-b pb-4">
                    <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                      <Lock className="w-5 h-5 text-gray-500"/> Update Password
                    </h3>
                </div>

                <div className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Password Saat Ini</label>
                    <Input 
                      type="password" 
                      placeholder="Masukkan password lama"
                      value={passwords.current} 
                      onChange={(e) => setPasswords({...passwords, current: e.target.value})} 
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
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Konfirmasi Password Baru</label>
                      <Input 
                        type="password" 
                        placeholder="Ulangi password baru"
                        value={passwords.confirm} 
                        onChange={(e) => setPasswords({...passwords, confirm: e.target.value})} 
                      />
                    </div>
                  </div>
                  
                  <div className="pt-2 flex justify-end">
                    <Button 
                      onClick={handleSavePassword} 
                      disabled={isChangingPassword}
                      variant="outline"
                      className="border-gray-300 text-gray-700 hover:bg-gray-50 px-8 gap-2"
                    >
                      <KeyRound className="w-4 h-4" /> {isChangingPassword ? "Memproses..." : "Perbarui Password"}
                    </Button>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </main>
    </div>
  );
}