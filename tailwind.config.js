/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        metro: {
          blue: '#0078BE',
          green: '#4CAF50',
        },
      },
    },
  },
  plugins: [],
};
