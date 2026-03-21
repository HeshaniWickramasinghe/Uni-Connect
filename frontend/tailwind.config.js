/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,jsx}',
    './components/**/*.{js,jsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        header: '0 1px 3px rgba(0,0,0,0.06)',
        dropdown: '0 12px 40px rgba(0,0,0,0.12)',
        'brand-sm': '0 4px 12px rgba(249,115,22,0.25)',
        'brand-md': '0 8px 24px rgba(249,115,22,0.35)',
        login: '0 32px 80px rgba(0,0,0,0.25)',
      },
      animation: {
        'wave-hand': 'wave 1.5s ease-in-out infinite',
        'drop-down': 'dropDown 0.15s ease-out',
        'card-in': 'cardIn 0.5s cubic-bezier(0.22,1,0.36,1)',
        blob: 'blobPulse 8s ease-in-out infinite',
        'pulse-ring': 'pulseRing 2s ease-in-out infinite',
      },
      keyframes: {
        wave: {
          '0%,100%': { transform: 'rotate(0deg)' },
          '20%': { transform: 'rotate(20deg)' },
          '40%': { transform: 'rotate(-10deg)' },
          '60%': { transform: 'rotate(10deg)' },
        },
        dropDown: {
          from: { opacity: '0', transform: 'translateY(-8px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        cardIn: {
          from: { opacity: '0', transform: 'translateY(24px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        blobPulse: {
          '0%,100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.08)' },
        },
        pulseRing: {
          '0%,100%': { boxShadow: '0 0 0 10px rgba(255,255,255,0.08)' },
          '50%': { boxShadow: '0 0 0 20px rgba(255,255,255,0.02)' },
        },
      },
    },
  },
  plugins: [],
};
