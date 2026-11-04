import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://xylopdf.com'; // Adjust to your actual domain
  const lastModified = new Date();

  const routes = [
    { url: '', priority: 1.0 },
    { url: '/tools', priority: 1.0 },
    { url: '/tools/merge-pdf', priority: 0.9 },
    { url: '/tools/split-pdf', priority: 0.9 },
    { url: '/tools/compress-pdf', priority: 0.9 },
    { url: '/tools/pdf-to-word', priority: 0.8 },
    { url: '/tools/pdf-to-excel', priority: 0.8 },
    { url: '/tools/pdf-to-ppt', priority: 0.8 },
    { url: '/tools/pdf-to-jpg', priority: 0.8 },
    { url: '/tools/word-to-pdf', priority: 0.8 },
    { url: '/tools/excel-to-pdf', priority: 0.8 },
    { url: '/tools/ppt-to-pdf', priority: 0.8 },
    { url: '/tools/image-to-pdf', priority: 0.8 },
    { url: '/tools/ocr-to-pdf', priority: 0.8 },
    { url: '/tools/rotate-pdf', priority: 0.8 },
    { url: '/tools/delete-pages', priority: 0.8 },
    { url: '/tools/lock-pdf', priority: 0.8 },
    { url: '/tools/unlock-pdf', priority: 0.8 },
    { url: '/tools/organize-pdf', priority: 0.8 },
    { url: '/tools/remove-watermark', priority: 0.8 },
    { url: '/tools/watermark', priority: 0.8 },
    { url: '/tools/compare-pdf', priority: 0.8 },
    { url: '/about', priority: 0.9 },
    { url: '/privacy', priority: 0.7 },
    { url: '/terms', priority: 0.7 },
  ];

  return routes.map((r) => ({
    url: `${baseUrl}${r.url}`,
    lastModified,
    changeFrequency: 'monthly',
    priority: r.priority,
  }));
}
