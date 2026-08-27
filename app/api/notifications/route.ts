import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
export async function GET() {
  try {
    const notifications = await prisma.notifications.findMany({
      orderBy: { created_at: 'desc' },
      take: 10,
    });
    
    return NextResponse.json({ success: true, data: notifications });
  } catch (error) {
    console.error("Fetch Notifications Error:", error);
    return NextResponse.json({ success: false, message: "Gagal mengambil data notifikasi" }, { status: 500 });
  }
}