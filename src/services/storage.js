// حفظ التقدم محليًا (localStorage) — من غير حساب ولا سيرفر.
// - رقم إصدار للبيانات + دمج مع الافتراضي علشان تحديث المحتوى ما يمسحش تقدم قديم.
// - JSON تالف: بنحتفظ بنسخة منه ونبدأ من جديد من غير ما اللعب يقف.
// - لو التخزين مش متاح/رافض: اللعب بيكمّل والتقدم مؤقت (storageOk=false).
import { STORAGE_KEY, DATA_VERSION } from "../config.js";

export const defaultState = () => ({
  version: DATA_VERSION,
  progress: {
    completed: {}, // levelId -> true
    stars: {}, // levelId -> true (نجمة واحدة لكل مرحلة)
    results: {}, // questionId -> {skills, firstTry, help, at}  (آخر نتيجة، مش مجموع)
    introduced: {}, // "letter:ب" -> true
    resume: null, // {levelId, qIndex}
    tutorialDone: false,
    soundChecked: false,
  },
  settings: {
    music: true,
    sfx: true,
    reduceMotion: "auto", // auto | on | off
    rate: 0.8,
    voiceURI: null,
    bunny: true,
    usePraiseName: true,
    assistedMode: false,
    unlockAll: false,
    approvedSounds: {}, // "ب" -> true بعد ما ولي الأمر يراجع صوت الحرف
    soundConfirmed: false,
  },
});

const isObj = (x) => x && typeof x === "object" && !Array.isArray(x);
function merge(base, extra) {
  if (!isObj(base) || !isObj(extra)) return extra === undefined ? base : extra;
  const out = { ...base };
  for (const k of Object.keys(extra)) out[k] = isObj(base[k]) && isObj(extra[k]) ? merge(base[k], extra[k]) : extra[k];
  return out;
}

export function storageAvailable() {
  try {
    const k = "__t__";
    window.localStorage.setItem(k, "1");
    window.localStorage.removeItem(k);
    return true;
  } catch (_) {
    return false;
  }
}

function migrate(data) {
  // مكان للترحيل بين الإصدارات في المستقبل. الإصدار ١ مفيش فيه حاجة قبله.
  return { ...data, version: DATA_VERSION };
}

// بترجع { state, storageOk, recovered }
export function loadState() {
  const fresh = defaultState();
  if (!storageAvailable()) return { state: fresh, storageOk: false, recovered: false };
  let raw = null;
  try {
    raw = window.localStorage.getItem(STORAGE_KEY);
  } catch (_) {
    return { state: fresh, storageOk: false, recovered: false };
  }
  if (!raw) return { state: fresh, storageOk: true, recovered: false };
  try {
    const parsed = JSON.parse(raw);
    if (!isObj(parsed) || !isObj(parsed.progress)) throw new Error("bad shape");
    const merged = merge(fresh, migrate(parsed));
    // تأكد إن الأنواع الأساسية سليمة
    for (const key of ["completed", "stars", "results", "introduced"]) {
      if (!isObj(merged.progress[key])) merged.progress[key] = {};
    }
    if (!isObj(merged.settings.approvedSounds)) merged.settings.approvedSounds = {};
    return { state: merged, storageOk: true, recovered: false };
  } catch (_) {
    try {
      window.localStorage.setItem(STORAGE_KEY + ":corrupt", raw);
    } catch (__) {
      /* ignore */
    }
    return { state: fresh, storageOk: true, recovered: true };
  }
}

// بترجع true لو الحفظ نجح
export function saveState(state) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    return true;
  } catch (_) {
    return false;
  }
}
