import type { Config } from "tailwindcss";

export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // The mat: header bands and primary actions.
        mat: { DEFAULT: "#13294B", 600: "#1D3A66", 400: "#4F6B95", 100: "#E3E9F2" },
        // Page and text.
        paper: "#F3F5F7",
        ink: { DEFAULT: "#16202C", soft: "#4A5563", faint: "#8A94A3" },
        line: "#DCE1E7",
        // Scoreboard corners: the top wrestler is red, the bottom green.
        corner: { red: "#D3313C", green: "#16935A" },
        // Bout status.
        deck: { DEFAULT: "#B7791F", bg: "#FDF3DC" },
      },
      fontFamily: {
        sans: ["var(--font-body)", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "var(--font-body)", "sans-serif"],
      },
    },
  },
  plugins: [],
} satisfies Config;
