import React, { useCallback, useEffect, useRef, useState } from "react";
import { LEVEL_BY_ID, introKey } from "../data/curriculum.js";
import { LETTER_BY_CHAR } from "../data/letters.js";
import { COLOR_BY_ID, SHAPE_BY_ID } from "../data/colorsShapes.js";
import { NUMBER_BY_VALUE, ITEM_BY_ID } from "../data/numbers.js";
import { useGame } from "../state/GameContext.jsx";
import { playClips, replayInstruction, speakDeviceText, preloadClips, cancel } from "../audio/audioService.ts";
import { numKey, qtyClips, HELP_KEY } from "../audio/clips.js";
import { introClips, tapLetterClips, tapWordClips, tapColorClips, tapThingClips, tapShapeClips, levelClipKeys } from "../audio/sequences.js";
import { sfxCorrect, sfxGentle, sfxTap } from "../services/sfx.js";
import NoorleenHero, { useHeroState } from "../art/NoorleenHero.jsx";
import { WordArt } from "../art/Words.jsx";
import { ColorThing } from "../art/Items.jsx";
import { ShapeArt } from "../art/Shapes.jsx";
import { IconNext, IconPlay, IconCount, IconCheck, IconSpeaker } from "../art/Icons.jsx";
import {
  SpeakerButton,
  MapButton,
  ProgressDots,
  TileContent,
  tileLabel,
  ModelCard,
  QtyGroup,
  CountGroup,
  speakAndWait,
  sleep,
  useMounted,
} from "../components/ui.jsx";

// ------------------------------------------------------------------
// الهيدر: زر الخريطة (ثابت يمين) — النقط — زر السماعة (ثابت شمال)
function Header({ onExit, onReplay, dots }) {
  return (
    <header className="lvl-header">
      <MapButton onGo={onExit} />
      {dots || <span className="dots-spacer" />}
      <SpeakerButton onClick={onReplay} />
    </header>
  );
}

// ------------------------------------------------------------------
// عدّ بالصوت: بينوّر كل عنصر مرة واحدة بالترتيب
function useCounter(value) {
  const [counted, setCounted] = useState([]);
  const [lit, setLit] = useState(-1);
  const ref = useRef([]);
  const run = useRef(0);
  const mounted = useMounted();
  const reset = useCallback(() => {
    run.current++;
    ref.current = [];
    setCounted([]);
    setLit(-1);
  }, []);
  const tap = useCallback((i) => {
    if (ref.current.includes(i)) return; // العنصر ما يتحسبش مرتين في نفس المحاولة
    ref.current = [...ref.current, i];
    setCounted(ref.current);
    sfxTap();
    playClips([numKey(ref.current.length)]);
  }, []);
  const auto = useCallback(async () => {
    const id = ++run.current;
    ref.current = [];
    setCounted([]);
    for (let i = 0; i < value; i++) {
      if (id !== run.current || !mounted.current) return false;
      setLit(i);
      ref.current = [...ref.current, i];
      setCounted(ref.current);
      await speakAndWait(playClips([numKey(i + 1)]), 650);
    }
    if (id !== run.current || !mounted.current) return false;
    setLit(-1);
    return true;
  }, [value, mounted]);
  useEffect(() => () => (run.current += 1), []);
  return { counted, lit, tap, auto, reset };
}

