const {heroui} = require('@heroui/theme');
// tailwind.config.js
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
    "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}"
  ],
  darkMode: 'class', // Enable class-based dark mode
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
        },

        accent: {
          50: '#f5f3ff',
          100: '#ede9fe',
          200: '#ddd6fe',
          300: '#c4b5fd',
          400: '#a78bfa',
          500: '#8b5cf6',
          600: '#7c3aed',
          700: '#6d28d9',
          800: '#5b21b6',
          900: '#4c1d95',
        },

        lightBg: '#F9FBFF',
        darkBg: '#0C0F1F',
        circle1: '#38BDF8',
        circle2: '#027BF9',
      },
      keyframes: {
        moveCircle1: {
          '0%': { transform: 'translate(0, 0)' },
          '50%': { transform: 'translate(40vw, 30vh)' },
          '100%': { transform: 'translate(0, 0)' },
        },
        moveCircle2: {
          '0%': { transform: 'translate(0, 0)' },
          '50%': { transform: 'translate(-30vw, -20vh)' },
          '100%': { transform: 'translate(0, 0)' },
        },
      },
      animation: {
        moveCircle1: 'moveCircle1 18s ease-in-out infinite',
        moveCircle2: 'moveCircle2 22s ease-in-out infinite',
      },
    },
  },
  plugins: [heroui()],
}
