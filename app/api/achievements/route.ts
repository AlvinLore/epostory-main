import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import crypto from 'crypto';
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    if (!userId) {
      return NextResponse.json({ success: false, message: 'Missing userId' }, { status: 400 });
    }

    //1. Fetch progress user
    const userProgress = await prisma.user_progress.findMany({
      where: { user_id: userId }
    });

    //2. Kalkulasi statistik
    const completedStoriesCount = userProgress.filter(p => p.status === 'completed').length;
    const perfectQuizzesCount = userProgress.filter(p => p.intermezzo_quiz_score === 100).length;
    //Fetch total cerita published
    const totalPublishedStories = await prisma.stories.count({
      where: { status: 'published' }
    });
    const completionPercentage = totalPublishedStories === 0 
      ? 0 
      : Math.round((completedStoriesCount / totalPublishedStories) * 100);

    //3. Fetch badge yang didapat
    const earnedBadges = await prisma.user_badges.findMany({
      where: { user_id: userId }
      });
    const earnedBadgeIds = earnedBadges.map(b => b.badge_id);

    //4. Fetch semua badge dari database
    const allBadges = await prisma.badges.findMany({
      orderBy: { id: 'asc' }
    });
    const formattedBadges = allBadges.map(badge => ({
      id: badge.id,
      title: badge.name,
      description: badge.description,
      unlocked: earnedBadgeIds.includes(badge.id)
    }));
    return NextResponse.json({
      success: true,
      data: {
        stats: {
          completedCount: completedStoriesCount,
          totalStories: totalPublishedStories,
          completionPercentage: completionPercentage
        },
        badges: formattedBadges
      }
    });
  } catch (error) {
    console.error("Achievements Error:", error);
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
  }
}