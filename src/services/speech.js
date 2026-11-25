// خدمة الصوت الوحيدة في اللعبة (Web Speech API).
// - ما بنستخدمش أي صوت غير عربي لنطق العربي أبدًا.
// - بنفضّل ar-EG، وإلا أي ar-*. لو مفيش: الحالة 'no-arabic-voice' واللعبة بتنبّه الأهل.
// - كل جملة جديدة بتلغي اللي قبلها (token)، وفي مهلة انتظار علشان اللعبة ما تتعلقش.

const win = typeof window !== "undefined" ? window : null;
const synth = win && "speechSynthesis" in win ? win.speechSynthesis : null;
const hasUtter = !!(win && "SpeechSynthesisUtterance" in win);
const AR_RE = /^ar([-_]|$)/i;

const state = {
  supported: !!(synth && hasUtter),
  voicesLoaded: false,
  voices: [], // كل الأصوات العربية المتاحة
  voice: null,
  preferredURI: null,
  rate: 0.8,
  failures: 0,
  forcedFailed: false,
  speaking: false,
};

const listeners = new Set();
const speakingListeners = new Set();
let token = 0;
let currentUtterance = null; // لازم نحتفظ بمرجع (Chrome بيشيل الـ utterance ويضيّع onend)
let graceTimer = null;

export function getStatus() {
  if (!state.supported) return "unsupported";
  if (!state.voicesLoaded) return "checking";
  if (!state.voice) return "no-arabic-voice";
  if (state.forcedFailed) return "failed";
  return "ok";
}
export function getInfo() {
  return {
    status: getStatus(),
    voiceName: state.voice ? state.voice.name : null,
    voiceLang: state.voice ? state.voice.lang : null,
    arabicVoices: state.voices.map((v) => ({ uri: v.voiceURI, name: v.name, lang: v.lang })),
    supported: state.supported,
  };
}
export function subscribe(cb) {
  listeners.add(cb);
  return () => listeners.delete(cb);
}
export function onSpeakingChange(cb) {
  speakingListeners.add(cb);
  return () => speakingListeners.delete(cb);
}
function notify() {
  listeners.forEach((cb) => cb(getInfo()));
}
function setSpeaking(v) {
  if (state.speaking === v) return;
  state.speaking = v;
  speakingListeners.forEach((cb) => cb(v));
}

function chooseVoice() {
  const ar = state.voices;
  if (!ar.length) return null;
  if (state.preferredURI) {
    const p = ar.find((v) => v.voiceURI === state.preferredURI);
    if (p) return p;
  }
  const norm = (v) => (v.lang || "").replace("_", "-").toLowerCase();
  return ar.find((v) => norm(v) === "ar-eg") || ar[0];
}

function refreshVoices() {
  if (!synth) return;
  const all = synth.getVoices() || [];
  if (all.length) {
    state.voicesLoaded = true;
    state.voices = all.filter((v) => AR_RE.test(v.lang || ""));
    state.voice = chooseVoice();
  }
  notify();
}

export function initSpeech() {
  if (!state.supported) {
    state.voicesLoaded = true;
    notify();
    return;
  }
  refreshVoices();
  const handler = () => refreshVoices();
  if (synth.addEventListener) synth.addEventListener("voiceschanged", handler);
  else synth.onvoiceschanged = handler;
  // القائمة ممكن تتأخر: نستنى شوية قبل ما نحكم إن مفيش صوت عربي
  clearTimeout(graceTimer);
  graceTimer = setTimeout(() => {
    if (!state.voicesLoaded) {
      state.voicesLoaded = true;
      notify();
    }
  }, 2500);
}

export function ensureVoices() {
  return new Promise((resolve) => {
    if (getStatus() !== "checking") return resolve(getStatus());
    const off = subscribe(() => {
      if (getStatus() !== "checking") {
        off();
        resolve(getStatus());
      }
    });
  });
}

export function setRate(r) {
  state.rate = r;
}
export function setPreferredVoice(uri) {
  state.preferredURI = uri || null;
  state.voice = chooseVoice();
  notify();
}
export function retryAudio() {
  state.failures = 0;
  state.forcedFailed = false;
  refreshVoices();
}

function stopNow() {
  if (!synth) return;
  try {
    synth.cancel();
  } catch (_) {
    /* ignore */
  }
  setSpeaking(false);
}

