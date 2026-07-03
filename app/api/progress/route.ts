import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { userId, storyId, progressPercentage, isCompleted } = body;

    if (!userId || !storyId) {
      return NextResponse.json({ success: false, message: "Data tidak lengkap" }, { status: 400 });
    }

    //Fungsi Progress Membaca Siswa
    const progress = await prisma.user_progress.upsert({
      where: {
        user_id_story_id: { user_id: userId, story_id: storyId }
      },
      update: {
        progress_percentage: progressPercentage,
        status: isCompleted ? "completed" : "started",
        last_read_at: new Date()
      },
      create: {
        id: Date.now().toString(),
        user_id: userId,
        story_id: storyId,
        progress_percentage: progressPercentage,
        status: isCompleted ? "completed" : "started"
      }
    });

    //Sistem Trigger Badge (Jika Cerita Selesai)
    let earnedBadge = null;

    if (isCompleted) {
      //Tentukan ID Badge
      const targetBadgeId = "BADGE_STORY_01";

      //Validasi badge duplikat
      const existingBadge = await prisma.user_badges.findUnique({
        where: { 
          user_id_badge_id: { user_id: userId, badge_id: targetBadgeId } 
        }
      });

      //Beri badge jika belum ada
      if (!existingBadge) {
        await prisma.user_badges.create({
          data: {
            id: Date.now().toString() + Math.random().toString(36).substring(2, 6),
            user_id: userId,
            badge_id: targetBadgeId,
          }
        });

        //Tarik nama badge untuk ditampilkan di pop-up animasi Frontend
        const badgeData = await prisma.badges.findUnique({ where: { id: targetBadgeId } });
        earnedBadge = badgeData ? badgeData.name : "Badge Baru";
      }
    }

    return NextResponse.json({ 
      success: true, 
      data: progress,
      newBadge: earnedBadge, //Jika tidak null, memunculkan animasi 
      message: "Progress disimpan" 
    });

  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}