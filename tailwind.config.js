/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./App.{js,jsx,ts,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        background: "#0F172A",
        card: "#1E293B",
        cardBorder: "#334155",
        primary: "#38BDF8",
        lang: {
          vi: "#10B981",
          en: "#0EA5E9",
          zh: "#F59E0B"
        }
      }
    },
  },
  plugins: [],
};
