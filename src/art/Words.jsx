import React from "react";

// رسومات SVG محلية لكل كلمة (viewBox 120×120). مفيش إيموجي ومفيش صور خارجية.
const O = "#6B4A2B"; // لون الخطوط الغامق الدافي

const Lion = () => (
  <g>
    {Array.from({ length: 12 }).map((_, i) => {
      const a = (i * Math.PI * 2) / 12;
      return <circle key={i} cx={60 + Math.cos(a) * 33} cy={58 + Math.sin(a) * 33} r="14" fill="#B8661E" />;
    })}
    <circle cx="60" cy="58" r="34" fill="#C97B2A" />
    <circle cx="38" cy="34" r="8" fill="#F6C76F" />
    <circle cx="82" cy="34" r="8" fill="#F6C76F" />
    <circle cx="38" cy="34" r="4" fill="#E9A5A5" />
    <circle cx="82" cy="34" r="4" fill="#E9A5A5" />
    <circle cx="60" cy="60" r="26" fill="#F6C76F" />
    <ellipse cx="60" cy="72" rx="13" ry="10" fill="#FFE8B5" />
    <path d="M53 64 L67 64 L60 72 Z" fill="#6B3B1A" />
    <path d="M60 72 V77 M52 79 Q60 84 60 77 Q60 84 68 79" stroke="#6B3B1A" strokeWidth="2" fill="none" strokeLinecap="round" />
    <circle cx="49" cy="55" r="3.5" fill="#3B2314" />
    <circle cx="71" cy="55" r="3.5" fill="#3B2314" />
    <circle cx="50" cy="54" r="1.1" fill="#fff" />
    <circle cx="72" cy="54" r="1.1" fill="#fff" />
  </g>
);

const Duck = () => (
  <g>
    <path d="M30 96 Q60 108 92 96" stroke="#7CC4F2" strokeWidth="6" fill="none" strokeLinecap="round" />
    <ellipse cx="56" cy="74" rx="34" ry="25" fill="#FFD84D" />
    <path d="M24 66 Q14 56 22 50 Q30 58 32 66 Z" fill="#FFD84D" />
    <circle cx="80" cy="42" r="21" fill="#FFD84D" />
    <path d="M96 42 Q114 40 112 50 Q100 54 94 50 Z" fill="#FF9A3C" />
    <circle cx="84" cy="37" r="3.6" fill="#3B2314" />
    <circle cx="85" cy="36" r="1.1" fill="#fff" />
    <ellipse cx="74" cy="48" rx="4" ry="2.6" fill="#FFAE9E" opacity=".7" />
    <path d="M42 70 Q58 94 76 70 Q66 66 42 70 Z" fill="#F2B91E" />
    <path d="M55 99 L50 108 M62 99 L66 108" stroke="#FF9A3C" strokeWidth="4" strokeLinecap="round" />
  </g>
);

const Apple = () => (
  <g>
    <path d="M60 36 C44 22 14 34 18 66 C22 96 44 108 60 100 C76 108 98 96 102 66 C106 34 76 22 60 36 Z" fill="#E0443E" />
    <path d="M32 50 Q34 38 46 36" stroke="#fff" strokeOpacity=".45" strokeWidth="5" fill="none" strokeLinecap="round" />
    <path d="M60 36 Q58 22 66 14" stroke="#7B4A22" strokeWidth="5" fill="none" strokeLinecap="round" />
    <path d="M66 24 Q84 10 96 22 Q80 34 66 24 Z" fill="#5FB24B" />
  </g>
);

const Fox = () => (
  <g>
    <path d="M60 106 L20 62 L22 16 L48 38 Q60 34 72 38 L98 16 L100 62 Z" fill="#F07F2C" />
    <path d="M22 16 L30 40 L40 34 Z" fill="#3B2314" />
    <path d="M98 16 L90 40 L80 34 Z" fill="#3B2314" />
    <path d="M60 106 L30 70 Q44 62 60 74 Q76 62 90 70 Z" fill="#FFF4E6" />
    <path d="M60 74 L52 84 Q60 90 68 84 Z" fill="#FFF4E6" />
    <ellipse cx="60" cy="82" rx="6" ry="4.5" fill="#2B1A12" />
    <circle cx="44" cy="58" r="4.2" fill="#2B1A12" />
    <circle cx="76" cy="58" r="4.2" fill="#2B1A12" />
    <circle cx="45" cy="57" r="1.2" fill="#fff" />
    <circle cx="77" cy="57" r="1.2" fill="#fff" />
  </g>
);

