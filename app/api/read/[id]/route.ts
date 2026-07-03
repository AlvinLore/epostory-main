import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = await params;

    //Menarik cerita, chapter, dan halaman yang berstatus hanya "published"
    const story = await prisma.stories.findFirst({
      where: { 
        id: id, 
        status: "published" 
      },
      include: {
        chapters: {
          orderBy: { order_index: 'asc' }, //Urutkan chapter
          include: {
            pages: {
              orderBy: { order_index: 'asc' }, //Urutkan halaman
              include: {
                page_quiz_options: true //Tarik opsi kuis jika ada
              }
            }
          }
        }
      }
    });

    if (!story) {
      return NextResponse.json({ success: false, message: "Cerita belum diterbitkan atau tidak ditemukan." }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: story });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}