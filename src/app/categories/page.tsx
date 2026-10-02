import React from 'react';
import Link from 'next/link';
import type { Metadata } from 'next';
import { getAllCategories, getPostsByCategory } from '@/lib/posts';
import { Folder, ArrowRight } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Categories',
  description: 'Browse posts by category.',
};

export default function CategoriesPage() {
  const categories = getAllCategories();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
      <div className="mb-10 pb-6 border-b border-[var(--border-color)]">
        <h1 className="text-3xl sm:text-4xl font-extrabold font-mono text-white mb-2">
          Categories
        </h1>
        <p className="text-sm sm:text-base text-[var(--text-muted)] font-sans">
          Topics and subjects explored across the blog.
        </p>
      </div>

      {/* Category Cloud / Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-16">
        {categories.map((cat) => (
          <Link
            key={cat.name}
            href={`/categories/${cat.name}/`}
            className="p-5 rounded-lg border border-[var(--border-color)] bg-[var(--bg-card)] hover:border-[var(--neon-accent)] hover:shadow-lg hover:shadow-[var(--neon-accent)]/10 transition-all flex items-center justify-between group"
          >
            <div className="flex items-center space-x-3">
              <Folder className="w-5 h-5 text-[var(--neon-accent)] group-hover:scale-110 transition-transform" />
              <span className="font-mono font-bold text-base text-[var(--text-primary)] group-hover:text-[var(--neon-accent)] uppercase">
                {cat.name}
              </span>
            </div>
            <span className="text-xs font-mono px-2 py-0.5 rounded border border-[var(--border-color)] text-[var(--text-muted)]">
              {cat.count}
            </span>
          </Link>
        ))}
      </div>

      {/* Detailed Category Sections */}
      <div className="space-y-12">
        {categories.map((cat) => {
          const posts = getPostsByCategory(cat.name);
          return (
            <section key={cat.name} id={cat.name} className="border-t border-[var(--border-color)] pt-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold font-mono text-[var(--neon-accent)] uppercase flex items-center space-x-2">
                  <span>/ {cat.name}</span>
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
