// خدمة الصوت الوحيدة في اللعبة: بتشغّل ملفات mp3 الجاهزة من public/audio.
// - المرجع الوحيد للمفاتيح والنصوص: src/audio/manifest.json
// - playClips(keys) بتلغي أي تشغيل جاري وبتشغّل المقاطع ورا بعض (بتستنى حدث ended، مش مدة ثابتة).
// - لو مفتاح ناقص أو ملف فشل: بنتخطاه بصمت (تحذير في الكونسول بس).
// - speechSynthesis احتياطي صامت: بيتستخدم بس لو ملف mp3 فشل يتحمّل أو التشغيل اترفض لسبب غير القفل،
//   ولو مفيش صوت عربي في الجهاز مفيش أي حاجة بتحصل واللعبة بتكمّل.

import manifestJson from "./manifest.json";

const manifest: Record<string, string> = manifestJson as Record<string, string>;

// لو اللعبة اتنشرت على مسار فرعي، BASE_URL بيتحط قدام المسار
const BASE: string = (import.meta as any).env?.BASE_URL ?? "/";
const clipUrl = (key: string) => `${BASE}audio/${key}.mp3`;

const GAP_MS = 90; // فاصل صغير بين المقاطع (70–120 م.ث) علشان الجملة تتسمع متصلة
const START_TIMEOUT_MS = 6000; // لو المقطع ما بدأش خالص (ملف بطيء/معطوب) نكمّل بدل ما نتعلق

export type PlayResult = { ok: boolean; cancelled?: boolean; deferred?: boolean };

// ---------------------------------------------------------------- تحذيرات (مرة واحدة لكل مفتاح)
const warned = new Set<string>();
function warnOnce(msg: string) {
  if (warned.has(msg)) return;
  warned.add(msg);
  // eslint-disable-next-line no-console
  console.warn("[audio] " + msg);
}

export const hasClip = (key: string) => Object.prototype.hasOwnProperty.call(manifest, key);
/** النص العربي اللي في المقطع (للعرض فقط، ما بيتنطقش بالـ TTS إلا في الاحتياطي) */
export const clipText = (key: string): string => manifest[key] || "";

// ---------------------------------------------------------------- حالة التشغيل
type El = HTMLAudioElement & { _key?: string };
let els: El[] = [];
let runId = 0; // كل playClips جديدة بتزوّده، فأي تشغيل قديم بيقف
let unlocked = false;
let pending: { keys: string[]; run: number } | null = null; // اللي اتطلب قبل فتح الصوت
let lastInstruction: string[] = []; // آخر سلسلة تعليمات اتشغلت (لزر "اسمعي التعليمات تاني")
let cancelHook: (() => void) | null = null;
let speaking = false;
const speakingListeners = new Set<(v: boolean) => void>();

function setSpeaking(v: boolean) {
  if (speaking === v) return;
  speaking = v;
  speakingListeners.forEach((cb) => cb(v));
}
export function onSpeakingChange(cb: (v: boolean) => void) {
  speakingListeners.add(cb);
  return () => speakingListeners.delete(cb);
}
export const isSpeaking = () => speaking;
export const isUnlocked = () => unlocked;

function pool(): El[] {
  if (!els.length && typeof Audio !== "undefined") {
    els = [new Audio() as El, new Audio() as El];
    els.forEach((e) => {
      e.preload = "auto";
    });
  }
  return els;
}

// ---------------------------------------------------------------- فتح الصوت (أول لمسة)
function silentWav(): string {
  const n = 200;
  const bytes = new Uint8Array(44 + n);
  const dv = new DataView(bytes.buffer);
  const w = (o: number, s: string) => [...s].forEach((c, i) => dv.setUint8(o + i, c.charCodeAt(0)));
  w(0, "RIFF");
  dv.setUint32(4, 36 + n, true);
  w(8, "WAVEfmt ");
  dv.setUint32(16, 16, true);
  dv.setUint16(20, 1, true);
  dv.setUint16(22, 1, true);
  dv.setUint32(24, 8000, true);
  dv.setUint32(28, 8000, true);
  dv.setUint16(32, 1, true);
  dv.setUint16(34, 8, true);
  w(36, "data");
  dv.setUint32(40, n, true);
  bytes.fill(128, 44); // سكون
  let bin = "";
  bytes.forEach((b) => (bin += String.fromCharCode(b)));
  return "data:audio/wav;base64," + btoa(bin);
}
let SILENT = "";

/**
 * لازم تتنده جوه معالج ضغطة/لمسة المستخدم. بتفتح عناصر الصوت (play ثم pause لكل عنصر)
 * وبتعلّم إن الصوت اتفتح. أي مقطع اتطلب قبل كده بيتأجل لحد دلوقتي.
 */
