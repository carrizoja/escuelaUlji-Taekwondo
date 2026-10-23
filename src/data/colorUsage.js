// Usage examples and documentation for the custom color palette
// This file demonstrates how to use the Escuela Ul-ji color system

/*
USAGE EXAMPLES:

1. Using Tailwind classes with custom colors:
   - text-ulji-red-500 (Main red)
   - text-ulji-red-700 (Deep red)
   - bg-brand-red (Primary red background)

2. Using custom gradient classes:
   - bg-gradient-primary (Red gradient)
   - bg-gradient-hero (Hero section gradient)

3. Using CSS custom properties:
   - color: var(--color-red-primary)
   - background: var(--gradient-primary)

4. Using utility classes:
   - brand-button (Pre-styled button)
   - brand-button-outline (Outline button)
   - brand-heading (Red heading text)

COLOR PALETTE REFERENCE:

RED VARIANTS:
- #FF6666 - Light Red (plenos)
- #F73434 - Red (plenos) - MAIN BRAND COLOR
- #A00000 - Deep Red (plenos)
- #F79292 - Pink (desaturated)
- #CC3131 - Red (desaturated)
- #810000 - Dark Red (desaturated)

GREEN VARIANTS:
- #95F9AF - Light Green (plenos)
- #49F57A - Green (plenos) - MAIN ACCENT COLOR
- #34BC5B - Green (desaturated)
- #C2F0CE - Light Green (desaturated)

NEUTRALS:
- #FFFFFF - White (plenos)
- #000000 - Black (desaturated)

EXAMPLE COMPONENTS:

Button Examples:
<button class="brand-button">Primary Action</button>
<button class="brand-button-outline">Secondary Action</button>

Text Examples:
<h1 class="brand-heading">Main Heading</h1>

Background Examples:
<div class="bg-gradient-primary">Primary Gradient</div>
<div class="bg-gradient-hero">Hero Gradient</div>

Custom Color Examples:
<div class="bg-ulji-red-500 text-white">Main Red Background</div>
<div class="text-ulji-red-700">Deep Red Text</div>
<div class="border-ulji-red-400">Red Border</div>

*/

export const colorUsageExamples = {
  buttons: {
    primary: 'bg-brand-red hover:bg-brand-red-deep text-white',
    outline: 'border-2 border-brand-red text-brand-red hover:bg-brand-red hover:text-white'
  },
  
  text: {
    heading: 'text-ulji-red-700 dark:text-ulji-red-400',
    muted: 'text-gray-600 dark:text-gray-400'
  },
  
  backgrounds: {
    primary: 'bg-gradient-primary',
    hero: 'bg-gradient-hero',
    card: 'bg-white dark:bg-gray-900',
    surface: 'bg-gray-50 dark:bg-gray-800'
  },
  
  borders: {
    primary: 'border-ulji-red-400',
    neutral: 'border-gray-200 dark:border-gray-700'
  }
}
