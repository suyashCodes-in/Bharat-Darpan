/**
 * Tailwind CSS v4 — this file is NOT used by Tailwind v4.
 *
 * In v4, all design tokens are declared in the @theme {} block
 * inside src/index.css (via `@import "tailwindcss"`).
 *
 * The @tailwindcss/vite plugin reads the CSS directly.
 * This config file is retained only for tooling compatibility
 * (e.g. IDE IntelliSense plugins that still look for tailwind.config.js).
 *
 * Active token definitions → src/index.css (@theme block):
 *   --color-navy:        #0A2947
 *   --color-cream:       #F3E4C9
 *   --color-accent:      #D3D4C0
 *   --color-footer-dark: #05182A
 *   --font-heading:      'Playfair Display', serif
 *   --font-sans:         'Poppins', system-ui, sans-serif
 */

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {},
  plugins: [],
}
