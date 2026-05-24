/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          '-apple-system',
          'BlinkMacSystemFont',
          'Inter',
          'SF Pro Display',
          'Segoe UI',
          'Roboto',
          'sans-serif',
        ],
      },
      colors: {
        ink: {
          950: '#070811',
          900: '#0b0d18',
          850: '#10131f',
          800: '#161a28',
          700: '#1f2435',
          600: '#2a3149',
          500: '#3a4360',
        },
        accent: {
          lime: '#c6ff3d',
          green: '#22e07e',
          violet: '#7c5cff',
          pink: '#ff5cd1',
          orange: '#ff8a3d',
          cyan: '#3dd9ff',
        },
      },
      backgroundImage: {
        'glow-lime': 'radial-gradient(ellipse at 30% 20%, rgba(198,255,61,0.18), transparent 60%)',
        'glow-violet': 'radial-gradient(ellipse at 70% 0%, rgba(124,92,255,0.22), transparent 60%)',
        'mesh': 'radial-gradient(at 20% 0%, rgba(124,92,255,0.18) 0px, transparent 50%), radial-gradient(at 80% 0%, rgba(61,217,255,0.10) 0px, transparent 50%), radial-gradient(at 0% 100%, rgba(198,255,61,0.10) 0px, transparent 50%)',
      },
      boxShadow: {
        'glow-lime': '0 10px 40px -10px rgba(198,255,61,0.45)',
        'glow-violet': '0 10px 40px -10px rgba(124,92,255,0.55)',
        'card': '0 1px 0 rgba(255,255,255,0.04) inset, 0 8px 24px -12px rgba(0,0,0,0.6)',
      },
      borderRadius: {
        '2xl': '1.25rem',
        '3xl': '1.75rem',
      },
      animation: {
        'fade-in': 'fadeIn 0.4s ease-out',
        'slide-up': 'slideUp 0.45s cubic-bezier(0.22, 1, 0.36, 1)',
        'pop': 'pop 0.35s cubic-bezier(0.22, 1, 0.36, 1)',
        'shimmer': 'shimmer 2.4s linear infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        pop: {
          '0%': { transform: 'scale(0.92)', opacity: '0' },
          '60%': { transform: 'scale(1.04)', opacity: '1' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
    },
  },
  plugins: [],
}
