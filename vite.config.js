import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  content: [
    "./src/**/*.{js,jsx,ts,tsx}", // Scan all React files
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#673AB7",
        },
      },
    },
  },
  plugins: [react(), tailwindcss()],
});
