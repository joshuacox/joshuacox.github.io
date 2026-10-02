'use client';

import React from 'react';
import { useTheme } from './ThemeProvider';
import { Palette } from 'lucide-react';

export function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="flex items-center space-x-2 text-xs border border-[var(--border-color)] bg-[var(--bg-secondary)] px-2.5 py-1.5 rounded">
      <Palette className="w-3.5 h-3.5 text-[var(--neon-accent)]" />
      <select
        value={theme}
        onChange={(e) => setTheme(e.target.value as any)}
        className="bg-transparent text-[var(--neon-accent)] text-xs focus:outline-none cursor-pointer"
        aria-label="Select Theme"
      >
        <option value="techromancer" className="bg-[#14031a] text-[#33dd00]">Techromancer (Matrix)</option>
        <option value="midnite" className="bg-[#121217] text-[#38bdf8]">Midnite (Cyan)</option>
        <option value="alt" className="bg-[#0a1526] text-[#eebf3f]">Alt (Gold/Navy)</option>
        <option value="print" className="bg-[#ffffff] text-[#0f766e]">Print (Clean Light)</option>
      </select>
    </div>
  );
}
