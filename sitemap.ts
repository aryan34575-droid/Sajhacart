import type { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_APP_URL;
  if (!base || !/^https:\/\//i.test(base)) return [];
  return [{ url: base.replace(/\/$/, ''), lastModified: new Date(), changeFrequency: 'weekly', priority: 1 }];
}