const Camel = () => (
  <g>
    <g fill="#D9A55B">
      <rect x="40" y="86" width="9" height="26" rx="4" />
      <rect x="53" y="88" width="9" height="24" rx="4" />
      <rect x="82" y="86" width="9" height="26" rx="4" />
      <rect x="95" y="88" width="9" height="24" rx="4" />
      <path d="M30 70 Q30 48 52 46 Q62 30 72 48 Q84 34 96 50 Q108 54 106 74 Q104 92 84 92 L48 92 Q30 92 30 70 Z" />
      <path d="M32 62 Q24 40 30 28" stroke="#D9A55B" strokeWidth="14" fill="none" strokeLinecap="round" />
      <ellipse cx="26" cy="24" rx="13" ry="9" transform="rotate(-18 26 24)" />
    </g>
    <path d="M52 46 Q62 34 72 48" stroke="#C48C3F" strokeWidth="3" fill="none" />
    <circle cx="22" cy="22" r="2.6" fill="#3B2314" />
    <ellipse cx="14" cy="27" rx="2" ry="1.4" fill="#8A5A22" />
    <path d="M34 15 L38 8 L40 17 Z" fill="#D9A55B" />
    <path d="M106 66 Q114 76 108 88" stroke="#8A5A22" strokeWidth="3" fill="none" strokeLinecap="round" />
  </g>
);

const Horse = () => (
  <g>
    <g fill="#8B5A2B">
      <rect x="36" y="78" width="9" height="32" rx="4" />
      <rect x="50" y="80" width="9" height="30" rx="4" />
      <rect x="80" y="78" width="9" height="32" rx="4" />
      <rect x="94" y="80" width="9" height="30" rx="4" />
      <rect x="28" y="52" width="76" height="34" rx="16" />
      <path d="M38 58 L30 24 Q34 12 46 14 L58 18 Q70 20 66 34 L58 56 Z" />
      <path d="M26 26 Q20 24 20 34 Q22 42 34 42 Z" />
    </g>
    <path d="M40 14 Q32 28 40 54 Q46 40 50 20 Z" fill="#3B2314" />
    <path d="M104 58 Q122 66 114 98 Q104 84 102 70 Z" fill="#3B2314" />
    <path d="M44 14 L47 5 L52 16 Z" fill="#8B5A2B" />
    <circle cx="48" cy="26" r="2.8" fill="#1E120A" />
    <ellipse cx="23" cy="34" rx="2" ry="1.5" fill="#3B2314" />
    <rect x="36" y="104" width="9" height="6" rx="2" fill="#3B2314" />
    <rect x="50" y="104" width="9" height="6" rx="2" fill="#3B2314" />
    <rect x="80" y="104" width="9" height="6" rx="2" fill="#3B2314" />
    <rect x="94" y="104" width="9" height="6" rx="2" fill="#3B2314" />
  </g>
);

const Cucumber = () => (
  <g>
    <g transform="rotate(-28 60 62)">
      <rect x="10" y="44" width="100" height="36" rx="18" fill="#4CA64F" />
      <rect x="10" y="44" width="16" height="36" rx="12" fill="#7BC46E" />
      <path d="M32 52 H98 M32 62 H98 M32 72 H98" stroke="#2F7D32" strokeWidth="2.4" strokeLinecap="round" opacity=".7" />
      {[40, 58, 76, 90].map((x, i) => (
        <circle key={i} cx={x} cy={i % 2 ? 58 : 68} r="1.8" fill="#C8E6B0" />
      ))}
    </g>
    <circle cx="94" cy="92" r="14" fill="#4CA64F" />
    <circle cx="94" cy="92" r="10.5" fill="#D8F0B8" />
    {[0, 1, 2, 3, 4].map((i) => (
      <ellipse key={i} cx={94 + Math.cos(i * 1.25) * 5} cy={92 + Math.sin(i * 1.25) * 5} rx="1.6" ry="2.4" fill="#fff" />
    ))}
  </g>
);

