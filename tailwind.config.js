module.exports = {
  content: ["./app/**/*.{js,jsx}", "./components/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: { sans: ["var(--font-sans)", "system-ui", "sans-serif"] },
      colors: { ink: "#05060f", panel: "#0d1020" },
      keyframes: {
        float: { "0%,100%": { transform: "translateY(0)" }, "50%": { transform: "translateY(-14px)" } },
        blob: { "0%,100%": { transform: "translate3d(0,0,0) scale(1)" }, "50%": { transform: "translate3d(30px,-40px,0) scale(1.15)" } },
        gridmove: { from: { backgroundPosition: "0 0" }, to: { backgroundPosition: "48px 48px" } },
        rise: { "0%": { opacity: 0, transform: "translateY(0) scale(.6)" }, "30%": { opacity: 0.9 }, "100%": { opacity: 0, transform: "translateY(-120px) scale(1)" } },
      },
      animation: {
        float: "float 6s ease-in-out infinite",
        blob: "blob 14s ease-in-out infinite",
        gridmove: "gridmove 6s linear infinite",
        rise: "rise 7s ease-in infinite",
      },
    },
  },
  plugins: [],
};
