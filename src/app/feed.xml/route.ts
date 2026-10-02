import { getAllPosts } from '@/lib/posts';
import { siteConfig } from '@/config/site';

export const dynamic = 'force-static';

export async function GET() {
  const posts = getAllPosts();

  const itemsXml = posts
    .map((post) => {
      const postUrl = `${siteConfig.url}${post.url}`;
      const pubDate = new Date(post.date).toUTCString();
      const escapedTitle = post.title.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
      const escapedDesc = (post.description || post.title)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');

      return `
    <item>
      <title>${escapedTitle}</title>
      <link>${postUrl}</link>
      <guid isPermaLink="true">${postUrl}</guid>
      <pubDate>${pubDate}</pubDate>
      <description>${escapedDesc}</description>
      <category>${post.category}</category>
    </item>`;
    })
    .join('');

  const feedXml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${siteConfig.title}</title>
    <link>${siteConfig.url}</link>
    <description>${siteConfig.description}</description>
    <language>en-us</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${siteConfig.url}/feed.xml" rel="self" type="application/rss+xml"/>
    ${itemsXml}
  </channel>
</rss>`;

  return new Response(feedXml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
    },
  });
}
