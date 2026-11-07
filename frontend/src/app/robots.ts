import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', '/account', '/login', '/register', '/forgot-password', '/reset-password/', '/confirm-account/', '/auth-redirect', '/activate-premium', '/unlimited-access'],
    },
    sitemap: 'https://xylopdf.com/sitemap.xml',
    host: 'https://xylopdf.com',
  };
}
