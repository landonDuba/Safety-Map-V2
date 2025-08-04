/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      keyframes: {
        glow: {
          '0%, 100%': {
            filter: 'drop-shadow(0 0 5px #00f) drop-shadow(0 0 10px #00f)',
            transform: 'scale(1)',
          },
          '50%': {
            filter: 'drop-shadow(0 0 20px #00f) drop-shadow(0 0 30px #00f)',
            transform: 'scale(1.05)',
          },
        },
      },
      animation: {
        glow: 'glow 2s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
