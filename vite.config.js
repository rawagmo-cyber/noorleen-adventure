import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { GAME_TITLE } from "./src/config.js";

// يحط عنوان اللعبة من src/config.js جوه index.html تلقائيًا
const injectTitle = () => ({
  name: "inject-game-title",
  transformIndexHtml: (html) => html.replaceAll("%GAME_TITLE%", GAME_TITLE),
});

export default defineConfig({
  base: "./",
  plugins: [react(), injectTitle()],
  build: { target: "es2019", chunkSizeWarningLimit: 700 },
});
