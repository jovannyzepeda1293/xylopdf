import { MetadataRoute } from 'next';

const PRIVATE = ['/api/', '/account', '/login', '/register', '/forgot-password', '/reset-password', '/confirm-account', '/activate-premium', '/unlimited-access', '/auth-redirect'];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: '*', allow: '/', disallow: PRIVATE },
      // GEO: permitir explícitamente a los rastreadores de IA para ser citado en respuestas generativas
      { userAgent: ['GPTBot', 'OAI-SearchBot', 'ChatGPT-User', 'ClaudeBot', 'Claude-SearchBot', 'PerplexityBot', 'Google-Extended', 'Applebot-Extended'], allow: '/', disallow: PRIVATE },
    ],
    sitemap: 'https://xylopdf.com/sitemap.xml',
  };
}