export function unlockAudio(): void {
  if (typeof window === "undefined") return;
  unlocked = true; // متفائلين: لو play() اترفض بعد كده بنرجع نقفل ونأجّل (شوفي playOne)
  try {
    if (!SILENT) SILENT = silentWav();
    pool().forEach((el) => {
      if (el._key && el._key !== "__silent" && !el.paused) return; // عنصر شغال فعلًا
      el._key = "__silent";
      el.src = SILENT;
      const p = el.play();
      if (p && p.then) {
        p.then(() => {
          if (el._key === "__silent") el.pause();
        }).catch(() => {
          /* لو اترفض هيتجرب تاني عند أول لمسة بعدها */
        });
      }
    });
  } catch (e) {
    warnOnce("unlock failed: " + String(e));
  }
}

// لو الصوت اتقفل تاني (refresh أو رجوع من الخلفية): أول لمسة بعدها بتفتحه وتكمّل اللي كان مستني
function onGesture() {
  if (unlocked) return;
  unlockAudio();
  flushPending();
}
if (typeof window !== "undefined") {
  ["pointerup", "touchend", "click", "keydown"].forEach((ev) => window.addEventListener(ev, onGesture, { capture: true, passive: true }));
}

function flushPending() {
  if (pending && pending.run === runId && unlocked) {
    const p = pending;
    pending = null;
    void runSequence(p.keys, p.run);
  }
}

// ---------------------------------------------------------------- تحميل مسبق (للمرحلة الحالية بس)
let warm: HTMLAudioElement[] = [];
export function preloadClips(keys: string[]) {
  if (typeof Audio === "undefined") return;
  warm = []; // نسيب القديم للـ GC
  const seen = new Set<string>();
  keys.forEach((k) => {
    if (!k || seen.has(k)) return;
    seen.add(k);
    if (!hasClip(k)) return;
    const a = new Audio();
    a.preload = "auto";
    a.src = clipUrl(k);
    warm.push(a); // ما بنشغّلهاش: بس بتسخّن الكاش علشان التشغيل الفعلي يبقى فوري
  });
}

// ---------------------------------------------------------------- الاحتياطي الصامت (speechSynthesis)
const synth: SpeechSynthesis | null = typeof window !== "undefined" && "speechSynthesis" in window ? window.speechSynthesis : null;
let arVoice: SpeechSynthesisVoice | null = null;
function refreshVoice() {
  if (!synth) return;
  const ar = (synth.getVoices() || []).filter((v) => /^ar([-_]|$)/i.test(v.lang || ""));
  const norm = (v: SpeechSynthesisVoice) => (v.lang || "").replace("_", "-").toLowerCase();
  arVoice = ar.find((v) => norm(v) === "ar-eg") || ar[0] || null;
}
if (synth) {
  refreshVoice();
  try {
    synth.addEventListener("voiceschanged", refreshVoice);
  } catch (_) {
    /* ignore */
  }
}

/** بينطق نص بصوت الجهاز لو فيه صوت عربي. لو مفيش: بيرجع فورًا من غير أي حاجة. */
function speakDevice(text: string, run: number | null): Promise<void> {
  return new Promise((resolve) => {
    if (!synth || !arVoice || !text || typeof SpeechSynthesisUtterance === "undefined") return resolve();
    let done = false;
    let t: ReturnType<typeof setTimeout> | undefined;
    const fin = () => {
      if (done) return;
      done = true;
      clearTimeout(t);
      resolve();
    };
    try {
      synth.cancel();
      const u = new SpeechSynthesisUtterance(text);
      u.voice = arVoice;
      u.lang = arVoice.lang;
      u.rate = 0.8;
      u.onend = fin;
      u.onerror = fin;
      u.onstart = () => clearTimeout(t);
      synth.speak(u);
      // لو ما بدأش خالص ما نتعلقش
      t = setTimeout(() => {
        try {
          synth.cancel();
        } catch (_) {
          /* ignore */
        }
        fin();
      }, 4000);
      if (run !== null) {
        const prev = cancelHook;
        cancelHook = () => {
          try {
            synth.cancel();
          } catch (_) {
            /* ignore */
          }
          fin();
          prev && prev();
        };
      }
    } catch (_) {
      fin();
    }
  });
}

/** صوت حرف معتمد من ولي الأمر (مفيش له مقطع جاهز، فبيتنطق بصوت الجهاز لو موجود) */
export function speakDeviceText(text: string): Promise<void> {
  stopAudio();
  const run = ++runId;
  return speakDevice(text, run);
}

// ---------------------------------------------------------------- تشغيل مقطع واحد
type Outcome = "ended" | "error" | "cancelled" | "blocked";

