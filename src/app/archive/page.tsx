import React from 'react';
import type { Metadata } from 'next';
import { getAllPosts } from '@/lib/posts';
import { SearchBar } from '@/components/SearchBar';
import { Archive, Terminal } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Archive',
  description: 'Full chronological archive of all blog posts and articles by Joshua Cox.',
};

export default function ArchivePage() {
  const posts = getAllPosts();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
      <div className="mb-8 pb-6 border-b border-[var(--border-color)]">
        <div className="inline-flex items-center space-x-2 text-xs font-mono text-[var(--neon-accent)] mb-3">
          <Archive className="w-4 h-4" />
          <span>INDEX &bull; CHRONOLOGICAL REPOSITORY</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold font-mono text-white mb-2">
          Post Archive
        </h1>
        <p className="text-sm sm:text-base text-[var(--text-muted)] font-sans">
          Search and browse through all {posts.length} articles on Docker, Linux, Jekyll, Penetration Testing, and Techromancy.
        </p>
      </div>

      <SearchBar posts={posts} />
    </div>
  );
}
