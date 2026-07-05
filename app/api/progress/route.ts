import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { userId, storyId, progressPercentage, isCompleted, quizAnswers } = body;

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

    //Gabungkan jawaban lama dengan jawaban baru (jika ada kiriman dari frontend)
    const updatedAnswers = {
      ...currentAnswers,
      ...(quizAnswers || {})
    };

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
        quiz_answers: JSON.stringify(updatedAnswers), //Simpan kembali sebagai string JSON
        last_read_at: new Date(),
      },
      create: {
        id: `prog_${userId}_${storyId}`,
        user_id: userId,
        story_id: storyId,
        progress_percentage: progressPercentage,
        status: isCompleted ? "completed" : "started",
        quiz_answers: JSON.stringify(updatedAnswers),
      },
    });

    //Logika Badge (Contoh: jika baru saja tamat)
    let newBadge = null;
    if (isCompleted && existingProgress?.status !== "completed") {
        //Logika pengecekan database untuk memberi badge
        //Misalnya: Berikan 'BADGE_STORY_01' jika siswa baru pertama kali menamatkan cerita
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