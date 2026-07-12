import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        triangle: {
          DEFAULT: "#f59e0b",
          dark: "#b45309",
        },
      },
    },
  },
  plugins: [],
};

export default config;
