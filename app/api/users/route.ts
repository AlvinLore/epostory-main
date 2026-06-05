import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// METHOD GET: Mengambil semua data pengguna dari phpMyAdmin
export async function GET() {
  try {
    const users = await prisma.users.findMany({
      orderBy: { created_at: 'desc' }
    });
    
    return NextResponse.json({ success: true, data: users });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, message: "Gagal mengambil data database" }, { status: 500 });
  }
}

// METHOD POST: Menambahkan pengguna baru ke phpMyAdmin
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { id, name, email, password, role, gender } = body;

    const newUser = await prisma.users.create({
      data: {
        id: id || Date.now().toString(),
        name,
        email,
        password,
        role: role || 'user',
        gender: gender || ''
      }
    });

    return NextResponse.json({ success: true, data: newUser }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, message: "Gagal membuat user" }, { status: 500 });
  }
}