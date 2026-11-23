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

      <div id="recent-posts" className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        {/* Category Filter Pills */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-10 pb-5 border-b border-[var(--border-color)]">
          <div className="flex items-center space-x-2 text-xs sm:text-sm font-mono text-[var(--neon-accent)] font-bold tracking-wider">
            <Layers className="w-4 h-4" />
            <span>TOPICS / CATEGORIES</span>
          </div>
          <div className="flex flex-wrap gap-2 text-xs font-mono">
            {categories.map((cat) => (
              <Link
                key={cat.name}
                href={`/categories/${cat.name}/`}
                className="px-3 py-1.5 rounded-md border border-[var(--border-color)] bg-[var(--bg-card)] text-[var(--text-muted)] hover:border-[var(--neon-accent)] hover:text-[var(--neon-accent)] transition-all uppercase tracking-wide text-[11px]"
              >
                {cat.name} <span className="text-[var(--neon-dim)]">({cat.count})</span>
              </Link>
            ))}
          </div>
        </div>

        {/* Section Heading */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-2.5 font-mono">
            <span className="p-1 rounded bg-[var(--bg-secondary)] border border-[var(--border-color)]">
              <Terminal className="w-4 h-4 text-[var(--neon-accent)]" />
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-[var(--text-primary)] tracking-wide">
              RECENT_TRANSMISSIONS
            </h2>
          </div>
          <Link
            href="/archive/"
            className="inline-flex items-center space-x-1.5 text-xs sm:text-sm font-mono text-[var(--neon-accent)] hover:text-[var(--neon-hover)] group"
          >
            <span>View All ({posts.length})</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
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
          <div className="mt-14 text-center">
            <Link
              href="/archive/"
              className="inline-flex items-center space-x-2 px-6 py-3 rounded-lg border border-[var(--neon-accent)] bg-[var(--bg-secondary)] text-[var(--neon-accent)] hover:bg-[var(--neon-accent)] hover:text-black font-mono text-sm font-semibold transition-all shadow-md hover:shadow-lg hover:shadow-[var(--glow-color)]"
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
