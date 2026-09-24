import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        surface: "var(--surface)",
        "surface-muted": "var(--surface-muted)",
        foreground: "var(--foreground)",
        muted: "var(--muted)",
        border: "var(--border)",
        brand: "var(--brand)",
        "brand-dark": "var(--brand-dark)",
        vitalis: {
          primary: "var(--brand)",
          risk: {
            low: "#16A34A",
            medium: "#EAB308",
            high: "#EA580C",
            critical: "#DC2626",
          },
        },
      },
      fontFamily: {
        sans: ["Vazirmatn", "ui-sans-serif", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
