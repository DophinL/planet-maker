import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["icon.svg", "assets/brand/tripo-logo.svg"],
      manifest: {
        name: "Planet Maker — Offline 3D World Editor",
        short_name: "Planet Maker",
        description: "Design a 3D planet locally in your browser.",
        theme_color: "#0f1517",
        background_color: "#0f1517",
        display: "standalone",
        start_url: "/",
        icons: [
          {
            src: "/icon.svg",
            sizes: "any",
            type: "image/svg+xml",
            purpose: "any maskable"
          }
        ]
      },
      workbox: {
        globPatterns: [
          "**/*.{js,css,html,svg,woff2}",
          "assets/planets/previews/*.webp",
          "assets/planets/earth.jpg",
          "assets/planets/earth-clouds.jpg"
        ],
        maximumFileSizeToCacheInBytes: 4 * 1024 * 1024,
        navigateFallback: "/index.html",
        runtimeCaching: [
          {
            urlPattern: /\/assets\/planets\/.*\.(?:jpg|jpeg|png|webp)$/,
            handler: "CacheFirst",
            options: {
              cacheName: "planet-maker-textures-v1",
              expiration: { maxEntries: 32, maxAgeSeconds: 60 * 60 * 24 * 90 },
              cacheableResponse: { statuses: [0, 200] }
            }
          },
          {
            urlPattern: /\/assets\/models\/.*\.(?:glb|jpg|jpeg|png)$/,
            handler: "CacheFirst",
            options: {
              cacheName: "planet-maker-models-v1",
              expiration: { maxEntries: 64, maxAgeSeconds: 60 * 60 * 24 * 90 },
              cacheableResponse: { statuses: [0, 200] }
            }
          }
        ]
      }
    })
  ],
  server: {
    port: 5173
  },
  build: {
    target: "es2022",
    sourcemap: true
  }
});
