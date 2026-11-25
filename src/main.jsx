import React from "react";
import { createRoot } from "react-dom/client";
import "@fontsource/noto-kufi-arabic/arabic-400.css";
import "@fontsource/noto-kufi-arabic/arabic-700.css";
import "./styles.css";
import App from "./App.jsx";
import { onSpeakingChange } from "./audio/audioService.ts";
import { duck } from "./services/sfx.js";

// الموسيقى بتخفت لما الصوت يتكلم
onSpeakingChange(duck);
createRoot(document.getElementById("root")).render(<App />);
