import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "#208099", // Mediterranean Teal
          foreground: "#FFFFFF",
        },
        secondary: {
          DEFAULT: "#1E293B", // Fortress Slate
          foreground: "#F8FAFC",
        },
        accent: {
          DEFAULT: "#F59E0B", // Luzzu Yellow
          foreground: "#1E293B",
        },
        success: {
          DEFAULT: "#10B981", // Compliance Green
          foreground: "#FFFFFF",
        },
        error: {
          DEFAULT: "#EF4444", // Alert Red
          foreground: "#FFFFFF",
        },
        limestone: "#F8FAFC",
      },
      fontFamily: {
        sans: ["var(--font-inter)"],
        mono: ["var(--font-ibm-plex-mono)"],
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
export default config;
