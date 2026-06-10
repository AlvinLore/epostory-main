import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

//METHOD GET: Mengambil semua daftar cerita untuk ditampilkan di tabel Admin
export async function GET() {
  try {
    const stories = await prisma.stories.findMany({
      orderBy: { number: 'asc' }, //Urutkan berdasarkan nomor cerita
    });
    
    return NextResponse.json({ success: true, data: stories });
  } catch (error) {
    console.error("Fetch Stories Error:", error);
    return NextResponse.json({ success: false, message: "Gagal mengambil data cerita" }, { status: 500 });
  }
}

//METHOD POST: Menyimpan cerita baru dari halaman "Buat Cerita"
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { number, title, synopsis, topic } = body;

    //CEK APAKAH NOMOR CERITA SUDAH DIPAKAI
    const existingStory = await prisma.stories.findFirst({
      where: { number: number }
    });

    if (existingStory) {
      return NextResponse.json(
        { success: false, message: "Nomor cerita tersebut sudah dipakai!" },
        { status: 400 }
      );
    }

    //Simpan ke database MySQL
    const newStory = await prisma.stories.create({
      data: {
        id: `story_${Date.now()}`, //Generate ID unik
        number: number,  //Pastikan sebagai INT
        title,
        synopsis: synopsis || "",
        topic: topic || "",
        status: 'draft', //default
      }
    });

    return NextResponse.json({ success: true, data: newStory }, { status: 201 });
  } catch (error) {
    console.error("Create Story Error:", error);
    return NextResponse.json({ success: false, message: "Gagal membuat cerita baru" }, { status: 500 });
  }
}