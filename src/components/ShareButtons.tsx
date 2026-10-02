'use client';

import React, { useState } from 'react';
import { Twitter, Linkedin, Facebook, Share2, Check, Copy } from 'lucide-react';

export function ShareButtons({ title, url }: { title: string; url: string }) {
  const [copied, setCopied] = useState(false);

  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-wrap items-center gap-2 pt-6 pb-2 text-xs font-mono">
      <span className="text-[var(--text-muted)] flex items-center space-x-1 mr-2">
        <Share2 className="w-3.5 h-3.5 text-[var(--neon-accent)]" />
        <span>Share:</span>
      </span>

      <a
        href={`https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`}
        target="_blank"
        rel="noopener noreferrer"
        className="px-2.5 py-1 rounded border border-[var(--border-color)] bg-[var(--bg-secondary)] text-[var(--text-muted)] hover:text-[var(--neon-accent)] hover:border-[var(--neon-accent)] transition-colors flex items-center space-x-1"
        aria-label="Share on Twitter"
      >
        <Twitter className="w-3 h-3" />
        <span>Twitter</span>
      </a>

      <a
        href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`}
        target="_blank"
        rel="noopener noreferrer"
        className="px-2.5 py-1 rounded border border-[var(--border-color)] bg-[var(--bg-secondary)] text-[var(--text-muted)] hover:text-[var(--neon-accent)] hover:border-[var(--neon-accent)] transition-colors flex items-center space-x-1"
        aria-label="Share on LinkedIn"
      >
        <Linkedin className="w-3 h-3" />
        <span>LinkedIn</span>
      </a>

      <a
        href={`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`}
        target="_blank"
        rel="noopener noreferrer"
        className="px-2.5 py-1 rounded border border-[var(--border-color)] bg-[var(--bg-secondary)] text-[var(--text-muted)] hover:text-[var(--neon-accent)] hover:border-[var(--neon-accent)] transition-colors flex items-center space-x-1"
        aria-label="Share on Facebook"
      >
        <Facebook className="w-3 h-3" />
        <span>Facebook</span>
      </a>

      <button
        onClick={copyToClipboard}
        className="px-2.5 py-1 rounded border border-[var(--border-color)] bg-[var(--bg-secondary)] text-[var(--text-muted)] hover:text-[var(--neon-accent)] hover:border-[var(--neon-accent)] transition-colors flex items-center space-x-1"
        aria-label="Copy link"
      >
        {copied ? <Check className="w-3 h-3 text-[var(--neon-accent)]" /> : <Copy className="w-3 h-3" />}
        <span>{copied ? 'Copied!' : 'Copy Link'}</span>
      </button>
    </div>
  );
}
