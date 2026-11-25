import React from "react";
import { createRoot } from "react-dom/client";
import "@fontsource/noto-kufi-arabic/arabic-400.css";
import "@fontsource/noto-kufi-arabic/arabic-700.css";
import "./styles.css";
import App from "./App.jsx";
import { initSpeech } from "./services/speech.js";

initSpeech();
createRoot(document.getElementById("root")).render(<App />);
