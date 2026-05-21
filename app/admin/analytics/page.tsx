"use client";

import { useState } from "react";
import AdminRoute from "@/components/AdminRoute";
import { AdminSidebar } from "@/components/AdminSidebar";
import { BarChart3, Search, Download, Users, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const DUMMY_RESPONDENTS = [
  { id: "R001", name: "Budi Santoso", email: "budi@stis.ac.id", gender: "Laki-laki", preTest: 40, postTest: 85, nGain: 0.75 },
  { id: "R002", name: "Siti Aminah", email: "siti@stis.ac.id", gender: "Perempuan", preTest: 50, postTest: 90, nGain: 0.80 },
  { id: "R003", name: "Alex Sitompul", email: "alex@stis.ac.id", gender: "Laki-laki", preTest: 30, postTest: 70, nGain: 0.57 },
  { id: "R004", name: "Dewi Lestari", email: "dewi@stis.ac.id", gender: "Perempuan", preTest: 60, postTest: 95, nGain: 0.88 },
  { id: "R005", name: "Andi Saputra", email: "andi@stis.ac.id", gender: "Laki-laki", preTest: 45, postTest: 75, nGain: 0.55 },
];

export default function AdminAnalytics() {
  const [searchTerm, setSearchTerm] = useState("");
  const [genderFilter, setGenderFilter] = useState("Semua");
  const [hasSearched, setHasSearched] = useState(false);
  const [filteredData, setFilteredData] = useState<typeof DUMMY_RESPONDENTS>([]);

  // Logika Pencarian & Filter
  const handleSearch = () => {
    let result = DUMMY_RESPONDENTS;
    // Filter berdasarkan nama/email
    if (searchTerm) {
      result = result.filter(user => 
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter berdasarkan jenis kelamin
    if (genderFilter !== "Semua") {
      result = result.filter(user => user.gender === genderFilter);
    }

    setFilteredData(result);
    setHasSearched(true);
  };

  // Logika Ekspor ke CSV
  const handleExportCSV = () => {
    if (filteredData.length === 0) return;
    const headers = ["ID,Nama,Email,Jenis Kelamin,Pre-Test,Post-Test,N-Gain Score"];
    // Mapping data ke baris CSV
    const rows = filteredData.map(row => 
      `${row.id},"${row.name}","${row.email}",${row.gender},${row.preTest},${row.postTest},${row.nGain}`
    );
    // Menggabungkan header dan isi
    const csvContent = headers.concat(rows).join("\n");
    // Membuat file dan memicu download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `Data_Analisis_EpoStory_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <AdminRoute>
      <div className="flex min-h-screen bg-gray-50">
        <AdminSidebar />

        <main className="flex-1 md:ml-64 pt-16 md:pt-0 transition-all duration-300">
          {/* Header */}
          <div className="bg-white border-b border-gray-200 px-4 py-6 md:px-8">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Analisis Data Responden</h1>
            <p className="text-gray-600 mt-1 text-sm md:text-base">
              Kelola, filter, dan unduh data pencapaian kuis pengguna.
            </p>
          </div>

          <div className="p-4 md:p-8">
            {/* Control Panel (Pencarian & Filter) */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <Input 
                    placeholder="Cari berdasarkan nama atau email... (Kosongkan untuk cari semua)" 
                    className="pl-10 h-12"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  />
                </div>
                
                <div className="flex items-center gap-2 border rounded-md px-3 bg-gray-50 h-12">
                  <Filter className="h-5 w-5 text-gray-500" />
                  <select 
                    value={genderFilter}
                    onChange={(e) => setGenderFilter(e.target.value)}
                    className="bg-transparent text-sm focus:outline-none border-none py-2 cursor-pointer"
                  >
                    <option value="Semua">Semua Gender</option>
                    <option value="Laki-laki">Laki-laki</option>
                    <option value="Perempuan">Perempuan</option>
                  </select>
                </div>

                <Button onClick={handleSearch} className="h-12 bg-indigo-600 hover:bg-indigo-700 px-8">
                  Tampilkan Data
                </Button>
              </div>
            </div>

            {/* Hasil Pencarian (Tabel) */}
            {!hasSearched ? (
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
                <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-bold text-gray-900 mb-2">Belum Ada Data Tertampil</h3>
                <p className="text-gray-500 max-w-md mx-auto">
                  Gunakan fitur pencarian di atas atau langsung tekan <b>"Tampilkan Data"</b> untuk melihat seluruh daftar responden Anda.
                </p>
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                  <h3 className="text-lg font-bold text-gray-900">
                    Hasil Pencarian <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full ml-2">{filteredData.length} Ditemukan</span>
                  </h3>
                  <Button 
                    onClick={handleExportCSV} 
                    disabled={filteredData.length === 0}
                    className="bg-green-600 hover:bg-green-700 gap-2"
                  >
                    <Download className="w-4 h-4" /> Export CSV
                  </Button>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm text-gray-600">
                    <thead className="bg-gray-50 text-gray-700 font-bold uppercase text-xs border-b">
                      <tr>
                        <th className="px-6 py-4">ID</th>
                        <th className="px-6 py-4">Nama Responden</th>
                        <th className="px-6 py-4">Gender</th>
                        <th className="px-6 py-4 text-center">Pre-Test</th>
                        <th className="px-6 py-4 text-center">Post-Test</th>
                        <th className="px-6 py-4 text-center">N-Gain</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredData.length > 0 ? (
                        filteredData.map((row, i) => (
                          <tr key={row.id} className="border-b last:border-0 hover:bg-gray-50 transition-colors">
                            <td className="px-6 py-4 font-medium text-gray-900">{row.id}</td>
                            <td className="px-6 py-4">
                              <p className="font-bold text-gray-900">{row.name}</p>
                              <p className="text-xs text-gray-500">{row.email}</p>
                            </td>
                            <td className="px-6 py-4">{row.gender}</td>
                            <td className="px-6 py-4 text-center text-orange-600 font-semibold">{row.preTest}</td>
                            <td className="px-6 py-4 text-center text-purple-600 font-semibold">{row.postTest}</td>
                            <td className="px-6 py-4 text-center font-bold text-green-600">{row.nGain.toFixed(2)}</td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={6} className="px-6 py-12 text-center text-gray-500 font-medium">
                            Data tidak ditemukan dengan filter tersebut.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </AdminRoute>
  );
}