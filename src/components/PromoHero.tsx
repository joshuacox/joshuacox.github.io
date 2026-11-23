import React from 'react';
import Link from 'next/link';
import { siteConfig } from '@/config/site';
import { Terminal, Shield, ChevronDown } from 'lucide-react';

export function PromoHero() {
  return (
    <section className="relative py-20 md:py-28 border-b border-[var(--border-color)] bg-gradient-to-b from-[var(--bg-secondary)] via-[var(--bg-primary)] to-[var(--bg-primary)] overflow-hidden transition-colors duration-200">
      <div className="absolute inset-0 scanline opacity-25"></div>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center relative z-10">
        <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full border border-[var(--border-color)] bg-[var(--bg-card)] text-xs text-[var(--neon-accent)] font-mono mb-6 box-glow">
          <Terminal className="w-3.5 h-3.5 animate-pulse" />
          <span>system.boot() &bull; status: online</span>
        </div>

        <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight font-mono mb-4">
          <span className="text-[var(--neon-accent)] terminal-glow">{siteConfig.name}</span>
        </h1>

        <div className="text-xl sm:text-2xl font-mono text-[var(--neon-dim)] mb-6 flex items-center justify-center space-x-2">
          <span className="text-[var(--neon-accent)]">&gt;</span>
          <span className="font-semibold tracking-wide">{siteConfig.orgSummary}</span>
        </div>

        <p className="text-base sm:text-lg text-[var(--text-muted)] max-w-2xl mx-auto mb-10 font-sans leading-relaxed">
          {siteConfig.orgFullDescription}
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4 font-mono text-sm">
          <a
            href="#recent-posts"
            className="inline-flex items-center space-x-2 px-6 py-3 rounded-lg bg-[var(--neon-accent)] text-black font-bold hover:bg-[var(--neon-hover)] transition-all shadow-lg shadow-[var(--glow-color)] hover:scale-105"
          >
            <span>Read Posts</span>
            <ChevronDown className="w-4 h-4" />
          </a>
          <Link
            href="/about/"
            className="inline-flex items-center space-x-2 px-6 py-3 rounded-lg border border-[var(--border-color)] bg-[var(--bg-card)] text-[var(--text-primary)] hover:border-[var(--neon-accent)] hover:text-[var(--neon-accent)] transition-all hover:scale-105"
          >
            <Shield className="w-4 h-4 text-[var(--neon-accent)]" />
            <span>About Me</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
