import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // 既存Vue.jsプロジェクトのカラーパレット
        'bg-primary': '#2a262f',
        'bg-secondary': '#3b3541',
        'bg-white': '#ffffff',
        'text-primary': '#ffffff',
        'text-secondary': '#bdbdbd',
        'text-tertiary': '#828282',
        'border-light': 'rgba(130, 130, 130, 0.5)',
        'accent-green': '#cdfe7f',
        // 白背景用のダークテキスト
        dark: '#2F2626',

        // shadcn/ui compatibility
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: '#3b82f6',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: '#64748b',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      keyframes: {
        // 背景ズームアニメーション（ルアー詳細ページ）
        zoom: {
          '0%, 100%': {
            backgroundSize: '400%',
            backgroundPosition: '20% 48%'
          },
          '50%': {
            backgroundSize: '600%',
            backgroundPosition: '40% 52%'
          },
        },
        // トップボタンのバウンス
        'bounce-in': {
          '0%': { transform: 'scale(0)' },
          '50%': { transform: 'scale(1.25)' },
          '100%': { transform: 'scale(1)' },
        },
      },
      animation: {
        zoom: 'zoom 20s linear infinite',
        'bounce-in': 'bounce-in 0.5s',
        'bounce-out': 'bounce-in 0.5s reverse',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};

export default config;
