/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Bebas Neue"', "sans-serif"],
        body: ['"DM Sans"', "sans-serif"],
        mono: ['"JetBrains Mono"', "monospace"],
      },
      colors: {
        primary: "#4a9eff",
        ink: "#0A0A0A",
        ash: "#111111",
        smoke: "#1A1A1A",
        mist: "#888888",
      },
      animation: {
        "spin-slow": "spin 3s linear infinite",
        "pulse-primary": "pulsePrimary 2s ease-in-out infinite",
        "slide-up": "slideUp 0.5s ease forwards",
        "fade-in": "fadeIn 0.4s ease forwards",
      },
      keyframes: {
        pulsePrimary: {
          "0%, 100%": { opacity: 1 },
          "50%": { opacity: 0.5 },
        },
        slideUp: {
          from: { opacity: 0, transform: "translateY(20px)" },
          to: { opacity: 1, transform: "translateY(0)" },
        },
        fadeIn: {
          from: { opacity: 0 },
          to: { opacity: 1 },
        },
      },
    },
  },
  plugins: [],
};
