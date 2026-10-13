/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        pjYellow: '#FFD200',
        pjYellowHover: '#E5BD00',
        pjNavy: '#0F172A',
        pjDark: '#0B1120',
        pjBlue: '#1E3A8A',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
