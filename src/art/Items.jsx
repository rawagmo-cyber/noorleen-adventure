import React from "react";
import { WORD_ART } from "./Words.jsx";
import { COLOR_BY_ID } from "../data/colorsShapes.js";

const Star = () => (
  <g>
    <path d="M60 10 L74 42 L109 45 L83 68 L91 102 L60 84 L29 102 L37 68 L11 45 L46 42 Z" fill="#FFC531" stroke="#E0A92B" strokeWidth="4" strokeLinejoin="round" />
    <path d="M44 48 L60 24" stroke="#fff" strokeOpacity=".55" strokeWidth="5" strokeLinecap="round" />
  </g>
);
const Balloon = () => (
  <g>
    <path d="M60 104 Q56 112 62 116" stroke="#7B6A58" strokeWidth="2.5" fill="none" strokeLinecap="round" />
    <path d="M60 14 C26 14 22 62 60 90 C98 62 94 14 60 14 Z" fill="#F28CB1" />
    <path d="M54 90 L66 90 L60 98 Z" fill="#E36A98" />
    <path d="M38 36 Q42 24 54 22" stroke="#fff" strokeOpacity=".55" strokeWidth="5" fill="none" strokeLinecap="round" />
  </g>
);

const ART = { ...WORD_ART, star: Star, balloon: Balloon };

export function ItemArt({ art, className }) {
  const C = ART[art];
  if (!C) return null;
  return (
    <svg viewBox="0 0 120 120" className={className} aria-hidden="true" focusable="false">
      <C />
    </svg>
  );
}

// ---------- أشياء بلون واحد ثابت (للمحطة التالتة) ----------
function shade(hex, amt) {
  const n = parseInt(hex.slice(1), 16);
  const c = (v) => Math.max(0, Math.min(255, v + amt));
  const r = c(n >> 16), g = c((n >> 8) & 255), b = c(n & 255);
  return `#${((1 << 24) | (r << 16) | (g << 8) | b).toString(16).slice(1)}`;
}

// كل شكل مرسوم بلون واحد (وتدرجاته الخفيفة)، مفيش لون تاني يلخبط.
export function ColorThing({ colorId, className }) {
  const col = COLOR_BY_ID[colorId];
  const hex = col.hex;
  const dark = shade(hex, -45);
  const lite = "#fff";
  let body = null;
  switch (col.thing) {
    case "apple":
      body = (
        <g>
          <path d="M60 36 C44 22 14 34 18 66 C22 96 44 108 60 100 C76 108 98 96 102 66 C106 34 76 22 60 36 Z" fill={hex} />
          <path d="M60 36 Q58 22 66 12" stroke={dark} strokeWidth="6" fill="none" strokeLinecap="round" />
          <path d="M66 24 Q84 10 96 22 Q80 34 66 24 Z" fill={dark} />
          <path d="M32 50 Q34 38 46 36" stroke={lite} strokeOpacity=".45" strokeWidth="5" fill="none" strokeLinecap="round" />
        </g>
      );
      break;
    case "balloon":
      body = (
        <g>
          <path d="M60 104 Q56 112 62 116" stroke={dark} strokeWidth="3" fill="none" strokeLinecap="round" />
          <path d="M60 14 C26 14 22 62 60 90 C98 62 94 14 60 14 Z" fill={hex} />
          <path d="M54 90 L66 90 L60 98 Z" fill={dark} />
          <path d="M38 36 Q42 24 54 22" stroke={lite} strokeOpacity=".5" strokeWidth="5" fill="none" strokeLinecap="round" />
        </g>
      );
      break;
    case "banana":
      body = (
        <g>
          <path d="M18 34 Q24 100 96 92 Q106 90 108 80 Q84 90 46 64 Q32 50 36 34 Z" fill={hex} />
          <path d="M18 34 Q18 20 26 14 L36 14 Q34 24 36 34 Z" fill={dark} />
          <circle cx="106" cy="80" r="4" fill={dark} />
          <path d="M24 28 Q30 70 88 90" stroke={lite} strokeOpacity=".55" strokeWidth="4" fill="none" strokeLinecap="round" />
        </g>
      );
      break;
    case "leaf":
      body = (
        <g>
          <path d="M16 100 Q8 30 62 14 Q104 10 106 20 Q108 80 56 104 Q34 112 16 100 Z" fill={hex} />
          <path d="M14 104 Q50 70 98 24" stroke={dark} strokeWidth="4" fill="none" strokeLinecap="round" />
          <path d="M44 74 L40 52 M62 58 L58 38 M76 46 L90 52 M54 86 L74 84" stroke={dark} strokeWidth="3" strokeLinecap="round" opacity=".7" />
        </g>
      );
      break;
    case "orange":
      body = (
        <g>
          <circle cx="60" cy="66" r="38" fill={hex} />
          {[[44, 52], [70, 46], [56, 72], [82, 68], [42, 82], [66, 88]].map(([x, y], i) => (
            <circle key={i} cx={x} cy={y} r="2" fill={dark} opacity=".6" />
          ))}
          <path d="M60 28 Q56 18 62 12" stroke={dark} strokeWidth="5" fill="none" strokeLinecap="round" />
          <path d="M62 26 Q78 12 92 22 Q78 34 62 26 Z" fill={dark} />
          <path d="M34 52 Q38 40 50 36" stroke={lite} strokeOpacity=".5" strokeWidth="5" fill="none" strokeLinecap="round" />
        </g>
      );
      break;
    case "flower":
    default:
      body = (
        <g>
          <path d="M60 64 V112" stroke={dark} strokeWidth="6" strokeLinecap="round" />
          <path d="M60 96 Q40 88 36 70 Q54 72 60 96 Z" fill={dark} />
          <path d="M60 100 Q80 94 84 78 Q66 78 60 100 Z" fill={dark} />
          {Array.from({ length: 6 }).map((_, i) => {
            const a = (i * Math.PI * 2) / 6;
            return <circle key={i} cx={60 + Math.cos(a) * 20} cy={42 + Math.sin(a) * 20} r="14" fill={hex} />;
          })}
          <circle cx="60" cy="42" r="11" fill={dark} />
        </g>
      );
  }
  return (
    <svg viewBox="0 0 120 120" className={className} aria-hidden="true" focusable="false">
      {body}
    </svg>
  );
}
