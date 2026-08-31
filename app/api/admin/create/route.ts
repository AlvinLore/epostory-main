import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, password } = body;
    
    if (!name || !email || !password) {
      return NextResponse.json({ success: false, message: "Semua data wajib diisi" }, { status: 400 });
    }

    if (password.length < 8) {
      return NextResponse.json({ success: false, message: "Password minimal 8 karakter" }, { status: 400 });
    }
    
    const existingUser = await prisma.users.findUnique({
      where: { email }
    });
    if (existingUser) {
      return NextResponse.json(
        { success: false, message: "Email sudah terdaftar!" },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await prisma.users.create({
      data: {
        id: `adm_${Date.now()}`,
        name,
        email,
        password: hashedPassword,
        role: 'admin',
      }
    });
    const { password: _, ...userWithoutPassword } = newUser;
    return NextResponse.json(
      { success: true, message: "Admin berhasil didaftarkan!", data: userWithoutPassword },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Admin Create Error:", error);
    return NextResponse.json(
      { success: false, message: "Terjadi kesalahan pada server" },
      { status: 500 }
    );
  }
}