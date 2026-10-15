# Identitas:
Nama: Alvin Jeremy Naiborhu

NIM: 222212488

Kelas: 4SI2

---
# Struktur File:
```text
epostory/
├── app/
│   ├── (auth)/
│   │   ├── login/               # Halaman autentikasi masuk
│   │   └── signup/              # Halaman pendaftaran
│   ├── achievements/            # Halaman statistik pencapaian & galeri badge
│   ├── admin/                   # Panel Kontrol & CMS Administrator
│   │   ├── analytics/           # Pemantauan nilai, N-Gain, & ekspor CSV
│   │   ├── dashboard/           # Metrik statistik global
│   │   ├── settings/            # Pengaturan tambah admin
│   │   ├── profile/             # Pengaturan profil admin
│   │   └── stories/             # Manajemen & editor cerita
│   ├── api/                     # REST API Backend Endpoints
│   │   ├── auth/                # API Login & Register
│   │   ├── admin/               # API menu admin
│   │   ├── progress/            # API progres baca, jawaban kuis, & nilai N-Gain
│   │   ├── notifications/       # API notifikasi dashboard admin
│   │   ├── read/[id]/           # API membaca cerita
│   │   └── stories/             # API operasi CRUD konten cerita
│   ├── story/[id]/              # Reader materi interaktif, kuis, & tes evaluasi
│   ├── quiz/result/             # Halaman hasil/penilaian
│   ├── storybooks/              # Katalog cerita & riwayat bacaan siswa
│   ├── profile/                 # Pengaturan profil user
│   ├── layout.tsx               # Root layout aplikasi
│   └── page.tsx                 # Halaman utama (Landing page)
├── components/                  # Komponen UI modular (Sidebar, AdminSidebar, Modals)
├── context/                     # Context API (AuthContext untuk manajemen sesi)
├── lib/                         # Konfigurasi Prisma Client & helper utilities
├── prisma/
│   └── schema.prisma            # Skema pemodelan relasi basis data (11 tabel)
└── public/                      # Aset statis publik (Logo, ikon, dll)
```
---
# Dokumentasi:
**EpoStory** adalah sistem pembelajaran buku cerita digital interaktif berbasis web yang mengintegrasikan metode Digital Storytelling dengan alur evaluasi terstruktur (*Pre-test*, Kuis Sela Materi, dan *Post-test*) serta elemen gamifikasi.

Aplikasi ini dirancang khusus untuk meningkatkan pemahaman siswa dan menyediakan kalkulasi otomatis rasio **N-Gain Score** guna mengukur efektivitas hasil belajar secara objektif.

---
## ✨ Fitur Utama
### 1. Panel User
* **Digital Story Reader:** Membaca materi cerita bab demi bab yang dilengkapi ilustrasi visual serta kuis interaktif di sela materi (*intermezzo quiz*).
* **Alur Evaluasi Terstruktur:**
  * **Pre-test:** Mengukur pemahaman awal sebelum materi cerita terbuka.
  * **Post-test:** Menguji retensi pemahaman setelah materi selesai dibaca.
  * **Kalkulasi Otomatis N-Gain:** Menghitung skor efektivitas belajar secara *real-time* di *backend* dengan perlindungan terhadap *division by zero*.
* **Gamifikasi & Pencapaian:**
  * Koleksi **Lencana (*Badges*)** berdasarkan pencapaian dan nilai siswa.
  * **Sertifikat Digital:** Otomatisasi penerbitan sertifikat kelulusan dalam format PDF setelah menyelesaikan cerita.
* **Dasbor & Riwayat Progres:** Memantau status bacaan ("Belum Selesai" & "Tamat").
### 2. Panel Admin
* **Story Builder & Editor:** Manajemen cerita lengkap (Metadata, Pengaturan Cover dan Sertifikat, Status Draft/Published).
* **Manajemen Bab, Halaman & Kuis:** Penyusunan konten teks bacaan, unggahan ilustrasi, dan pembuatan kuis interaktif dengan umpan balik langsung (*intermediate feedback*).
* **Manajemen Soal Evaluasi:** Kelola butir soal evaluasi khusus *Pre-test* dan *Post-test* beserta pilihan jawaban berganda.
* **Analisis & Pemantauan Siswa:** Tabel analitik skor (*Pre-test*, *Post-test*, Kuis, dan *N-Gain*), dilengkapi filter pencarian dan fitur **Ekspor ke File CSV**.
* **Manajemen Akun Admin:** Fasilitas penambahan admin pengelola baru melalui menu pengaturan.
### 3. Performa Sistem
* **Database Transactions:** Menggunakan `prisma.$transaction` untuk menjamin konsistensi data saat pembuatan materi cerita relasional (Bab, Halaman, dan Soal) terhadap basis data MySQL.
* **Responsive UI:** Antarmuka responsif pc dan mobile.
---
## Arsitektur & Teknologi
* **Frontend:** Next.js dan Tailwind CSS.
* **Backend:** Next.js Serverless API Routes (`app/api/`).
* **Database & ORM:** MySQL via Prisma ORM.
* **Cloud Storage:** Cloudinary (https://cloudinary.com/) untuk Penyimpanan gambar sampul, ilustrasi halaman cerita, dan aset sertifikat.
* **Autentikasi & Sesi:** Hashing sandi menggunakan `bcryptjs` dan manajemen sesi berbasis klien via `LocalStorage` & React Context.
---
# Panduan Memulai
### 1. Prasyarat Sistem
* Node.js (versi 18.18 atau lebih baru)
* Server basis data MySQL

### 2. Kloning Repositori
Kloning repository melalui link HTTPS github/gitlab

### 3. Instalasi Dependensi
```bash
npm install
```
### 4. Konfigurasi Environment Variable
Buat berkas `.env` pada direktori *root* proyek, lalu sesuaikan konfigurasi berikut:
```env
# Koneksi Database MySQL
DATABASE_URL="mysql://USER:PASSWORD@HOST:PORT/epostory_db"
```
```env.local
# Konfigurasi Cloudinary (Untuk aset gambar)
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="your_cloud_name"
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET="your_preset"
```
### 5. Sinkronisasi Basis Data (Prisma)
* **Opsi A: Database-First (Jika Anda mengubah tabel langsung via phpMyAdmin / MySQL)**
Perintah untuk menarik skema tabel dari phpMyAdmin (MySQL) ke file schema.prisma (lakukan secara berurutan di terminal):
```
npx prisma db pull
npx prisma generate
```
* **Opsi B: Schema-First (Jika Anda mengubah model langsung di file schema.prisma)**
Perintah untuk menyelaraskan schema.prisma ke MySQL (lakukan secara berurutan di terminal):
```
npx prisma db push
npx prisma generate
```

### 6. Menjalankan Server Pengembangan
```
npm run dev
```
Buka peramban (*browser*) di alamat [http://localhost:3000](http://localhost:3000).
---


# Mentah readme:

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