const Bear = () => (
  <g>
    <circle cx="32" cy="32" r="14" fill="#8B5A3C" />
    <circle cx="88" cy="32" r="14" fill="#8B5A3C" />
    <circle cx="32" cy="32" r="7" fill="#D9A47E" />
    <circle cx="88" cy="32" r="7" fill="#D9A47E" />
    <circle cx="60" cy="62" r="38" fill="#8B5A3C" />
    <ellipse cx="60" cy="74" rx="18" ry="14" fill="#E8C9A4" />
    <ellipse cx="60" cy="68" rx="7" ry="5" fill="#2B1A12" />
    <path d="M60 73 V80 M52 82 Q60 88 60 80 Q60 88 68 82" stroke="#2B1A12" strokeWidth="2.4" fill="none" strokeLinecap="round" />
    <circle cx="44" cy="54" r="4.4" fill="#1E120A" />
    <circle cx="76" cy="54" r="4.4" fill="#1E120A" />
    <circle cx="45.4" cy="52.8" r="1.4" fill="#fff" />
    <circle cx="77.4" cy="52.8" r="1.4" fill="#fff" />
  </g>
);

const Corn = () => (
  <g>
    <g transform="rotate(14 60 60)">
      <path d="M60 8 Q82 14 82 56 Q82 84 60 90 Q38 84 38 56 Q38 14 60 8 Z" fill="#FFD84D" />
      {[0, 1, 2, 3, 4, 5, 6].map((r) =>
        [0, 1, 2, 3].map((c) => (
          <ellipse key={r + "-" + c} cx={46 + c * 9.3} cy={22 + r * 10} rx="4" ry="4.6" fill="#F7B91E" opacity={0.75} />
        ))
      )}
      <path d="M60 106 Q30 98 28 52 Q44 70 60 74 Z" fill="#5FB24B" />
      <path d="M60 106 Q90 98 92 52 Q76 70 60 74 Z" fill="#4C9C3B" />
      <path d="M60 108 Q56 84 60 66 Q64 84 60 108 Z" fill="#7BC46E" />
    </g>
  </g>
);

const Pomegranate = () => (
  <g>
    <circle cx="48" cy="66" r="32" fill="#C62F3A" />
    <path d="M40 40 L44 26 L50 36 L56 24 L60 38 L66 30 L66 42 Z" fill="#A5232E" />
    <path d="M26 56 Q28 44 38 40" stroke="#fff" strokeOpacity=".4" strokeWidth="5" fill="none" strokeLinecap="round" />
    <circle cx="90" cy="84" r="22" fill="#C62F3A" />
    <circle cx="90" cy="84" r="17" fill="#FFE5E1" />
    {Array.from({ length: 9 }).map((_, i) => {
      const a = (i * Math.PI * 2) / 9;
      return <circle key={i} cx={90 + Math.cos(a) * 10} cy={84 + Math.sin(a) * 10} r="3.6" fill="#E0394B" />;
    })}
    <circle cx="90" cy="84" r="3.6" fill="#E0394B" />
  </g>
);

const Flower = () => (
  <g>
    <path d="M60 64 V112" stroke="#4C9C3B" strokeWidth="6" strokeLinecap="round" />
    <path d="M60 96 Q40 88 36 70 Q54 72 60 96 Z" fill="#5FB24B" />
    <path d="M60 100 Q80 94 84 78 Q66 78 60 100 Z" fill="#5FB24B" />
    {Array.from({ length: 6 }).map((_, i) => {
      const a = (i * Math.PI * 2) / 6;
      return <circle key={i} cx={60 + Math.cos(a) * 20} cy={42 + Math.sin(a) * 20} r="14" fill="#F28CB1" />;
    })}
    <circle cx="60" cy="42" r="12" fill="#FFD84D" />
    <circle cx="56" cy="39" r="2" fill="#E0A92B" />
    <circle cx="64" cy="44" r="2" fill="#E0A92B" />
  </g>
);

const Fish = () => (
  <g>
    <path d="M88 60 L116 36 L110 60 L116 84 Z" fill="#FF8A4C" />
    <ellipse cx="54" cy="60" rx="38" ry="25" fill="#FF9F43" />
    <path d="M40 38 Q54 22 70 38 Q56 42 40 38 Z" fill="#FF7B2E" />
    <path d="M40 82 Q50 94 64 82 Q52 78 40 82 Z" fill="#FF7B2E" />
    <path d="M62 40 Q70 60 62 80 M74 44 Q80 60 74 76" stroke="#fff" strokeOpacity=".7" strokeWidth="4" fill="none" strokeLinecap="round" />
    <circle cx="30" cy="54" r="6" fill="#fff" />
    <circle cx="29" cy="54" r="3.4" fill="#2B1A12" />
    <path d="M18 66 Q24 70 30 68" stroke="#B5541C" strokeWidth="2.4" fill="none" strokeLinecap="round" />
    <circle cx="96" cy="26" r="4" fill="#B3E0F7" />
    <circle cx="104" cy="14" r="2.6" fill="#B3E0F7" />
  </g>
);

