import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, currentPassword, newPassword } = body;

    if (!id || !currentPassword || !newPassword) {
      return NextResponse.json({ success: false, message: "Semua data harus diisi" }, { status: 400 });
    }

    if (newPassword.length < 8) {
      return NextResponse.json({ success: false, message: "Password baru minimal 8 karakter" }, { status: 400 });
    }

    const user = await prisma.users.findUnique({ where: { id } });
    if (!user) {
      return NextResponse.json({ success: false, message: "User tidak ditemukan" }, { status: 404 });
    }
    
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return NextResponse.json({ success: false, message: "Password lama salah" }, { status: 400 });
    }
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    
    await prisma.users.update({
      where: { id },
      data: { password: hashedNewPassword }
    });
    return NextResponse.json({ success: true, message: "Password berhasil diubah" });
  } catch (error: any) {
    console.error("Password Update Error:", error);
    return NextResponse.json(
      { success: false, message: "Terjadi kesalahan saat menyimpan password" },
      { status: 500 }
    );
  }
}