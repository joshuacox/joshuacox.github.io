'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { Post } from '@/lib/posts';
import { Search, Calendar, Folder, Tag, X } from 'lucide-react';
import { format, parseISO } from 'date-fns';

export function SearchBar({ posts }: { posts: Post[] }) {
  const [query, setQuery] = useState('');

  const filteredPosts = useMemo(() => {
    if (!query.trim()) return posts;
    const q = query.toLowerCase().trim();
    return posts.filter((post) => {
      const matchTitle = post.title.toLowerCase().includes(q);
      const matchDesc = post.description.toLowerCase().includes(q);
      const matchCat = post.category.toLowerCase().includes(q);
      const matchTags = post.tags.some(t => t.toLowerCase().includes(q));
      return matchTitle || matchDesc || matchCat || matchTags;
    });
  }, [posts, query]);

  return (
    <div className="space-y-6">
      {/* Search Input Box */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[var(--neon-accent)]">
          <Search className="w-5 h-5" />
        </div>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Filter posts by title, tag, category, keyword..."
          className="w-full pl-10 pr-10 py-3 rounded-lg border border-[var(--border-color)] bg-[var(--bg-secondary)] text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--neon-accent)] focus:ring-1 focus:ring-[var(--neon-accent)] font-mono text-sm"
        />
        {query && (
          <button
            onClick={() => setQuery('')}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-[var(--text-muted)] hover:text-white"
            aria-label="Clear search"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      <div className="text-xs font-mono text-[var(--text-muted)] flex justify-between items-center px-1">
        <span>Showing {filteredPosts.length} of {posts.length} posts</span>
        {query && (
          <button onClick={() => setQuery('')} className="text-[var(--neon-accent)] hover:underline">
            Reset filter
          </button>
        )}
      </div>

      {/* Post List */}
      <div className="border border-[var(--border-color)] rounded-lg bg-[var(--bg-card)] divide-y divide-[var(--border-color)]">
        {filteredPosts.length === 0 ? (
          <div className="p-8 text-center text-sm font-mono text-[var(--text-muted)]">
            No posts found matching &ldquo;<span className="text-[var(--neon-accent)]">{query}</span>&rdquo;
          </div>
        ) : (
          filteredPosts.map((post) => {
            const formattedDate = post.date ? format(parseISO(post.date), 'MMM dd, yyyy') : '';
            return (
              <div key={post.url} className="p-4 sm:p-5 hover:bg-[var(--bg-secondary)] transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2 text-xs font-mono text-[var(--text-muted)]">
                    <span className="flex items-center space-x-1">
                      <Calendar className="w-3 h-3 text-[var(--neon-accent)]" />
                      <span>{formattedDate}</span>
                    </span>
                    <span>&bull;</span>
                    <Link
                      href={`/categories/${post.category}/`}
                      className="text-[var(--neon-dim)] hover:text-[var(--neon-accent)] uppercase text-[10px]"
                    >
                      {post.category}
                    </Link>
                  </div>
                  <h3 className="text-base font-bold font-mono text-[var(--text-primary)] hover:text-[var(--neon-accent)]">
                    <Link href={post.url}>{post.title}</Link>
                  </h3>
                  {post.description && (
                    <p className="text-xs text-[var(--text-muted)] line-clamp-1 font-sans">
                      {post.description}
                    </p>
                  )}
                </div>

                <div className="flex flex-wrap gap-1 sm:self-center">
                  {post.tags.slice(0, 3).map((t) => (
                    <span key={t} className="text-[10px] font-mono px-1.5 py-0.5 rounded border border-[var(--border-color)] text-[var(--text-muted)]">
                      #{t}
                    </span>
                  ))}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
