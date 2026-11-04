import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import crypto from "crypto";
import { sendConfirmationEmail } from "@/lib/sendgrid";

export async function POST(req: Request) {
  try {
    const { lang } = await req.json().catch(() => ({}));
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ message: "No autorizado" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email as string },
    });

    if (!user) {
      return NextResponse.json({ message: "Usuario no encontrado" }, { status: 404 });
    }

    if (user.isConfirmed) {
      return NextResponse.json({ message: "La cuenta ya está confirmada" }, { status: 400 });
    }

    // Generar nuevo token
    const newToken = crypto.randomBytes(32).toString('hex');

    await prisma.user.update({
      where: { id: user.id },
      data: { confirmationToken: newToken },
    });

    const confirmUrl = `${process.env.NEXTAUTH_URL}/confirm-account/${newToken}`;
    await sendConfirmationEmail(user.email, confirmUrl, lang || 'es');

    return NextResponse.json({ message: "Correo de confirmación reenviado" });
  } catch (error: any) {
    console.error("Error al reenviar email:", error);
    return NextResponse.json({ message: "Error interno: " + error.message }, { status: 500 });
  }
}
