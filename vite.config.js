import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";
export default defineConfig({
    plugins: [
        react(),
        VitePWA({
            registerType: "autoUpdate",
            includeAssets: ["assets/**/*"],
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
                globPatterns: ["**/*.{js,css,html,svg,png,jpg,jpeg,webp,glb,woff2}"],
                maximumFileSizeToCacheInBytes: 4 * 1024 * 1024,
                navigateFallback: "/index.html"
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
