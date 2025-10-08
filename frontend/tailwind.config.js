/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'black-primary': '#000000',
        'black-card': '#0a0a0a',
        'accent-teal': '#00d4aa',
        'accent-amber': '#ffa500',
        'text-primary': '#ffffff',
        'text-secondary': '#a0a0a0',
        'border-subtle': '#1a1a1a'
      },
      fontSize: {
        'headline': ['28px', { lineHeight: '1.2', fontWeight: '700' }],
        'subheadline': ['22px', { lineHeight: '1.3', fontWeight: '600' }],
        'gist': ['18px', { lineHeight: '1.6', fontWeight: '400' }],
        'body': ['16px', { lineHeight: '1.5', fontWeight: '400' }],
        'small': ['14px', { lineHeight: '1.4', fontWeight: '400' }]
      }
    },
  },
  plugins: [],
}
