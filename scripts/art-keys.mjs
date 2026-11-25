import fs from "node:fs";
const src = fs.readFileSync(new URL("../src/art/Words.jsx", import.meta.url), "utf8");
const m = src.match(/export const WORD_ART = \{([\s\S]*?)\};/);
export const WORD_ART_KEYS = m[1].split(",").map((s) => s.split(":")[0].trim()).filter(Boolean);
