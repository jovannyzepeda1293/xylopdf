import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { createStripeCheckoutSession } from "@/lib/stripe";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const { email, name } = session.user;
    const body = await req.json().catch(() => ({}));
    const clientLang = body.lang || 'es';

    const checkoutSession = await createStripeCheckoutSession({ 
      name: name || "Cliente Premium", 
      email: email as string,
      lang: clientLang
    });

    return NextResponse.json({ 
      checkout_url: checkoutSession.url,
      id: checkoutSession.id 
    });
  } catch (error: any) {
    console.error("Error in checkout:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
