import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '10', 10);
    const skip = (page - 1) * limit;
    const [notifications, totalCount] = await Promise.all([
      prisma.notifications.findMany({
        orderBy: { created_at: 'desc' },
        skip,
        take: limit,
      }),
      prisma.notifications.count()
    ]);
    
    return NextResponse.json({ 
      success: true, 
      data: notifications,
      pagination: {
        total: totalCount,
        page,
        limit,
        totalPages: Math.ceil(totalCount / limit)
      }
    });
  } catch (error) {
    console.error("Fetch Notifications Error:", error);
    return NextResponse.json({ success: false, message: "Gagal mengambil data notifikasi" }, { status: 500 });
  }
}