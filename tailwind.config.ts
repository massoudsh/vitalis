import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        vitalis: {
          primary: "#0F766E", // سبز-آبی طبی، حس آرامش و اعتماد
          risk: {
            low: "#16A34A",
            medium: "#EAB308",
            high: "#EA580C",
            critical: "#DC2626",
          },
        },
      },
    },
  },
  plugins: [],
};

export default config;
