import { nextui } from "@nextui-org/react";

export default {
  content: [
    "./src/**/{**,.client,.server}/**/*.{js,jsx,ts,tsx}",
    "./node_modules/@nextui-org/theme/dist/components/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        disabled: {
          DEFAULT: "hsl(var(--disabled))",
          foreground: "hsl(var(--disabled-foreground))",
        },
      },

      fontFamily: {
        sans: [
          "Helvetica Neue",
          "Arial",
          "Helvetica",
          "ui-sans-serif",
          "system-ui",
          "sans-serif",
          "Apple Color Emoji",
          "Segoe UI Emoji",
          "Segoe UI Symbol",
          "Noto Color Emoji",
        ],
      },
    },
  },
  darkMode: "class",
  plugins: [nextui()],
};
