import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const POSTS_DIR = path.join(process.cwd(), '_posts');
const OUT_DIR = path.join(process.cwd(), 'out');

if (!fs.existsSync(POSTS_DIR) || !fs.existsSync(OUT_DIR)) {
  console.log('Skipping redirects generation: directories not found');
  process.exit(0);
}

function parseFilename(filename) {
  const match = filename.match(/^(\d{4})-(\d{2})-(\d{2})-(.+)\.md$/);
  if (!match) return null;
  const [, year, month, day, slug] = match;
  return { year, month, day, slug };
}

const files = fs.readdirSync(POSTS_DIR).filter(f => f.endsWith('.md'));
let redirectCount = 0;

for (const file of files) {
  const parsed = parseFilename(file);
  if (!parsed) continue;

  const content = fs.readFileSync(path.join(POSTS_DIR, file), 'utf8');
  const { data } = matter(content);

  const category = (data.category ? String(data.category).toLowerCase().trim() : 'blog') || 'blog';
  const targetUrl = `/${category}/${parsed.year}/${parsed.month}/${parsed.day}/${parsed.slug}/`;

  let redirects = [];
  if (data.redirect_from) {
    if (Array.isArray(data.redirect_from)) {
      redirects = data.redirect_from;
    } else if (typeof data.redirect_from === 'string') {
      redirects = [data.redirect_from];
    }
  }

  for (const redir of redirects) {
    const cleanRedir = redir.replace(/^\/+/, '');
    const outTarget = path.join(OUT_DIR, cleanRedir);

    // If redirect ends in .html or is a file path
    const targetFilePath = cleanRedir.endsWith('.html')
      ? outTarget
      : path.join(outTarget, 'index.html');

    fs.mkdirSync(path.dirname(targetFilePath), { recursive: true });

    const htmlContent = `<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <title>Redirecting...</title>
    <link rel="canonical" href="${targetUrl}">
    <meta http-equiv="refresh" content="0; url=${targetUrl}">
  </head>
  <body>
    <h1>Redirecting...</h1>
    <p>This page has moved to <a href="${targetUrl}">${targetUrl}</a>.</p>
  </body>
</html>`;

    fs.writeFileSync(targetFilePath, htmlContent);
    redirectCount++;
    console.log(`Generated redirect: /${cleanRedir} -> ${targetUrl}`);
  }
}

console.log(`Generated ${redirectCount} redirect stubs.`);
