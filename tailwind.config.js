export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        inter: ["Inter", "sans-serif"],
      },
      // --- Marquee Keyframes ---
      keyframes: {
        // Defines the animation: moves from 0% (start) to -50% (half the total duplicated width)
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
      },
      // --- Marquee Animation Class ---
      animation: {
        // Applies the keyframes: runs for 10 seconds, linearly, and infinitely loops
        marquee: "marquee 10s linear infinite",
      },
    },
  },
  plugins: [],
};
