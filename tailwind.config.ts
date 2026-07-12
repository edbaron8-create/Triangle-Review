import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Army green brand ramp; DEFAULT ≈ classic army green (#4b5320).
        army: {
          50: "#f6f7ec",
          100: "#eaeed4",
          200: "#d6deae",
          300: "#bcc87f",
          400: "#a2b158",
          500: "#85963c",
          600: "#67772c",
          700: "#4b5320",
          800: "#404624",
          900: "#373c21",
          950: "#1c200e",
          DEFAULT: "#4b5320",
        },
      },
    },
  },
  plugins: [],
};

export default config;
