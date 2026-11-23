import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: ['class'],
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        cyber: {
          bg: 'var(--bg-primary)',
          card: 'var(--bg-card)',
          border: 'var(--border-color)',
          neon: 'var(--neon-accent)',
          neonDark: 'var(--neon-dim)',
          neonGlow: 'var(--neon-hover)',
          muted: 'var(--text-muted)',
        },
      },
      fontFamily: {
        mono: ['var(--font-mono)', 'Menlo', 'Monaco', 'Consolas', 'monospace'],
        sans: ['var(--font-sans)', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', 'sans-serif'],
      },
      typography: {
        cyber: {
          css: {
            '--tw-prose-body': 'var(--text-primary)',
            '--tw-prose-headings': 'var(--heading-color)',
            '--tw-prose-lead': 'var(--text-muted)',
            '--tw-prose-links': 'var(--neon-accent)',
            '--tw-prose-bold': 'var(--text-primary)',
            '--tw-prose-counters': 'var(--neon-dim)',
            '--tw-prose-bullets': 'var(--neon-accent)',
            '--tw-prose-hr': 'var(--border-color)',
            '--tw-prose-quotes': 'var(--neon-accent)',
            '--tw-prose-quote-borders': 'var(--neon-accent)',
            '--tw-prose-captions': 'var(--text-muted)',
            '--tw-prose-code': 'var(--neon-accent)',
            '--tw-prose-pre-code': 'var(--text-primary)',
            '--tw-prose-pre-bg': 'var(--code-bg)',
            '--tw-prose-th-borders': 'var(--border-color)',
            '--tw-prose-td-borders': 'var(--border-color)',
          },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
};

export default config;
