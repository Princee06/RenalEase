/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#2E86AB",
        secondary: "#1A5276",
        accent: "#A8DADC",
        soft: "#F4F9FF",
        danger: "#E74C3C",
        success: "#1A7A4A",
        warning: "#B7770D",
      },
      fontFamily: {
        sans: ["Inter", "Arial", "sans-serif"],
      },
    },
  },
  plugins: [],
};
