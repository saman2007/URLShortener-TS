/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts}", "./dist/**/*.{html,js}"],
  theme: {
    extend: {
      fontFamily: {
        primary: ["Combo", "cursive"],
        secondary: ["Roboto", "sans-serif"],
      },
    },
  },
  plugins: [],
};
