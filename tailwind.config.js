/** @type {import('tailwindcss').Config} */
export default {
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
      screens: {
        "sm": {'max': '600px'},
        "md": {'min': '601px'}
      },
      backgroundColor: {
        'primary': '#EBF2FC',
        'secondary': '#0c2461'
      },
      spacing: {
        '1/6': '16.666667%',
        '72vh': '72vh'
      }
    },
  },
  plugins: [],
}