function playOne(el: El, key: string, run: number): Promise<Outcome> {
  return new Promise((resolve) => {
    let settled = false;
    let startTimer: ReturnType<typeof setTimeout> | undefined;
    let ourPause = false;
    const onEnded = () => done("ended");
    const onError = () => done("error");
    const onPlaying = () => {
      clearTimeout(startTimer);
      unlocked = true;
      setSpeaking(true);
    };
    // مقاطعة من النظام (مكالمة مثلًا): نعتبر المقطع خلص ونكمّل
    // (حدث pause قديم ممكن يوصل متأخر بعد ما نبدأ تشغيل جديد على نفس العنصر، فبنتجاهله لو العنصر شغال)
    const onPause = () => {
      if (!ourPause && el.paused && !el.ended) done("ended");
    };
    const cleanup = () => {
      el.removeEventListener("ended", onEnded);
      el.removeEventListener("error", onError);
      el.removeEventListener("playing", onPlaying);
      el.removeEventListener("pause", onPause);
      clearTimeout(startTimer);
      if (cancelHook === hook) cancelHook = null;
    };
    const done = (r: Outcome) => {
      if (settled) return;
      settled = true;
      cleanup();
      resolve(r);
    };
    const hook = () => {
      ourPause = true;
      try {
        el.pause();
      } catch (_) {
        /* ignore */
      }
      done("cancelled");
    };
    cancelHook = hook;
    el.addEventListener("ended", onEnded);
    el.addEventListener("error", onError);
    el.addEventListener("playing", onPlaying);
    el.addEventListener("pause", onPause);
    try {
      if (el._key !== key) {
        el.src = clipUrl(key);
        el._key = key;
      } else {
        el.currentTime = 0;
      }
      const p = el.play();
      if (p && p.catch) {
        p.catch((err: any) => {
          if (run !== runId) return done("cancelled");
          if (err && err.name === "NotAllowedError") return done("blocked");
          if (err && err.name === "AbortError") return done("cancelled"); // اتقاطع بتحميل أحدث
          done("error");
        });
      }
    } catch (_) {
      done("error");
      return;
    }
    startTimer = setTimeout(() => done("error"), START_TIMEOUT_MS);
  });
}

const sleep = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));

async function runSequence(keys: string[], run: number): Promise<PlayResult> {
  const elements = pool();
  if (!elements.length) return { ok: false };
  let anyOk = false;
  for (let i = 0; i < keys.length; i++) {
    if (run !== runId) return { ok: false, cancelled: true };
    const key = keys[i];
    const el = elements[i % 2];
    // نجهّز المقطع الجاي في العنصر التاني علشان الفاصل يبقى صغير فعلًا
    const next = keys[i + 1];
    if (next && elements.length > 1) {
      const other = elements[(i + 1) % 2];
      if (other._key !== next) {
        other._key = next;
        other.src = clipUrl(next);
      }
    }
    const r = await playOne(el, key, run);
    if (run !== runId || r === "cancelled") return { ok: false, cancelled: true };
    if (r === "blocked") {
      // الصوت اتقفل تاني: نأجّل الباقي لحد أول لمسة
      unlocked = false;
      pending = { keys: keys.slice(i), run };
      setSpeaking(false);
      return { ok: false, deferred: true };
    }
    if (r === "error") {
      warnOnce(`clip failed: ${key} (${clipUrl(key)})`);
      el._key = undefined; // ما نعيدش استخدام عنصر باظ
      await speakDevice(clipText(key), run); // احتياطي صامت: لو مفيش صوت عربي بيرجع فورًا
      if (run !== runId) return { ok: false, cancelled: true };
    } else {
      anyOk = true;
    }
    if (i < keys.length - 1) {
      await sleep(GAP_MS);
    }
  }
  if (run === runId) setSpeaking(false);
  return { ok: anyOk };
}

// ---------------------------------------------------------------- واجهة اللعبة
/** بتوقف أي صوت شغال فورًا (من غير ما تشغّل حاجة جديدة) */
export function stopAudio() {
  runId++;
  pending = null;
  const h = cancelHook;
  cancelHook = null;
  if (h) h();
  pool().forEach((el) => {
    try {
      if (!el.paused) el.pause();
    } catch (_) {
      /* ignore */
    }
  });
  try {
    synth && synth.cancel();
  } catch (_) {
    /* ignore */
  }
  setSpeaking(false);
}
export const cancel = stopAudio;

/**
 * بتلغي أي تشغيل جاري وبتشغّل المقاطع بالترتيب. الـ Promise بتتحل لما السلسلة تخلص (أو تتلغي).
 * instruction=true: السلسلة دي هي تعليمات السؤال الحالي، فزر "اسمعي التعليمات تاني" يعيدها.
 */
export function playClips(keys: string[], opts: { instruction?: boolean } = {}): Promise<PlayResult> {
  stopAudio();
  const run = runId; // stopAudio زوّد الرقم
  const valid: string[] = [];
  for (const k of keys || []) {
    if (!k) continue;
    if (!hasClip(k)) {
      warnOnce(`missing key in manifest: ${k}`);
      continue;
    }
    valid.push(k);
  }
  if (opts.instruction) lastInstruction = valid.slice();
  if (!valid.length) return Promise.resolve({ ok: true });
  if (!unlocked) {
    pending = { keys: valid, run };
    return Promise.resolve({ ok: false, deferred: true });
  }
  return runSequence(valid, run);
}

/** نفس سلسلة التعليمات اللي اتشغلت آخر مرة (من غير ما نبنيها من جديد) */
export function replayInstruction(): Promise<PlayResult> {
  return playClips(lastInstruction, { instruction: true });
}
export const getLastInstruction = () => lastInstruction.slice();

/** للاختبار: كل المفاتيح */
export const allClipKeys = () => Object.keys(manifest);
