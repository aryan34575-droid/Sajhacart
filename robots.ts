import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const productionUrl = process.env.NEXT_PUBLIC_APP_URL;
  const validProductionUrl = productionUrl && /^https:\/\//i.test(productionUrl);

  // Avoid indexing previews and deployments without a verified canonical domain.
  if (!validProductionUrl) {
    return { rules: { userAgent: '*', disallow: '/' } };
  }

  return {
    rules: { userAgent: '*', allow: '/', disallow: ['/api/', '/admin/'] },
    sitemap: `${productionUrl.replace(/\/$/, '')}/sitemap.xml`,
  };
}
