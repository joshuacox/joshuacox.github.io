import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const POSTS_DIR = path.join(process.cwd(), '_posts');
const PUBLIC_DIR = path.join(process.cwd(), 'public');

if (!fs.existsSync(POSTS_DIR)) {
  console.log('Skipping search index generation: _posts directory not found');
  process.exit(0);
}

function parseFilename(filename) {
  const match = filename.match(/^(\d{4})-(\d{2})-(\d{2})-(.+)\.md$/);
  if (!match) return null;
  const [, year, month, day, slug] = match;
  return { year, month, day, slug, date: `${year}-${month}-${day}` };
}

const files = fs.readdirSync(POSTS_DIR).filter(f => f.endsWith('.md'));
const searchIndex = [];

for (const file of files) {
  const parsed = parseFilename(file);
  if (!parsed) continue;

  const content = fs.readFileSync(path.join(POSTS_DIR, file), 'utf8');
  const { data } = matter(content);

  const isPublished = data.published === undefined || data.published === true || data.published === 'true';
  if (!isPublished) continue;

  const category = (data.category ? String(data.category).toLowerCase().trim() : 'blog') || 'blog';
  const url = `/${category}/${parsed.year}/${parsed.month}/${parsed.day}/${parsed.slug}/`;

  searchIndex.push({
    title: data.title || parsed.slug,
    url,
    category,
    tags: Array.isArray(data.tags) ? data.tags : (data.tags ? data.tags.split(',') : []),
    description: data.description || '',
    date: parsed.date,
  });
}

searchIndex.sort((a, b) => new Date(b.date) - new Date(a.date));

fs.writeFileSync(path.join(PUBLIC_DIR, 'search.json'), JSON.stringify(searchIndex));
console.log('Generated public/search.json');
