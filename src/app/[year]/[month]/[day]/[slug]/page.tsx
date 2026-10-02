import React from 'react';
import { notFound, redirect } from 'next/navigation';
import { getAllPosts, getPostWithoutCategory } from '@/lib/posts';

interface PageProps {
  params: Promise<{
    year: string;
    month: string;
    day: string;
    slug: string;
  }>;
}

export async function generateStaticParams() {
  const posts = getAllPosts();
  return posts.map((post) => ({
    year: post.year,
    month: post.month,
    day: post.day,
    slug: post.slug,
  }));
}

export default async function FallbackPostPage({ params }: PageProps) {
  const { year, month, day, slug } = await params;
  const post = getPostWithoutCategory(year, month, day, slug);
  if (!post) notFound();

  // Redirect to canonical category URL with meta refresh fallback for static export
  return (
    <div className="max-w-2xl mx-auto px-4 py-20 text-center font-mono">
      <meta httpEquiv="refresh" content={`0; url=${post.url}`} />
      <p className="text-[var(--neon-accent)] text-lg mb-4">Redirecting to transmission...</p>
      <p className="text-sm text-[var(--text-muted)]">
        If you are not redirected automatically,{' '}
        <a href={post.url} className="text-[var(--neon-accent)] underline">
          click here
        </a>.
      </p>
    </div>
  );
}
