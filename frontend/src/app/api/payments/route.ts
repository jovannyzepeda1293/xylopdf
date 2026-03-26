import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const rawBody = await req.json();
    
    // El JSON proporcionado parece ser un array (estilo n8n), 
    // intentamos obtener el objeto real de Conekta.
    let eventData = Array.isArray(rawBody) ? rawBody[0]?.body : rawBody;
    
    // Si sigue sin ser el objeto, podria ser que ya recibimos el body directamente
    if (!eventData && rawBody.type) eventData = rawBody;

    if (!eventData) {
      console.error("Webhook Error: No event data found in body");
      return NextResponse.json({ error: "No data" }, { status: 400 });
    }

    const eventType = eventData.type;
    console.log(`Webhook Received: ${eventType}`);

    // Solo procesamos pagos exitosos
    if (eventType === "charge.paid" || eventType === "order.paid") {
      const charge = eventData.data.object;
      
      // Intentamos obtener el email de metadata (que acabamos de configurar) 
      // o del customer_info si está presente.
      const email = charge.metadata?.email || charge.customer_info?.email;

      if (!email) {
        console.warn("Webhook: No se encontró email en el charge", charge.id);
        return NextResponse.json({ received: true, message: "No email found" });
      }

      // Bucamos al usuario en la base de datos
      const user = await prisma.user.findUnique({
        where: { email },
      });

      if (!user) {
        console.warn(`Webhook: Usuario no encontrado para el email ${email}`);
        return NextResponse.json({ received: true, message: "User not found" });
      }

      // Calcular fecha de expiración: 1 mes + 1 día después de hoy
      const expiresAt = new Date();
      expiresAt.setMonth(expiresAt.getMonth() + 1);
      expiresAt.setDate(expiresAt.getDate() + 1);

      // Crear o actualizar la suscripción
      await prisma.subscription.upsert({
        where: { userId: user.id },
        update: {
          lastPaymentDate: new Date(),
          expiresAt: expiresAt,
          status: 1, // 1 = Activo
        },
        create: {
          userId: user.id,
          lastPaymentDate: new Date(),
          expiresAt: expiresAt,
          status: 1,
        },
      });

      console.log(`Suscripción activada para ${email}. Expira el ${expiresAt.toISOString()}`);
      return NextResponse.json({ status: "success", message: "Subscription activated" });
    }

    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error("Webhook Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
