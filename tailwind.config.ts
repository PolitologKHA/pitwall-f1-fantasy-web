import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        surface: {
          950: "#08090d",
          900: "#0d1017",
          800: "#141824",
          700: "#1d2433",
        },
        pit: {
          red: "#f04444",
          cyan: "#33d6ff",
          lime: "#b9ff66",
          silver: "#d8dde8",
        },
      },
      boxShadow: {
        glow: "0 0 40px rgba(51, 214, 255, 0.14)",
        "red-glow": "0 0 44px rgba(240, 68, 68, 0.18)",
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
        mono: ["Menlo", "Consolas", "ui-monospace", "monospace"],
      },
    },
  },
  plugins: [],
};

export default config;
