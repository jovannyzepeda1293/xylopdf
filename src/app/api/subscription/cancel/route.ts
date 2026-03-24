import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const userId = Number((session.user as any).id);
    const subscription = await prisma.subscription.findUnique({
      where: { userId }
    });

    if (!subscription || !subscription.subscriptionId) {
      return NextResponse.json({ error: "Suscripción no encontrada" }, { status: 404 });
    }

    // Cancel in Stripe
    await stripe.subscriptions.update(subscription.subscriptionId, {
      cancel_at_period_end: true
    });

    // Update in Database
    await prisma.subscription.update({
      where: { userId },
      data: { canceled: true }
    });

    return NextResponse.json({ message: "Suscripción cancelada con éxito" });

  } catch (error: any) {
    console.error("Error cancelling subscription:", error);
    return NextResponse.json({ error: error.message || "Error interno" }, { status: 500 });
  }
}
