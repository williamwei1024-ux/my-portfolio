/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        serif: ['Playfair Display', 'serif'],
        'serif-num': ['Cormorant Garamond', 'serif'],
        'mono-tech': ['Space Mono', 'monospace'],
      },
    },
  },
  plugins: [],
}