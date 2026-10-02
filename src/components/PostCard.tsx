import React from 'react';
import Link from 'next/link';
import { Post } from '@/lib/posts';
import { Calendar, Tag, ArrowRight, Folder } from 'lucide-react';
import { format, parseISO } from 'date-fns';

export function PostCard({ post }: { post: Post }) {
  const formattedDate = post.date ? format(parseISO(post.date), 'MMM dd, yyyy') : '';

  return (
    <article className="group flex flex-col justify-between border border-[var(--border-color)] bg-[var(--bg-card)] rounded-lg overflow-hidden hover:border-[var(--neon-accent)] transition-all duration-300 hover:shadow-lg hover:shadow-[var(--neon-accent)]/10">
      {post.photo_url && (
        <Link href={post.url} className="block relative h-48 w-full overflow-hidden bg-[var(--bg-secondary)] border-b border-[var(--border-color)]">
          <img
            src={post.photo_url}
            alt={post.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90 group-hover:opacity-100"
            loading="lazy"
          />
        </Link>
      )}

      <div className="p-6 flex-1 flex flex-col justify-between">
        <div>
          {/* Metadata badges */}
          <div className="flex flex-wrap items-center gap-3 text-xs font-mono text-[var(--text-muted)] mb-3">
            <span className="flex items-center space-x-1">
              <Calendar className="w-3.5 h-3.5 text-[var(--neon-accent)]" />
              <time dateTime={post.date}>{formattedDate}</time>
            </span>
            <span className="text-[var(--border-color)]">&bull;</span>
            <Link
              href={`/categories/${post.category}/`}
              className="flex items-center space-x-1 text-[var(--neon-dim)] hover:text-[var(--neon-accent)] uppercase tracking-wider"
            >
              <Folder className="w-3.5 h-3.5" />
              <span>{post.category}</span>
            </Link>
          </div>

          {/* Title */}
          <h2 className="text-xl font-bold font-mono text-[var(--text-primary)] group-hover:text-[var(--neon-accent)] transition-colors line-clamp-2 mb-3">
            <Link href={post.url}>{post.title}</Link>
          </h2>

          {/* Excerpt / Description */}
          {post.description && (
            <p className="text-sm text-[var(--text-muted)] line-clamp-3 mb-4 font-sans">
              {post.description}
            </p>
          )}
        </div>

        {/* Tags & Read Link */}
        <div className="pt-4 border-t border-[var(--border-color)]/50 flex items-center justify-between mt-auto">
          <div className="flex flex-wrap gap-1.5">
            {post.tags.slice(0, 3).map((tag) => (
              <Link
                key={tag}
                href={`/tags/${tag.toLowerCase()}/`}
                className="text-[10px] font-mono px-2 py-0.5 rounded border border-[var(--border-color)] text-[var(--text-muted)] hover:text-[var(--neon-accent)] hover:border-[var(--neon-accent)]"
              >
                #{tag}
              </Link>
            ))}
          </div>

          <Link
            href={post.url}
            className="inline-flex items-center space-x-1 text-xs font-mono text-[var(--neon-accent)] group-hover:translate-x-1 transition-transform"
          >
            <span>Read</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </article>
  );
}
