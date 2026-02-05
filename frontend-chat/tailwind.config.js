/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#020617", 
        card: "#020617",
        border: "#1e293b",
        primary: "#6366f1",
        primaryHover: "#4f46e5",
      },
    },
  },
  plugins: [],
}
