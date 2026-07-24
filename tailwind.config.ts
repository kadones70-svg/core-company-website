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
        "core-black": "#1A1917",
        "core-warm": "#F8F7F4",
        "core-orange": "#E8620A",
        "core-purple": "#8B3AC8",
        "core-blue": "#1E56C8",
        "core-teal": "#0F7A5A",
        "core-amber": "#B86A00",
        "core-green": "#3A6D11",
        "core-border": "#E8E6E1",
      },
      fontFamily: {
        sans: ["Noto Sans KR", "sans-serif"],
        mono: ["DM Mono", "monospace"],
      },
    },
  },
  plugins: [],
};

export default config;
