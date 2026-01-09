/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#135bec',
        'primary-hover': '#1d6bf3',
        'background-light': '#f6f6f8',
        'background-dark': '#101622',
        'surface-light': '#ffffff',
        'surface-dark': '#1a2233',
        'border-light': '#e2e8f0',
        'border-dark': '#2d3b55',
        'text-main-light': '#111813',
        'text-main-dark': '#ffffff',
        'text-sub-light': '#64748b',
        'text-sub-dark': '#94a3b8',
      },
      fontFamily: {
        display: ['Lexend', 'sans-serif'],
        body: ['Noto Sans', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
