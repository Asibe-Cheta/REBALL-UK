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
        // REBALL Custom Color Palette from section 3.1
        black: {
          DEFAULT: '#000000',
          charcoal: '#0A0A0A',
          dark: '#1A1A1A',
          medium: '#2A2A2A',
          accent: '#3A3A3A',
          muted: '#4A4A4A',
        },
        white: {
          DEFAULT: '#FFFFFF',
          off: '#FAFAFA',
          light: '#F5F5F5',
          soft: '#E5E5E5',
          medium: '#D4D4D4',
          text: '#737373',
          dark: '#262626',
        },
        success: {
          light: '#F0F9FF',
          dark: '#166534',
        },
        error: {
          light: '#FEF2F2',
          dark: '#991B1B',
        },
        warning: {
          light: '#FFFBEB',
          dark: '#92400E',
        }
      },
      fontFamily: {
        'permanent-marker': ['Permanent Marker', 'cursive'],
        'poppins': ['Poppins', 'sans-serif'],
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
    },
  },
  plugins: [],
};

export default config; 