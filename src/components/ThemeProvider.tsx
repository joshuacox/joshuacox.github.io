'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'techromancer' | 'midnite' | 'alt' | 'print';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: 'techromancer',
  setTheme: () => {},
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>('techromancer');

  useEffect(() => {
    const saved = localStorage.getItem('jc-theme') as Theme;
    if (saved && ['techromancer', 'midnite', 'alt', 'print'].includes(saved)) {
      setThemeState(saved);
      document.documentElement.setAttribute('data-theme', saved);
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
