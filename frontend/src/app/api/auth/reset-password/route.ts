import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";
import * as dotenv from 'dotenv';
dotenv.config({ override: true });

export async function POST(req: Request) {
  try {
    const { token, password } = await req.json();

    if (!token || !password) {
      return NextResponse.json({ message: "El token y la nueva contraseña son obligatorios" }, { status: 400 });
    }

    const user = await prisma.user.findFirst({
      where: {
        resetToken: token,
        resetTokenExpires: {
          gt: new Date(), // Debe ser mayor que ahora
        },
      },
    });

    if (!user) {
      return NextResponse.json({ message: "El enlace es inválido o ha expirado" }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.user.update({
      where: { id: user.id },
      data: {
        passwordHash: hashedPassword,
        resetToken: null,
        resetTokenExpires: null,
      },
    });

    return NextResponse.json({ message: "Contraseña actualizada exitosamente" });
  } catch (error: any) {
    console.error("Error en reset-password:", error);
    return NextResponse.json({ message: "Ocurrió un error: " + error.message }, { status: 500 });
  }
}
