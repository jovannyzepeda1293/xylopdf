import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";
import crypto from "crypto";
import { sendConfirmationEmail } from "@/lib/sendgrid";
import * as dotenv from 'dotenv';
dotenv.config({ override: true });

export async function POST(req: Request) {
  try {
    const { email, password, lang, recaptchaToken } = await req.json();

    if (!recaptchaToken) {
      return NextResponse.json(
        { message: "Verificación de reCAPTCHA requerida" },
        { status: 400 }
      );
    }

    // Verificar reCAPTCHA
    const recaptchaRes = await fetch(
      `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${recaptchaToken}`,
      { method: "POST" }
    );
    const recaptchaData = await recaptchaRes.json();

    if (!recaptchaData.success) {
      return NextResponse.json(
        { message: "Falla en la verificación de reCAPTCHA. Inténtalo de nuevo." },
        { status: 400 }
      );
    }

    if (!email || !password) {
      return NextResponse.json(
        { message: "El email y la contraseña son obligatorios" },
        { status: 400 }
      );
    }

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { message: "El correo electrónico ya está registrado" },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const confirmationToken = crypto.randomBytes(32).toString('hex');

    const user = await prisma.user.create({
      data: {
        email,
        passwordHash: hashedPassword,
        confirmationToken: confirmationToken,
        isConfirmed: false,
      },
    });

    // Enviar correo de confirmación
    const confirmUrl = `${process.env.NEXTAUTH_URL}/confirm-account/${confirmationToken}`;
    
    try {
      await sendConfirmationEmail(email, confirmUrl, lang || 'es');
    } catch (mailError) {
      console.error("Error al enviar email de confirmación:", mailError);
      // No bloqueamos el registro si el email falla, pero el usuario tendrá que reenviarlo luego
    }

    return NextResponse.json(
      { 
        message: "Usuario creado exitosamente. Por favor verifica tu correo.", 
        user: { id: user.id, email: user.email } 
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Error en registro:", error);
    return NextResponse.json(
      { message: "Error en registro: " + error.message },
      { status: 500 }
    );
  }
}
