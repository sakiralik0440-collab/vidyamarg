import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:5000",
        changeOrigin: true,
        secure: false,
      },
    },
  },
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["favicon.svg", "icons.svg", "vidyamarg-icon.svg"],
      manifest: {
        name: "NextStep — Gaon se College Tak",
        short_name: "NextStep",
        description:
          "Helping village students find college guidance, scholarships, and job opportunities",
        theme_color: "#3B6D11",
        background_color: "#EAF3DE",
        display: "standalone",
        orientation: "portrait",
        scope: "/",
        start_url: "/",
        icons: [
          { src: "favicon.svg", sizes: "192x192", type: "image/svg+xml" },
          { src: "icons.svg", sizes: "512x512", type: "image/svg+xml" },
          { src: "vidyamarg-icon.svg", sizes: "any", type: "image/svg+xml", purpose: "any maskable" },
        ],
      },
      workbox: {
        globPatterns: ["**/*.{js,css,html,ico,png,svg,woff2}"],
        runtimeCaching: [
          {
            // Cache API calls to our backend
            urlPattern: /^http:\/\/vidyamarg-production-50d6.up.railway.app\/api\/.*/i,
            handler: "NetworkFirst",
            options: {
              cacheName: "vidyamarg-api-cache",
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 60 * 60 * 24, // 24 hours
              },
              cacheableResponse: {
                statuses: [0, 200],
              },
            },
          },
          {
            // Cache Google Fonts
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: "CacheFirst",
            options: {
              cacheName: "google-fonts-cache",
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365, // 1 year
              },
            },
          },
        ],
      },
    }),
  ],
});
