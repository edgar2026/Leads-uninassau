import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";

// Usamos path.join para garantir que os caminhos sejam resolvidos corretamente
const rootDir = process.cwd();

export default defineConfig({
  base: './', // Mantido como relativo para compatibilidade máxima no deploy
  plugins: [
    react(),
    runtimeErrorOverlay(),
    ...(process.env.NODE_ENV !== "production" &&
    process.env.REPL_ID !== undefined
      ? [
          await import("@replit/vite-plugin-cartographer").then((m) =>
            m.cartographer(),
          ),
          await import("@replit/vite-plugin-dev-banner").then((m) =>
            m.devBanner(),
          ),
        ]
      : []),
  ],
  resolve: {
    alias: {
      "@": path.join(rootDir, "client", "src"),
      "@shared": path.join(rootDir, "shared"),
      "@assets": path.join(rootDir, "attached_assets"),
    },
  },
  root: path.join(rootDir, "client"),
  build: {
    outDir: path.join(rootDir, "dist"),
    emptyOutDir: true,
  },
  server: {
    host: '0.0.0.0',
    port: 5173,
    fs: {
      strict: true,
      deny: ["**/.*"],
    },
  },
});