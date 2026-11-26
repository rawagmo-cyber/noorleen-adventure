import React, { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import Hero from "./Hero.jsx";

// صور نورلين: public/images/noorleen/{idle,happy,encourage}.png
//  - idle: الحالة الافتراضية | happy: إجابة صح والمكافأة | encourage: إجابة غلط (تشجيع هادي)
//  - think: وش بيفكّر (بتظهر في شاشات الأسئلة أثناء ما الطفلة بتختار). لو ناقصة بنستخدم idle.
// لو happy أو encourage ناقصة/فشلت: نستخدم idle بنفس حركة الحالة.
// لو idle نفسها ناقصة: نرجع لرسم الـ SVG القديم (احتياطي مؤقت لحد ما الصورة تتحط).
// عدّلي الامتداد هنا لو الصور webp/jpg.
const BASE = (import.meta.env && import.meta.env.BASE_URL) || "/";
const FILES = { idle: "idle.png", happy: "happy.png", encourage: "encourage.png", think: "think.png" };
const urlOf = (state) => `${BASE}images/noorleen/${FILES[state]}`;
export const HERO_STATES = Object.keys(FILES);

// ---- تحميل مسبق + حالة كل صورة (مشتركة بين كل النسخ في الشاشات)
let status = { idle: null, happy: null, encourage: null, think: null }; // null = لسه بيتحمّل، "ok"، "fail"
const subs = new Set();
const setStatus = (k, v) => {
  if (status[k] === v) return;
  status = { ...status, [k]: v };
  subs.forEach((cb) => cb());
};
const subscribe = (cb) => {
  subs.add(cb);
  return () => subs.delete(cb);
};
const getStatus = () => status;
let preloaded = false;
export function preloadHeroImages() {
  if (preloaded || typeof Image === "undefined") return;
  preloaded = true;
  HERO_STATES.forEach((k) => {
    const im = new Image();
    im.onload = () => setStatus(k, "ok");
    im.onerror = () => setStatus(k, "fail");
    im.src = urlOf(k);
  });
}
preloadHeroImages();

/** الحالة بتتغير للحظة (حوالي ٢ ثانية) وبعدين ترجع idle. pulse بيزيد كل مرة علشان الحركة تتعاد. */
export function useHeroState(base = "idle") {
  const [state, setState] = useState(base);
  const [pulse, setPulse] = useState(0);
  const timer = useRef(null);
  useEffect(() => () => clearTimeout(timer.current), []);
  const flash = useCallback((next, ms = 2000) => {
    clearTimeout(timer.current);
    setState(next);
    setPulse((p) => p + 1);
    if (next !== base) timer.current = setTimeout(() => setState(base), ms);
  }, [base]);
  return [state, flash, pulse];
}

const SVG_EXPR = { idle: "happy", happy: "excited", encourage: "thinking", think: "thinking" };

/**
 * شخصية نورلين. كل الشاشات بتستخدم الكومبوننت ده.
 * state: idle | happy | encourage — size: اسم الحجم (بيتظبط بـ CSS: nh-welcome, nh-q, nh-celebrate, nh-pin)
 */
export default function NoorleenHero({ state = "idle", pulse = 0, size = "q", fallbackCrop = "bust", className = "" }) {
  const st = useSyncExternalStore(subscribe, getStatus, getStatus);
  const wanted = HERO_STATES.includes(state) ? state : "idle";
  // think ناقصة: بنعرض idle بحجمه وحركته العادية (من غير تصغير ولا تدريج)
  const cssState = wanted === "think" && st.think === "fail" ? "idle" : wanted;
  const cls = `nh nh-${size} nh-s-${cssState} ${className}`.trim();

  // idle ناقصة: الرسم القديم (SVG)
  if (st.idle === "fail") {
    return (
      <span className={cls} data-fallback="svg">
        <Hero expression={SVG_EXPR[wanted]} crop={fallbackCrop} className="nh-svg" />
      </span>
    );
  }
  // الصورة المطلوبة فشلت: idle بنفس حركة الحالة
  const useState_ = st[wanted] === "fail" ? "idle" : wanted;
  return (
    <span className={cls} data-state={wanted}>
      <img
        key={`${useState_}-${pulse}`}
        className="nh-img"
        src={urlOf(useState_)}
        alt=""
        draggable={false}
        decoding="async"
        onError={() => setStatus(useState_, "fail")}
      />
    </span>
  );
}
