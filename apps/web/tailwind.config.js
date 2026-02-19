/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        gold: "#FFCD00",
        hawkeye: {
          gold: "#FFCD00",
          black: "#000000",
        },
      },
      fontFamily: {
        condensed: ["Barlow Condensed", "Impact", "sans-serif"],
        body: ["Barlow", "sans-serif"],
      },
    },
  },
  plugins: [],
};
