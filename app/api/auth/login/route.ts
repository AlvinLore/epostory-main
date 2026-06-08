import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    //Search berdasarkan email
    const user = await prisma.users.findUnique({
      where: { email }
    });

    //User tidak ditemukan
    if (!user) {
      return NextResponse.json(
        { success: false, message: "Email tidak ditemukan!" },
        { status: 404 }
      );
    }

    //Cocokkan password yang diketik dengan password acak di database
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return NextResponse.json(
        { success: false, message: "Password salah!" },
        { status: 401 }
      );
    }

    //Hapus password dari response agar tidak bocor ke frontend
    const { password: _, ...userWithoutPassword } = user;

    return NextResponse.json(
      { success: true, message: "Login berhasil!", data: userWithoutPassword },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Login Error:", error);
    return NextResponse.json(
      { success: false, message: "Terjadi kesalahan pada server" },
      { status: 500 }
    );
  }
}