/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ink: {
          950: "#0B0E1A",
          900: "#0F1324",
          800: "#141829",
          700: "#1B2036",
          600: "#242A47",
        },
        paper: {
          50: "#EDEEF5",
          100: "#C9CBDB",
          400: "#8A8FA3",
        },
        gold: {
          400: "#F2B441",
          500: "#E29B22",
        },
        violet: {
          400: "#8B7EFF",
          500: "#7C6FF0",
        },
        teal: {
          400: "#2DD4BF",
          500: "#1FB8A6",
        },
      },
      fontFamily: {
        display: ["Iowan Old Style", "Georgia", "ui-serif", "serif"],
        sans: ["-apple-system", "Segoe UI", "Roboto", "Helvetica Neue", "Arial", "sans-serif"],
      },
      borderRadius: {
        xl2: "1.25rem",
      },
      boxShadow: {
        glow: "0 0 60px -15px rgba(124, 111, 240, 0.35)",
        goldglow: "0 0 40px -10px rgba(242, 180, 65, 0.4)",
      },
      backgroundImage: {
        "grid-lines":
          "linear-gradient(to right, rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.04) 1px, transparent 1px)",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-14px)" },
        },
        drift: {
          "0%, 100%": { transform: "translate(0,0)" },
          "50%": { transform: "translate(20px,-20px)" },
        },
      },
      animation: {
        float: "float 6s ease-in-out infinite",
        drift: "drift 14s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
