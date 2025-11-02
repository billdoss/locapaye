/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#eef5ff',
          100: '#dbeaff',
          200: '#bfd9ff',
          300: '#92beff',
          400: '#5e9aff',
          500: '#377dff',
          600: '#1f63f2',
          700: '#184fd2',
          800: '#183fa7',
          900: '#193884',
        }
      },
      boxShadow: {
        card: '0 10px 30px rgba(0,0,0,0.06)',
      },
      borderRadius: {
        '2xl': '1.25rem',
      }
    },
  },
  plugins: [],
};
