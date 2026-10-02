import { getAllPosts, getAllCategories, getAllTags } from '@/lib/posts';
import { siteConfig } from '@/config/site';

export const dynamic = 'force-static';

export async function GET() {
  const posts = getAllPosts();
  const categories = getAllCategories();
  const tags = getAllTags();

  const staticPages = [
    '',
    '/about/',
    '/archive/',
    '/categories/',
    '/tags/',
  ];

  const staticUrls = staticPages.map((page) => `
  <url>
    <loc>${siteConfig.url}${page}</loc>
    <changefreq>weekly</changefreq>
    <priority>${page === '' ? '1.0' : '0.8'}</priority>
  </url>`).join('');

  const postUrls = posts.map((post) => `
  <url>
    <loc>${siteConfig.url}${post.url}</loc>
    <lastmod>${post.date}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>`).join('');

  const categoryUrls = categories.map((cat) => `
  <url>
    <loc>${siteConfig.url}/categories/${cat.name}/</loc>
    <changefreq>weekly</changefreq>
    <priority>0.6</priority>
  </url>`).join('');

  const tagUrls = tags.map((t) => `
  <url>
    <loc>${siteConfig.url}/tags/${t.name}/</loc>
    <changefreq>weekly</changefreq>
    <priority>0.5</priority>
  </url>`).join('');

  const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${staticUrls}
  ${postUrls}
  ${categoryUrls}
  ${tagUrls}
</urlset>`;

  return new Response(sitemapXml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
    },
  });
}
