import React, { useCallback, useEffect, useRef, useState } from "react";
import { cancel } from "../audio/audioService.ts";
import { sfxTap } from "../services/sfx.js";
import { IconSpeaker, IconMap, IconStar, IconParent, IconWarn } from "../art/Icons.jsx";
import { WordArt } from "../art/Words.jsx";
import { ItemArt, ColorThing } from "../art/Items.jsx";
import { ShapeArt } from "../art/Shapes.jsx";
import { LETTER_BY_CHAR } from "../data/letters.js";
import { COLOR_BY_ID } from "../data/colorsShapes.js";
import { NUMBER_BY_VALUE, ITEM_BY_ID } from "../data/numbers.js";
import { useGame } from "../state/GameContext.jsx";

export const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// زر سماعة (ثابت المكان) — بيعيد التعليمات، ومش بيتقفل حتى لو الصوت فشل
export function SpeakerButton({ onClick, label = "اسمعي التعليمات تاني", className = "" }) {
  return (
    <button type="button" className={`btn-round speaker ${className}`} onClick={onClick} aria-label={label}>
      <IconSpeaker size={40} />
    </button>
  );
}

// زر مصوّر مسموع للرجوع للخريطة: بيقول "الخريطة" وبعدين بيروح
export function MapButton({ onGo, label = "الخريطة", className = "" }) {
  const busy = useRef(false);
  const go = () => {
    if (busy.current) return;
    busy.current = true;
    sfxTap();
    onGo();
  };
  return (
    <button type="button" className={`btn-round map-btn ${className}`} onClick={go} aria-label={label}>
      <IconMap size={40} />
    </button>
  );
}

export function ProgressDots({ total, current, label }) {
  return (
    <div className="dots" role="img" aria-label={label || `السؤال ${current + 1} من ${total}`}>
      {Array.from({ length: total }).map((_, i) => (
        <span key={i} className={`dot ${i < current ? "done" : i === current ? "now" : ""}`}>
          <IconStar size={i === current ? 30 : 24} filled={i < current} />
        </span>
      ))}
    </div>
  );
}

// ---------- دخول الأهل: ضغطة مطولة ٣ ثواني + تأكيد ----------
export function ParentGateButton({ onOpen, className = "" }) {
  const [holding, setHolding] = useState(false);
  const [confirm, setConfirm] = useState(false);
  const timer = useRef(null);
  const start = () => {
    clearTimeout(timer.current);
    setHolding(true);
    timer.current = setTimeout(() => {
      setHolding(false);
      setConfirm(true);
    }, 3000);
  };
  const stop = () => {
    clearTimeout(timer.current);
    setHolding(false);
  };
  useEffect(() => () => clearTimeout(timer.current), []);
  return (
    <>
      <button
        type="button"
        className={`parent-gate ${holding ? "holding" : ""} ${className}`}
        aria-label="للأهل: اضغطي مطولًا ٣ ثواني"
        onPointerDown={start}
        onPointerUp={stop}
        onPointerLeave={stop}
        onPointerCancel={stop}
        onContextMenu={(e) => e.preventDefault()}
        onKeyDown={(e) => {
          if ((e.key === "Enter" || e.key === " ") && !e.repeat) {
            e.preventDefault();
            start();
          }
        }}
        onKeyUp={(e) => {
          if (e.key === "Enter" || e.key === " ") stop();
        }}
        onBlur={stop}
      >
        <svg className="gate-ring" viewBox="0 0 44 44" aria-hidden="true">
          <circle cx="22" cy="22" r="19" />
        </svg>
        <IconParent size={24} />
      </button>
      {confirm && (
        <ConfirmDialog
          title="للأهل فقط"
          text="هل أنتِ ولي الأمر؟ الشاشة الجاية فيها إعدادات وتقدّم الطفلة."
          yes="أيوه، أنا ولي الأمر"
          no="لا، رجوع"
          onYes={() => {
            setConfirm(false);
            onOpen();
          }}
          onNo={() => setConfirm(false)}
        />
      )}
    </>
  );
}

export function ConfirmDialog({ title, text, yes, no, onYes, onNo, danger = false }) {
  const ref = useRef(null);
  useEffect(() => {
    ref.current && ref.current.focus();
  }, []);
  return (
    <div className="overlay" role="presentation">
      <div className="dialog" role="dialog" aria-modal="true" aria-labelledby="dlg-title" tabIndex={-1} ref={ref}>
        <h2 id="dlg-title">{title}</h2>
        <p>{text}</p>
        <div className="dialog-actions">
          <button type="button" className={`pbtn ${danger ? "danger" : "primary"}`} onClick={onYes}>
            {yes}
          </button>
          <button type="button" className="pbtn" onClick={onNo}>
            {no}
          </button>
        </div>
      </div>
    </div>
  );
}

// ---------- مجموعات العدّ ----------
const colsFor = (v) => (v <= 5 ? v : Math.ceil(v / 2));

