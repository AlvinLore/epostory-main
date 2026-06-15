import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

//METHOD GET: Menarik data 1 cerita berserta seluruh relasinya
export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    //Menunggu (await) params sebelum mengambil ID (Aturan Next.js terbaru)
    const { id } = await params; 
    
    const story = await prisma.stories.findUnique({
      where: { id },
      include: {
        chapters: {
          orderBy: { order_index: 'asc' },
          include: {
            pages: {
              orderBy: { order_index: 'asc' },
              include: { 
                page_quiz_options: { orderBy: { id: 'asc' } } 
              }
            }
          }
        },
        test_items: {
          orderBy: { created_at: 'asc' },
          include: { test_options: { orderBy: { id: 'asc' } } }
        }
      }
    });

    if (!story) return NextResponse.json({ success: false, message: "Cerita tidak ditemukan" }, { status: 404 });
    return NextResponse.json({ success: true, data: story });
  } catch (error) {
    console.error("GET Story Error:", error);
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}

//METHOD PUT: Menyimpan perubahan Editor
export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    //Menunggu (await) params sebelum mengambil ID
    const { id } = await params;
    const body = await request.json();
    
    const { number, title, status, coverImage, certificateImage, preTest, postTest, chapters } = body;

    //Validasi Nomor Cerita
    if (number) {
      const existingStory = await prisma.stories.findFirst({ where: { number: number } });
      if (existingStory && existingStory.id !== id) {
        return NextResponse.json(
          { success: false, message: `Gagal: Nomor cerita '${number}' sudah dipakai oleh cerita lain!` }, 
          { status: 400 }
        );
      }
    }

    //Prisma Transaction
    await prisma.$transaction(async (tx) => {
      //Update tabel stories utama
      await tx.stories.update({
        where: { id },
        data: { number, title, status, cover_image: coverImage, certificate_image: certificateImage }
      });

      //Hapus isi lama sebelum ditimpa (ON DELETE CASCADE)
      await tx.chapters.deleteMany({ where: { story_id: id } });
      await tx.test_items.deleteMany({ where: { story_id: id } });

      //Masukkan data chapters baru
      for (let i = 0; i < chapters.length; i++) {
        const ch = chapters[i];
        const newChapter = await tx.chapters.create({
          data: { id: `ch_${Date.now()}_${i}`, story_id: id, title: ch.title, order_index: i }
        });

        for (let j = 0; j < ch.pages.length; j++) {
          const p = ch.pages[j];
          const newPage = await tx.pages.create({
            data: {
              id: `pg_${Date.now()}_${j}`, chapter_id: newChapter.id, type: p.type, title: p.title,
              content: p.content, image: p.image, order_index: j
            }
          });

          if (p.type === 'quiz' && p.quizOptions) {
            for (let k = 0; k < p.quizOptions.length; k++) {
              await tx.page_quiz_options.create({
                data: { 
                  id: `pqo_${Date.now()}_${k}`, 
                  page_id: newPage.id, 
                  text: p.quizOptions[k].text, 
                  feedback: p.quizOptions[k].feedback,
                  is_correct: p.quizAns === k
                }
              });
            }
          }
        }
      }

      //Masukkan data Pre-Test & Post-Test
      const allAssessments = [
        ...preTest.map((q: any) => ({ ...q, type: 'PRE_TEST' })),
        ...postTest.map((q: any) => ({ ...q, type: 'POST_TEST' }))
      ];

      for (let i = 0; i < allAssessments.length; i++) {
        const asm = allAssessments[i];
        const newAsm = await tx.test_items.create({
          data: { 
            id: `ti_${Date.now()}_${i}`, 
            story_id: id, 
            type: asm.type as any,
            question: asm.question
          }
        });

        for (let j = 0; j < asm.options.length; j++) {
          await tx.test_options.create({
            data: { 
              id: `to_${Date.now()}_${j}`, 
              test_item_id: newAsm.id, 
              text: asm.options[j].text, 
              is_correct: asm.options[j].isCorrect 
            }
          });
        }
      }
    });

    return NextResponse.json({ success: true, message: "Berhasil disimpan!" });
  } catch (error: any) {
    console.error("Save Story Error:", error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}