import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
export async function GET() {
  try {
    const progressData = await prisma.user_progress.findMany({
      include: {
        users: {
          select: {
            name: true,
            email: true,
            gender: true,
            semester: true,
          }
        },
        stories: {
          select: {
            title: true,
            number: true
          }
        }
      },
      orderBy: { last_read_at: 'desc' }
    });
    const formattedData = progressData.map(prog => {
      return {
        id: prog.id,
        name: prog.users.name,
        email: prog.users.email,
        gender: prog.users.gender === 'L' ? 'Laki-laki' : (prog.users.gender === 'P' ? 'Perempuan' : 'Tidak Disebutkan'),
        semester: prog.users.semester || '-',
        storyTitle: prog.stories.title,
        preTest: prog.pre_test_score !== null ? Number(prog.pre_test_score.toFixed(2)) : '-',
        postTest: prog.post_test_score !== null ? Number(prog.post_test_score.toFixed(2)) : '-',
        intermezzoScore: prog.intermezzo_quiz_score !== null ? Number(prog.intermezzo_quiz_score.toFixed(2)) : '-',
        nGain: prog.n_gain_score !== null ? Number(prog.n_gain_score.toFixed(2)) : '-',
        status: prog.status
      };
    });
    return NextResponse.json({
      success: true,
      data: formattedData
    });
  } catch (error) {
    console.error("Fetch Analytics Error:", error);
    return NextResponse.json({ success: false, message: "Gagal mengambil data analitik" }, { status: 500 });
  }
}