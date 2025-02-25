/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ocean: {
          primary: '#1e40af',
          secondary: '#3b82f6',
          accent: '#bfdbfe',
          background: '#f0f9ff',
          text: '#1e3a8a',
        },
        forest: {
          primary: '#166534',
          secondary: '#22c55e',
          accent: '#bbf7d0',
          background: '#f0fdf4',
          text: '#14532d',
        },
        sunset: {
          primary: '#c2410c',
          secondary: '#fb923c',
          accent: '#fed7aa',
          background: '#fff7ed',
          text: '#9a3412',
        },
        moonlight: {
          primary: '#4338ca',
          secondary: '#6366f1',
          accent: '#c7d2fe',
          background: '#eef2ff',
          text: '#3730a3',
        },
        aurora: {
          primary: '#0f766e',
          secondary: '#14b8a6',
          accent: '#99f6e4',
          background: '#f0fdfa',
          text: '#134e4a',
        }
      },
      animation: {
        'float': 'float 8s infinite ease-in-out',
        'aurora': 'aurora 15s ease infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0) scale(1)' },
          '50%': { transform: 'translateY(-20px) scale(1.1)' },
        },
        aurora: {
          '0%, 100%': { 
            'background-position': '0% 50%',
            'transform': 'translateY(0)'
          },
          '50%': { 
            'background-position': '100% 50%',
            'transform': 'translateY(-10px)'
          },
        }
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      }
    },
  },
  plugins: [],
}