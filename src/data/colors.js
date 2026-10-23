// Custom Color Palette for Escuela Ul-ji Taekwondo
// Based on provided design palette

export const colors = {
  // Primary Brand Colors
  primary: {
    // Red variants (main brand color)
    red: {
      50: '#FEF2F2',   // Very light red
      100: '#FDE8E8',  // Light red
      200: '#FBD5D5',  // Lighter red
      300: '#F79292',  // Pink (desaturated)
      400: '#FF6666',  // Light Red (plenos)
      500: '#F73434',  // Red (plenos) - Main red
      600: '#CC3131',  // Red (desaturated)
      700: '#A00000',  // Deep Red (plenos)
      800: '#810000',  // Dark Red (desaturated)
      900: '#7F1D1D',  // Very dark red
      950: '#450A0A'   // Darkest red
    }
  },

  // Neutral Colors
  neutral: {
    white: '#FFFFFF',    // White (plenos)
    black: '#000000',    // Black (desaturated)
    gray: {
      50: '#F9FAFB',
      100: '#F3F4F6',
      200: '#E5E7EB',
      300: '#D1D5DB',
      400: '#9CA3AF',
      500: '#6B7280',
      600: '#4B5563',
      700: '#374151',
      800: '#1F2937',
      900: '#111827',
      950: '#030712'
    }
  },

  // Semantic Colors
  semantic: {
    success: '#5FB77E',    // Muted status green (--status)
    warning: '#F59E0B',    
    error: '#F73434',      // Red (plenos)
    info: '#3B82F6'
  },

  // Special gradients using palette colors
  gradients: {
    primary: 'linear-gradient(135deg, #A00000 0%, #F73434 50%, #FF6666 100%)',
    secondary: 'linear-gradient(135deg, #34BC5B 0%, #49F57A 50%, #95F9AF 100%)',
    dark: 'linear-gradient(135deg, #000000 0%, #810000 50%, #A00000 100%)',
    hero: 'linear-gradient(135deg, #111827 0%, #810000 25%, #A00000 75%, #000000 100%)'
  }
}

// CSS Custom Properties for easy usage
export const cssVariables = {
  // Primary colors
  '--color-red-primary': '#F73434',
  '--color-red-deep': '#A00000', 
  '--color-red-light': '#FF6666',
  '--color-red-dark': '#810000',
  '--color-red-pink': '#F79292',

  '--color-white': '#FFFFFF',
  '--color-black': '#000000',

  // Gradients
  '--gradient-primary': 'linear-gradient(135deg, #A00000 0%, #F73434 50%, #FF6666 100%)',
  '--gradient-hero': 'linear-gradient(135deg, #111827 0%, #810000 25%, #A00000 75%, #000000 100%)'
}

// Tailwind CSS color extensions
export const tailwindColors = {
  'ulji-red': {
    50: '#FEF2F2',
    100: '#FDE8E8', 
    200: '#FBD5D5',
    300: '#F79292',
    400: '#FF6666', 
    500: '#F73434',
    600: '#CC3131',
    700: '#A00000',
    800: '#810000',
    900: '#7F1D1D',
    950: '#450A0A'
  }
}

// Semantic tone colors. They resolve to the CSS variables defined per tone
// (.tone-dark, .tone-light, .dark .tone-light) in src/styles/global.css,
// which is the single source of the hex values.
export const toneColors = {
  bg: 'var(--bg)',
  surface: 'var(--surface)',
  card: 'var(--card)',
  line: 'var(--border)',
  fg: 'var(--text)',
  muted: 'var(--muted)',
  eyebrow: 'var(--eyebrow)',
  status: 'var(--status)'
}
