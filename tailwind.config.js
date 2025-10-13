/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Primary colors
        'primary-pink': '#ec4899',
        'primary-purple': '#8b5cf6',
        'primary-black': '#0a0a0a',
        
        // Accent colors
        'accent-yellow': '#fbbf24',
        'accent-orange': '#f97316',
        'accent-red': '#ef4444',
        
        // Neutral colors
        'neutral-white': '#ffffff',
        'neutral-darkGray': '#1f2937',
        'neutral-lightGray': '#9ca3af',
        
        // Cinema colors
        'cinema-neonBlue': '#00e5ff',
        'cinema-neonPink': '#ff6ec7',
        'cinema-navy': '#0d253f',
      },
      fontFamily: {
        sans: ['Arial', 'Helvetica', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [],
}
