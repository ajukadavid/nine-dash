import colors from 'tailwindcss/colors'

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./public/**/*.html', './src/**/*.{js,jsx,ts,tsx,vue}'],
  theme: {
    extend: {
      fontFamily: {
        pricedow: ['pricedow', 'monspace-regular'],
        headline: ['Space Grotesk', 'system-ui', 'sans-serif'],
        body: ['Work Sans', 'system-ui', 'sans-serif'],
        label: ['Space Grotesk', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        mechanical: '0.125rem',
        'mech-lg': '0.25rem',
        'mech-xl': '0.5rem',
        'mech-full': '0.75rem',
      },
      colors: {
        background: '#131313',
        'on-background': '#e4e2e1',
        surface: '#131313',
        'on-surface': '#e4e2e1',
        'surface-container': '#1f2020',
        'surface-container-low': '#1b1c1c',
        'surface-dim': '#131313',
        primary: '#ffbebc',
        'on-primary': '#680011',
        secondary: '#e9c349',
        'on-secondary': '#3c2f00',
        'secondary-container': '#af8d11',
        'on-secondary-container': '#342800',
        outline: '#99907c',
        'outline-variant': '#4d4635',
      },
    },
    colors: {
      ...colors,
      purpleBg: '#2B1347',
    },
  },
  plugins: [],
}

