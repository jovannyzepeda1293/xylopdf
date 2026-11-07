import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import crypto from "crypto";
import { sendPasswordResetEmail } from "@/lib/brevo";
import * as dotenv from 'dotenv';
dotenv.config({ override: true });

export async function POST(req: Request) {
  try {
    const { email, lang } = await req.json();

    if (!email) {
      return NextResponse.json({ message: "El correo es obligatorio" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      // Por seguridad, no revelamos si el usuario existe o no
      return NextResponse.json({ message: "Si el correo está registrado, recibirás un enlace de recuperación." });
    }

    // Generar token de recuperación
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpires = new Date(Date.now() + 3600000); // 1 hora desde ahora

    await prisma.user.update({
      where: { id: user.id },
      data: {
        resetToken,
        resetTokenExpires,
      },
    });

    // Enviar correo
    const resetUrl = `${process.env.NEXTAUTH_URL}/reset-password/${resetToken}`;
    await sendPasswordResetEmail(email, resetUrl, lang || 'es');

    return NextResponse.json({ message: "Si el correo está registrado, recibirás un enlace de recuperación." });
  } catch (error: any) {
    console.error("Error en forgot-password:", error);
    return NextResponse.json({ message: "Ocurrió un error: " + error.message }, { status: 500 });
  }
}
