"use client";

import { useState, useEffect } from "react";
import { Sidebar } from "@/components/Sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/context/AuthContext";
import { LogOut, Save, UserCircle, Lock, KeyRound, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function ProfileSettings() {
  const { user, logout, updateProfile, changePassword } = useAuth();
  const router = useRouter();

  // State form profile
  const [formData, setFormData] = useState({
    fullName: "Learner",
    email: "learner@example.com",
    gender: "",
    school: ""
  });

  // State form ganti password
  const [passwords, setPasswords] = useState({
    current: "",
    new: "",
    confirm: ""
  });
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        fullName: user.name || "Learner",
        email: user.email || "learner@example.com",
        gender: user.gender || "",
        school: user.school || ""
      }));
    }
  }, [user]);

  const [isSavingProfile, setIsSavingProfile] = useState(false);

  const handleSaveProfile = async () => {
    setIsSavingProfile(true);
    const success = await updateProfile(formData.fullName, formData.gender, formData.school);
    if (success) {
      toast.success("Profile Updated", {
        description: "Perubahanmu sukses disimpan."
      });
    }
    setIsSavingProfile(false);
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

    if (passwords.new.length < 8) {
      toast.error("Gagal", { description: "Password baru minimal terdiri dari 8 karakter." });
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
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar />

      {/* Main Content */}
      <main className="flex-1 md:ml-64 pb-24 md:pb-8">

        {/* Header Banner */}
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
                      {user?.name ? user.name.charAt(0).toUpperCase() : "L"}
                    </div>
                </div>
                <div className="relative z-10">
                    <h2 className="text-xl font-bold text-gray-900">{user?.name}</h2>
                    <p className="text-gray-500 text-sm mb-4">{user?.email}</p>
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
                    <Input placeholder="Opsional (Contoh: STIS)" value={formData.school} onChange={(e) => setFormData({...formData, school: e.target.value})} className="rounded-lg border-gray-300" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Jenis Kelamin</label>
                    <select value={formData.gender} onChange={(e) => setFormData({...formData, gender: e.target.value})} className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm">
                      <option value="" disabled>Pilih Jenis Kelamin</option>
                      <option value="L">Laki-laki</option>
                      <option value="P">Perempuan</option>
                    </select>
                  </div>
                  <div className="pt-2 flex justify-end">
                    <Button 
                      onClick={handleSaveProfile} 
                      disabled={isSavingProfile}
                      className="bg-green-600 hover:bg-emerald-700 text-white px-8 gap-2"
                    >
                      <Save className="w-4 h-4" /> {isSavingProfile ? "Menyimpan..." : "Simpan Profil"}
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
                    <div className="relative">
                      <Input 
                        type={showCurrentPassword ? "text" : "password"}
                        placeholder="Masukkan password lama"
                        value={passwords.current} 
                        onChange={(e) => setPasswords({...passwords, current: e.target.value})} 
                        className="pr-10"
                      />
                      <button type="button" onClick={() => setShowCurrentPassword(!showCurrentPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700">
                        {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Password Baru</label>
                      <div className="relative">
                        <Input 
                          type={showNewPassword ? "text" : "password"}
                          placeholder="Minimal 8 karakter"
                          value={passwords.new} 
                          onChange={(e) => setPasswords({...passwords, new: e.target.value})} 
                          className="pr-10"
                        />
                        <button type="button" onClick={() => setShowNewPassword(!showNewPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700">
                          {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Konfirmasi Password Baru</label>
                      <div className="relative">
                        <Input 
                          type={showConfirmPassword ? "text" : "password"}
                          placeholder="Ulangi password baru"
                          value={passwords.confirm} 
                          onChange={(e) => setPasswords({...passwords, confirm: e.target.value})} 
                          className="pr-10"
                        />
                        <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700">
                          {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
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