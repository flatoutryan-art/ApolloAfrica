/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        apollo: {
          green:       '#0B2B26',
          'green-mid': '#0d2e29',
          'green-dark':'#081e1a',
          gold:        '#C9A84C',
          'gold-light':'#e8c96a',
        },
      },
      fontFamily: {
        syne: ['Syne', 'sans-serif'],
        dm:   ['DM Sans', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
