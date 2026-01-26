"use client";

import { useState, useEffect } from "react";
import { Sidebar } from "@/components/Sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/context/AuthContext";
import { LogOut, Save, UserCircle } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function ProfileSettings() {
  const { user, logout } = useAuth();
  const router = useRouter();

  // State untuk form
  const [formData, setFormData] = useState({
    fullName: "Learner",
    email: "learner@example.com",
    school: "STIS"
  });

  // Update state saat data user dari context siap
  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        fullName: user.name || "Learner",
        email: user.email || "learner@example.com"
      }));
    }
  }, [user]);

  const handleSave = () => {
    // Simulasi simpan data
    toast.success("Profile Updated", {
      description: "Perubahanmu sukses disimpan."
    });
    console.log("Saved:", formData);
  };

  const handleLogout = () => {
    logout();
    router.push("/"); // Redirect ke halaman login/landing
    toast.info("Berhasil logout");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />

      {/* Main Content */}
      <main className="md:ml-64 pb-24 md:pb-8">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white p-6 md:p-10 shadow-sm">
          <div className="max-w-5xl mx-auto">
            <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-3">
              <UserCircle className="w-8 h-8" /> Pengaturan Profil
            </h1>
            <p className="text-green-100 mt-2">Kelola akun personalmu</p>
          </div>
        </div>

        {/* Content Area */}
        <div className="p-6 md:p-8">
          <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Kolom Kiri - Profile Card */}
            <div className="lg:col-span-1 space-y-6">
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center relative overflow-hidden">
                {/* Background */}
                <div className="absolute top-0 left-0 w-full h-24 bg-green-50 z-0"></div>
                
                {/* Avatar */}
                <div className="relative z-10 w-28 h-28 rounded-full bg-white p-1 mx-auto mb-4 shadow-sm">
                    <div className="w-full h-full rounded-full bg-gradient-to-br from-green-500 to-emerald-700 flex items-center justify-center text-white text-4xl font-bold">
                    {formData.fullName.charAt(0).toUpperCase()}
                    </div>
                </div>

                {/* Bio */}
                <div className="relative z-10">
                    <h2 className="text-xl font-bold text-gray-900">{formData.fullName}</h2>
                    <p className="text-gray-500 text-sm mb-4">{formData.email}</p>
                    
                    <span className="inline-block px-4 py-1.5 bg-green-100 text-green-700 text-xs font-bold uppercase tracking-wider rounded-full border border-green-200">
                    Student
                    </span>

                    <p className="text-gray-400 text-xs mt-6">
                    Bergabung sejak Januari 2026
                    </p>
                </div>
              </div>

              {/* Logout Button Card */}
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

            {/* Kolom Kanan - Edit Form */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* Edit Form */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-bold text-gray-900">
                    Edit Profile
                    </h3>
                </div>

                <div className="space-y-5">
                  {/* Full Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nama Lengkap
                    </label>
                    <Input
                      type="text"
                      value={formData.fullName}
                      onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                      className="rounded-lg border-gray-300 focus:ring-green-500"
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Alamat Email
                    </label>
                    <Input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className="rounded-lg border-gray-300 focus:ring-green-500"
                    />
                  </div>

                  {/* School/Institution */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Sekolah / Institusi
                    </label>
                    <Input
                      type="text"
                      value={formData.school}
                      onChange={(e) => setFormData({...formData, school: e.target.value})}
                      className="rounded-lg border-gray-300 focus:ring-green-500"
                    />
                  </div>

                  {/* Save Button */}
                  <div className="pt-4 flex justify-end">
                    <Button
                      onClick={handleSave}
                      className="bg-green-600 hover:bg-emerald-700 text-white font-medium px-8 py-2 rounded-lg shadow-sm gap-2"
                    >
                      <Save className="w-4 h-4" /> Simpan
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