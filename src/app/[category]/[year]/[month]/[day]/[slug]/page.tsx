import React from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';
import { getAllPosts, getPostByParams } from '@/lib/posts';
import { markdownToHtml } from '@/lib/markdown';
import { siteConfig } from '@/config/site';
import { ShareButtons } from '@/components/ShareButtons';
import { DisqusComments } from '@/components/DisqusComments';
import { Calendar, Folder, Tag, ArrowLeft, Terminal } from 'lucide-react';
import { format, parseISO } from 'date-fns';

interface PageProps {
  params: Promise<{
    category: string;
    year: string;
    month: string;
    day: string;
    slug: string;
  }>;
}

export async function generateStaticParams() {
  const posts = getAllPosts();
  return posts.map((post) => ({
    category: post.category,
    year: post.year,
    month: post.month,
    day: post.day,
    slug: post.slug,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { category, year, month, day, slug } = await params;
  const post = getPostByParams(category, year, month, day, slug);
  if (!post) return { title: 'Post Not Found' };

  const canonicalUrl = `${siteConfig.url}${post.url}`;

  return {
    title: post.title,
    description: post.description || siteConfig.description,
    openGraph: {
      title: post.title,
      description: post.description || siteConfig.description,
      url: canonicalUrl,
      type: 'article',
      publishedTime: post.date,
      images: post.photo_url ? [{ url: post.photo_url }] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.description || siteConfig.description,
      images: post.photo_url ? [post.photo_url] : undefined,
    },
    alternates: {
      canonical: canonicalUrl,
    },
  };
}

export default async function PostPage({ params }: PageProps) {
  const { category, year, month, day, slug } = await params;
  const post = getPostByParams(category, year, month, day, slug);
  if (!post) notFound();

  const contentHtml = await markdownToHtml(post.content);
  const formattedDate = post.date ? format(parseISO(post.date), 'MMMM dd, yyyy') : '';
  const canonicalUrl = `${siteConfig.url}${post.url}`;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.description || siteConfig.description,
    image: post.photo_url ? [post.photo_url] : [],
    datePublished: post.date ? new Date(post.date).toISOString() : undefined,
    dateModified: post.date ? new Date(post.date).toISOString() : undefined,
    author: [{
      '@type': 'Person',
      name: siteConfig.author,
      url: siteConfig.url
    }]
  };

  return (
    <article className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {/* Back button */}
      <div className="mb-8">
        <Link
          href="/"
          className="inline-flex items-center space-x-2 text-xs font-mono text-[var(--neon-accent)] hover:underline"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Transmissions</span>
        </Link>
      </div>

      {/* Header */}
      <header className="mb-8 pb-8 border-b border-[var(--border-color)]">
        <div className="flex flex-wrap items-center gap-3 text-xs font-mono text-[var(--text-muted)] mb-4">
          <span className="flex items-center space-x-1.5">
            <Calendar className="w-3.5 h-3.5 text-[var(--neon-accent)]" />
            <time dateTime={post.date}>{formattedDate}</time>
          </span>
          <span>&bull;</span>
          <span className="flex items-center space-x-1.5">
            <span>⏳ {post.readingTime}</span>
          </span>
          <span>&bull;</span>
          <Link
            href={`/categories/${post.category}/`}
            className="flex items-center space-x-1 text-[var(--neon-dim)] hover:text-[var(--neon-accent)] uppercase tracking-wider font-semibold"
          >
            <Folder className="w-3.5 h-3.5" />
            <span>{post.category}</span>
          </Link>
          {post.isDraft && (
            <span className="px-2 py-0.5 rounded bg-red-900/60 text-red-200 border border-red-700 text-[10px]">
              DRAFT
            </span>
          )}
        </div>

        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold font-mono text-white tracking-tight mb-4">
          {post.title}
        </h1>

        {post.description && (
          <p className="text-lg text-[var(--text-muted)] font-sans leading-relaxed">
            {post.description}
          </p>
        )}

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mt-4">
          {post.tags.map((tag) => (
            <Link
              key={tag}
              href={`/tags/${tag.toLowerCase()}/`}
              className="text-xs font-mono px-2.5 py-1 rounded border border-[var(--border-color)] bg-[var(--bg-secondary)] text-[var(--text-muted)] hover:text-[var(--neon-accent)] hover:border-[var(--neon-accent)]"
            >
              #{tag}
            </Link>
          ))}
        </div>
      </header>

      {/* Optional Featured Image */}
      {post.photo_url && (
        <div className="mb-10 rounded-lg overflow-hidden border border-[var(--border-color)] bg-[var(--bg-secondary)]">
          <img
            src={post.photo_url}
            alt={post.title}
            className="w-full max-h-[500px] object-cover"
          />
        </div>
      )}

      {/* Main Content */}
      <div
        className="prose prose-invert prose-cyber max-w-none font-sans leading-relaxed text-base prose-headings:font-mono prose-pre:p-0 prose-code:font-mono"
        dangerouslySetInnerHTML={{ __html: contentHtml }}
      />

      {/* Share Buttons */}
      <div className="mt-12 pt-6 border-t border-[var(--border-color)]">
        <ShareButtons title={post.title} url={canonicalUrl} />
      </div>

      {/* Disqus Comments */}
      {post.disqus && (
        <DisqusComments
          postUrl={canonicalUrl}
          postIdentifier={post.url}
          postTitle={post.title}
        />
      )}
    </article>
  );
}
