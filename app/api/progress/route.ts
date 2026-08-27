import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

//FUNGSI GET: Mengambil progres dari database
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');
    const storyId = searchParams.get('storyId');

    if (!userId) {
      return NextResponse.json({ success: false, message: 'Missing userId' }, { status: 400 });
    }

    if (storyId) {
      //Ambil progres untuk 1 cerita spesifik
      const progress = await prisma.user_progress.findUnique({
        where: {
          user_id_story_id: {
            user_id: userId,
            story_id: storyId,
          }
        }
        });
      return NextResponse.json({ success: true, data: progress });
    } else {
      //Ambil semua progres untuk user ini
      const progresses = await prisma.user_progress.findMany({
        where: {
          user_id: userId
        }
      });
      return NextResponse.json({ success: true, data: progresses });
    }
  } catch (error) {
    console.error("Error fetching progress:", error);
    return NextResponse.json({ success: false, message: 'Internal Server Error' }, { status: 500 });
  }
}

//FUNGSI POST: Menyimpan/Update progres
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { userId, storyId, progressPercentage, isCompleted, quiz_answers: quizAnswers, preTestScore, postTestScore } = body;

    //Validasi input dasar
    if (!userId || !storyId) {
      return NextResponse.json({ success: false, message: "User ID dan Story ID wajib ada" }, { status: 400 });
    }

    //Ambil progres yang sudah ada di database
    const existingProgress = await prisma.user_progress.findUnique({
      where: {
        user_id_story_id: {
          user_id: userId,
          story_id: storyId,
        },
      },
    });

    //Parse JSON jawaban kuis (Jika ada data di DB, ubah string ke objek)
    let currentAnswers = {};
    if (existingProgress?.quiz_answers) {
      try {
        currentAnswers = JSON.parse(existingProgress.quiz_answers as string);
      } catch (e) {
        console.error("Gagal parse JSON quiz_answers", e);
      }
    }

    let updatedAnswersString = null;
    let mergedAnswers: any = {};

    //Gabungkan jawaban lama dengan jawaban baru (jika ada kiriman dari frontend)
    if (quizAnswers) {
        let newAnswersParsed = {};
        try {
            newAnswersParsed = typeof quizAnswers === 'string' ? JSON.parse(quizAnswers) : quizAnswers;
        } catch(e) {
            console.error("Gagal parse new quiz_answers", e);
        }
        
        const mergedAnswers: any = {
            ...currentAnswers,
            ...newAnswersParsed
        };

        // Jika user menyelesaikan cerita, hitung validasi nilai intermezo kuis di backend
        if (isCompleted && mergedAnswers.answeredQuizzes) {
            // Ambil seluruh halaman kuis untuk story tersebut beserta opsi jawabannya
            const storyPages = await prisma.pages.findMany({
                where: { 
                  chapters: { story_id: storyId }, 
                  type: 'quiz' 
                },
                include: { page_quiz_options: true }
            });

            let correctCount = 0;
            let totalActiveQuizzes = storyPages.length;

            for (const page of storyPages) {
                // userAnswerId sekarang berupa string ID opsi
                const userAnswerId = mergedAnswers.answeredQuizzes[page.id];
                
                if (userAnswerId) {
                    // Cari opsi mana yang benar dari database saat ini
                    const correctOption = page.page_quiz_options.find(opt => opt.is_correct);
                    
                    // Cocokkan apakah ID jawaban user sama dengan ID opsi yang benar
                    if (correctOption && userAnswerId === correctOption.id) {
                        correctCount++;
                    }
                }
            }
            
            mergedAnswers.calculatedIntermezzoScore = correctCount;
            mergedAnswers.totalActiveQuizzes = totalActiveQuizzes;
        }

        updatedAnswersString = JSON.stringify(mergedAnswers);
    } else {
        updatedAnswersString = existingProgress?.quiz_answers || null;
    }

    //Gunakan nilai dari database jika skor dari frontend undefined (agar tidak tertimpa null). jika frontend mengirim 0 secara eksplisit, simpan 0
    const finalPreScore = preTestScore !== undefined ? preTestScore : existingProgress?.pre_test_score;
    const finalPostScore = postTestScore !== undefined ? postTestScore : existingProgress?.post_test_score;

    //Update atau Buat data progress baru
    const progress = await prisma.user_progress.upsert({
      where: {
        user_id_story_id: {
          user_id: userId,
          story_id: storyId,
        },
      },
      update: {
        progress_percentage: progressPercentage,
        status: isCompleted ? "completed" : "started",
        quiz_answers: updatedAnswersString, 
        last_read_at: new Date(),
        pre_test_score: finalPreScore,
        post_test_score: finalPostScore,
      },
      create: {
        id: `prog_${userId}_${storyId}`,
        user_id: userId,
        story_id: storyId,
        progress_percentage: progressPercentage,
        status: isCompleted ? "completed" : "started",
        quiz_answers: updatedAnswersString,
        pre_test_score: finalPreScore,
        post_test_score: finalPostScore,
      },
    });

    //Logika Badge (Contoh: jika baru saja tamat)
    let newBadge = null;
    if (isCompleted && existingProgress?.status !== "completed") {
        newBadge = "Story Master"; 
    }

    return NextResponse.json({ 
        success: true, 
        data: progress,
        newBadge 
    });

  } catch (error) {
    console.error("Error updating progress:", error);
    return NextResponse.json({ success: false, message: "Gagal menyimpan progres" }, { status: 500 });
  }
}