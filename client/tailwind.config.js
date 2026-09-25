/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        oomni: {
          dark: "#0b1329",
          navy: "#0f172a",
          panel: "#1e293b",
          border: "#e2e8f0",
          purple: "#7c3aed",
          accent: "#2563eb",
          sidebar: "#f8fafc"
        }
      }
    },
  },
  plugins: [],
}
