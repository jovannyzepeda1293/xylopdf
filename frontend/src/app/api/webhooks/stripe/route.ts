import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";
import { sendSubscriptionActiveEmail } from "@/lib/brevo";
import Stripe from "stripe";

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

export async function POST(req: Request) {
  const body = await req.text();
  const signature = req.headers.get("stripe-signature") || "";

  let event: Stripe.Event;

  try {
    if (!endpointSecret) throw new Error("STRIPE_WEBHOOK_SECRET no configurada");
    event = stripe.webhooks.constructEvent(body, signature, endpointSecret);
  } catch (err: any) {
    console.error(`Webhook signature verification failed: ${err.message}`);
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
  }

  const data = event.data.object as any;

  // Manejamos el pago exitoso (tanto inicial como renovaciones)
  if (event.type === "checkout.session.completed" || event.type === "invoice.payment_succeeded") {
    const customerEmail = data.customer_email || data.customer_details?.email || data.metadata?.email;
    const lang = (data.metadata?.lang as 'es' | 'en') || 'es';

    if (customerEmail) {
      const user = await prisma.user.findUnique({
        where: { email: customerEmail.toLowerCase() },
      });

      if (user) {
        console.log(`Actualizando suscripción para el usuario: ${user.email}`);
        
        // Calcular fecha de expiración (un mes desde ahora o extender la actual)
        let expiresAt = new Date();
        const currentSub = await prisma.subscription.findUnique({
          where: { userId: user.id }
        });

        if (currentSub && currentSub.expiresAt && currentSub.expiresAt > new Date()) {
          expiresAt = new Date(currentSub.expiresAt);
        }
        expiresAt.setMonth(expiresAt.getMonth() + 1);

        await prisma.subscription.upsert({
          where: { userId: user.id },
          update: {
            status: 1,
            lastPaymentDate: new Date(),
            expiresAt: expiresAt,
            customerId: data.customer as string,
            subscriptionId: data.subscription as string,
          },
          create: {
            userId: user.id,
            status: 1,
            lastPaymentDate: new Date(),
            expiresAt: expiresAt,
            customerId: data.customer as string,
            subscriptionId: data.subscription as string,
          },
        });

        // Enviar correo de éxito
        const renewalDateStr = expiresAt.toLocaleDateString(lang === 'es' ? 'es-MX' : 'en-US');
        await sendSubscriptionActiveEmail(customerEmail, renewalDateStr, lang);
      }
    }
  }

  // Manejamos cancelaciones o falta de pago
  if (event.type === "customer.subscription.deleted" || event.type === "invoice.payment_failed") {
    const customerId = data.customer as string;
    if (customerId) {
       await prisma.subscription.updateMany({
         where: { customerId },
         data: { status: 0 } // Desactivar suscripción
       });
    }
  }

  return NextResponse.json({ received: true });
}
