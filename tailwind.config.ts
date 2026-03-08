import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        cream: "#F5F0E8",
        "cream-dark": "#EBE4D8",
        charcoal: "#1A1A1A",
        terracotta: "#C75B30",
        "terracotta-dark": "#A84A25",
        "warm-gray": "#6B6560",
        // Dark mode palette
        "dark-bg": "#111110",
        "dark-surface": "#1A1918",
        "dark-border": "#2A2826",
        "dark-text": "#E8E4DF",
        "dark-muted": "#8A857F",
      },
      fontFamily: {
        sans: ["var(--font-geist-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-geist-mono)", "monospace"],
      },
    },
  },
  plugins: [],
};
export default config;
