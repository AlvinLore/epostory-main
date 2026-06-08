import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, password, gender } = body;

    //Validasi email
    const existingUser = await prisma.users.findUnique({
      where: { email }
    });

    if (existingUser) {
      return NextResponse.json(
        { success: false, message: "Email sudah terdaftar!" },
        { status: 400 }
      );
    }

    //Hashing password dengan bcrypt
    const hashedPassword = await bcrypt.hash(password, 10);

    //Simpan ke database MySQL
    const userData: any = {
      id: `usr_${Date.now()}`,
      name,
      email,
      password: hashedPassword,
      role: 'user', //default
    };

    //Gender hanya L dan P, jika valid baru disimpan
    if (gender === 'L' || gender === 'P') {
      userData.gender = gender;
    }

    const newUser = await prisma.users.create({
      data: userData
    });

    //Hapus password dari response agar tidak bocor ke frontend
    const { password: _, ...userWithoutPassword } = newUser;

    return NextResponse.json(
      { success: true, message: "Pendaftaran berhasil!", data: userWithoutPassword },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Register Error:", error);
    return NextResponse.json(
      { success: false, message: "Terjadi kesalahan pada server" },
      { status: 500 }
    );
  }
}