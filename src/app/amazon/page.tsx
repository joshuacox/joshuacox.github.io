import React from 'react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'jcox.amzn',
  description: 'Amazon store recommendations.',
};

export default function AmazonPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12 font-mono text-center">
      <h1 className="text-3xl font-bold text-white mb-6">jcox.amzn</h1>
      <p className="text-sm text-[var(--text-muted)] mb-8 font-sans">
        Recommended hardware, gadgets, and tech books.
      </p>
      <div className="p-8 rounded-lg border border-[var(--border-color)] bg-[var(--bg-card)]">
        <p className="text-[var(--neon-accent)] text-sm mb-4">
          Amazon Storefront &bull; Joshua Cox
        </p>
        <a
          href="https://www.amazon.com"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block px-6 py-2.5 rounded bg-[var(--neon-accent)] text-black font-bold text-xs uppercase hover:bg-[var(--neon-hover)]"
        >
          Visit Amazon
        </a>
      </div>
    </div>
  );
}
