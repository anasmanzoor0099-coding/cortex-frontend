/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cortex: {
          bg: '#F8F7F2',       // Pearl White background
          ivory: '#FDFCF8',    // Soft Ivory elevated surface
          card: '#FDFCF8',     // Soft Ivory for cards
          text: '#17231E',     // Deep Forest Primary Text
          muted: '#737A75',    // Muted Sage Text
          emerald: '#064E3B',  // Deep Emerald (primary accent)
          forest: '#0B3D2E',   // Forest Green (rich dark/hover)
          jade: '#10B981',     // Jade (interactive highlight)
          gold: '#D6B56D',     // Champagne Gold (luxury accent)
          border: '#DCE4DF',   // Refined emerald-tinted border
        }
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'serif'],
        sans: ['"Inter"', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
