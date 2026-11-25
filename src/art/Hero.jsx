import React from "react";
import { BunnyBody } from "./Bunny.jsx";
import { HERO_NAME } from "../config.js";

// البطلة: رسم SVG محلي بنفس مواصفات الورقة (مش صورة مطابقة):
// شعر بني غامق كيرلي وطويل نسبيًا، مشابك ورد صغيرة، عينين عسليتين كبار، خدود ناعمة وابتسامة مرحة،
// فستان كريمي أصفر فاتح بتنورة منفوشة وتفاصيل لامعة وفيونكة ورا، قلادة قلب، وجزمة وردي بفيونكة.
const SKIN = "#F2C9A0";
const SKIN_D = "#DDA877";
const HAIR = "#4A2C1A";
const HAIR_L = "#6A4229";
const DRESS = "#FFF1B8";
const DRESS_L = "#FFF9DB";
const GOLD = "#E0A92B";
const PINK = "#F5B3C8";

const Clip = ({ x, y, c }) => (
  <g>
    {[0, 1, 2, 3, 4].map((i) => {
      const a = (i * Math.PI * 2) / 5 - Math.PI / 2;
      return <circle key={i} cx={x + Math.cos(a) * 5} cy={y + Math.sin(a) * 5} r="3.8" fill={c} />;
    })}
    <circle cx={x} cy={y} r="2.8" fill={GOLD} />
  </g>
);

const Sparkle = ({ x, y, s = 1 }) => (
  <path d={`M${x} ${y - 4 * s} L${x + 1.2 * s} ${y - 1.2 * s} L${x + 4 * s} ${y} L${x + 1.2 * s} ${y + 1.2 * s} L${x} ${y + 4 * s} L${x - 1.2 * s} ${y + 1.2 * s} L${x - 4 * s} ${y} L${x - 1.2 * s} ${y - 1.2 * s} Z`} fill={GOLD} opacity=".85" />
);

function Eye({ cx, cy, expr }) {
  if (expr === "laughing") {
    return <path d={`M${cx - 9} ${cy + 3} Q${cx} ${cy - 9} ${cx + 9} ${cy + 3}`} stroke="#3A2312" strokeWidth="3.2" fill="none" strokeLinecap="round" />;
  }
  const ry = expr === "surprised" ? 12.5 : expr === "excited" ? 11.5 : 10.5;
  const ir = expr === "surprised" ? 6.6 : 7.6;
  const dx = expr === "thinking" ? 2.5 : 0;
  const dy = expr === "thinking" ? -3.5 : 0;
  return (
    <g>
      <ellipse cx={cx} cy={cy} rx="9.4" ry={ry} fill="#fff" />
      <circle cx={cx + dx} cy={cy + dy} r={ir} fill="#A5702F" />
      <circle cx={cx + dx} cy={cy + dy} r={ir - 2.2} fill="#7A4A1E" />
      <circle cx={cx + dx} cy={cy + dy} r="3.3" fill="#24120A" />
      <circle cx={cx + dx - 2.6} cy={cy + dy - 3} r="2.2" fill="#fff" />
      <circle cx={cx + dx + 2.6} cy={cy + dy + 2.6} r="1.1" fill="#fff" />
      <path d={`M${cx - 10} ${cy - 2} Q${cx} ${cy - ry - 3} ${cx + 10} ${cy - 2}`} stroke="#3A2312" strokeWidth="2.8" fill="none" strokeLinecap="round" />
    </g>
  );
}

function Mouth({ expr }) {
  switch (expr) {
    case "excited":
      return (
        <g>
          <path d="M86 114 Q100 140 114 114 Q100 120 86 114 Z" fill="#8E2F2F" />
          <path d="M88 115 Q100 121 112 115 L110 118 Q100 124 90 118 Z" fill="#fff" />
          <ellipse cx="100" cy="129" rx="6" ry="3.6" fill="#F28C8C" />
        </g>
      );
    case "laughing":
      return (
        <g>
          <path d="M83 112 Q100 148 117 112 Z" fill="#8E2F2F" />
          <path d="M85 112 H115 Q100 120 85 112 Z" fill="#fff" />
          <ellipse cx="100" cy="130" rx="8" ry="5" fill="#F28C8C" />
        </g>
      );
    case "surprised":
      return <ellipse cx="100" cy="125" rx="5" ry="6.6" fill="#8E2F2F" />;
    case "thinking":
      return <path d="M92 122 Q102 127 110 118" stroke="#A24B3A" strokeWidth="3" fill="none" strokeLinecap="round" />;
    default:
      return <path d="M87 116 Q100 131 113 116" stroke="#A24B3A" strokeWidth="3.2" fill="none" strokeLinecap="round" />;
  }
}

