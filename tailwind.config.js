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
          bg: '#FDFBF7',       // Very soft cream background
          card: '#FFFFFF',     // Pure white for cards
          text: '#1C1C1C',     // Almost black (easier on eyes than pure #000)
          muted: '#6B6B6B',    // Soft gray for paragraphs
          orange: '#FF8C42',   // Light Orange (primary accent)
          yellow: '#FFD166',   // Soft Yellow (secondary accent)
          border: '#EAE6DF',   // Light border color
        }
      },
      fontFamily: {
        // We will use a premium serif for headings and clean sans for text
        serif: ['"Playfair Display"', 'serif'],
        sans: ['"Inter"', 'sans-serif'],
      }
    },
  },
  plugins: [],
}