export function QtyGroup({ value, item, className = "" }) {
  const it = ITEM_BY_ID[item];
  return (
    <div className={`qty ${className}`} style={{ "--cols": colsFor(value), "--rows": value <= 5 ? 1 : 2 }} role="img" aria-label={`${NUMBER_BY_VALUE[value].numeral} ${it.plural}`}>
      {Array.from({ length: value }).map((_, i) => (
        <ItemArt key={i} art={it.art} className="qty-item" />
      ))}
    </div>
  );
}

// عدّ باللمس: كل عنصر بيتحسب مرة واحدة (counted = Set). lit = العنصر المنوّر في العدّ الصوتي.
export function CountGroup({ value, item, counted, lit = -1, onTap, big = false }) {
  const it = ITEM_BY_ID[item];
  return (
    <div className={`qty count-group ${big ? "big" : ""}`} style={{ "--cols": colsFor(value), "--rows": value <= 5 ? 1 : 2 }} role="group" aria-label={`عدّي ${it.plural}`}>
      {Array.from({ length: value }).map((_, i) => {
        const order = counted ? counted.indexOf(i) : -1;
        return (
          <button
            type="button"
            key={i}
            className={`count-item ${order >= 0 ? "counted" : ""} ${lit === i ? "lit" : ""}`}
            onClick={() => onTap && onTap(i)}
            aria-label={order >= 0 ? `اتعدّت ${order + 1}` : `${it.one}`}
          >
            <ItemArt art={it.art} className="qty-item" />
            {order >= 0 && <span className="count-badge">{NUMBER_BY_VALUE[order + 1].numeral}</span>}
          </button>
        );
      })}
    </div>
  );
}

// ---------- محتوى كارت الاختيار (حرف/صورة/رقم/كمية/لون/شكل) ----------
export function TileContent({ kind, val: r, item }) {
  switch (kind) {
    case "letter":
      return <span className="glyph">{LETTER_BY_CHAR[r].char}</span>;
    case "word":
      return <WordArt art={LETTER_BY_CHAR[r].art} className="tile-art" />;
    case "numeral":
      return <span className="glyph">{NUMBER_BY_VALUE[r].numeral}</span>;
    case "qty":
      return <QtyGroup value={r} item={item} />;
    case "swatch":
      return <span className="swatch" style={{ background: COLOR_BY_ID[r].hex }} />;
    case "thing":
      return <ColorThing colorId={r} className="tile-art" />;
    case "shape":
      return <ShapeArt shape={r} className="tile-art" />;
    case "shapeOutline":
      return <ShapeArt shape={r} outline className="tile-art" />;
    default:
      return null;
  }
}

export function tileLabel(kind, r) {
  switch (kind) {
    case "letter":
      return `حرف ${LETTER_BY_CHAR[r].name}`;
    case "word":
      return `صورة ${LETTER_BY_CHAR[r].word}`;
    case "numeral":
      return `رقم ${NUMBER_BY_VALUE[r].numeral}`;
    case "qty":
      return `مجموعة صور`;
    case "swatch":
      return `بقعة لون`;
    case "thing":
      return `صورة شيء`;
    case "shape":
    case "shapeOutline":
      return `شكل`;
    default:
      return "";
  }
}

// تلميح بصري صغير بيظهر جنب الأرنب
export function ModelCard({ model }) {
  if (!model) return null;
  const { kind, ref: r, item } = model;
  switch (kind) {
    case "letterWord":
      return (
        <div className="model">
          <span className="glyph sm">{LETTER_BY_CHAR[r].char}</span>
          <WordArt art={LETTER_BY_CHAR[r].art} className="model-art" />
        </div>
      );
    case "wordOnly":
      return (
        <div className="model">
          <WordArt art={LETTER_BY_CHAR[r].art} className="model-art" />
        </div>
      );
    case "numberItems":
    case "countHint":
      return (
        <div className="model">
          <span className="glyph sm">{NUMBER_BY_VALUE[r].numeral}</span>
          <QtyGroup value={r} item={item} className="mini" />
        </div>
      );
    case "colorThing":
      return (
        <div className="model">
          <span className="swatch sm" style={{ background: COLOR_BY_ID[r].hex }} />
          <ColorThing colorId={r} className="model-art" />
        </div>
      );
    case "swatchOnly":
      return (
        <div className="model">
          <span className="swatch sm" style={{ background: COLOR_BY_ID[r].hex }} />
        </div>
      );
    case "shapeCard":
      return (
        <div className="model">
          <ShapeArt shape={r} className="model-art" />
        </div>
      );
    default:
      return null;
  }
}

// تنفيذ كلام ثم انتظار حد أدنى (علشان الشاشة ما تفوتش لو المقطع اتخطى أو الصوت لسه مفتحش)
export async function speakAndWait(speakPromise, minMs = 900) {
  const t0 = Date.now();
  const res = await speakPromise;
  const left = minMs - (Date.now() - t0);
  if (left > 0) await sleep(left);
  return res;
}

export function useMounted() {
  const m = useRef(true);
  useEffect(() => {
    m.current = true;
    return () => {
      m.current = false;
    };
  }, []);
  return m;
}

export { cancel };
