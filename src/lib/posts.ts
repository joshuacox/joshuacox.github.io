import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import readingTime from 'reading-time';

const POSTS_DIRECTORY = path.join(process.cwd(), '_posts');
const DRAFTS_DIRECTORY = path.join(process.cwd(), '_drafts');

export interface PostFrontmatter {
  title: string;
  date?: string;
  published?: boolean | string;
  layout?: string;
  disqus?: boolean | string;
  fbcomments?: boolean | string;
  category?: string;
  tags?: string[] | string;
  photo_url?: string;
  description?: string;
  redirect_from?: string[] | string;
  [key: string]: any;
}

export interface Post {
  slug: string;
  title: string;
  date: string;
  year: string;
  month: string;
  day: string;
  category: string;
  tags: string[];
  photo_url?: string;
  description: string;
  redirect_from: string[];
  disqus: boolean;
  content: string;
  url: string;
  isDraft?: boolean;
  readingTime?: string;
}

function parseFilename(filename: string): { year: string; month: string; day: string; slug: string; date: string } | null {
  const match = filename.match(/^(\d{4})-(\d{2})-(\d{2})-(.+)\.md$/);
  if (!match) return null;
  const [, year, month, day, slug] = match;
  return {
    year,
    month,
    day,
    slug,
    date: `${year}-${month}-${day}`,
  };
}

function normalizeTags(rawTags: any): string[] {
  if (!rawTags) return ['blog'];
  if (Array.isArray(rawTags)) return rawTags.map(t => String(t).trim()).filter(Boolean);
  if (typeof rawTags === 'string') {
    return rawTags.split(/[\s,]+/).map(t => t.trim()).filter(Boolean);
  }
  return ['blog'];
}

function normalizeRedirects(rawRedirects: any): string[] {
  if (!rawRedirects) return [];
  if (Array.isArray(rawRedirects)) return rawRedirects.map(r => String(r).trim()).filter(Boolean);
  if (typeof rawRedirects === 'string') return [rawRedirects.trim()];
  return [];
}

export function getAllPosts(includeDrafts = process.env.SHOW_DRAFTS === 'true'): Post[] {
  if (!fs.existsSync(POSTS_DIRECTORY)) return [];

  const files = fs.readdirSync(POSTS_DIRECTORY).filter(f => f.endsWith('.md'));
  const posts: Post[] = [];

  for (const filename of files) {
    const parsed = parseFilename(filename);
    if (!parsed) continue;

    const fullPath = path.join(POSTS_DIRECTORY, filename);
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const { data, content } = matter(fileContents);

    const isPublished = data.published === undefined || data.published === true || data.published === 'true';
    if (!isPublished) continue;

    const category = (data.category ? String(data.category).toLowerCase().trim() : 'blog') || 'blog';
    const tags = normalizeTags(data.tags);
    const redirect_from = normalizeRedirects(data.redirect_from);
    const disqus = data.disqus === true || data.disqus === 'true' || data.disqus === 'yes';

    const url = `/${category}/${parsed.year}/${parsed.month}/${parsed.day}/${parsed.slug}/`;

    const stats = readingTime(content);

    posts.push({
      slug: parsed.slug,
      title: data.title || parsed.slug,
      date: parsed.date,
      year: parsed.year,
      month: parsed.month,
      day: parsed.day,
      category,
      tags,
      photo_url: data.photo_url || undefined,
      description: data.description ? String(data.description).trim() : '',
      redirect_from,
      disqus,
      content,
      url,
      isDraft: false,
      readingTime: stats.text,
    });
  }

  if (includeDrafts && fs.existsSync(DRAFTS_DIRECTORY)) {
    const draftFiles = fs.readdirSync(DRAFTS_DIRECTORY).filter(f => f.endsWith('.md'));
    const now = new Date();
    const year = String(now.getFullYear());
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const date = `${year}-${month}-${day}`;

    for (const filename of draftFiles) {
      const slug = filename.replace(/\.md$/, '');
      const fullPath = path.join(DRAFTS_DIRECTORY, filename);
      const fileContents = fs.readFileSync(fullPath, 'utf8');
      const { data, content } = matter(fileContents);

      const category = (data.category ? String(data.category).toLowerCase().trim() : 'blog') || 'blog';
      const tags = normalizeTags(data.tags);
      const url = `/${category}/${year}/${month}/${day}/${slug}/`;

      const stats = readingTime(content);

      posts.push({
        slug,
        title: `[DRAFT] ${data.title || slug}`,
        date,
        year,
        month,
        day,
        category,
        tags,
        photo_url: data.photo_url || undefined,
        description: data.description ? String(data.description).trim() : '',
        redirect_from: [],
        disqus: false,
        content,
        url,
        isDraft: true,
        readingTime: stats.text,
      });
    }
  }

  return posts.sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function getPostByParams(category: string, year: string, month: string, day: string, slug: string): Post | undefined {
  const posts = getAllPosts(true);
  const normalizedCat = category.toLowerCase().trim();
  const normalizedSlug = slug.toLowerCase().trim();

  return posts.find(
    p =>
      p.category.toLowerCase() === normalizedCat &&
      p.year === year &&
      p.month === month &&
      p.day === day &&
      p.slug.toLowerCase() === normalizedSlug
  );
}

export function getPostWithoutCategory(year: string, month: string, day: string, slug: string): Post | undefined {
  const posts = getAllPosts(true);
  const normalizedSlug = slug.toLowerCase().trim();

  return posts.find(
    p =>
      p.year === year &&
      p.month === month &&
      p.day === day &&
      p.slug.toLowerCase() === normalizedSlug
  );
}

export function getAllCategories(): { name: string; count: number }[] {
  const posts = getAllPosts();
  const catMap = new Map<string, number>();

  for (const post of posts) {
    const c = post.category;
    catMap.set(c, (catMap.get(c) || 0) + 1);
  }

  return Array.from(catMap.entries())
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);
}

export function getAllTags(): { name: string; count: number }[] {
  const posts = getAllPosts();
  const tagMap = new Map<string, number>();

  for (const post of posts) {
    for (const tag of post.tags) {
      const t = tag.toLowerCase();
      tagMap.set(t, (tagMap.get(t) || 0) + 1);
    }
  }

  return Array.from(tagMap.entries())
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);
}

export function getPostsByCategory(category: string): Post[] {
  const normalized = category.toLowerCase();
  return getAllPosts().filter(p => p.category.toLowerCase() === normalized);
}

export function getPostsByTag(tag: string): Post[] {
  const normalized = tag.toLowerCase();
  return getAllPosts().filter(p => p.tags.some(t => t.toLowerCase() === normalized));
}
