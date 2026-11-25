import React from "react";

const Svg = ({ children, size = 32, ...p }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none" aria-hidden="true" focusable="false" {...p}>
    {children}
  </svg>
);
const stroke = { stroke: "currentColor", strokeWidth: 4, strokeLinecap: "round", strokeLinejoin: "round" };

export const IconPlay = (p) => (
  <Svg {...p}>
    <path d="M16 10 L38 24 L16 38 Z" fill="currentColor" stroke="currentColor" strokeWidth="4" strokeLinejoin="round" />
  </Svg>
);
export const IconSpeaker = (p) => (
  <Svg {...p}>
    <path d="M8 19 H15 L25 10 V38 L15 29 H8 Z" fill="currentColor" stroke="currentColor" strokeWidth="3" strokeLinejoin="round" />
    <path d="M31 17 Q36 24 31 31 M36 12 Q45 24 36 36" {...stroke} />
  </Svg>
);
export const IconMap = (p) => (
  <Svg {...p}>
    <path d="M6 12 L17 8 L31 12 L42 8 V36 L31 40 L17 36 L6 40 Z" fill="currentColor" fillOpacity=".15" {...stroke} />
    <path d="M17 8 V36 M31 12 V40" {...stroke} />
  </Svg>
);
export const IconHome = (p) => (
  <Svg {...p}>
    <path d="M7 24 L24 9 L41 24 M12 21 V39 H21 V28 H27 V39 H36 V21" {...stroke} />
  </Svg>
);
export const IconNext = (p) => (
  // سهم لليسار = "التالي" في الاتجاه العربي
  <Svg {...p}>
    <path d="M30 10 L16 24 L30 38" {...stroke} />
  </Svg>
);
export const IconLock = (p) => (
  <Svg {...p}>
    <rect x="10" y="21" width="28" height="19" rx="5" fill="currentColor" />
    <path d="M16 21 V15 A8 8 0 0 1 32 15 V21" {...stroke} />
  </Svg>
);
export const IconStar = ({ filled = true, ...p }) => (
  <Svg {...p}>
    <path d="M24 5 L30 18 L44 19.5 L33.5 29 L36.5 43 L24 36 L11.5 43 L14.5 29 L4 19.5 L18 18 Z" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="3" strokeLinejoin="round" />
  </Svg>
);
export const IconCheck = (p) => (
  <Svg {...p}>
    <path d="M10 25 L20 35 L38 13" {...stroke} strokeWidth="6" />
  </Svg>
);
export const IconParent = (p) => (
  <Svg {...p}>
    <circle cx="24" cy="15" r="8" fill="currentColor" />
    <path d="M8 42 Q8 26 24 26 Q40 26 40 42 Z" fill="currentColor" />
  </Svg>
);
export const IconMoon = (p) => (
  <Svg {...p}>
    <path d="M32 6 A18 18 0 1 0 42 32 A14 14 0 0 1 32 6 Z" fill="currentColor" />
  </Svg>
);
export const IconReplay = (p) => (
  <Svg {...p}>
    <path d="M12 24 A13 13 0 1 0 17 14 M12 8 V16 H20" {...stroke} />
  </Svg>
);
export const IconCount = (p) => (
  <Svg {...p}>
    <circle cx="10" cy="24" r="5" fill="currentColor" />
    <circle cx="24" cy="24" r="5" fill="currentColor" />
    <circle cx="38" cy="24" r="5" fill="currentColor" />
  </Svg>
);
export const IconSticker = (p) => (
  <Svg {...p}>
    <path d="M8 8 H32 L40 16 V40 H8 Z" fill="currentColor" fillOpacity=".18" {...stroke} />
    <path d="M32 8 V16 H40" {...stroke} />
    <path d="M24 22 L26.5 28 L33 28.5 L28 32.5 L29.5 39 L24 35.5 L18.5 39 L20 32.5 L15 28.5 L21.5 28 Z" fill="currentColor" />
  </Svg>
);
export const IconWarn = (p) => (
  <Svg {...p}>
    <path d="M24 6 L44 41 H4 Z" fill="currentColor" fillOpacity=".18" {...stroke} />
    <path d="M24 18 V29 M24 35 V36" {...stroke} />
  </Svg>
);
export const IconClose = (p) => (
  <Svg {...p}>
    <path d="M12 12 L36 36 M36 12 L12 36" {...stroke} />
  </Svg>
);
