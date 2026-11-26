import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { GAME_TITLE } from "./src/config.js";

// يحط عنوان اللعبة من src/config.js جوه index.html تلقائيًا
const injectTitle = () => ({
  name: "inject-game-title",
  transformIndexHtml: (html) => html.replaceAll("%GAME_TITLE%", GAME_TITLE),
});

// manifest بسيط علشان الأيقونة تظهر لما اللعبة تتضاف على شاشة الموبايل (من غير service worker ولا أوفلاين)
const manifest = () => {
  const json = JSON.stringify({
    name: GAME_TITLE,
    short_name: GAME_TITLE,
    lang: "ar",
    dir: "rtl",
    display: "standalone",
    start_url: "./",
    scope: "./",
    background_color: "#FFF3C4",
    theme_color: "#FFF3C4",
    icons: [
      { src: "icons/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any maskable" },
      { src: "icons/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any maskable" },
    ],
  });
  return {
    name: "game-manifest",
    configureServer(server) {
      server.middlewares.use("/manifest.webmanifest", (_req, res) => {
        res.setHeader("Content-Type", "application/manifest+json");
        res.end(json);
      });
    },
    generateBundle() {
      this.emitFile({ type: "asset", fileName: "manifest.webmanifest", source: json });
    },
  };
};

export default defineConfig({
  base: "./",
  plugins: [react(), injectTitle(), manifest()],
  build: { target: "es2019", chunkSizeWarningLimit: 700 },
});
