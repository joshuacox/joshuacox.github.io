import React from 'react';
import Link from 'next/link';
import type { Metadata } from 'next';
import { getAllTags, getPostsByTag } from '@/lib/posts';
import { Tag } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Tags',
  description: 'Explore blog posts by tag.',
};

export default function TagsPage() {
  const tags = getAllTags();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
      <div className="mb-10 pb-6 border-b border-[var(--border-color)]">
        <h1 className="text-3xl sm:text-4xl font-extrabold font-mono text-white mb-2">
          Tags
        </h1>
        <p className="text-sm sm:text-base text-[var(--text-muted)] font-sans">
          Index of all subject tags across the blog.
        </p>
      </div>

      {/* Tag Cloud */}
      <div className="p-6 rounded-lg border border-[var(--border-color)] bg-[var(--bg-card)] mb-16">
        <div className="flex flex-wrap gap-2.5">
          {tags.map((tag) => (
            <Link
              key={tag.name}
              href={`#tag-${tag.name}`}
              className="text-xs sm:text-sm font-mono px-3 py-1.5 rounded border border-[var(--border-color)] bg-[var(--bg-secondary)] text-[var(--text-muted)] hover:border-[var(--neon-accent)] hover:text-[var(--neon-accent)] transition-colors flex items-center space-x-1.5"
            >
              <span>#{tag.name}</span>
              <span className="text-[10px] text-[var(--neon-dim)]">({tag.count})</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Grouped Tag Lists */}
      <div className="space-y-12">
        {tags.map((tag) => {
          const posts = getPostsByTag(tag.name);
          return (
            <section key={tag.name} id={`tag-${tag.name}`} className="border-t border-[var(--border-color)] pt-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold font-mono text-[var(--neon-accent)] flex items-center space-x-2">
                  <Tag className="w-4 h-4" />
                  <span>#{tag.name}</span>
                </h2>
                <span className="text-xs font-mono text-[var(--text-muted)]">
                  {posts.length} {posts.length === 1 ? 'post' : 'posts'}
                </span>
              </div>

              <div className="border border-[var(--border-color)] rounded-lg bg-[var(--bg-card)] divide-y divide-[var(--border-color)]">
                {posts.map((post) => (
                  <div key={post.url} className="p-3.5 sm:p-4 hover:bg-[var(--bg-secondary)] transition-colors flex items-center justify-between">
                    <Link
                      href={post.url}
                      className="font-mono text-sm text-[var(--text-primary)] hover:text-[var(--neon-accent)] transition-colors line-clamp-1"
                    >
                      {post.title}
                    </Link>
                    <time dateTime={post.date} className="text-xs font-mono text-[var(--text-muted)] shrink-0 ml-4">
                      {post.date}
                    </time>
                  </div>
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
