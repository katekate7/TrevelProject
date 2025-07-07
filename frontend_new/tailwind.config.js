/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      fontFamily: {
        // Тепер у класах можна писати "font-abril"
        abril: ["Abril Fatface", "cursive"],
      },
    },
  },
  plugins: [],
};
