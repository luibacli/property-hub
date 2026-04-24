import type { Config } from 'tailwindcss'

export default {
  darkMode: 'class',
  content: [
    './components/**/*.{js,vue,ts}',
    './layouts/**/*.vue',
    './pages/**/*.vue',
    './plugins/**/*.{js,ts}',
    './app.vue',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50:  '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
          700: '#b45309',
          800: '#92400e',
          900: '#78350f',
          950: '#451a03',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        card: '0 1px 4px 0 rgba(0,0,0,0.06), 0 1px 2px 0 rgba(0,0,0,0.04)',
        'card-hover':
          '0 20px 40px -12px rgba(0,0,0,0.10), 0 4px 6px -2px rgba(0,0,0,0.05)',
        'card-dark': '0 1px 4px 0 rgba(0,0,0,0.4)',
        'card-hover-dark': '0 20px 40px -12px rgba(0,0,0,0.5)',
      },
      animation: {
        shimmer: 'shimmer 2s linear infinite',
        'fade-up': 'fade-up 0.35s ease-out',
        'fade-in': 'fade-in 0.25s ease-out',
        'slide-in': 'slide-in 0.3s ease-out',
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'slide-in': {
          '0%': { opacity: '0', transform: 'translateX(16px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
    require('@tailwindcss/forms')({ strategy: 'class' }),
    require('@tailwindcss/aspect-ratio'),
  ],
} satisfies Config
