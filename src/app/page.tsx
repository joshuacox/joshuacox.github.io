import React from 'react';
import Link from 'next/link';
import { getAllPosts, getAllCategories } from '@/lib/posts';
import { PromoHero } from '@/components/PromoHero';
import { PostCard } from '@/components/PostCard';
import { ArrowRight, Terminal, Layers } from 'lucide-react';

export default function HomePage() {
  const posts = getAllPosts();
  const categories = getAllCategories();
  const recentPosts = posts.slice(0, 12);

  return (
    <div>
      <PromoHero />

      <div id="recent-posts" className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Category Filter Pills */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8 pb-4 border-b border-[var(--border-color)]">
          <div className="flex items-center space-x-2 text-sm font-mono text-[var(--neon-accent)] font-bold">
            <Layers className="w-4 h-4" />
            <span>TOPICS / CATEGORIES</span>
          </div>
          <div className="flex flex-wrap gap-2 text-xs font-mono">
            {categories.map((cat) => (
              <Link
                key={cat.name}
                href={`/categories/${cat.name}/`}
                className="px-3 py-1 rounded border border-[var(--border-color)] bg-[var(--bg-secondary)] text-[var(--text-muted)] hover:border-[var(--neon-accent)] hover:text-[var(--neon-accent)] transition-colors"
              >
                {cat.name} ({cat.count})
              </Link>
            ))}
          </div>
        </div>

        {/* Section Heading */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-2 font-mono">
            <Terminal className="w-5 h-5 text-[var(--neon-accent)]" />
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-wide">
              RECENT_TRANSMISSIONS
            </h2>
          </div>
          <Link
            href="/archive/"
            className="inline-flex items-center space-x-1 text-xs sm:text-sm font-mono text-[var(--neon-accent)] hover:underline"
          >
            <span>View All ({posts.length})</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recentPosts.map((post) => (
            <PostCard key={post.url} post={post} />
          ))}
        </div>

        {/* Bottom CTA to Archive */}
        {posts.length > 12 && (
          <div className="mt-12 text-center">
            <Link
              href="/archive/"
              className="inline-flex items-center space-x-2 px-6 py-3 rounded border border-[var(--neon-accent)] bg-[var(--bg-secondary)] text-[var(--neon-accent)] hover:bg-[var(--neon-accent)] hover:text-black font-mono text-sm font-semibold transition-colors"
            >
              <span>Explore All {posts.length} Posts in Archive</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
