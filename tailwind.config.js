/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Cormorant Garamond"', 'serif'],
        mono: ['"DM Mono"', 'monospace'],
        body: ['"Jost"', 'sans-serif'],
      },
      colors: {
        vault: {
          black: 'rgb(var(--v-black) / <alpha-value>)',
          dark: 'rgb(var(--v-dark) / <alpha-value>)',
          panel: 'rgb(var(--v-panel) / <alpha-value>)',
          border: 'rgb(var(--v-border) / <alpha-value>)',
          gold: 'rgb(var(--v-gold) / <alpha-value>)',
          'gold-light': 'rgb(var(--v-gold-light) / <alpha-value>)',
          'gold-dark': 'rgb(var(--v-gold-dark) / <alpha-value>)',
          amber: 'rgb(var(--v-amber) / <alpha-value>)',
          copper: 'rgb(var(--v-copper) / <alpha-value>)',
          text: 'rgb(var(--v-text) / <alpha-value>)',
          muted: 'rgb(var(--v-muted) / <alpha-value>)',
        }
      },
      animation: {
        'tick': 'tick 1s ease-in-out infinite',
        'glow-pulse': 'glowPulse 3s ease-in-out infinite',
        'float': 'float 6s ease-in-out infinite',
        'coin-spin': 'coinSpin 4s linear infinite',
        'shimmer': 'shimmer 2.5s linear infinite',
        'count-flip': 'countFlip 0.3s ease-out',
        'fade-up': 'fadeUp 0.8s ease-out forwards',
      },
      keyframes: {
        tick: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.3' },
        },
        glowPulse: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(201,168,76,0.2), 0 0 60px rgba(201,168,76,0.05)' },
          '50%': { boxShadow: '0 0 40px rgba(201,168,76,0.4), 0 0 100px rgba(201,168,76,0.15)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% center' },
          '100%': { backgroundPosition: '200% center' },
        },
        countFlip: {
          '0%': { transform: 'translateY(-20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        fadeUp: {
          '0%': { transform: 'translateY(30px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}