const Sun = () => (
  <g>
    {Array.from({ length: 12 }).map((_, i) => (
      <rect key={i} x="56" y="6" width="8" height="20" rx="4" fill="#FFB300" transform={`rotate(${i * 30} 60 60)`} />
    ))}
    <circle cx="60" cy="60" r="30" fill="#FFD23F" />
    <circle cx="60" cy="60" r="24" fill="#FFE066" />
    <path d="M44 56 Q47 52 50 56 M70 56 Q73 52 76 56" stroke="#B9770E" strokeWidth="3" fill="none" strokeLinecap="round" />
    <path d="M48 68 Q60 80 72 68" stroke="#B9770E" strokeWidth="3.4" fill="none" strokeLinecap="round" />
  </g>
);

const Falcon = () => (
  <g>
    <rect x="6" y="100" width="108" height="8" rx="4" fill="#8B5A2B" />
    <path d="M86 96 L102 100 L98 106 L82 100 Z" fill="#6B4A2B" />
    <path d="M70 96 Q54 100 40 106 Q52 80 54 54 Q62 70 70 96 Z" fill="#7A5A3A" />
    <path d="M62 38 Q86 40 90 72 Q90 94 70 100 Q50 96 48 72 Q48 42 62 38 Z" fill="#8A6642" />
    <path d="M70 50 Q84 56 82 80 Q80 96 70 98 Q62 80 70 50 Z" fill="#F3E6D3" />
    <path d="M66 76 Q54 78 52 92" stroke="#5E4128" strokeWidth="3" fill="none" strokeLinecap="round" />
    <circle cx="48" cy="40" r="18" fill="#8A6642" />
    <path d="M32 38 Q22 40 24 52 Q30 50 34 44 Z" fill="#FFC531" />
    <path d="M26 50 Q32 56 34 46" fill="#E0A92B" />
    <circle cx="44" cy="36" r="4.6" fill="#fff" />
    <circle cx="43" cy="36" r="2.8" fill="#1E120A" />
    <path d="M36 32 L52 30" stroke="#3B2314" strokeWidth="2.6" strokeLinecap="round" />
    <path d="M76 100 L76 106 M82 100 L82 106" stroke="#FFC531" strokeWidth="3" strokeLinecap="round" />
  </g>
);

const Frog = () => (
  <g>
    <ellipse cx="60" cy="78" rx="42" ry="30" fill="#5FB24B" />
    <ellipse cx="60" cy="96" rx="22" ry="12" fill="#A6DB8F" />
    <circle cx="36" cy="44" r="16" fill="#5FB24B" />
    <circle cx="84" cy="44" r="16" fill="#5FB24B" />
    <circle cx="36" cy="43" r="11" fill="#fff" />
    <circle cx="84" cy="43" r="11" fill="#fff" />
    <circle cx="37" cy="44" r="6" fill="#1E120A" />
    <circle cx="83" cy="44" r="6" fill="#1E120A" />
    <circle cx="39" cy="42" r="2" fill="#fff" />
    <circle cx="85" cy="42" r="2" fill="#fff" />
    <path d="M30 76 Q60 100 90 76" stroke="#2F7D32" strokeWidth="3.6" fill="none" strokeLinecap="round" />
    <circle cx="52" cy="62" r="2" fill="#2F7D32" />
    <circle cx="68" cy="62" r="2" fill="#2F7D32" />
    <circle cx="26" cy="74" r="6" fill="#F9A8B4" opacity=".6" />
    <circle cx="94" cy="74" r="6" fill="#F9A8B4" opacity=".6" />
  </g>
);

