import React from "react";

// أشكال هندسية واضحة. لون واحد موحّد (إلا لو outline) ومساحات متقاربة علشان السؤال يقيس الشكل مش الحجم.
export const SHAPE_FILL = "#F29BB5";
export const SHAPE_STROKE = "#C2547E";

export function ShapeArt({ shape, className, outline = false }) {
  const common = outline
    ? { fill: "none", stroke: SHAPE_STROKE, strokeWidth: 6, strokeDasharray: "2 10", strokeLinecap: "round" }
    : { fill: SHAPE_FILL, stroke: SHAPE_STROKE, strokeWidth: 5, strokeLinejoin: "round" };
  let el = null;
  if (shape === "circle") el = <circle cx="60" cy="60" r="44" {...common} />;
  if (shape === "square") el = <rect x="22" y="22" width="76" height="76" rx="3" {...common} />;
  if (shape === "triangle") el = <path d="M60 14 L110 102 L10 102 Z" {...common} />;
  if (shape === "rectangle") el = <rect x="8" y="30" width="104" height="60" rx="3" {...common} />;
  return (
    <svg viewBox="0 0 120 120" className={className} aria-hidden="true" focusable="false">
      {el}
    </svg>
  );
}
