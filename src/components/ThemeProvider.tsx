'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { SITE_THEMES, ThemeId } from '@/config/themes';

interface ThemeContextType {
  theme: string;
  setTheme: (theme: string) => void;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: 'tekromancer',
  setTheme: () => {},
});

const VALID_THEME_IDS = new Set<string>([
  'techromancer',
  ...SITE_THEMES.map((t) => t.id),
]);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<string>('tekromancer');

  useEffect(() => {
    const saved = localStorage.getItem('jc-theme');
    if (saved && VALID_THEME_IDS.has(saved)) {
      const normalizedTheme = saved === 'techromancer' ? 'tekromancer' : saved;
      setThemeState(normalizedTheme);
      document.documentElement.setAttribute('data-theme', normalizedTheme);
    }
  }, []);

  const setTheme = (newTheme: string) => {
    const normalized = newTheme === 'techromancer' ? 'tekromancer' : newTheme;
    setThemeState(normalized);
    localStorage.setItem('jc-theme', normalized);
    document.documentElement.setAttribute('data-theme', normalized);
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
