import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  base: "./", // relative paths for assets
  server: {
    proxy: {
      "/api": {
        target: "https://edison-qr.eagletechsolutions.co.uk",
        changeOrigin: true,
        secure: true,
      },
    },
  },
  plugins: [react()],
});
