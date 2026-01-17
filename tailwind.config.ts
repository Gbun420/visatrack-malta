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
          DEFAULT: "#0F172A", // Deep Sapphire
          foreground: "#FFFFFF",
        },
        secondary: {
          DEFAULT: "#208099", // Mediterranean Teal
          foreground: "#FFFFFF",
        },
        accent: {
          DEFAULT: "#F59E0B", // Luzzu Gold
          foreground: "#0F172A",
        },
        slate: {
          50: "#F8FAFC",
          100: "#F1F5F9",
          200: "#E2E8F0",
          300: "#CBD5E1",
          400: "#94A3B8",
          500: "#64748B",
          600: "#475569",
          700: "#334155",
          800: "#1E293B",
          900: "#0F172A",
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
        sans: ["var(--font-inter)", "ui-sans-serif", "system-ui"],
        display: ["var(--font-outfit)", "ui-sans-serif", "system-ui"],
        mono: ["var(--font-ibm-plex-mono)", "ui-monospace", "SFMono-Regular"],
      },
      backgroundImage: {
        'glass-gradient': 'linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05))',
      },
      boxShadow: {
        'premium': '0 20px 50px -12px rgba(15, 23, 42, 0.1)',
        'premium-hover': '0 30px 60px -12px rgba(15, 23, 42, 0.15)',
      }
    },
  },
  plugins: [require("tailwindcss-animate")],
};
export default config;
