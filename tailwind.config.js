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
          950: '#030914',
          900: '#061325',
          800: '#0b223d',
          700: '#10355b',
          600: '#174c7e',
          500: '#1e68a3',
          400: '#2c89cf',
          300: '#48b2ef',
          200: '#7fd3fc',
          100: '#baebfd',
          50: '#f0f9ff',
        },
        biolum: {
          cyan: '#00f2fe',
          teal: '#00e5ff',
          aqua: '#4facfe',
          emerald: '#00ffb3',
          amber: '#ffd700',
        }
      },
      animation: {
        'caustic-slow': 'caustic 12s ease-in-out infinite alternate',
        'float-bubble': 'bubbleFloat 8s ease-in-out infinite',
        'pulse-glow': 'pulseGlow 3s ease-in-out infinite alternate',
        'wave-slide': 'waveSlide 20s linear infinite',
      },
      keyframes: {
        caustic: {
          '0%': { transform: 'scale(1) rotate(0deg)', opacity: '0.4' },
          '50%': { transform: 'scale(1.1) rotate(3deg)', opacity: '0.7' },
          '100%': { transform: 'scale(1.05) rotate(-2deg)', opacity: '0.5' },
        },
        bubbleFloat: {
          '0%': { transform: 'translateY(100vh) scale(0.5)', opacity: '0' },
          '20%': { opacity: '0.8' },
          '80%': { opacity: '0.8' },
          '100%': { transform: 'translateY(-10vh) scale(1.2)', opacity: '0' },
        },
        pulseGlow: {
          '0%': { boxShadow: '0 0 15px rgba(0, 242, 254, 0.2)' },
          '100%': { boxShadow: '0 0 35px rgba(0, 242, 254, 0.6)' },
        },
        waveSlide: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        }
      }
    },
  },
  plugins: [],
}
