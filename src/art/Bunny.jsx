import React from "react";

// الأرنب الأبيض الدمية: ودان من جوه وردي + فيونكة وردي. رفيق المغامرة ويساعد في التلميحات.
export function BunnyBody({ mood = "happy" }) {
  const eyes =
    mood === "sleepy" ? (
      <g stroke="#4A2C1A" strokeWidth="3" strokeLinecap="round" fill="none">
        <path d="M42 74 Q48 79 54 74" />
        <path d="M66 74 Q72 79 78 74" />
      </g>
    ) : (
      <g fill="#3A2214">
        <circle cx="48" cy="74" r="4.4" />
        <circle cx="72" cy="74" r="4.4" />
        <circle cx="49.4" cy="72.6" r="1.4" fill="#fff" />
        <circle cx="73.4" cy="72.6" r="1.4" fill="#fff" />
      </g>
    );
  return (
    <g>
      {/* ودان */}
      <g className="bunny-ear-l">
        <ellipse cx="42" cy="28" rx="13" ry="30" fill="#FFFDFB" stroke="#EADDE2" strokeWidth="2" transform="rotate(-8 42 28)" />
        <ellipse cx="42" cy="30" rx="6.5" ry="21" fill="#F9C6D4" transform="rotate(-8 42 30)" />
      </g>
      <g className="bunny-ear-r">
        <ellipse cx="78" cy="28" rx="13" ry="30" fill="#FFFDFB" stroke="#EADDE2" strokeWidth="2" transform="rotate(8 78 28)" />
        <ellipse cx="78" cy="30" rx="6.5" ry="21" fill="#F9C6D4" transform="rotate(8 78 30)" />
      </g>
      {/* جسم ورجلين */}
      <ellipse cx="60" cy="122" rx="27" ry="24" fill="#FFFDFB" stroke="#EADDE2" strokeWidth="2" />
      <ellipse cx="42" cy="142" rx="12" ry="7" fill="#FFFDFB" stroke="#EADDE2" strokeWidth="2" />
      <ellipse cx="78" cy="142" rx="12" ry="7" fill="#FFFDFB" stroke="#EADDE2" strokeWidth="2" />
      <ellipse cx="42" cy="143" rx="6" ry="3.6" fill="#F9C6D4" />
      <ellipse cx="78" cy="143" rx="6" ry="3.6" fill="#F9C6D4" />
      {/* راس */}
      <circle cx="60" cy="78" r="31" fill="#FFFDFB" stroke="#EADDE2" strokeWidth="2" />
      <circle cx="38" cy="86" r="6" fill="#F9B8CA" opacity=".6" />
      <circle cx="82" cy="86" r="6" fill="#F9B8CA" opacity=".6" />
      {eyes}
      <path d="M55 83 Q60 80 65 83 Q60 89 55 83 Z" fill="#F28CB1" />
      <path d="M60 88 Q57 93 52 91 M60 88 Q63 93 68 91" stroke="#B5788A" strokeWidth="2" fill="none" strokeLinecap="round" />
      {/* فيونكة وردي */}
      <path d="M60 104 L38 94 Q34 106 38 116 Z" fill="#F28CB1" stroke="#D96C97" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M60 104 L82 94 Q86 106 82 116 Z" fill="#F28CB1" stroke="#D96C97" strokeWidth="1.5" strokeLinejoin="round" />
      <circle cx="60" cy="105" r="5.5" fill="#F7A6C3" stroke="#D96C97" strokeWidth="1.5" />
    </g>
  );
}

export default function Bunny({ mood = "happy", className = "", title = "الأرنب" }) {
  return (
    <svg viewBox="0 0 120 150" className={className} role="img" aria-label={title} focusable="false">
      <BunnyBody mood={mood} />
    </svg>
  );
}
