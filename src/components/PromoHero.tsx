import React from 'react';
import Link from 'next/link';
import { siteConfig } from '@/config/site';
import { Terminal, Shield, Cpu, ChevronDown } from 'lucide-react';

export function PromoHero() {
  return (
    <section className="relative py-16 md:py-24 border-b border-[var(--border-color)] bg-gradient-to-b from-[var(--bg-secondary)] to-[var(--bg-primary)] overflow-hidden">
      <div className="absolute inset-0 scanline opacity-30"></div>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center relative z-10">
        <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full border border-[var(--border-color)] bg-[var(--bg-card)] text-xs text-[var(--neon-accent)] font-mono mb-6">
          <Terminal className="w-3.5 h-3.5" />
          <span>system.boot() &bull; status: online</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight font-mono text-white mb-4">
          <span className="text-[var(--neon-accent)] terminal-glow">{siteConfig.name}</span>
        </h1>

        <div className="text-xl sm:text-2xl font-mono text-[var(--neon-dim)] mb-6 flex items-center justify-center space-x-2">
          <span>&gt;</span>
          <span className="animate-pulse">{siteConfig.orgSummary}</span>
        </div>

        <p className="text-base sm:text-lg text-[var(--text-muted)] max-w-2xl mx-auto mb-8 font-sans">
          {siteConfig.orgFullDescription}
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4 font-mono text-sm">
          <a
            href="#recent-posts"
            className="inline-flex items-center space-x-2 px-5 py-2.5 rounded bg-[var(--neon-accent)] text-black font-semibold hover:bg-[var(--neon-hover)] transition-colors shadow-lg shadow-[var(--neon-accent)]/20"
          >
            <span>Read Posts</span>
            <ChevronDown className="w-4 h-4" />
          </a>
          <Link
            href="/about/"
            className="inline-flex items-center space-x-2 px-5 py-2.5 rounded border border-[var(--border-color)] bg-[var(--bg-card)] text-[var(--text-primary)] hover:border-[var(--neon-accent)] hover:text-[var(--neon-accent)] transition-colors"
          >
            <Shield className="w-4 h-4 text-[var(--neon-accent)]" />
            <span>About Me</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
