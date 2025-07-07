import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#6366F1",       // indigo
        secondary: "#FBBF24",     // amber
        accent: "#22C55E",        // green
        background: "#F9FAFB",    // gray-50
        text: "#1F2937",          // gray-800
      },
      fontFamily: {
        ubuntu: ["Ubuntu", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
