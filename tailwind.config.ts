import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#6366F1",     // indigo-500
          50: "#EEF2FF",
          100: "#E0E7FF", 
          500: "#6366F1",
          600: "#5B21B6",
          700: "#4C1D95",
        },
        secondary: {
          DEFAULT: "#FBBF24",     // amber-400
          50: "#FFFBEB",
          100: "#FEF3C7",
          400: "#FBBF24",
          500: "#F59E0B",
          600: "#D97706",
        },
        accent: "#22C55E",        // green
        background: "#F9FAFB",    // gray-50
        text: "#1F2937",          // gray-800
      },
      fontFamily: {
        ubuntu: ["Ubuntu", "sans-serif"],
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 50%, #FBBF24 100%)',
        'gradient-text': 'linear-gradient(135deg, #6366F1 0%, #EC4899 50%, #FBBF24 100%)',
      },
    },
  },
  plugins: [],
};

export default config;
