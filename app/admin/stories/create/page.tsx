"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import AdminRoute from "@/components/AdminRoute";
import { AdminSidebar } from "@/components/AdminSidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, UploadCloud } from "lucide-react";
import { toast } from "sonner";

export default function CreateStoryPage() {
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({ title: "", synopsis: "" });

  const handleSave = () => {
    if (!formData.title) return toast.error("Judul wajib diisi!");
    
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      toast.success("Story Created!");
      router.push("/admin/stories");
    }, 1000);
  };

  return (
    <AdminRoute>
      <div className="flex min-h-screen bg-gray-50">
        <AdminSidebar />
        <main className="ml-64 flex-1">
          <div className="bg-white border-b border-gray-200 px-8 py-6">
            <div className="flex items-center gap-4">
              <Link href="/admin/stories">
                <Button variant="ghost" size="icon"><ArrowLeft className="w-5 h-5" /></Button>
              </Link>
              <h1 className="text-3xl font-bold text-gray-900">Create New Story</h1>
            </div>
          </div>

          <div className="p-8 max-w-4xl mx-auto">
            <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-100 mb-6">
              <h2 className="text-lg font-bold mb-4">Story Details</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Title</label>
                  <Input 
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    placeholder="Judul Cerita..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Synopsis</label>
                  <textarea 
                    className="w-full border rounded-md p-2" 
                    rows={4}
                    value={formData.synopsis}
                    onChange={(e) => setFormData({...formData, synopsis: e.target.value})}
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <Link href="/admin/stories"><Button variant="outline">Cancel</Button></Link>
              <Button onClick={handleSave} className="bg-green-600 text-white">
                {isSaving ? "Saving..." : "Create Story"}
              </Button>
            </div>
          </div>
        </main>
      </div>
    </AdminRoute>
  );
}