// ------------------------------------------------------------------
// كارت التقديم (أول تقديم لأي حرف/رقم/لون/شكل)
function IntroCard({ item, index, total, onNext, onExit }) {
  const game = useGame();
  const mounted = useMounted();
  const run = useRef(0);
  const nextLock = useRef(false);
  const counter = useCounter(item.kind === "number" ? item.ref : 0);

  const play = useCallback(async () => {
    const id = ++run.current;
    if (item.kind === "number") {
      const n = NUMBER_BY_VALUE[item.ref];
      await speakAndWait(playClips(introClips(item), { instruction: true }), 500);
      if (id !== run.current || !mounted.current) return;
      const ok = await counter.auto();
      // الكمية بعد العدّ (النجمة المفردة مالهاش مقطع، فبتتخطى بصمت)
      const qty = qtyClips(n.value, item.item);
      if (ok && id === run.current && mounted.current && qty.length) await playClips(qty);
    } else {
      await playClips(introClips(item), { instruction: true });
    }
  }, [item, counter, mounted]);

  useEffect(() => {
    game.markIntroduced([introKey(item)]);
    play();
    return () => {
      run.current++;
      cancel();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [item.kind, item.ref]);

  const next = () => {
    if (nextLock.current) return;
    nextLock.current = true;
    sfxTap();
    onNext();
  };
  const last = index === total - 1;

  let body = null;
  if (item.kind === "letter") {
    const l = LETTER_BY_CHAR[item.ref];
    const approved = !!game.settings.approvedSounds[item.ref];
    body = (
      <>
        <div className="intro-row">
          <button type="button" className="tile big" onClick={() => playClips(tapLetterClips(l.char))} aria-label={`حرف ${l.name}`}>
            <span className="glyph xl">{l.char}</span>
          </button>
          <button type="button" className="tile big" onClick={() => playClips(tapWordClips(l.char))} aria-label={`صورة ${l.word}`}>
            <WordArt art={l.art} className="tile-art" />
          </button>
        </div>
        <p className="intro-word">{l.word}</p>
        {approved && (
          <button type="button" className="chip-btn" onClick={() => speakDeviceText(l.letterSound)} aria-label="صوت الحرف">
            <IconSpeaker size={26} /> <span>صوت الحرف</span>
          </button>
        )}
      </>
    );
  } else if (item.kind === "number") {
    const n = NUMBER_BY_VALUE[item.ref];
    body = (
      <>
        <div className="num-top">
          <NoorleenHero size="q" />
          <div className="tile big numeral-tile">
            <span className="glyph xl">{n.numeral}</span>
            <span className="num-name">{n.name}</span>
          </div>
        </div>
        <CountGroup value={n.value} item={item.item} counted={counter.counted} lit={counter.lit} onTap={counter.tap} big />
      </>
    );
  } else if (item.kind === "color") {
    const c = COLOR_BY_ID[item.ref];
    body = (
      <>
        <div className="intro-row">
          <button type="button" className="tile big" onClick={() => playClips(tapColorClips(c.id))} aria-label={`لون ${c.name}`}>
            <span className="swatch xl" style={{ background: c.hex }} />
          </button>
          <button type="button" className="tile big" onClick={() => playClips(tapThingClips(c.id))} aria-label={c.thingName}>
            <ColorThing colorId={c.id} className="tile-art" />
          </button>
        </div>
        <p className="intro-word">{c.name}</p>
      </>
    );
  } else if (item.kind === "shape") {
    const s = SHAPE_BY_ID[item.ref];
    body = (
      <>
        <button type="button" className="tile huge pulse-soft" onClick={() => playClips(tapShapeClips(s.id))} aria-label={s.name}>
          <ShapeArt shape={s.id} className="tile-art" />
        </button>
        <p className="intro-word">{s.name}</p>
      </>
    );
  }
  return (
    <main className="screen level">
      <Header onExit={onExit} onReplay={play} />
      <div className="intro-stage">
        {item.kind !== "number" && (
          <div className="mascots">
            <NoorleenHero size="q" />
          </div>
        )}
        <div className="intro-body">{body}</div>
      </div>
      <footer className="lvl-footer">
        <button type="button" className="btn-big go" onClick={next} aria-label={last ? "ابدئي الأسئلة" : "التالي"}>
          {last ? <IconPlay size={44} /> : <IconNext size={44} />}
        </button>
      </footer>
    </main>
  );
}

// ------------------------------------------------------------------
// سؤال اختيار واحد
function PickQuestion({ q, index, total, onComplete, onExit }) {
  const game = useGame();
  const mounted = useMounted();
  const attempts = useRef(0);
  const locked = useRef(false);
  const [wrong, setWrong] = useState([]);
  const [hint, setHint] = useState(false);
  const [helpId, setHelpId] = useState(null);
  const [heroState, flashHero, heroPulse] = useHeroState();
  const [done, setDone] = useState(null);
  const [praiseText, setPraiseText] = useState("");
  const counter = useCounter(q.countTarget ? q.countTarget.value : 0);

  useEffect(() => {
    playClips(q.prompt.clips, { instruction: true });
    return () => cancel();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q.id]);

  const finish = async (firstTry, help) => {
    locked.current = true;
    sfxCorrect();
    flashHero("happy"); // نفس لحظة صوت التشجيع
    setDone(help ? "help" : "correct");
    game.recordResult(q.id, q.skills, firstTry, help);
    const pr = game.praise();
    setPraiseText(pr.text);
    await speakAndWait(playClips([pr.key]), 1500);
    if (!mounted.current) return;
    onComplete();
  };

  const choose = async (opt) => {
    if (locked.current || wrong.includes(opt.id)) return;
    if (opt.id === q.answerId) {
      finish(attempts.current === 0, false);
      return;
    }
    attempts.current += 1;
    sfxGentle();
    flashHero("encourage");
    setWrong((w) => [...w, opt.id]);
    counter.reset();
    setHint(true);
    if (attempts.current === 1) {
      // "ولا يهمك" ثم نعيد السؤال بنفس المقاطع (التلميح نفسه بصري)
      playClips([game.retry().key, ...q.prompt.clips]);
    } else {
      // بعد محاولتين: "تعالي نعملها سوا" ثم السؤال، ونوريها الصح وننفذه معاها
      locked.current = true;
      setHelpId(q.answerId);
      await speakAndWait(playClips([HELP_KEY, ...q.prompt.clips]), 900);
      if (!mounted.current) return;
      await sleep(500);
      if (!mounted.current) return;
      finish(false, true);
    }
  };

  const target = q.target;
  return (
    <main className="screen level">
      <Header
        onExit={onExit}
        onReplay={replayInstruction}
        dots={<ProgressDots total={total} current={index} />}
      />
      <section className={`stage ${q.countTarget ? "countq" : ""}`}>
        <div className="mascots">
          <NoorleenHero state={heroState} pulse={heroPulse} size="q" />
          {game.settings.bunny && (
            <div className={`bunny-wrap ${hint ? "hinting" : ""}`}>
              {hint && <ModelCard model={q.hint.model} />}
            </div>
          )}
        </div>
        <p className="prompt-text" aria-live="polite">{q.prompt.display}</p>
        {done && <p className="praise-text">{praiseText}</p>}
        {target && (
          <div className="target-card" aria-label="الشكل المطلوب">
            <TileContent kind={target.kind} val={target.ref} />
          </div>
        )}
        {q.countTarget && (
          <div className="count-area">
            <CountGroup value={q.countTarget.value} item={q.countTarget.item} counted={counter.counted} lit={counter.lit} onTap={counter.tap} big />
            <button type="button" className="chip-btn" onClick={() => counter.auto()} aria-label="عدّي معايا">
              <IconCount size={26} /> <span>عدّي معايا</span>
            </button>
          </div>
        )}
      </section>
      <section className={`options ${q.layout} n${q.options.length}`} aria-label="الاختيارات">
        {q.options.map((opt) => {
          const isWrong = wrong.includes(opt.id);
          const isHelp = helpId === opt.id;
          const isDone = done && opt.id === q.answerId;
          return (
            <button
              type="button"
              key={opt.id}
              className={`opt tile ${isWrong ? "faded" : ""} ${isHelp ? "help" : ""} ${isDone ? "right" : ""}`}
              onClick={() => choose(opt)}
              aria-label={tileLabel(opt.kind, opt.ref)}
              aria-disabled={isWrong || !!done}
            >
              <TileContent kind={opt.kind} val={opt.ref} item={opt.item} />
              {isDone && <span className="badge-check"><IconCheck size={30} /></span>}
            </button>
          );
        })}
      </section>
    </main>
  );
}

// ------------------------------------------------------------------
// لوحة مطابقة: اضغطي الأول وبعدين التاني
function PairsQuestion({ q, index, total, onComplete, onExit }) {
  const game = useGame();
  const mounted = useMounted();
  const [sel, setSel] = useState(null); // {side, id}
  const [matched, setMatched] = useState([]);
  const [helpIds, setHelpIds] = useState(null);
  const [hint, setHint] = useState(false);
  const [heroState, flashHero, heroPulse] = useHeroState();
  const [done, setDone] = useState(false);
  const [praiseText, setPraiseText] = useState("");
  const wrongSince = useRef(0); // أخطاء من آخر توصيلة
  const wrongTotal = useRef(0);
  const helped = useRef(false);
  const locked = useRef(false);
  const matchedRef = useRef([]);
  const byId = Object.fromEntries(q.pairs.map((p) => [p.id, p]));

  useEffect(() => {
    playClips(q.prompt.clips, { instruction: true });
    return () => cancel();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q.id]);

  const finishAll = async () => {
    locked.current = true;
    sfxCorrect();
    flashHero("happy");
    setDone(true);
    game.recordResult(q.id, q.skills, wrongTotal.current === 0 && !helped.current, helped.current);
    const pr = game.praise();
    setPraiseText(pr.text);
    await speakAndWait(playClips([pr.key]), 1500);
    if (!mounted.current) return;
    onComplete();
  };

  const addMatch = (id) => {
    const next = [...matchedRef.current, id];
    matchedRef.current = next;
    setMatched(next);
    wrongSince.current = 0;
    return next.length === q.pairs.length;
  };

  const tap = async (side, id) => {
    if (locked.current || matchedRef.current.includes(id)) return;
    const p = byId[id];
    const name = side === "key" ? p.keyClips : p.matchClips; // مقاطع اسم اللي اتلمس
    if (!sel || sel.side === side) {
      setSel({ side, id });
      sfxTap();
      playClips(name);
      return;
    }
    // الاتنين اتختاروا
    const keyId = side === "key" ? id : sel.id;
    const matchId = side === "match" ? id : sel.id;
    setSel(null);
    if (keyId === matchId) {
      sfxCorrect();
      const all = addMatch(keyId);
      if (all) {
        finishAll();
      } else {
        flashHero("happy");
        playClips([...name, game.praise().key]);
      }
      return;
    }
    wrongTotal.current += 1;
    wrongSince.current += 1;
    sfxGentle();
    flashHero("encourage");
    setHint(true);
    if (wrongSince.current < 2) {
      playClips([...name, game.retry().key]);
      return;
    }
    // بعد محاولتين: نوريها توصيلة ونعملها سوا
    locked.current = true;
    helped.current = true;
    const nextId = q.keysOrder.find((x) => !matchedRef.current.includes(x));
    setHelpIds(nextId);
    await speakAndWait(playClips([HELP_KEY]), 900);
    if (!mounted.current) return;
    await sleep(700);
    if (!mounted.current) return;
    setHelpIds(null);
    const all = addMatch(nextId);
    if (all) {
      finishAll();
    } else {
      locked.current = false;
    }
  };

  const renderTile = (side, id) => {
    const p = byId[id];
    const t = side === "key" ? p.key : p.match;
    const isMatched = matched.includes(id);
    const isSel = sel && sel.side === side && sel.id === id;
    const isHelp = helpIds === id;
    return (
      <button
        type="button"
        key={side + id}
        className={`opt tile pair-tile ${isSel ? "selected" : ""} ${isMatched ? "matched" : ""} ${isHelp ? "help" : ""}`}
        onClick={() => tap(side, id)}
        aria-label={tileLabel(t.kind, t.ref)}
        aria-pressed={!!isSel}
      >
        <TileContent kind={t.kind} val={t.ref} item={t.item} />
        {isMatched && <span className="badge-check"><IconCheck size={28} /></span>}
      </button>
    );
  };

  return (
    <main className="screen level">
      <Header onExit={onExit} onReplay={replayInstruction} dots={<ProgressDots total={total} current={index} />} />
      <section className="stage">
        <div className="mascots">
          <NoorleenHero state={heroState} pulse={heroPulse} size="q" />
        </div>
        <p className="prompt-text">{q.prompt.display}</p>
        {done && <p className="praise-text">{praiseText}</p>}
      </section>
      <section className={`pairs n${q.pairs.length}`} aria-label="لوحة المطابقة">
        <div className="pair-row keys">{q.keysOrder.map((id) => renderTile("key", id))}</div>
        <div className="pair-row matches">{q.matchesOrder.map((id) => renderTile("match", id))}</div>
      </section>
    </main>
  );
}

// ------------------------------------------------------------------
export default function LevelScreen({ levelId, onExit, onDone }) {
  const level = LEVEL_BY_ID[levelId];
  const game = useGame();
  const resume = game.progress.resume;
  const startQ = resume && resume.levelId === levelId && resume.qIndex > 0 && resume.qIndex < level.questions.length ? resume.qIndex : 0;
  const [phase, setPhase] = useState(startQ > 0 || !level.learn.length ? "q" : "learn");
  const [idx, setIdx] = useState(startQ);
  const advancing = useRef(null);

  // تحميل مسبق لمقاطع المرحلة الحالية بس
  useEffect(() => {
    preloadClips(levelClipKeys(level));
  }, [level]);

  const nextCard = () => {
    if (idx + 1 < level.learn.length) setIdx(idx + 1);
    else {
      setPhase("q");
      setIdx(0);
    }
  };

  const nextQuestion = () => {
    const key = `${levelId}:${idx}`;
    if (advancing.current === key) return; // يمنع ضغطتين من تخطي سؤال أو احتساب نجمتين
    advancing.current = key;
    if (idx + 1 < level.questions.length) {
      game.setResume({ levelId, qIndex: idx + 1 });
      setIdx(idx + 1);
    } else {
      const res = game.completeLevel(levelId);
      onDone(levelId, res);
    }
  };

  if (phase === "learn") {
    const item = level.learn[idx];
    return <IntroCard key={`${item.kind}${item.ref}`} item={item} index={idx} total={level.learn.length} onNext={nextCard} onExit={onExit} />;
  }
  const q = level.questions[idx];
  const props = { q, index: idx, total: level.questions.length, onComplete: nextQuestion, onExit };
  return q.type === "pairs" ? <PairsQuestion key={q.id} {...props} /> : <PickQuestion key={q.id} {...props} />;
}
