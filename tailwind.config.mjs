/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ['class'],
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}'
  ],
  theme: {
    extend: {
      fontFamily: {
        outfit: ['Outfit', 'sans-serif']
      },
      fontSize: {
        'title-2xl': ['72px', '90px'],
        'title-xl': ['60px', '72px'],
        'title-lg': ['48px', '60px'],
        'title-md': ['36px', '44px'],
        'title-sm': ['30px', '38px'],
        'theme-xl': ['20px', '30px'],
        'theme-sm': ['14px', '20px'],
        'theme-xs': ['12px', '18px']
      },
      colors: {
        white: '#F8F8FF',
        primary: {
          100: '#25294A',
          200: '#202442',
          300: '#4B6FD7'
        },
        line: 'bg-zinc-500/[0.12]'
      }
    },
    zIndex: {
      1: 1,
      9: 9,
      99: 99,
      999: 999,
      9999: 9999,
      99999: 99999
    }
  },
  plugins: [require('tailwindcss-animate')]
}
