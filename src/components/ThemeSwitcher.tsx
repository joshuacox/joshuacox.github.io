'use client';

import React from 'react';
import { useTheme } from './ThemeProvider';
import { SITE_THEMES } from '@/config/themes';
import { Palette } from 'lucide-react';

export function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();

  // Group themes into logical sections for clean UX
  const originalThemes = SITE_THEMES.filter((t) => t.category === 'original');
  const oledThemes = SITE_THEMES.filter((t) => t.category === 'oled');
  const darkRedThemes = SITE_THEMES.filter((t) => t.category === 'dark-red');
  const ambientThemes = SITE_THEMES.filter((t) => t.category === 'dark-ambient');
  const lightThemes = SITE_THEMES.filter((t) => t.category === 'light');
  const solarizedThemes = SITE_THEMES.filter((t) => t.category === 'solarized');
  const gruvboxThemes = SITE_THEMES.filter((t) => t.category === 'gruvbox');
  const catppuccinThemes = SITE_THEMES.filter((t) => t.category === 'catppuccin');
  const creativeThemes = SITE_THEMES.filter((t) => t.category === 'fun' || t.category === 'creative');

  return (
    <div className="flex items-center space-x-2 text-xs border border-[var(--border-color)] bg-[var(--bg-secondary)] px-2.5 py-1.5 rounded">
      <Palette className="w-3.5 h-3.5 text-[var(--neon-accent)] shrink-0" />
      <select
        value={theme}
        onChange={(e) => setTheme(e.target.value)}
        className="bg-transparent text-[var(--neon-accent)] text-xs focus:outline-none cursor-pointer max-w-[150px] sm:max-w-[190px] truncate"
        aria-label="Select Theme"
      >
        <optgroup label="Original Themes" className="bg-[var(--bg-secondary)] text-[var(--text-muted)] font-bold">
          {originalThemes.map((t) => (
            <option key={t.id} value={t.id} className="bg-[var(--bg-secondary)] text-[var(--text-primary)]">
              {t.name}
            </option>
          ))}
        </optgroup>

        <optgroup label="Winnegans OLED" className="bg-[var(--bg-secondary)] text-[var(--text-muted)] font-bold">
          {oledThemes.map((t) => (
            <option key={t.id} value={t.id} className="bg-[var(--bg-secondary)] text-[var(--text-primary)]">
              {t.name}
            </option>
          ))}
        </optgroup>

        <optgroup label="Winnegans Dark Red" className="bg-[var(--bg-secondary)] text-[var(--text-muted)] font-bold">
          {darkRedThemes.map((t) => (
            <option key={t.id} value={t.id} className="bg-[var(--bg-secondary)] text-[var(--text-primary)]">
              {t.name}
            </option>
          ))}
        </optgroup>

        <optgroup label="Winnegans Ambient &amp; Creative" className="bg-[var(--bg-secondary)] text-[var(--text-muted)] font-bold">
          {ambientThemes.concat(creativeThemes).map((t) => (
            <option key={t.id} value={t.id} className="bg-[var(--bg-secondary)] text-[var(--text-primary)]">
              {t.name}
            </option>
          ))}
        </optgroup>

        <optgroup label="Solarized" className="bg-[var(--bg-secondary)] text-[var(--text-muted)] font-bold">
          {solarizedThemes.map((t) => (
            <option key={t.id} value={t.id} className="bg-[var(--bg-secondary)] text-[var(--text-primary)]">
              {t.name}
            </option>
          ))}
        </optgroup>

        <optgroup label="Gruvbox" className="bg-[var(--bg-secondary)] text-[var(--text-muted)] font-bold">
          {gruvboxThemes.map((t) => (
            <option key={t.id} value={t.id} className="bg-[var(--bg-secondary)] text-[var(--text-primary)]">
              {t.name}
            </option>
          ))}
        </optgroup>

        <optgroup label="Catppuccin" className="bg-[var(--bg-secondary)] text-[var(--text-muted)] font-bold">
          {catppuccinThemes.map((t) => (
            <option key={t.id} value={t.id} className="bg-[var(--bg-secondary)] text-[var(--text-primary)]">
              {t.name}
            </option>
          ))}
        </optgroup>

        <optgroup label="Light &amp; Parchment" className="bg-[var(--bg-secondary)] text-[var(--text-muted)] font-bold">
          {lightThemes.map((t) => (
            <option key={t.id} value={t.id} className="bg-[var(--bg-secondary)] text-[var(--text-primary)]">
              {t.name}
            </option>
          ))}
        </optgroup>
      </select>
    </div>
  );
}
