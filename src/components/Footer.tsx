import React from 'react';
import Link from 'next/link';
import { siteConfig } from '@/config/site';
import { Github, Twitter, Instagram, Mail, Rss, Terminal, Heart } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t border-[var(--border-color)] bg-[var(--bg-secondary)] py-12 mt-20 text-sm font-mono">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start space-x-2 text-[var(--neon-accent)] font-bold mb-2">
              <Terminal className="w-4 h-4" />
              <span>{siteConfig.name}</span>
              <span className="text-[var(--text-muted)] font-normal">&mdash; {siteConfig.orgSummary}</span>
            </div>
            <p className="text-xs text-[var(--text-muted)] max-w-md">
              {siteConfig.orgFullDescription}
            </p>
          </div>

          {/* Social Icons */}
          <div className="flex items-center space-x-4">
            <a
              href={`https://github.com/${siteConfig.social.github}`}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded border border-[var(--border-color)] bg-[var(--bg-card)] text-[var(--text-muted)] hover:text-[var(--neon-accent)] hover:border-[var(--neon-accent)] transition-colors"
              aria-label="GitHub Profile"
            >
              <Github className="w-4 h-4" />
            </a>
            <a
              href={`https://twitter.com/${siteConfig.social.twitter}`}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded border border-[var(--border-color)] bg-[var(--bg-card)] text-[var(--text-muted)] hover:text-[var(--neon-accent)] hover:border-[var(--neon-accent)] transition-colors"
              aria-label="Twitter Profile"
            >
              <Twitter className="w-4 h-4" />
            </a>
            <a
              href={`https://instagram.com/${siteConfig.social.instagram}`}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded border border-[var(--border-color)] bg-[var(--bg-card)] text-[var(--text-muted)] hover:text-[var(--neon-accent)] hover:border-[var(--neon-accent)] transition-colors"
              aria-label="Instagram Profile"
            >
              <Instagram className="w-4 h-4" />
            </a>
            <a
              href={`mailto:${siteConfig.social.email}`}
              className="p-2 rounded border border-[var(--border-color)] bg-[var(--bg-card)] text-[var(--text-muted)] hover:text-[var(--neon-accent)] hover:border-[var(--neon-accent)] transition-colors"
              aria-label="Email Joshua"
            >
              <Mail className="w-4 h-4" />
            </a>
            <Link
              href="/feed.xml"
              className="p-2 rounded border border-[var(--border-color)] bg-[var(--bg-card)] text-[var(--text-muted)] hover:text-[var(--neon-accent)] hover:border-[var(--neon-accent)] transition-colors"
              aria-label="RSS Feed"
            >
              <Rss className="w-4 h-4" />
            </Link>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-[var(--border-color)]/60 flex flex-col sm:flex-row items-center justify-between text-xs text-[var(--text-muted)] gap-4">
          <p>&copy; {new Date().getFullYear()} {siteConfig.name}. All rights reserved.</p>
          <p className="flex items-center space-x-1">
            <span>Powered by Next.js &amp; GitHub Actions</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
