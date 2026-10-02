'use client';

import React from 'react';
import { siteConfig } from '@/config/site';
import { Terminal, Shield, Mail, MapPin, Phone, Github, Twitter, Instagram } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 font-mono">
      {/* Bio / About */}
      <section id="about" className="mb-16">
        <div className="inline-flex items-center space-x-2 text-xs text-[var(--neon-accent)] mb-3">
          <Terminal className="w-4 h-4" />
          <span>IDENTITY &bull; DOSSIER</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white mb-6">
          About {siteConfig.name}
        </h1>

        <div className="p-6 sm:p-8 rounded-lg border border-[var(--border-color)] bg-[var(--bg-card)] space-y-6">
          <div className="text-xl sm:text-2xl text-[var(--neon-accent)] flex items-center space-x-2">
            <span>&gt;</span>
            <span className="font-bold">{siteConfig.orgSummary}</span>
          </div>

          <p className="text-base sm:text-lg text-[var(--text-primary)] font-sans leading-relaxed">
            {siteConfig.orgFullDescription}
          </p>

          <div className="pt-4 border-t border-[var(--border-color)]/60 text-sm text-[var(--text-muted)] font-sans leading-relaxed space-y-3">
            <p>
              I blog about Docker, Linux, containerization, cybersecurity, automation, and techromancy.
              From rolling custom kernel images to managing Kubernetes clusters and penetration testing rigs,
              this site is a live log of tools, experiments, and open-source recipes.
            </p>
          </div>
        </div>
      </section>

      {/* Mailing List Section */}
      <section id="join" className="mb-16">
        <div className="p-6 sm:p-8 rounded-lg border border-[var(--border-color)] bg-[var(--bg-secondary)]">
          <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">
            Thoughts from Thoth
          </h2>
          <p className="text-sm text-[var(--text-muted)] mb-6 font-sans">
            Sign up to receive occasional transmissions, tech notes, and nerdy humor. No spam ever.
          </p>

          <form
            action={`https://tinyletter.com/${siteConfig.tinyletterUsername}`}
            method="post"
            target="popupwindow"
            onSubmit={() => {
              window.open(`https://tinyletter.com/${siteConfig.tinyletterUsername}`, 'popupwindow', 'scrollbars=yes,width=800,height=600');
              return true;
            }}
            className="flex flex-col sm:flex-row gap-3 max-w-md"
          >
            <input
              type="email"
              name="email"
              placeholder="operator@domain.org"
              required
              className="flex-1 px-4 py-2.5 rounded border border-[var(--border-color)] bg-[var(--bg-primary)] text-sm text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--neon-accent)]"
            />
            <button
              type="submit"
              className="px-5 py-2.5 rounded bg-[var(--neon-accent)] text-black font-bold text-sm hover:bg-[var(--neon-hover)] transition-colors"
            >
              Join List
            </button>
          </form>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact">
        <h2 className="text-2xl font-bold text-white mb-6 flex items-center space-x-2">
          <Mail className="w-5 h-5 text-[var(--neon-accent)]" />
          <span>Contact &amp; Coordinates</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 rounded-lg border border-[var(--border-color)] bg-[var(--bg-card)] space-y-4">
            <h3 className="text-sm uppercase tracking-wider text-[var(--neon-dim)] font-bold">Location</h3>
            <div className="flex items-start space-x-3 text-sm text-[var(--text-muted)] font-sans">
              <MapPin className="w-4 h-4 text-[var(--neon-accent)] shrink-0 mt-1" />
              <div>
                <p className="text-[var(--text-primary)] font-semibold">{siteConfig.name}</p>
                <p>{siteConfig.contact.address}, {siteConfig.contact.suite}</p>
                <p>{siteConfig.contact.city}, {siteConfig.contact.state} {siteConfig.contact.zip}</p>
              </div>
            </div>

            <div className="flex items-center space-x-3 text-sm text-[var(--text-muted)] pt-2 border-t border-[var(--border-color)]/50">
              <Phone className="w-4 h-4 text-[var(--neon-accent)] shrink-0" />
              <span>{siteConfig.contact.phone}</span>
            </div>
          </div>

          <div className="p-6 rounded-lg border border-[var(--border-color)] bg-[var(--bg-card)] space-y-4">
            <h3 className="text-sm uppercase tracking-wider text-[var(--neon-dim)] font-bold">Social Matrix</h3>
            <ul className="space-y-3 text-sm font-sans">
              <li>
                <a
                  href={`mailto:${siteConfig.social.email}`}
                  className="flex items-center space-x-3 text-[var(--text-muted)] hover:text-[var(--neon-accent)]"
                >
                  <Mail className="w-4 h-4 text-[var(--neon-accent)]" />
                  <span>{siteConfig.social.email}</span>
                </a>
              </li>
              <li>
                <a
                  href={`https://github.com/${siteConfig.social.github}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-3 text-[var(--text-muted)] hover:text-[var(--neon-accent)]"
                >
                  <Github className="w-4 h-4 text-[var(--neon-accent)]" />
                  <span>github.com/{siteConfig.social.github}</span>
                </a>
              </li>
              <li>
                <a
                  href={`https://twitter.com/${siteConfig.social.twitter}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-3 text-[var(--text-muted)] hover:text-[var(--neon-accent)]"
                >
                  <Twitter className="w-4 h-4 text-[var(--neon-accent)]" />
                  <span>twitter.com/{siteConfig.social.twitter}</span>
                </a>
              </li>
              <li>
                <a
                  href={`https://instagram.com/${siteConfig.social.instagram}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-3 text-[var(--text-muted)] hover:text-[var(--neon-accent)]"
                >
                  <Instagram className="w-4 h-4 text-[var(--neon-accent)]" />
                  <span>instagram.com/{siteConfig.social.instagram}</span>
                </a>
              </li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}
