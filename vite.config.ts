import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import tailwindcss from "tailwindcss";
import autoprefixer from "autoprefixer";
// import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";

export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  // Set the third parameter to '' to load all env regardless of the `VITE_` prefix.
  const env = loadEnv(mode, process.cwd(), '');
  
  return {
    plugins: [
      react(),
      // runtimeErrorOverlay(),
    ],
    envDir: "./",
    envPrefix: "VITE_",
    define: {
      // Explicitly define environment variables for build
      'import.meta.env.VITE_SUPABASE_URL': JSON.stringify(env.VITE_SUPABASE_URL),
      'import.meta.env.VITE_SUPABASE_ANON_KEY': JSON.stringify(env.VITE_SUPABASE_ANON_KEY),
      'import.meta.env.VITE_LEMONSQUEEZY_STORE_ID': JSON.stringify(env.VITE_LEMONSQUEEZY_STORE_ID),
      'import.meta.env.VITE_LEMONSQUEEZY_API_KEY': JSON.stringify(env.VITE_LEMONSQUEEZY_API_KEY),
      'import.meta.env.VITE_APP_URL': JSON.stringify(env.VITE_APP_URL),
    },
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
  };
});
