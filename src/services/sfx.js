// مؤثرات ونغمات هادية (WebAudio) — مفيش ملفات صوت. الموسيقى منفصلة تمامًا عن صوت التعليم،
// وبتنخفض لما الصوت يتكلم. مفيش أصوات عالية أو مفاجئة.
let ctx = null;
let master = null;
let musicGain = null;
let sfxGain = null;
let musicTimer = null;
let cfg = { music: true, sfx: true };
let ducked = false;
let started = false;

const SCALE = [261.63, 293.66, 329.63, 392.0, 440.0, 523.25, 587.33];

export function unlockAudio() {
  try {
    if (!ctx) {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return;
      ctx = new AC();
      master = ctx.createGain();
      master.gain.value = 0.9;
      master.connect(ctx.destination);
      musicGain = ctx.createGain();
      musicGain.gain.value = 0;
      musicGain.connect(master);
      sfxGain = ctx.createGain();
      sfxGain.gain.value = 0.5;
      sfxGain.connect(master);
      document.addEventListener("visibilitychange", () => {
        if (!ctx) return;
        if (document.hidden) ctx.suspend && ctx.suspend();
        else ctx.resume && ctx.resume();
      });
    }
    if (ctx.state === "suspended") ctx.resume();
    started = true;
    applyMusic();
  } catch (_) {
    /* الصوت مش أساسي */
  }
}

function tone(freq, when, dur, { type = "sine", gain = 0.15, dest = sfxGain } = {}) {
  if (!ctx || !dest) return;
  const o = ctx.createOscillator();
  const g = ctx.createGain();
  o.type = type;
  o.frequency.value = freq;
  const t0 = ctx.currentTime + when;
  g.gain.setValueAtTime(0.0001, t0);
  g.gain.exponentialRampToValueAtTime(gain, t0 + 0.04);
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
  o.connect(g);
  g.connect(dest);
  o.start(t0);
  o.stop(t0 + dur + 0.05);
}

function musicLevel() {
  return ducked ? 0.1 : 0.32;
}
function applyMusic() {
  if (!ctx || !musicGain) return;
  const on = cfg.music && started;
  musicGain.gain.setTargetAtTime(on ? musicLevel() : 0, ctx.currentTime, 0.4);
  clearInterval(musicTimer);
  musicTimer = null;
  if (on) {
    const step = () => {
      const f = SCALE[Math.floor(Math.random() * SCALE.length)];
      tone(f, 0, 2.2, { type: "triangle", gain: 0.1, dest: musicGain });
      if (Math.random() < 0.4) tone(f / 2, 0.02, 2.8, { type: "sine", gain: 0.06, dest: musicGain });
    };
    step();
    musicTimer = setInterval(step, 1900);
  }
}

export function setAudioSettings(next) {
  cfg = { ...cfg, ...next };
  applyMusic();
}
export function duck(v) {
  ducked = v;
  if (ctx && musicGain && cfg.music && started) musicGain.gain.setTargetAtTime(musicLevel(), ctx.currentTime, 0.15);
}

const play = (fn) => {
  if (!cfg.sfx || !ctx) return;
  try {
    fn();
  } catch (_) {
    /* ignore */
  }
};
export const sfxTap = () => play(() => tone(520, 0, 0.12, { gain: 0.07 }));
export const sfxCorrect = () =>
  play(() => {
    tone(523.25, 0, 0.3, { gain: 0.11 });
    tone(659.25, 0.12, 0.3, { gain: 0.11 });
    tone(783.99, 0.24, 0.45, { gain: 0.11 });
  });
export const sfxGentle = () =>
  play(() => {
    tone(349.23, 0, 0.35, { gain: 0.07 });
    tone(311.13, 0.16, 0.45, { gain: 0.07 });
  });
export const sfxStar = () =>
  play(() => {
    [523.25, 659.25, 783.99, 1046.5].forEach((f, i) => tone(f, i * 0.13, 0.5, { gain: 0.1 }));
  });
export const sfxLock = () => play(() => tone(262, 0, 0.25, { gain: 0.06 }));
