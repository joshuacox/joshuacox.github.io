'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { siteConfig } from '@/config/site';
import { ThemeSwitcher } from './ThemeSwitcher';
import { Terminal, Menu, X, BookOpen, Tag, Folder, Archive, User, Mail } from 'lucide-react';

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: '/', label: 'Home', icon: BookOpen },
    { href: '/categories/', label: 'Categories', icon: Folder },
    { href: '/tags/', label: 'Tags', icon: Tag },
    { href: '/archive/', label: 'Archive', icon: Archive },
    { href: '/about/', label: 'About', icon: User },
    { href: '/about/#contact', label: 'Contact', icon: Mail },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--border-color)] bg-[var(--bg-primary)]/90 backdrop-blur-md">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 text-[var(--neon-accent)] hover:text-[var(--neon-hover)] transition-colors group">
            <Terminal className="w-5 h-5 text-[var(--neon-accent)] group-hover:animate-pulse" />
            <span className="font-bold text-lg tracking-wider font-mono">
              {siteConfig.name}
            </span>
            <span className="text-xs px-2 py-0.5 rounded border border-[var(--border-color)] bg-[var(--bg-secondary)] text-[var(--text-muted)] font-mono hidden sm:inline-block">
              blog
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center space-x-6 text-sm font-mono">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-[var(--text-muted)] hover:text-[var(--neon-accent)] transition-colors py-1 hover:border-b-2 hover:border-[var(--neon-accent)]"
              >
                {link.label}
              </Link>
            ))}
            <div className="pl-2 border-l border-[var(--border-color)]">
              <ThemeSwitcher />
            </div>
          </nav>

          {/* Mobile menu button */}
          <div className="flex md:hidden items-center space-x-3">
            <ThemeSwitcher />
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded text-[var(--text-muted)] hover:text-[var(--neon-accent)] focus:outline-none"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-[var(--border-color)] bg-[var(--bg-secondary)] px-4 pt-2 pb-4 space-y-1 font-mono text-sm">
          {navLinks.map((link) => {
            const Icon = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center space-x-3 px-3 py-2 rounded text-[var(--text-muted)] hover:text-[var(--neon-accent)] hover:bg-[var(--bg-card)] transition-colors"
              >
                <Icon className="w-4 h-4 text-[var(--neon-accent)]" />
                <span>{link.label}</span>
              </Link>
            );
          })}
        </div>
      )}
    </header>
  );
}
