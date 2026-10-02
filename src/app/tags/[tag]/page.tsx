import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getAllTags, getPostsByTag } from '@/lib/posts';
import { PostCard } from '@/components/PostCard';
import { Tag, ArrowLeft } from 'lucide-react';

interface PageProps {
  params: Promise<{
    tag: string;
  }>;
}

export async function generateStaticParams() {
  const tags = getAllTags();
  return tags.map((t) => ({
    tag: t.name,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { tag } = await params;
  return {
    title: `Tag: #${tag}`,
    description: `Articles tagged with #${tag}.`,
  };
}

export default async function TagDetailPage({ params }: PageProps) {
  const { tag } = await params;
  const posts = getPostsByTag(tag);
  if (!posts || posts.length === 0) notFound();

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <Link
          href="/tags/"
          className="inline-flex items-center space-x-2 text-xs font-mono text-[var(--neon-accent)] hover:underline"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>All Tags</span>
        </Link>
      </div>

      <div className="mb-10 pb-6 border-b border-[var(--border-color)]">
        <div className="flex items-center space-x-3 mb-2">
          <Tag className="w-6 h-6 text-[var(--neon-accent)]" />
          <h1 className="text-3xl sm:text-4xl font-extrabold font-mono text-white">
            #{tag}
          </h1>
        </div>
        <p className="text-sm font-mono text-[var(--text-muted)]">
          Found {posts.length} {posts.length === 1 ? 'post' : 'posts'} tagged with #{tag}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map((post) => (
          <PostCard key={post.url} post={post} />
        ))}
      </div>
    </div>
  );
}
