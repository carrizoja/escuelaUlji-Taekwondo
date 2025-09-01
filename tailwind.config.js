/** @type {import('tailwindcss').Config} */
import { tailwindColors } from './src/data/colors.js'

export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        'heading': ['Poppins', 'sans-serif'],
        'text': ['Barlow', 'sans-serif'],
        'sans': ['Barlow', 'sans-serif'], // Default sans-serif
      },
      colors: {
        ...tailwindColors,
        // Alias for easier usage
        primary: tailwindColors['ulji-red'],
        secondary: tailwindColors['ulji-green'],
        brand: {
          red: '#F73434',      // Main red from palette
          'red-deep': '#A00000', // Deep red from palette
          'red-light': '#FF6666', // Light red from palette
          'red-dark': '#810000',  // Dark red from palette
          green: '#49F57A',     // Main green from palette
          'green-deep': '#34BC5B', // Deep green from palette
          'green-light': '#95F9AF', // Light green from palette
        }
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, #A00000 0%, #F73434 50%, #FF6666 100%)',
        'gradient-secondary': 'linear-gradient(135deg, #34BC5B 0%, #49F57A 50%, #95F9AF 100%)',
        'gradient-hero': 'linear-gradient(135deg, #111827 0%, #810000 25%, #A00000 75%, #000000 100%)',
        'gradient-dark': 'linear-gradient(135deg, #000000 0%, #810000 50%, #A00000 100%)',
      }
    },
  },
  plugins: [],
}
