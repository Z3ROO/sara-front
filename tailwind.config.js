/** @type {import('tailwindcss').Config} */
module.exports = {
  corePlugins: {
    preflight: true
  },
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        gray: {
          800: '#0e1013',    
          750: '#17181b',
          700: '#202124',
          650: '#282a2d',
          600: '#2e3134',
          550: '#3c4043',
          500: '#5f6368',
          450: '#80868b',
          400: '#9aa0a6',
          350: '#bdc1c6',
          300: '#dadce0',
          250: '#e8eaed',
          200: '#f1f3f4',
          100: '#f8f9fa'
        }
      }
    },
  },
  plugins: [],
}