const Plane = () => (
  <g>
    <path d="M14 56 L26 28 L36 28 L32 56 Z" fill="#4A90D9" />
    <ellipse cx="62" cy="60" rx="50" ry="15" fill="#fff" stroke="#5B7BA6" strokeWidth="2.5" />
    <path d="M100 52 Q116 56 112 64 Q104 66 96 64 Z" fill="#4A90D9" />
    <path d="M52 62 L36 98 L52 98 L84 64 Z" fill="#CFE3F7" stroke="#5B7BA6" strokeWidth="2.5" strokeLinejoin="round" />
    <path d="M52 56 L40 24 L56 24 L82 54 Z" fill="#CFE3F7" stroke="#5B7BA6" strokeWidth="2.5" strokeLinejoin="round" />
    {[36, 50, 64, 78].map((x) => (
      <circle key={x} cx={x + 16} cy="58" r="3.4" fill="#4A90D9" />
    ))}
    <path d="M14 58 H96" stroke="#4A90D9" strokeWidth="3" opacity=".6" />
  </g>
);

const Envelope = () => (
  <g>
    <rect x="10" y="26" width="100" height="70" rx="8" fill="#FFF8E7" stroke="#C9A36B" strokeWidth="3" />
    <path d="M12 30 L60 66 L108 30" fill="none" stroke="#C9A36B" strokeWidth="3" strokeLinejoin="round" strokeLinecap="round" />
    <path d="M12 94 L46 58 M108 94 L74 58" stroke="#C9A36B" strokeWidth="3" strokeLinecap="round" />
    <path d="M60 78 C52 70 48 64 54 60 C58 58 60 62 60 62 C60 62 62 58 66 60 C72 64 68 70 60 78 Z" fill="#F28CB1" />
  </g>
);

const Grapes = () => (
  <g>
    <path d="M62 12 Q62 24 60 30" stroke="#6B4A2B" strokeWidth="5" fill="none" strokeLinecap="round" />
    <path d="M62 18 Q80 4 96 16 Q82 30 62 18 Z" fill="#5FB24B" />
    {[
      [40, 42], [60, 42], [80, 42],
      [32, 60], [50, 60], [70, 60], [88, 60],
      [42, 78], [60, 78], [78, 78],
      [50, 95], [70, 95],
      [60, 110],
    ].map(([x, y], i) => (
      <g key={i}>
        <circle cx={x} cy={y} r="11" fill="#8E5BC9" />
        <circle cx={x - 3.5} cy={y - 3.5} r="3" fill="#fff" opacity=".45" />
      </g>
    ))}
  </g>
);

const Gazelle = () => (
  <g transform="translate(0 12)">
    <g fill="#D9A066">
      <rect x="38" y="82" width="6" height="26" rx="3" />
      <rect x="49" y="84" width="6" height="24" rx="3" />
      <rect x="82" y="82" width="6" height="26" rx="3" />
      <rect x="93" y="84" width="6" height="24" rx="3" />
      <ellipse cx="68" cy="70" rx="38" ry="19" />
      <path d="M36 62 Q28 44 30 26" stroke="#D9A066" strokeWidth="11" fill="none" strokeLinecap="round" />
      <ellipse cx="30" cy="20" rx="11" ry="8" transform="rotate(-12 30 20)" />
    </g>
    <path d="M44 82 Q68 92 94 82 Q68 98 44 82 Z" fill="#FFF4E0" />
    <path d="M27 13 Q18 0 26 -4 M34 13 Q42 0 35 -5" stroke="#6B4A2B" strokeWidth="3.2" fill="none" strokeLinecap="round" />
    <path d="M38 17 L44 10 L42 21 Z" fill="#D9A066" />
    <circle cx="26" cy="19" r="2.6" fill="#1E120A" />
    <ellipse cx="20" cy="24" rx="2" ry="1.4" fill="#3B2314" />
    <path d="M104 62 Q114 60 112 72" stroke="#D9A066" strokeWidth="6" fill="none" strokeLinecap="round" />
    <path d="M52 60 H92" stroke="#8A5A22" strokeWidth="3" strokeLinecap="round" opacity=".55" />
  </g>
);

