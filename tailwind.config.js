/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
  theme: {
    extend: {
      fontFamily: {
        pretendard: ["Pretendard Standard", "sans-serif"],
      },
      colors: {
        "green-d": "#31C48D",
        "green-u": "#84E1BC",
        "green-f": "#057A55",
      },
    },
  },
  plugins: [],
};
