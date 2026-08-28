import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const [totalStories, activeUsers, totalAttempted] = await Promise.all([
      prisma.stories.count(),
      prisma.users.count({ where: { role: 'user' } }),
      prisma.user_progress.count()
    ]);
    return NextResponse.json({
      success: true,
      data: {
        totalStories,
        activeUsers,
        totalAttempted
      }
    });
  } catch (error) {
    console.error("Fetch Admin Stats Error:", error);
    return NextResponse.json({ success: false, message: "Gagal mengambil statistik" }, { status: 500 });
  }
}