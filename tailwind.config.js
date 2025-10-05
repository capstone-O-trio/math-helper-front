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
        "green-u": "#C1EDDD",
        "green-f": "#057A55",
      },
    },
  },
  plugins: [],
};