const Butterfly = () => (
  <g>
    <path d="M60 58 Q18 6 12 44 Q10 70 60 62 Z" fill="#F28CB1" />
    <path d="M60 58 Q102 6 108 44 Q110 70 60 62 Z" fill="#F28CB1" />
    <path d="M60 64 Q20 66 24 96 Q34 110 60 70 Z" fill="#B48CE0" />
    <path d="M60 64 Q100 66 96 96 Q86 110 60 70 Z" fill="#B48CE0" />
    <circle cx="32" cy="38" r="8" fill="#FFE29A" />
    <circle cx="88" cy="38" r="8" fill="#FFE29A" />
    <circle cx="34" cy="90" r="5" fill="#FFE29A" />
    <circle cx="86" cy="90" r="5" fill="#FFE29A" />
    <rect x="55" y="40" width="10" height="56" rx="5" fill="#5A3A22" />
    <circle cx="60" cy="38" r="8" fill="#5A3A22" />
    <path d="M56 32 Q50 18 44 16 M64 32 Q70 18 76 16" stroke="#5A3A22" strokeWidth="2.6" fill="none" strokeLinecap="round" />
    <circle cx="44" cy="16" r="2.6" fill="#5A3A22" />
    <circle cx="76" cy="16" r="2.6" fill="#5A3A22" />
  </g>
);

const Moon = () => (
  <g>
    <circle cx="60" cy="60" r="42" fill="#FFE9A8" />
    <circle cx="44" cy="46" r="8" fill="#F2D27C" />
    <circle cx="74" cy="70" r="11" fill="#F2D27C" />
    <circle cx="50" cy="80" r="5.5" fill="#F2D27C" />
    <circle cx="80" cy="38" r="4.5" fill="#F2D27C" />
    <path d="M22 40 Q26 30 34 26" stroke="#fff" strokeOpacity=".6" strokeWidth="4" fill="none" strokeLinecap="round" />
  </g>
);

const Ball = () => (
  <g>
    <circle cx="60" cy="60" r="42" fill="#fff" stroke="#E0A92B" strokeWidth="3" />
    <path d="M60 60 L60 18 A42 42 0 0 1 96.4 39 Z" fill="#F28CB1" />
    <path d="M60 60 L96.4 81 A42 42 0 0 1 60 102 Z" fill="#4A90D9" />
    <path d="M60 60 L23.6 81 A42 42 0 0 1 23.6 39 Z" fill="#FFD84D" />
    <circle cx="60" cy="60" r="7" fill="#fff" stroke="#E0A92B" strokeWidth="3" />
    <path d="M30 34 Q36 24 46 20" stroke="#fff" strokeOpacity=".6" strokeWidth="5" fill="none" strokeLinecap="round" />
  </g>
);

const Lemon = () => (
  <g>
    <path d="M10 58 Q14 54 20 54 Q34 24 66 28 Q98 32 100 62 Q98 92 66 94 Q34 96 20 66 Q14 66 10 58 Z" fill="#FFE135" />
    <path d="M10 58 L18 56 M100 62 L108 60" stroke="#E6C200" strokeWidth="4" strokeLinecap="round" />
    <path d="M30 44 Q40 34 56 34" stroke="#fff" strokeOpacity=".6" strokeWidth="5" fill="none" strokeLinecap="round" />
    <path d="M88 26 Q106 8 112 24 Q100 34 88 26 Z" fill="#5FB24B" />
    <circle cx="86" cy="94" r="16" fill="#FFE135" />
    <circle cx="86" cy="94" r="12" fill="#FFF7B8" />
    {Array.from({ length: 6 }).map((_, i) => (
      <path key={i} d="M86 94 L86 84" stroke="#FFE135" strokeWidth="2" transform={`rotate(${i * 60} 86 94)`} />
    ))}
  </g>
);

const Banana = () => (
  <g>
    <path d="M18 34 Q24 100 96 92 Q106 90 108 80 Q84 90 46 64 Q32 50 36 34 Z" fill="#FFD43B" />
    <path d="M36 34 Q40 70 82 80" stroke="#E0B000" strokeWidth="3" fill="none" strokeLinecap="round" />
    <path d="M18 34 Q18 20 26 14 L36 14 Q34 24 36 34 Z" fill="#8B6B2F" />
    <path d="M24 28 Q30 70 88 90" stroke="#fff" strokeOpacity=".5" strokeWidth="4" fill="none" strokeLinecap="round" />
    <circle cx="106" cy="80" r="4" fill="#5E4520" />
  </g>
);

