/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],

  theme: {
    extend: {
      colors: {
        ink: '#1C2333',
        slate: {
          925: '#0F1420',
        },
        brand: {
          50: '#EEF4FF',
          100: '#DCE8FF',
          200: '#B7CFFF',
          300: '#8FB3FF',
          400: '#5C8DFF',
          500: '#3366FF',
          600: '#274CDB',
          700: '#1D3AAD',
          800: '#182E85',
          900: '#152863',
        },
        amber: {
          400: '#F5A524',
          500: '#E38F0F',
        },
      },

      fontFamily: {
        display: ['"Fraunces"', 'ui-serif', 'Georgia', 'serif'],
        sans: ['"Inter"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },

      boxShadow: {
        card: '0 1px 2px rgba(15, 20, 32, 0.04), 0 8px 24px -12px rgba(15, 20, 32, 0.12)',
        elevated: '0 4px 10px rgba(15, 20, 32, 0.06), 0 16px 32px -14px rgba(51, 102, 255, 0.22)',
      },

      transitionTimingFunction: {
        'out-soft': 'cubic-bezier(0.16, 1, 0.3, 1)',
      },

      // Toast animations
      keyframes: {
        slideInRight: {
          '0%': {
            opacity: '0',
            transform: 'translateX(30px)',
          },
          '100%': {
            opacity: '1',
            transform: 'translateX(0)',
          },
        },

        fadeOut: {
          '0%': {
            opacity: '1',
          },
          '100%': {
            opacity: '0',
          },
        },
      },

      animation: {
        slideInRight: 'slideInRight 0.3s ease-out',
        fadeOut: 'fadeOut 0.3s ease-in',
      },
    },
  },

  plugins: [],
};