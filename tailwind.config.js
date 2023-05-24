/** @type {import('tailwindcss').Config} */

const colors = require('tailwindcss/colors')

export default {
  content: [],
  theme: {
    extend: {
      fontFamily: {
        pricedow: ['pricedow', 'monspace-regular']
      }
    },
    colors: {
      ...colors,
      'purpleBg': '#E727E5'

    }
  },
  plugins: [],
  content: [
    // Example content paths...
    './public/**/*.html',
    './src/**/*.{js,jsx,ts,tsx,vue}',
  ],
}

