import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const token = searchParams.get("token");

  if (!token) {
    return NextResponse.json({ message: "Token no proporcionado" }, { status: 400 });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { confirmationToken: token }
    });

    if (!user) {
      return NextResponse.json({ message: "Token inválido o expirado" }, { status: 400 });
    }

    await prisma.user.update({
      where: { id: user.id },
      data: { 
        isConfirmed: true,
        confirmationToken: null, // Limpiar el token tras confirmarlo
      }
    });

    return NextResponse.json({ message: "Cuenta confirmada correctamente" });
  } catch (error) {
    console.error("Error al confirmar cuenta:", error);
    return NextResponse.json({ message: "Error interno del servidor" }, { status: 500 });
  }
}
