import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { loadState, saveState, defaultState } from "../services/storage.js";
import { LEVELS } from "../data/curriculum.js";
import { setRate, setPreferredVoice } from "../services/speech.js";
import { setAudioSettings } from "../services/sfx.js";
import { praiseLines, retryLine } from "../data/phrases.js";

export const STICKER_COUNT = 12;
export const unlockedStickerCount = (completedCount) =>
  Math.min(STICKER_COUNT, Math.floor((completedCount * STICKER_COUNT) / LEVELS.length));

const Ctx = createContext(null);
export const useGame = () => useContext(Ctx);

export function GameProvider({ children }) {
  const initial = useRef(null);
  if (!initial.current) initial.current = loadState();
  const [state, setState] = useState(initial.current.state);
  const [storageOk, setStorageOk] = useState(initial.current.storageOk);
  const [recovered] = useState(initial.current.recovered);
  const stateRef = useRef(state);
  const sessionLevels = useRef(0);
  const praiseIdx = useRef(0);

  // تحديث + حفظ فوري (بعد كل سؤال/مرحلة/إعداد)
  const update = useCallback((fn) => {
    const next = fn(stateRef.current);
    stateRef.current = next;
    setState(next);
    setStorageOk(saveState(next));
    return next;
  }, []);

  // الإعدادات بتتطبق على الخدمات
  const s = state.settings;
  useEffect(() => {
    setRate(s.rate);
    setPreferredVoice(s.voiceURI);
    setAudioSettings({ music: s.music, sfx: s.sfx });
  }, [s.rate, s.voiceURI, s.music, s.sfx]);

  useEffect(() => {
    const root = document.documentElement;
    const mq = window.matchMedia ? window.matchMedia("(prefers-reduced-motion: reduce)") : null;
    const apply = () => {
      const on = s.reduceMotion === "on" || (s.reduceMotion === "auto" && mq && mq.matches);
      root.classList.toggle("reduce-motion", !!on);
    };
    apply();
    if (mq && mq.addEventListener) mq.addEventListener("change", apply);
    return () => mq && mq.removeEventListener && mq.removeEventListener("change", apply);
  }, [s.reduceMotion]);

  const api = useMemo(() => {
    const isUnlocked = (level, st = stateRef.current) => {
      if (st.settings.unlockAll || level.index === 0) return true;
      return !!st.progress.completed[LEVELS[level.index - 1].id];
    };
    return {
      update,
      isUnlocked,
      currentLevel: (st = stateRef.current) => LEVELS.find((l) => !st.progress.completed[l.id]) || null,
      recordResult: (qid, skills, firstTry, help) =>
        update((st) => ({
          ...st,
          progress: {
            ...st.progress,
            // بنكتب على نفس الـ id (آخر نتيجة)، فإعادة التحميل أو التكرار ما يضاعفش حاجة
            results: { ...st.progress.results, [qid]: { skills, firstTry, help, at: Date.now() } },
          },
        })),
      markIntroduced: (keys) =>
        update((st) => {
          const introduced = { ...st.progress.introduced };
          keys.forEach((k) => (introduced[k] = true));
          return { ...st, progress: { ...st.progress, introduced } };
        }),
      setResume: (resume) => update((st) => ({ ...st, progress: { ...st.progress, resume } })),
      // النجمة بتتحفظ مرة واحدة لكل مرحلة
      completeLevel: (levelId) => {
        const before = stateRef.current;
        const wasCompleted = !!before.progress.completed[levelId];
        const countBefore = Object.keys(before.progress.completed).length;
        const next = update((st) => ({
          ...st,
          progress: {
            ...st.progress,
            completed: { ...st.progress.completed, [levelId]: true },
            stars: { ...st.progress.stars, [levelId]: true },
            resume: null,
          },
        }));
        const countAfter = Object.keys(next.progress.completed).length;
        sessionLevels.current += 1;
        const sb = unlockedStickerCount(countBefore);
        const sa = unlockedStickerCount(countAfter);
        return {
          newStar: !wasCompleted,
          newStickerIndex: sa > sb ? sa - 1 : null,
          sessionCount: sessionLevels.current,
        };
      },
      patchProgress: (patch) => update((st) => ({ ...st, progress: { ...st.progress, ...patch } })),
      updateSettings: (patch) => update((st) => ({ ...st, settings: { ...st.settings, ...patch } })),
      resetProgress: () => update((st) => ({ ...st, progress: defaultState().progress })),
      praise: () => {
        const list = praiseLines(stateRef.current.settings.usePraiseName);
        const line = list[praiseIdx.current % list.length];
        praiseIdx.current += 1;
        return line;
      },
      retry: () => retryLine(stateRef.current.settings.usePraiseName),
    };
  }, [update]);

  const value = useMemo(
    () => ({ state, progress: state.progress, settings: state.settings, storageOk, recovered, ...api }),
    [state, storageOk, recovered, api]
  );
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}
