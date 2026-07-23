/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#7C5CFC",
        secondary: "#A78BFA",
        accent: "#FF8AC2",
        background: "#FFF9FD",
        card: "#FFFFFF",
        textPrimary: "#2D2D2D",
        success: "#4ADE80",
        warning: "#FBBF24",
        danger: "#FB7185",
      },
      fontFamily: {
        poppins: ["Poppins", "sans-serif"],
        inter: ["Inter", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
    },
  },
  plugins: [],
}
