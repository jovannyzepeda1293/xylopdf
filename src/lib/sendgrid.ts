import sgMail from '@sendgrid/mail';
import * as dotenv from 'dotenv';
dotenv.config({ override: true });

const TEMPLATES = {
  confirmation: {
    es: 'd-5620fab35f5845f7b340815afbb990ca',
    en: 'd-60a7b2722f194074abfd5606579663f4'
  },
  passwordReset: {
    es: 'd-de0676db203d413a95db823c87d6e589',
    en: 'd-4506ae0b71a74d91abc4ae069510530d'
  },
  subscriptionActive: {
    es: 'd-957dd9ef96984654900234d1c01b5871',
    en: 'd-0f3e0b5fa4364b5ab01f1558e0858062'
  }
};

export const sendConfirmationEmail = async (email: string, confirmUrl: string, lang: 'es' | 'en' = 'es') => {
  if (!process.env.SENDGRID_API_KEY) {
    console.error('SENDGRID_API_KEY no configurada');
    return;
  }
  
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);

  const msg = {
    to: email,
    from: process.env.SENDGRID_FROM_EMAIL || 'noreply@xylopdf.com',
    templateId: TEMPLATES.confirmation[lang] || TEMPLATES.confirmation.es,
    dynamicTemplateData: {
      confirm_url: confirmUrl,
    },
  };

  try {
    await sgMail.send(msg);
    console.log(`Email de confirmación (${lang}) enviado a ${email}`);
  } catch (error: any) {
    console.error('Error enviando email con SendGrid:', error.response?.body || error.message);
  }
};

export const sendPasswordResetEmail = async (email: string, resetUrl: string, lang: 'es' | 'en' = 'es') => {
  if (!process.env.SENDGRID_API_KEY) {
    console.error('SENDGRID_API_KEY no configurada');
    return;
  }

  sgMail.setApiKey(process.env.SENDGRID_API_KEY);

  const msg = {
    to: email,
    from: process.env.SENDGRID_FROM_EMAIL || 'noreply@xylopdf.com',
    templateId: TEMPLATES.passwordReset[lang] || TEMPLATES.passwordReset.es,
    dynamicTemplateData: {
      reset_url: resetUrl,
    },
  };

  try {
    await sgMail.send(msg);
    console.log(`Email de recuperación (${lang}) enviado a ${email}`);
  } catch (error: any) {
    console.error('Error enviando email de recuperación:', error.response?.body || error.message);
  }
};

export const sendSubscriptionActiveEmail = async (email: string, renewalDate: string, lang: 'es' | 'en' = 'es') => {
  if (!process.env.SENDGRID_API_KEY) {
    console.error('SENDGRID_API_KEY no configurada');
    return;
  }

  sgMail.setApiKey(process.env.SENDGRID_API_KEY);

  const msg = {
    to: email,
    from: process.env.SENDGRID_FROM_EMAIL || 'noreply@xylopdf.com',
    templateId: TEMPLATES.subscriptionActive[lang] || TEMPLATES.subscriptionActive.es,
    dynamicTemplateData: {
      renewal_date: renewalDate,
    },
  };

  try {
    await sgMail.send(msg);
    console.log(`Email de suscripción activa (${lang}) enviado a ${email}`);
  } catch (error: any) {
    console.error('Error enviando email de suscripción activa:', error.response?.body || error.message);
  }
};
