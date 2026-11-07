// IDs numéricos de plantillas de Brevo (Transactional → Templates)
const TEMPLATES = {
  confirmation: { es: 1, en: 2 },
  passwordReset: { es: 3, en: 4 },
  subscriptionActive: { es: 5, en: 6 },
};

type Lang = 'es' | 'en';

async function send(email: string, templateId: number, params: Record<string, string>, label: string) {
  const apiKey = process.env.BREVO_API_KEY;
  if (!apiKey) {
    console.error('BREVO_API_KEY no configurada');
    return;
  }

  try {
    const res = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: { 'api-key': apiKey, 'content-type': 'application/json', accept: 'application/json' },
      body: JSON.stringify({
        sender: { email: process.env.BREVO_FROM_EMAIL || 'noreply@xylopdf.com', name: 'XyloPDF' },
        to: [{ email }],
        templateId,
        params,
      }),
    });
    if (!res.ok) {
      console.error(`Error enviando email (${label}) con Brevo:`, res.status, await res.text());
      return;
    }
    console.log(`Email de ${label} enviado a ${email}`);
  } catch (error: any) {
    console.error(`Error enviando email (${label}) con Brevo:`, error.message);
  }
}

export const sendConfirmationEmail = (email: string, confirmUrl: string, lang: Lang = 'es') =>
  send(email, TEMPLATES.confirmation[lang] || TEMPLATES.confirmation.es, { confirm_url: confirmUrl }, `confirmación (${lang})`);

export const sendPasswordResetEmail = (email: string, resetUrl: string, lang: Lang = 'es') =>
  send(email, TEMPLATES.passwordReset[lang] || TEMPLATES.passwordReset.es, { reset_url: resetUrl }, `recuperación (${lang})`);

export const sendSubscriptionActiveEmail = (email: string, renewalDate: string, lang: Lang = 'es') =>
  send(email, TEMPLATES.subscriptionActive[lang] || TEMPLATES.subscriptionActive.es, { renewal_date: renewalDate }, `suscripción activa (${lang})`);
