import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, name, gender, school } = body;

    if (!id) {
      return NextResponse.json({ success: false, message: "ID User diperlukan" }, { status: 400 });
    }

    const dataToUpdate: any = {};
    if (name !== undefined) dataToUpdate.name = name;
    if (gender !== undefined) dataToUpdate.gender = gender;
    if (school !== undefined) dataToUpdate.school = school;
    const updatedUser = await prisma.users.update({
      where: { id },
      data: dataToUpdate
    });
    const { password: _, ...userWithoutPassword } = updatedUser;
    return NextResponse.json({ success: true, message: "Profil berhasil diperbarui", data: userWithoutPassword });
  } catch (error: any) {
    console.error("Profile Update Error:", error);
    return NextResponse.json(
      { success: false, message: "Terjadi kesalahan saat menyimpan profil" },
      { status: 500 }
    );
  }
}