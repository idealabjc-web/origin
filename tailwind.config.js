/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: { navy: { 950: '#060d20', 900: '#0a1530', 800: '#102046', 700: '#1a2d5e' }, charcoal: '#1c1f26', gold: { DEFAULT: '#c9a24b', light: '#e3c47a' } },
      fontFamily: { display: ['"Playfair Display"', 'Georgia', 'serif'], sans: ['Inter', 'system-ui', 'sans-serif'] }
    }
  },
  plugins: []
}