function Arms({ pose }) {
  const arm = { stroke: SKIN, strokeWidth: 9.5, strokeLinecap: "round", fill: "none" };
  const hand = (x, y, r = 6.2) => <circle cx={x} cy={y} r={r} fill={SKIN} />;
  switch (pose) {
    case "wave":
      return (
        <g>
          <path d="M74 152 Q62 178 66 202" {...arm} />
          {hand(66, 207)}
          <path d="M126 152 Q152 150 158 122" {...arm} />
          <g className="hero-wave-hand">{hand(158, 115, 7.4)}</g>
        </g>
      );
    case "celebrate":
      return (
        <g className="hero-cheer-arms">
          <path d="M74 152 Q48 142 46 110" {...arm} />
          {hand(45, 103, 7.2)}
          <path d="M126 152 Q152 142 154 110" {...arm} />
          {hand(155, 103, 7.2)}
        </g>
      );
    case "hug":
      return (
        <g>
          <path d="M74 154 Q54 186 88 198" {...arm} />
          {hand(90, 197)}
          <path d="M126 154 Q146 186 112 198" {...arm} />
          {hand(110, 197)}
        </g>
      );
    case "explore":
      return (
        <g>
          <path d="M74 152 Q58 176 78 192" {...arm} />
          {hand(80, 193)}
          <path d="M126 152 Q150 150 166 148" {...arm} />
          {hand(171, 147, 6.6)}
          <ellipse cx="180" cy="145" rx="7.5" ry="3.6" fill={SKIN} transform="rotate(-12 180 145)" />
        </g>
      );
    case "focus":
      return (
        <g>
          <path d="M74 152 Q58 176 78 192" {...arm} />
          {hand(80, 193)}
          <path d="M126 152 Q146 172 122 138" {...arm} />
          {hand(118, 133, 6.8)}
        </g>
      );
    default:
      return (
        <g>
          <path d="M74 152 Q62 178 66 202" {...arm} />
          {hand(66, 207)}
          <path d="M126 152 Q138 178 134 202" {...arm} />
          {hand(134, 207)}
        </g>
      );
  }
}

const HEM = (x) => 268 + 16 * (1 - Math.pow((x - 100) / 78, 2));

