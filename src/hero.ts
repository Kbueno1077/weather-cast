import { heroui } from "@heroui/theme";

export default heroui({
  defaultTheme: "dark",
  themes: {
    dark: {
      colors: {
        background: "#020817",
        foreground: {
          DEFAULT: "#969aa2",
        },
        primary: {
          DEFAULT: "#222c3a",
          foreground: "#ffffff",
        },
        default: {
          50: "#0d131d",
          100: "#1a2230",
          200: "#283345",
          300: "#36435a",
          400: "#4f5c72",
          500: "#7b8697",
          600: "#a1aab8",
          700: "#c4cad4",
          800: "#e1e5eb",
          900: "#f3f5f8",
          DEFAULT: "#36435a",
          foreground: "#ffffff",
        },
        content1: {
          DEFAULT: "#1a2230",
          foreground: "#ffffff",
        },
        divider: "rgba(255, 255, 255, 0.07)",
        focus: "#4c9aff",
      },
    },
  },
});
