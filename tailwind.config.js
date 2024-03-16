/** @type {import('tailwindcss').Config} */
export default {
  mode: 'jit',
  purge: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      maxWidth: {
        'vw-100': '100vw',
        'p-100': '100%'
      },
      backgroundColor: {
        'primary': '#EBF2FC',
        'secondary': '#0c2461'
      },
      spacing: {
        '1/9vw': '6vw',
        '1/8vw': '8vw',
        '1/7vw': '11vw',
        '1/6': '16.666667%',
        '72vh': '72vh',
        '40vh': '40vh',
        '95vw': '92vw',
        '30vw': '29.5vw',
        '16%': '16.6666%'
      },
      boxShadow: {
        "3x1": 'rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 2px 6px 2px'
      }
    },
  },
  plugins: [],
}

