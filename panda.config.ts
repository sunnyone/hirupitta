import { defineConfig } from "@pandacss/dev";

export default defineConfig({
  // Whether to use css reset
  preflight: true,

  // Where to look for your css declarations
  include: ["./src/**/*.{js,jsx,ts,tsx}", "./app/**/*.{js,jsx,ts,tsx}"],

  // Files to exclude
  exclude: [],

  // Useful for theme customization
  theme: {
    extend: {
      tokens: {
        colors: {
          primary: { value: "#0070f3" },
          secondary: { value: "#f0f0f0" },
          text: { value: "#333" },
          background: { value: "#ffffff" },
          border: { value: "#e5e5e5" },
        },
        spacing: {
          sm: { value: "5px" },
          md: { value: "10px" },
          lg: { value: "20px" },
        },
        radii: {
          sm: { value: "5px" },
          md: { value: "10px" },
        },
      },
    },
  },

  // The output directory for your css system
  outdir: "styled-system",
});