function FrontHero({ expression, pose, withBunny }) {
  const expr = expression;
  const browL = expr === "surprised" ? "M74 72 Q84 64 94 71" : "M74 79 Q84 72 94 78";
  const browR = expr === "surprised" || expr === "thinking" ? "M106 71 Q116 64 126 72" : "M106 78 Q116 72 126 79";
  return (
    <g>
      {/* شعر ورا (كيرلي وطويل نسبيًا) */}
      <g fill={HAIR}>
        <ellipse cx="100" cy="90" rx="57" ry="58" />
        {[[46, 118, 14], [40, 142, 13], [48, 166, 11], [154, 118, 14], [160, 142, 13], [152, 166, 11]].map(([x, y, r], i) => (
          <circle key={i} cx={x} cy={y} r={r} />
        ))}
        {[[62, 48, 17], [80, 36, 17], [100, 32, 18], [120, 36, 17], [138, 48, 17], [50, 72, 15], [150, 72, 15]].map(([x, y, r], i) => (
          <circle key={"t" + i} cx={x} cy={y} r={r} />
        ))}
      </g>
      <g fill={HAIR_L} opacity=".55">
        {[[40, 138, 5], [48, 114, 5], [158, 114, 5], [62, 40, 6], [136, 42, 6], [100, 26, 6]].map(([x, y, r], i) => (
          <circle key={i} cx={x} cy={y} r={r} />
        ))}
      </g>

      {/* رجلين وجزمة */}
      <g fill={SKIN}>
        <rect x="83" y="262" width="10" height="42" rx="5" />
        <rect x="107" y="262" width="10" height="42" rx="5" />
      </g>
      {[88, 112].map((x) => (
        <g key={x}>
          <ellipse cx={x} cy="307" rx="13" ry="7.5" fill={PINK} stroke="#E58EAD" strokeWidth="1.5" />
          <path d={`M${x - 3} 300 l-5 -3 l1 7 z M${x - 3} 300 l5 -3 l-1 7 z`} fill="#F28CB1" />
        </g>
      ))}

      {/* تنورة منفوشة */}
      <path d="M68 190 Q34 214 22 268 Q60 288 100 288 Q140 288 178 268 Q166 214 132 190 Z" fill="#FFEEA6" stroke="#EBD07F" strokeWidth="1.5" />
      <path d="M62 204 Q42 232 32 266 Q100 292 168 266 Q158 232 138 204 Q100 218 62 204 Z" fill={DRESS_L} opacity=".75" />
      {Array.from({ length: 9 }).map((_, i) => {
        const x = 30 + i * 17.5;
        return <circle key={i} cx={x} cy={HEM(x) + 2} r="10.5" fill={DRESS_L} stroke="#EBD07F" strokeWidth="1.2" />;
      })}
      {[[60, 236, 1], [100, 250, 1.2], [140, 236, 1], [80, 262, 0.9], [122, 264, 0.9], [44, 256, 0.8], [158, 256, 0.8]].map(([x, y, s], i) => (
        <Sparkle key={i} x={x} y={y} s={s} />
      ))}

      {/* صدر الفستان */}
      <path d="M76 146 Q100 156 124 146 L131 193 Q100 202 69 193 Z" fill={DRESS} stroke="#EBD07F" strokeWidth="1.5" />
      <rect x="69" y="188" width="62" height="7" rx="3.5" fill="#F2D77A" />
      {[[86, 168], [110, 172], [98, 182], [118, 160], [82, 182]].map(([x, y], i) => (
        <Sparkle key={i} x={x} y={y} s={0.8} />
      ))}

      {/* الأرنب في الحضن */}
      {withBunny && (
        <g transform="translate(52 128) scale(.78)">
          <BunnyBody />
        </g>
      )}

      {/* الدراعات */}
      <Arms pose={withBunny ? "hug" : pose} />
      {/* الأكمام */}
      <ellipse cx="74" cy="150" rx="11" ry="9" fill="#FFF6CF" stroke="#EBD07F" strokeWidth="1.5" />
      <ellipse cx="126" cy="150" rx="11" ry="9" fill="#FFF6CF" stroke="#EBD07F" strokeWidth="1.5" />

      {/* رقبة وقلادة */}
      <rect x="91" y="126" width="18" height="24" rx="8" fill={SKIN} />
      <path d="M86 144 Q100 160 114 144 Q100 150 86 144 Z" fill={SKIN} />
      <path d="M85 145 Q100 172 115 145" stroke={GOLD} strokeWidth="1.8" fill="none" />
      <path d="M100 176 C93 170 91 164 96 162 C99 161 100 164 100 164 C100 164 101 161 104 162 C109 164 107 170 100 176 Z" fill="#F28CB1" stroke="#D96C97" strokeWidth="1" />

      {/* وش */}
      <ellipse cx="60" cy="98" rx="6" ry="9" fill={SKIN_D} />
      <ellipse cx="140" cy="98" rx="6" ry="9" fill={SKIN_D} />
      <circle cx="60" cy="107" r="2.4" fill={GOLD} />
      <circle cx="140" cy="107" r="2.4" fill={GOLD} />
      <ellipse cx="100" cy="92" rx="41" ry="44" fill={SKIN} />
      <circle cx="73" cy="113" r="7.5" fill="#F4A19C" opacity=".5" />
      <circle cx="127" cy="113" r="7.5" fill="#F4A19C" opacity=".5" />
      <Eye cx={84} cy={96} expr={expr} />
      <Eye cx={116} cy={96} expr={expr} />
      <path d={browL} stroke={HAIR} strokeWidth="3" fill="none" strokeLinecap="round" />
      <path d={browR} stroke={HAIR} strokeWidth="3" fill="none" strokeLinecap="round" />
      <path d="M97 106 Q100 110 103 106" stroke={SKIN_D} strokeWidth="2.2" fill="none" strokeLinecap="round" />
      <Mouth expr={expr} />

      {/* شعر قدّام */}
      <g fill={HAIR}>
        {[[72, 57, 12], [88, 51, 13], [104, 50, 13], [120, 53, 12], [133, 61, 10]].map(([x, y, r], i) => (
          <circle key={i} cx={x} cy={y} r={r} />
        ))}
        {[[58, 80, 11], [142, 80, 11], [55, 98, 9], [145, 98, 9]].map(([x, y, r], i) => (
          <circle key={"s" + i} cx={x} cy={y} r={r} />
        ))}
      </g>
      <g fill={HAIR_L} opacity=".5">
        <circle cx="86" cy="48" r="4" />
        <circle cx="118" cy="50" r="4" />
        <circle cx="58" cy="76" r="3.5" />
      </g>
      <Clip x={64} y={52} c="#F28CB1" />
      <Clip x={138} y={58} c="#C9A8EE" />
      <Clip x={98} y={36} c="#FFD84D" />
    </g>
  );
}

