/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'ms-blue': '#0078D4',
        'ms-blue-dark': '#005A9E',
        'fraud-red': '#D13438',
        'fraud-red-dark': '#A4373A',
        'safe-green': '#107C10',
        'safe-green-dark': '#0B5A1F',
        'warning-orange': '#FFB900',
        'dark-bg': '#1F1F1F',
        'dark-card': '#252526',
        'dark-hover': '#2D2D30',
        'dark-border': '#3E3E42',
      },
      animation: {
        pulse: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        glow: 'glow 2s ease-in-out infinite',
        slideIn: 'slideIn 0.3s ease-out',
        scaleIn: 'scaleIn 0.3s ease-out',
        bounce: 'bounce 1s infinite',
      },
      keyframes: {
        glow: {
          '0%, 100%': { boxShadow: '0 0 5px rgba(209, 52, 56, 0.5)' },
          '50%': { boxShadow: '0 0 15px rgba(209, 52, 56, 0.8)' },
        },
        slideIn: {
          'from': { transform: 'translateX(-10px)', opacity: '0' },
          'to': { transform: 'translateX(0)', opacity: '1' },
        },
        scaleIn: {
          'from': { transform: 'scale(0.95)', opacity: '0' },
          'to': { transform: 'scale(1)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}
