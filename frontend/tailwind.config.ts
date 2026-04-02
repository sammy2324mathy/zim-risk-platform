import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        sand: "#f7f1e3",
        ink: "#102033",
        teal: "#0f766e",
        ember: "#c2410c",
        mist: "#e8efe8",
        moss: "#305544",
      },
      boxShadow: {
        panel: "0 24px 80px -36px rgba(16, 32, 51, 0.35)",
      },
      borderRadius: {
        panel: "28px",
      },
    },
  },
  plugins: [],
};

export default config;