function SideHero({ expression, pose }) {
  const walking = pose === "walk";
  const open = expression === "excited" || expression === "laughing";
  return (
    <g>
      {/* شعر ورا */}
      <g fill={HAIR}>
        <ellipse cx="92" cy="90" rx="52" ry="58" />
        {[[50, 120, 15], [44, 146, 13], [54, 170, 11], [58, 100, 14]].map(([x, y, r], i) => (
          <circle key={i} cx={x} cy={y} r={r} />
        ))}
        {[[66, 46, 17], [86, 34, 18], [108, 36, 16], [50, 76, 15]].map(([x, y, r], i) => (
          <circle key={"t" + i} cx={x} cy={y} r={r} />
        ))}
      </g>
      {/* رجلين */}
      <g fill={SKIN}>
        <rect x={walking ? 84 : 96} y="262" width="10" height="42" rx="5" transform={walking ? "rotate(14 90 266)" : ""} />
        <rect x={walking ? 106 : 100} y="262" width="10" height="42" rx="5" transform={walking ? "rotate(-14 111 266)" : ""} />
      </g>
      <ellipse cx={walking ? 75 : 102} cy="306" rx="15" ry="7.5" fill={PINK} stroke="#E58EAD" strokeWidth="1.5" transform={walking ? "rotate(14 90 266)" : ""} />
      <ellipse cx={walking ? 126 : 106} cy="306" rx="15" ry="7.5" fill={PINK} stroke="#E58EAD" strokeWidth="1.5" transform={walking ? "rotate(-14 111 266)" : ""} />
      {/* تنورة */}
      <path d="M84 190 Q52 214 40 268 Q92 290 154 268 Q150 214 118 190 Z" fill="#FFEEA6" stroke="#EBD07F" strokeWidth="1.5" />
      <path d="M72 204 Q54 232 46 266 Q100 292 148 266 Q144 232 124 204 Q100 216 72 204 Z" fill={DRESS_L} opacity=".75" />
      {Array.from({ length: 6 }).map((_, i) => {
        const x = 50 + i * 20;
        return <circle key={i} cx={x} cy={270 + 12 * Math.sin((i / 5) * Math.PI)} r="10.5" fill={DRESS_L} stroke="#EBD07F" strokeWidth="1.2" />;
      })}
      {[[72, 240], [104, 252], [130, 238], [90, 266]].map(([x, y], i) => (
        <Sparkle key={i} x={x} y={y} s={1} />
      ))}
      {/* صدر + فيونكة ورا */}
      <path d="M84 146 Q100 154 118 146 L122 193 Q102 200 82 193 Z" fill={DRESS} stroke="#EBD07F" strokeWidth="1.5" />
      <rect x="81" y="188" width="42" height="7" rx="3.5" fill="#F2D77A" />
      <g transform="translate(76 184)">
        <path d="M0 0 L-24 -12 Q-30 2 -22 14 Z" fill="#F28CB1" stroke="#D96C97" strokeWidth="1.5" strokeLinejoin="round" />
        <path d="M0 0 L-18 22 L-6 28 L4 8 Z" fill="#F7A6C3" stroke="#D96C97" strokeWidth="1.5" strokeLinejoin="round" />
        <circle cx="0" cy="0" r="6" fill="#F7A6C3" stroke="#D96C97" strokeWidth="1.5" />
      </g>
      {/* دراع */}
      <path d={walking ? "M102 152 Q124 164 134 186" : "M102 152 Q112 178 108 202"} stroke={SKIN} strokeWidth="9.5" strokeLinecap="round" fill="none" />
      <circle cx={walking ? 135 : 108} cy={walking ? 191 : 207} r="6.2" fill={SKIN} />
      <ellipse cx="102" cy="150" rx="10" ry="9" fill="#FFF6CF" stroke="#EBD07F" strokeWidth="1.5" />
      {/* رقبة وراس */}
      <rect x="95" y="126" width="18" height="24" rx="8" fill={SKIN} />
      <path d="M110 148 Q116 154 114 160" stroke={GOLD} strokeWidth="1.8" fill="none" />
      <path d="M114 168 C108 163 106 158 110 157 C113 156 114 159 114 159 C114 159 115 156 118 157 C122 159 120 163 114 168 Z" fill="#F28CB1" />
      <ellipse cx="104" cy="92" rx="36" ry="43" fill={SKIN} />
      <circle cx="141" cy="101" r="4.6" fill={SKIN} />
      <ellipse cx="88" cy="100" rx="6" ry="9" fill={SKIN_D} />
      <circle cx="88" cy="109" r="2.4" fill={GOLD} />
      <circle cx="124" cy="113" r="7.5" fill="#F4A19C" opacity=".5" />
      <ellipse cx="121" cy="95" rx="6.6" ry="10" fill="#fff" />
      <circle cx="123" cy="95" r="7" fill="#A5702F" />
      <circle cx="123.5" cy="95" r="4.8" fill="#7A4A1E" />
      <circle cx="124" cy="95" r="3" fill="#24120A" />
      <circle cx="121.6" cy="92" r="2" fill="#fff" />
      <path d="M113 91 Q122 80 130 91" stroke="#3A2312" strokeWidth="2.6" fill="none" strokeLinecap="round" />
      <path d="M112 80 Q122 73 131 80" stroke={HAIR} strokeWidth="3" fill="none" strokeLinecap="round" />
      {open ? (
        <path d="M116 113 Q126 133 136 113 Q126 118 116 113 Z" fill="#8E2F2F" />
      ) : (
        <path d="M116 116 Q126 128 136 115" stroke="#A24B3A" strokeWidth="3.2" fill="none" strokeLinecap="round" />
      )}
      {/* شعر قدّام */}
      <g fill={HAIR}>
        {[[82, 56, 13], [100, 50, 13], [118, 54, 12], [132, 62, 9], [72, 74, 11], [70, 96, 11]].map(([x, y, r], i) => (
          <circle key={i} cx={x} cy={y} r={r} />
        ))}
      </g>
      <Clip x={78} y={56} c="#F28CB1" />
      <Clip x={106} y={40} c="#FFD84D" />
      <Clip x={68} y={84} c="#C9A8EE" />
    </g>
  );
}

/**
 * Hero
 *  expression: happy | excited | thinking | surprised | laughing
 *  pose      : stand | wave | hug | explore | focus | celebrate | walk (للجانب)
 *  facing    : front | side
 *  crop      : full | bust
 */
export default function Hero({ expression = "happy", pose = "stand", facing = "front", withBunny = false, crop = "full", className = "", flip = false }) {
  const vb = crop === "bust" ? "28 14 144 186" : "0 0 200 320";
  return (
    <svg
      viewBox={vb}
      className={`hero ${className}`}
      role="img"
      aria-label={HERO_NAME}
      focusable="false"
      style={flip ? { transform: "scaleX(-1)" } : undefined}
    >
      {facing === "side" ? <SideHero expression={expression} pose={pose} /> : <FrontHero expression={expression} pose={pose} withBunny={withBunny} />}
    </svg>
  );
}
