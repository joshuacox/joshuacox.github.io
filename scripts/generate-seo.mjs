import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const POSTS_DIR = path.join(process.cwd(), '_posts');
const PUBLIC_DIR = path.join(process.cwd(), 'public');

const SITE_URL = 'https://joshuacox.github.io';
const SITE_TITLE = 'Joshua Cox';
const SITE_DESCRIPTION = 'Joshua Cox Blog and Portfolio';

if (!fs.existsSync(POSTS_DIR)) {
  console.log('Skipping SEO generation: _posts directory not found');
  process.exit(0);
}

function parseFilename(filename) {
  const match = filename.match(/^(\d{4})-(\d{2})-(\d{2})-(.+)\.md$/);
  if (!match) return null;
  const [, year, month, day, slug] = match;
  return { year, month, day, slug, date: `${year}-${month}-${day}` };
}

const files = fs.readdirSync(POSTS_DIR).filter(f => f.endsWith('.md'));
const posts = [];

for (const file of files) {
  const parsed = parseFilename(file);
  if (!parsed) continue;

  const content = fs.readFileSync(path.join(POSTS_DIR, file), 'utf8');
  const { data } = matter(content);

  const isPublished = data.published === undefined || data.published === true || data.published === 'true';
  if (!isPublished) continue;

  const category = (data.category ? String(data.category).toLowerCase().trim() : 'blog') || 'blog';
  const url = `${SITE_URL}/${category}/${parsed.year}/${parsed.month}/${parsed.day}/${parsed.slug}/`;

  posts.push({
    title: data.title || parsed.slug,
    url,
    date: new Date(parsed.date).toUTCString(),
    description: data.description || '',
    isoDate: new Date(parsed.date).toISOString()
  });
}

posts.sort((a, b) => new Date(b.date) - new Date(a.date));

// Generate Sitemap
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${SITE_URL}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${SITE_URL}/blog/</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <priority>0.8</priority>
  </url>
${posts.map(post => `  <url>
    <loc>${post.url}</loc>
    <lastmod>${post.isoDate}</lastmod>
    <priority>0.7</priority>
  </url>`).join('\n')}
</urlset>`;

fs.writeFileSync(path.join(PUBLIC_DIR, 'sitemap.xml'), sitemap);
console.log('Generated public/sitemap.xml');

// Generate RSS
const rss = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0">
  <channel>
    <title>${SITE_TITLE}</title>
    <link>${SITE_URL}</link>
    <description>${SITE_DESCRIPTION}</description>
${posts.map(post => `    <item>
      <title><![CDATA[${post.title}]]></title>
      <link>${post.url}</link>
      <description><![CDATA[${post.description}]]></description>
      <pubDate>${post.date}</pubDate>
      <guid>${post.url}</guid>
    </item>`).join('\n')}
  </channel>
</rss>`;

fs.writeFileSync(path.join(PUBLIC_DIR, 'rss.xml'), rss);
console.log('Generated public/rss.xml');
