import colors from 'tailwindcss/colors'

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './public/**/*.html',
    './src/**/*.{js,jsx,ts,tsx,vue}',
  ],
  theme: {
    extend: {
      fontFamily: {
        pricedow: ['pricedow', 'monspace-regular']
      }
    },
    colors: {
      ...colors,
      'purpleBg': '#2B1347'
    }
  },
  plugins: [],
}

