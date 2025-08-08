/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        surface: {
          primary: '#18181B',
          secondary: '#27272A',
          tertiary: '#3F3F46'
        },
        accent: {
          primary: '#0891B2',
          hover: '#0E7490',
          muted: '#164E63'
        },
        content: {
          primary: '#E4E4E7',
          secondary: '#A1A1AA',
          tertiary: '#71717A'
        },
        status: {
          success: '#059669',
          warning: '#D97706',
          error: '#DC2626',
          info: '#2563EB'
        }
      },
      boxShadow: {
        'soft': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        'glow': '0 0 15px rgba(8, 145, 178, 0.1)'
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      }
    },
  },
  plugins: [],
}
