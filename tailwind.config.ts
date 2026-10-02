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
          bg: '#0c0211',
          card: '#160520',
          border: '#3a134d',
          neon: '#33dd00',
          neonDark: '#11bb00',
          neonGlow: '#44ff11',
          gold: '#eebf3f',
          cyan: '#17baef',
          muted: '#8b8496',
        },
      },
      fontFamily: {
        mono: ['Menlo', 'Monaco', 'Consolas', '"Liberation Mono"', '"Courier New"', 'monospace'],
        sans: ['Lato', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', 'sans-serif'],
      },
      typography: {
        cyber: {
          css: {
            '--tw-prose-body': '#d1d5db',
            '--tw-prose-headings': '#33dd00',
            '--tw-prose-lead': '#9ca3af',
            '--tw-prose-links': '#33dd00',
            '--tw-prose-bold': '#ffffff',
            '--tw-prose-counters': '#11bb00',
            '--tw-prose-bullets': '#33dd00',
            '--tw-prose-hr': '#3a134d',
            '--tw-prose-quotes': '#eebf3f',
            '--tw-prose-quote-borders': '#33dd00',
            '--tw-prose-captions': '#9ca3af',
            '--tw-prose-code': '#33dd00',
            '--tw-prose-pre-code': '#e5e7eb',
            '--tw-prose-pre-bg': '#160520',
            '--tw-prose-th-borders': '#3a134d',
            '--tw-prose-td-borders': '#280c35',
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
