'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'tekromancer' | 'techromancer' | 'midnite' | 'alt' | 'print';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: 'tekromancer',
  setTheme: () => {},
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>('tekromancer');

  useEffect(() => {
    const saved = localStorage.getItem('jc-theme') as Theme;
    if (saved && ['tekromancer', 'techromancer', 'midnite', 'alt', 'print'].includes(saved)) {
      const normalizedTheme = saved === 'techromancer' ? 'tekromancer' : saved;
      setThemeState(normalizedTheme);
      document.documentElement.setAttribute('data-theme', normalizedTheme);
    }
  }, []);

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    localStorage.setItem('jc-theme', newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
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
