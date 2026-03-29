import Stripe from 'stripe';

const stripeSecret = process.env.STRIPE_SECRET_KEY || 'sk_test_dummy';

export const stripe = new Stripe(stripeSecret, {
  apiVersion: '2023-10-16' as any,
});

export async function createStripeCustomer(userData: { name: string; email: string; lang?: string }) {
  const customer = await stripe.customers.create({
    name: userData.name,
    email: userData.email,
    metadata: {
      lang: userData.lang || 'es',
    },
  });
  return customer;
}

export async function createStripeSubscription(customerId: string, priceId: string, paymentMethodId: string) {
  // Attach payment method to customer
  await stripe.paymentMethods.attach(paymentMethodId, {
    customer: customerId,
  });

  // Set as default payment method
  await stripe.customers.update(customerId, {
    invoice_settings: {
      default_payment_method: paymentMethodId,
    },
  });

  // Create subscription
  const subscription = await stripe.subscriptions.create({
    customer: customerId,
    items: [{ price: priceId }],
    expand: ['latest_invoice.payment_intent'],
    metadata: {
      price_id: priceId
    }
  });

  return subscription;
}

export async function createStripeCheckoutSession(userData: { name: string; email: string; lang?: string }) {
  let priceId = process.env.STRIPE_PRICE_ID;
  if (!priceId) throw new Error("STRIPE_PRICE_ID no configurada");

  // Si el usuario puso un Product ID instead of Price ID, buscamos el precio
  if (priceId.startsWith('prod_')) {
    const prices = await stripe.prices.list({
      product: priceId,
      active: true,
      limit: 1,
    });
    if (prices.data.length === 0) throw new Error("No se encontró un precio activo para el producto " + priceId);
    priceId = prices.data[0].id;
  }

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    customer_email: userData.email,
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    mode: 'subscription',
    success_url: `${process.env.NEXTAUTH_URL}/tools?status=success`,
    cancel_url: `${process.env.NEXTAUTH_URL}/activate-premium?status=failure`,
    metadata: {
      email: userData.email,
      lang: userData.lang || 'es',
    },
  });

  return session;
}
