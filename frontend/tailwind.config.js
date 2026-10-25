/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  theme: {
    extend: {
      colors: {
        dark: {
          bg: '#192c24',
          card: '#23372f',
          surface: '#2e4639',
        },
        accent: {
          primary: '#34594d',
          secondary: '#436754',
          glow: '#c3d3b4',
          violet: '#d1c49d',
        },
      },
      fontFamily: {
        sans: ['DM Sans', 'system-ui', 'sans-serif'],
        display: ['DM Sans', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
