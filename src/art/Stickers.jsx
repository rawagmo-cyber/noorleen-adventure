import React from "react";
import { BunnyBody } from "./Bunny.jsx";
import { WORD_ART } from "./Words.jsx";

// ١٢ ملصق بيتفتحوا بإكمال المراحل (مفيش شراء ولا حظ). الاسم بيتقال لما تضغط على الملصق.
const Butterfly = WORD_ART.butterfly;
const Sun = WORD_ART.sun;
const Flower = WORD_ART.flower;

const Star = () => (
  <g>
    <path d="M60 10 L74 42 L109 45 L83 68 L91 102 L60 84 L29 102 L37 68 L11 45 L46 42 Z" fill="#FFC531" stroke="#E0A92B" strokeWidth="4" strokeLinejoin="round" />
    <circle cx="52" cy="60" r="3" fill="#8A5A22" />
    <circle cx="68" cy="60" r="3" fill="#8A5A22" />
    <path d="M52 70 Q60 77 68 70" stroke="#8A5A22" strokeWidth="3" fill="none" strokeLinecap="round" />
  </g>
);
const MoonS = () => (
  <g>
    <path d="M78 12 A48 48 0 1 0 104 92 A40 40 0 1 1 78 12 Z" fill="#FFE9A8" stroke="#E7C76A" strokeWidth="3" />
    <circle cx="44" cy="62" r="3" fill="#8A5A22" />
    <path d="M38 78 Q46 84 54 78" stroke="#8A5A22" strokeWidth="3" fill="none" strokeLinecap="round" />
    <path d="M90 30 l3 7 8 1 -6 5 2 8 -7 -5 -7 5 2 -8 -6 -5 8 -1 z" fill="#FFC531" />
  </g>
);
const Rainbow = () => (
  <g fill="none" strokeLinecap="round" strokeWidth="9">
    <path d="M12 92 A48 48 0 0 1 108 92" stroke="#F28CB1" />
    <path d="M22 92 A38 38 0 0 1 98 92" stroke="#FFD84D" />
    <path d="M32 92 A28 28 0 0 1 88 92" stroke="#8ED081" />
    <path d="M42 92 A18 18 0 0 1 78 92" stroke="#9CC8F2" />
    <circle cx="16" cy="96" r="10" fill="#fff" stroke="none" />
    <circle cx="104" cy="96" r="10" fill="#fff" stroke="none" />
  </g>
);
const Heart = () => (
  <g>
    <path d="M60 100 C20 70 14 36 38 28 C50 24 58 32 60 40 C62 32 70 24 82 28 C106 36 100 70 60 100 Z" fill="#F28CB1" stroke="#D96C97" strokeWidth="3" />
    <path d="M34 42 Q38 34 46 33" stroke="#fff" strokeOpacity=".6" strokeWidth="5" fill="none" strokeLinecap="round" />
  </g>
);
const Cloud = () => (
  <g>
    <path d="M30 88 Q10 88 12 70 Q14 54 32 56 Q36 34 60 34 Q84 34 88 54 Q108 52 108 72 Q108 88 90 88 Z" fill="#EAF4FF" stroke="#B6D4F0" strokeWidth="3" />
    <circle cx="50" cy="66" r="3" fill="#6B8CAE" />
    <circle cx="70" cy="66" r="3" fill="#6B8CAE" />
    <path d="M52 75 Q60 82 68 75" stroke="#6B8CAE" strokeWidth="3" fill="none" strokeLinecap="round" />
  </g>
);
const BunnyS = () => (
  <g transform="translate(15 4) scale(.76)">
    <BunnyBody />
  </g>
);
const Balloon = () => (
  <g>
    <path d="M60 100 Q54 110 62 116" stroke="#7B6A58" strokeWidth="2.5" fill="none" strokeLinecap="round" />
    <path d="M60 10 C26 10 22 58 60 90 C98 58 94 10 60 10 Z" fill="#C9A8EE" stroke="#A987D8" strokeWidth="3" />
    <path d="M54 90 L66 90 L60 98 Z" fill="#A987D8" />
    <path d="M38 32 Q42 20 54 18" stroke="#fff" strokeOpacity=".55" strokeWidth="5" fill="none" strokeLinecap="round" />
  </g>
);
const Ladybug = () => (
  <g>
    <path d="M44 28 Q38 16 30 14 M76 28 Q82 16 90 14" stroke="#2B1A12" strokeWidth="3" fill="none" strokeLinecap="round" />
    <circle cx="60" cy="34" r="16" fill="#2B1A12" />
    <ellipse cx="60" cy="72" rx="38" ry="38" fill="#E5484D" />
    <path d="M60 36 V110" stroke="#2B1A12" strokeWidth="4" />
    {[[42, 60, 6], [78, 60, 6], [40, 86, 5], [80, 86, 5]].map(([x, y, r], i) => (
      <circle key={i} cx={x} cy={y} r={r} fill="#2B1A12" />
    ))}
    <circle cx="54" cy="32" r="3" fill="#fff" />
    <circle cx="66" cy="32" r="3" fill="#fff" />
  </g>
);
const Tree = () => (
  <g>
    <rect x="52" y="70" width="16" height="40" rx="5" fill="#8B5A2B" />
    <circle cx="60" cy="48" r="32" fill="#5FB24B" />
    <circle cx="38" cy="62" r="20" fill="#4C9C3B" />
    <circle cx="82" cy="62" r="20" fill="#4C9C3B" />
    <circle cx="50" cy="40" r="5" fill="#F28CB1" />
    <circle cx="72" cy="52" r="5" fill="#F28CB1" />
    <circle cx="46" cy="62" r="5" fill="#F28CB1" />
  </g>
);

export const STICKERS = [
  { id: "sun", name: "شمس", spoken: "شَمْس", C: Sun },
  { id: "butterfly", name: "فراشة", spoken: "فَرَاشَة", C: Butterfly },
  { id: "star", name: "نجمة", spoken: "نَجْمَة", C: Star },
  { id: "moon", name: "قمر", spoken: "قَمَر", C: MoonS },
  { id: "flower", name: "زهرة", spoken: "زَهْرَة", C: Flower },
  { id: "rainbow", name: "قوس قزح", spoken: "قَوْس قُزَح", C: Rainbow },
  { id: "heart", name: "قلب", spoken: "قَلْب", C: Heart },
  { id: "cloud", name: "سحابة", spoken: "سَحَابَة", C: Cloud },
  { id: "bunny", name: "أرنب", spoken: "أَرْنَب", C: BunnyS },
  { id: "balloon", name: "بالونة", spoken: "بَالُونَة", C: Balloon },
  { id: "ladybug", name: "دعسوقة", spoken: "دُعْسُوقَة", C: Ladybug },
  { id: "tree", name: "شجرة", spoken: "شَجَرَة", C: Tree },
];

export function StickerArt({ index, className }) {
  const s = STICKERS[index];
  const C = s.C;
  return (
    <svg viewBox="0 0 120 120" className={className} aria-hidden="true" focusable="false">
      <C />
    </svg>
  );
}