const Bee = () => (
  <g>
    <ellipse cx="44" cy="40" rx="18" ry="26" fill="#CFE9FA" stroke="#9CC8E6" strokeWidth="2" transform="rotate(-24 44 40)" />
    <ellipse cx="74" cy="38" rx="16" ry="24" fill="#CFE9FA" stroke="#9CC8E6" strokeWidth="2" transform="rotate(22 74 38)" />
    <ellipse cx="60" cy="72" rx="34" ry="26" fill="#FFD23F" />
    <path d="M46 48 Q44 72 50 96 M62 46 Q62 72 62 98 M78 48 Q80 72 74 96" stroke="#2B1A12" strokeWidth="8" fill="none" strokeLinecap="round" opacity=".92" />
    <path d="M92 72 L112 72 L100 78 Z" fill="#2B1A12" />
    <circle cx="34" cy="68" r="15" fill="#FFD23F" />
    <circle cx="28" cy="64" r="3.4" fill="#2B1A12" />
    <path d="M26 74 Q32 80 38 74" stroke="#2B1A12" strokeWidth="2.4" fill="none" strokeLinecap="round" />
    <path d="M30 54 Q24 42 16 40 M38 54 Q40 42 46 38" stroke="#2B1A12" strokeWidth="2.6" fill="none" strokeLinecap="round" />
    <circle cx="16" cy="40" r="2.6" fill="#2B1A12" />
    <circle cx="46" cy="38" r="2.6" fill="#2B1A12" />
  </g>
);

const Crescent = () => (
  <g>
    <path d="M78 14 A46 46 0 1 0 100 88 A38 38 0 1 1 78 14 Z" fill="#F4C542" />
    <path d="M34 34 Q38 28 44 26" stroke="#fff" strokeOpacity=".55" strokeWidth="5" fill="none" strokeLinecap="round" />
    <path d="M96 32 l4 9 10 1 -8 6 3 10 -9 -6 -9 6 3 -10 -8 -6 10 -1 z" fill="#F4C542" />
  </g>
);

const Rose = () => (
  <g>
    <path d="M60 70 V114" stroke="#4C9C3B" strokeWidth="6" strokeLinecap="round" />
    <path d="M60 98 Q38 94 30 76 Q52 76 60 98 Z" fill="#5FB24B" />
    <path d="M60 104 Q84 100 92 82 Q70 82 60 104 Z" fill="#5FB24B" />
    <circle cx="60" cy="44" r="34" fill="#D32F4B" />
    <path d="M60 44 m-24 0 a24 24 0 0 1 48 0 a18 18 0 0 1 -36 0 a12 12 0 0 1 24 0 a6 6 0 0 1 -12 0" fill="none" stroke="#8E1730" strokeWidth="4" strokeLinecap="round" />
    <path d="M30 34 Q40 20 56 18" stroke="#fff" strokeOpacity=".4" strokeWidth="4" fill="none" strokeLinecap="round" />
    <path d="M42 62 Q60 78 78 62 Q60 84 42 62 Z" fill="#B3203D" />
  </g>
);

const Hand = () => (
  <g>
    <g fill="#F2C29B" stroke="#D99A6C" strokeWidth="2.5" strokeLinejoin="round">
      <rect x="28" y="42" width="14" height="42" rx="7" transform="rotate(-8 35 63)" />
      <rect x="44" y="20" width="14" height="56" rx="7" />
      <rect x="60" y="14" width="14" height="62" rx="7" />
      <rect x="76" y="22" width="14" height="54" rx="7" />
      <rect x="92" y="62" width="14" height="40" rx="7" transform="rotate(-48 99 82)" />
      <path d="M28 70 Q28 112 60 112 Q92 112 92 72 L92 60 L28 60 Z" />
    </g>
    <path d="M40 68 Q60 80 80 68" stroke="#D99A6C" strokeWidth="2.4" fill="none" strokeLinecap="round" />
  </g>
);

export const WORD_ART = {
  lion: Lion, duck: Duck, apple: Apple, fox: Fox, camel: Camel, horse: Horse, cucumber: Cucumber, bear: Bear,
  corn: Corn, pomegranate: Pomegranate, flower: Flower, fish: Fish, sun: Sun, falcon: Falcon, frog: Frog,
  plane: Plane, envelope: Envelope, grapes: Grapes, gazelle: Gazelle, butterfly: Butterfly, moon: Moon,
  ball: Ball, lemon: Lemon, banana: Banana, bee: Bee, crescent: Crescent, rose: Rose, hand: Hand,
};

export function WordArt({ art, className, title }) {
  const C = WORD_ART[art];
  if (!C) return null;
  return (
    <svg viewBox="0 0 120 120" className={className} role={title ? "img" : undefined} aria-label={title} aria-hidden={title ? undefined : true} focusable="false">
      <C />
    </svg>
  );
}
