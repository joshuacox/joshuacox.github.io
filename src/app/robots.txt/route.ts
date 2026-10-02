import { siteConfig } from '@/config/site';

export const dynamic = 'force-static';

export async function GET() {
  const robots = `User-agent: *
Allow: /

Sitemap: ${siteConfig.url}/sitemap.xml
`;

  return new Response(robots, {
    headers: {
      'Content-Type': 'text/plain',
    },
  });
}
