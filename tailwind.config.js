/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eef5ff',
          100: '#dfeeff',
          200: '#bfdcff',
          300: '#9cc8ff',
          400: '#6aa4ff',
          500: '#3b7bff',
          600: '#245ee8',
          700: '#1b4dc2',
          800: '#1d429d',
          900: '#1c3c7a',
        },
        success: {
          50: '#ebfff5',
          100: '#d1f7e4',
          200: '#a6e8c5',
          500: '#1ca66a',
          600: '#128d5a',
          700: '#0d734d',
        },
        warning: {
          50: '#fff7eb',
          100: '#fbe4b2',
          200: '#f7d88a',
          500: '#d99b16',
          600: '#b77d10',
          700: '#8b5d0b',
        },
        danger: {
          50: '#fff0f0',
          100: '#ffe1e1',
          200: '#ffc3c3',
          500: '#e24b4b',
          600: '#c53a3a',
          700: '#9d2d2d',
        },
        info: {
          50: '#eef7ff',
          100: '#dfeeff',
          200: '#bfe0ff',
          500: '#1e75d8',
          600: '#1a5da8',
          700: '#174d86',
        },
      },
      boxShadow: {
        card: '0 10px 25px rgba(15, 23, 42, 0.06)',
        soft: '0 14px 28px rgba(30, 64, 175, 0.12)',
      },
      fontFamily: {
        sans: ['Inter', 'Segoe UI', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

