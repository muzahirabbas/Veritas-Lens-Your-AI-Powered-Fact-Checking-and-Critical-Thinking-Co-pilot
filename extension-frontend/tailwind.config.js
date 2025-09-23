
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'media', // or 'class'
  theme: {
    extend: {
      colors: {
        primary: '#2C3E50',
        background: {
          light: '#F8F9FA',
          dark: '#1A1A1B',
        },
        accent: {
          success: '#27AE60',
          warning: '#F39C12',
          error: '#C0392B',
        },
        text: {
          light: '#343A40',
          dark: '#D1D5DB',
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
