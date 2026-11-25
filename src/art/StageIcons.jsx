import React from "react";

// أيقونات المحطات الخمسة (SVG محلي) — كل واحدة ليها شكل مميز مش اللون بس
const Garden = () => (
  <g>
    <ellipse cx="60" cy="100" rx="50" ry="14" fill="#BFE3A0" />
    {[[34, 62, "#F28CB1"], [60, 50, "#FFD84D"], [86, 64, "#C9A8EE"]].map(([x, y, c], i) => (
      <g key={i}>
        <path d={`M${x} ${y + 8} V98`} stroke="#4C9C3B" strokeWidth="5" strokeLinecap="round" />
        {[0, 1, 2, 3, 4].map((k) => {
          const a = (k * Math.PI * 2) / 5 - Math.PI / 2;
          return <circle key={k} cx={x + Math.cos(a) * 11} cy={y + Math.sin(a) * 11} r="8.5" fill={c} />;
        })}
        <circle cx={x} cy={y} r="6.5" fill="#E0A92B" />
      </g>
    ))}
  </g>
);
const Island = () => (
  <g>
    <path d="M6 96 Q60 86 114 96 L114 112 L6 112 Z" fill="#7CC4F2" />
    <ellipse cx="60" cy="90" rx="40" ry="12" fill="#F4D9A0" />
    <path d="M60 88 Q56 60 64 34" stroke="#8B5A2B" strokeWidth="7" fill="none" strokeLinecap="round" />
    {[[-30, -8], [-18, -22], [14, -24], [30, -8], [0, -28]].map(([dx, dy], i) => (
      <path key={i} d={`M64 34 Q${64 + dx} ${34 + dy} ${64 + dx * 1.5} ${34 + dy * 0.2 + 10}`} stroke="#4C9C3B" strokeWidth="8" fill="none" strokeLinecap="round" />
    ))}
    <circle cx="58" cy="40" r="4" fill="#8B5A2B" />
    <circle cx="70" cy="42" r="4" fill="#8B5A2B" />
  </g>
);
const Orchard = () => (
  <g>
    <ellipse cx="60" cy="102" rx="46" ry="11" fill="#BFE3A0" />
    <rect x="53" y="62" width="14" height="40" rx="5" fill="#8B5A2B" />
    <circle cx="60" cy="42" r="30" fill="#5FB24B" />
    <circle cx="38" cy="58" r="19" fill="#4C9C3B" />
    <circle cx="82" cy="58" r="19" fill="#4C9C3B" />
    {[[48, 36], [72, 44], [44, 60], [78, 62], [60, 56]].map(([x, y], i) => (
      <circle key={i} cx={x} cy={y} r="6" fill={["#E53935", "#FDD835", "#FB8C00", "#E53935", "#FDD835"][i]} />
    ))}
  </g>
);
const City = () => (
  <g>
    <rect x="4" y="100" width="112" height="10" rx="4" fill="#CFC2E6" />
    <rect x="12" y="54" width="30" height="48" rx="3" fill="#F5B3C8" />
    <rect x="44" y="30" width="32" height="72" rx="3" fill="#FFE29A" />
    <path d="M80 102 V60 L98 40 L116 60 V102 Z" fill="#CDE9B8" />
    {[[20, 64], [30, 64], [20, 78], [30, 78], [52, 42], [64, 42], [52, 58], [64, 58], [52, 74], [64, 74]].map(([x, y], i) => (
      <rect key={i} x={x} y={y} width="7" height="9" rx="1.5" fill="#fff" />
    ))}
    <rect x="92" y="78" width="12" height="24" rx="2" fill="#fff" />
  </g>
);
const Bridge = () => (
  <g>
    <path d="M0 98 Q60 98 120 98 L120 114 L0 114 Z" fill="#7CC4F2" />
    <path d="M6 84 Q60 30 114 84" stroke="#F4A261" strokeWidth="9" fill="none" strokeLinecap="round" />
    <rect x="4" y="82" width="112" height="9" rx="4" fill="#E5894B" />
    {[22, 40, 60, 80, 98].map((x, i) => (
      <path key={i} d={`M${x} 82 V${i === 2 ? 52 : i % 2 ? 60 : 66}`} stroke="#F4A261" strokeWidth="4" strokeLinecap="round" />
    ))}
    <rect x="12" y="91" width="10" height="8" fill="#E5894B" />
    <rect x="98" y="91" width="10" height="8" fill="#E5894B" />
  </g>
);

const MAP = { garden: Garden, island: Island, orchard: Orchard, city: City, bridge: Bridge };
export function StageIcon({ icon, className }) {
  const C = MAP[icon];
  return (
    <svg viewBox="0 0 120 120" className={className} aria-hidden="true" focusable="false">
      <C />
    </svg>
  );
}
