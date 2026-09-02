import Link from "next/link";
import { Button } from "@/components/ui/button";
import { BookOpen, Target, Users, ArrowRight } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation Bar */}
      <nav className="fixed top-0 w-full bg-white border-b border-gray-200 z-50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <img src="/Logo EpoStory.png" alt="EpoStory" className="w-15 h-auto" />
            <span className="font-bold text-xl text-gray-900">EpoStory</span>
          </Link>
          <div className="flex items-center space-x-4">
            <Link
              href="/login"
              className="text-gray-700 hover:text-green-600 transition-colors font-medium"
            >
              Log In
            </Link>
            <Link href="/login">
              <Button className="bg-green-600 hover:bg-emerald-700 text-white rounded-lg">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6">
              Pelajari Isu Lingkungan Melalui Bab-Bab Interaktif
            </h1>
            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
              EpoStory menjadikan pendidikan lingkungan menarik dan 
              interaktif. Jelajahi bab-bab tentang polusi udara melalui narasi 
              yang mendalam dan aplikasi dunia nyata.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/login">
                <Button className="bg-green-600 hover:bg-emerald-700 text-white px-8 py-3 rounded-lg font-semibold flex items-center space-x-2 w-full sm:w-auto justify-center h-auto text-base">
                  <span>Mulai Perjalananmu</span>
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
              <a href="#fitur" className="px-8 py-3 border-2 border-green-600 text-green-600 rounded-lg font-semibold hover:bg-green-50 transition-colors flex items-center justify-center">
                Pelajari Lebih Lanjut
              </a>
            </div>
          </div>

          {/* Right Illustration */}
          <div className="relative">
            <div className="aspect-square flex items-center justify-center rounded-2xl overflow-hidden shadow-2xl">
              <img 
                src="/Ilustrasi-app.png" 
                alt="Ilustrasi Edukatif EpoStory" 
                className="w-full h-full object-cover animate-in fade-in duration-1000"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="fitur" className="py-20 px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Apa Yang Didapat Dari EpoStory?
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-white rounded-xl shadow-md p-8">
              <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center text-white text-xl mb-4">
                <BookOpen className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Pembelajaran Interaktif
              </h3>
              <p className="text-gray-600">
                Telusuri tiap cerita-cerita dengan ilustrasi dan narasi yang 
                membahas isu lingkungan udara.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white rounded-xl shadow-md p-8">
              <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center text-white text-xl mb-4">
                <Target className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Nilai Pengetahuanmu
              </h3>
              <p className="text-gray-600">
                Ikuti kuis di tiap cerita untuk menguji pemahaman Anda dan terima 
                umpan balik yang dipersonalisasi.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white rounded-xl shadow-md p-8">
              <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center text-white text-xl mb-4">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Lacak Progres
              </h3>
              <p className="text-gray-600">
                Pantau perjalanan pembelajaran Anda melalui statistik pencapaian.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Cara Kerja EpoStory
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              {
                number: 1,
                title: "Buat Akun",
                description: "Daftar dan atur profil Anda",
              },
              {
                number: 2,
                title: "Pilih Topik",
                description: "Pilih dari perpustakaan topik kami",
              },
              {
                number: 3,
                title: "Belajar dan Jelajahi",
                description: "Baca cerita lingkungan yang imersif",
              },
              {
                number: 4,
                title: "Ikuti Kuis",
                description: "Uji pengetahuan Anda dan lacak progresnya",
              },
            ].map((step) => (
              <div key={step.number} className="text-center">
                <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center text-white font-bold text-lg mx-auto mb-4">
                  {step.number}
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  {step.title}
                </h3>
                <p className="text-gray-600 text-sm">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-6 px-6">
        <div className="border-gray-800 text-center text-gray-400 text-sm text-center">
          <p>&copy; 2026 EpoStory. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}