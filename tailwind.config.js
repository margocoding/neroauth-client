/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      screens: {
        'xs': '375px',
        'sm': '640px',
        'md': '768px',
        'lg': '1024px',
        'xl': '1280px',
        '2xl': '1536px',
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },
      animation: {
        'fadeInUp': 'fadeInUp 0.6s ease-out forwards',
        'slideInUp': 'slideInUp 0.8s ease-out forwards',
        'ping': 'ping 2s cubic-bezier(0, 0, 0.2, 1) infinite',
      },
      keyframes: {
        fadeInUp: {
          '0%': {
            opacity: '0',
            transform: 'translateY(20px)',
          },
          '100%': {
            opacity: '1',
            transform: 'translateY(0)',
          },
        },
        slideInUp: {
          '0%': {
            opacity: '0',
            transform: 'translateY(30px) scale(0.95)',
          },
          '100%': {
            opacity: '1',
            transform: 'translateY(0) scale(1)',
          },
        },
        ping: {
          '75%, 100%': {
            transform: 'scale(2)',
            opacity: '0',
          },
        },
      },
      colors: {
        'nero': {
          'orange': '#FF7A00',
          'orange-dark': '#A64800',
          'orange-muted': '#BF6E30',
          'orange-light': '#FFB073',
        },
      },
      backdropBlur: {
        'xs': '2px',
      },
      boxShadow: {
        'orange-glow': '0 0 20px rgba(255, 122, 0, 0.3)',
        'orange-glow-lg': '0 0 40px rgba(255, 122, 0, 0.2)',
      },
    },
  },
  plugins: [],
}
