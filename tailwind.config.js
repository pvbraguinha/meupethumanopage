/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        'sans': ['Inter', 'system-ui', 'sans-serif'],
        'display': ['Space Grotesk', 'Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'float': 'float 3s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite',
        'shimmer': 'shimmer 2s ease-in-out infinite',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'spin-slow': 'spin 3s linear infinite',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'gradient-mesh': 'linear-gradient(135deg, #667eea 0%, #764ba2 25%, #f093fb 50%, #f5576c 75%, #4facfe 100%)',
      },
      backdropBlur: {
        'xs': '2px',
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },
      borderRadius: {
        '4xl': '2rem',
        '5xl': '2.5rem',
      },
      colors: {
        'neon-blue': '#00f3ff',
        'neon-purple': '#bf00ff',
        'neon-pink': '#ff0080',
        'neon-green': '#00ff41',
        'cyber-dark': '#0a0a0f',
        'cyber-darker': '#05050a',
      },
      boxShadow: {
        'neon-sm': '0 0 10px currentColor',
        'neon': '0 0 20px currentColor',
        'neon-lg': '0 0 40px currentColor',
        'cyber': '0 0 30px rgba(0, 243, 255, 0.3)',
        'cyber-lg': '0 0 60px rgba(0, 243, 255, 0.4)',
      }
    },
  },
  plugins: [],
};