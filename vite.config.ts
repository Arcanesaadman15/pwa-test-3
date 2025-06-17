import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import tailwindcss from "tailwindcss";
import autoprefixer from "autoprefixer";
// import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";

export default defineConfig({
  plugins: [
    react(),
    // runtimeErrorOverlay(),
  ],
  envDir: "./",
  envPrefix: "VITE_",
  server: {
    host: true, // Allow external hosts
    port: 5173,
    strictPort: false,
    // Proxy API calls to the backend server
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        secure: false
      }
    },
    // Allow specific ngrok hosts
    allowedHosts: [
      'localhost',
      '7c38-2a01-4b00-871d-f300-5028-f064-6707-207f.ngrok-free.app',
      '.ngrok-free.app'
    ]
  },
  css: {
    postcss: {
      plugins: [
        tailwindcss(),
        autoprefixer(),
      ],
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "client", "src"),
      "@shared": path.resolve(import.meta.dirname, "shared"),
      "@assets": path.resolve(import.meta.dirname, "attached_assets"),
    },
  },
  root: path.resolve(import.meta.dirname, "client"),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true,
  },
});