export function cancel() {
  token++;
  stopNow();
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

function recordFailure() {
  state.failures += 1;
  if (state.failures >= 2 && !state.forcedFailed) {
    state.forcedFailed = true;
    notify();
  }
}
function recordSuccess() {
  if (state.failures || state.forcedFailed) {
    state.failures = 0;
    state.forcedFailed = false;
    notify();
  }
}

// يقول جملة واحدة. بيرجع Promise دايمًا بيتحل (مش بيتعلق): {ok, reason}
function utter(text, myToken, opts = {}) {
  return new Promise((resolve) => {
    if (!state.supported) return resolve({ ok: false, reason: "unsupported" });
    if (!state.voice) return resolve({ ok: false, reason: "no-arabic-voice" });
    if (myToken !== token) return resolve({ ok: false, reason: "cancelled" });
    let done = false;
    let started = false;
    let startTimer = null;
    let endTimer = null;
    const finish = (res) => {
      if (done) return;
      done = true;
      clearTimeout(startTimer);
      clearTimeout(endTimer);
      if (currentUtterance === u) currentUtterance = null;
      if (myToken === token) setSpeaking(false);
      resolve(res);
    };
    const u = new SpeechSynthesisUtterance(text);
    u.voice = state.voice;
    u.lang = state.voice.lang;
    u.rate = opts.rate || state.rate;
    u.pitch = opts.pitch || 1.05;
    u.volume = opts.volume == null ? 1 : opts.volume;
    u.onstart = () => {
      started = true;
      clearTimeout(startTimer);
      if (myToken === token) setSpeaking(true);
    };
    u.onend = () => {
      if (myToken !== token) return finish({ ok: false, reason: "cancelled" });
      recordSuccess();
      finish({ ok: true });
    };
    u.onerror = (e) => {
      const err = e && e.error;
      if (err === "canceled" || err === "interrupted" || myToken !== token) return finish({ ok: false, reason: "cancelled" });
      recordFailure();
      finish({ ok: false, reason: err || "error" });
    };
    currentUtterance = u;
    try {
      if (synth.paused) synth.resume();
      synth.speak(u);
    } catch (err) {
      recordFailure();
      return finish({ ok: false, reason: "exception" });
    }
    // لو الصوت ما بدأش خالص = فشل. لو بدأ وما خلصش في وقت معقول = نكمّل من غير ما نعتبره فشل.
    startTimer = setTimeout(() => {
      if (!started && myToken === token) {
        stopNow();
        recordFailure();
        finish({ ok: false, reason: "no-start" });
      }
    }, 5000);
    const est = Math.min(20000, Math.max(3500, text.length * 230 + 2500));
    endTimer = setTimeout(() => {
      if (myToken === token) {
        stopNow();
        recordSuccess();
      }
      finish({ ok: started, reason: "timeout" });
    }, est);
  });
}

async function startFresh() {
  token++;
  const t = token;
  if (synth && (synth.speaking || synth.pending)) {
    stopNow();
    await sleep(70); // بعض المتصفحات بتسقط أول جملة بعد cancel مباشرة
  }
  return t;
}

// جملة واحدة (بتلغي اللي قبلها)
export async function speak(text, opts) {
  if (!text) return { ok: true };
  const t = await startFresh();
  if (t !== token) return { ok: false, reason: "cancelled" };
  return utter(text, t, opts);
}

// سلسلة جمل بالترتيب (بتلغي اللي قبلها). items: نص أو {text, gap}
export async function speakSequence(items, opts) {
  const t = await startFresh();
  let last = { ok: true };
  for (const it of items.filter(Boolean)) {
    if (t !== token) return { ok: false, reason: "cancelled" };
    const text = typeof it === "string" ? it : it.text;
    if (text) {
      last = await utter(text, t, opts);
      if (!last.ok && last.reason !== "timeout") return last;
    }
    const gap = typeof it === "string" ? 250 : it.gap == null ? 250 : it.gap;
    if (gap) await sleep(gap);
  }
  return t === token ? last : { ok: false, reason: "cancelled" };
}

// بتتنده من أول ضغطة مستخدم (بتفتح الصوت في المتصفحات اللي بتطلب كده)
export function prime() {
  if (!state.supported || !state.voice) return;
  try {
    const u = new SpeechSynthesisUtterance(" ");
    u.volume = 0;
    u.voice = state.voice;
    u.lang = state.voice.lang;
    synth.speak(u);
  } catch (_) {
    /* ignore */
  }
}

export const isSpeaking = () => state.speaking;
