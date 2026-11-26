import React, { useEffect, useRef, useState } from "react";
import { GAME_TITLE, HERO_NAME } from "../config.js";
import { STAGES, LEVELS, levelsOfStage, LEVEL_BY_ID } from "../data/curriculum.js";
import { COLOR_BY_ID, SHAPE_BY_ID } from "../data/colorsShapes.js";
import { useGame, unlockedStickerCount, STICKER_COUNT } from "../state/GameContext.jsx";
import { playClips, replayInstruction, cancel, clipText } from "../audio/audioService.ts";
import { STAR_KEY, BREAK_KEY, CONTINUE_KEY, LETS_PLAY_KEY } from "../audio/clips.js";
import { TUTORIAL_CLIPS } from "../audio/sequences.js";
import { sfxTap, sfxStar, sfxLock, sfxCorrect } from "../services/sfx.js";
import NoorleenHero, { useHeroState } from "../art/NoorleenHero.jsx";
import Bunny from "../art/Bunny.jsx";
import { StageIcon } from "../art/StageIcons.jsx";
import { STICKERS, StickerArt } from "../art/Stickers.jsx";
import { WordArt } from "../art/Words.jsx";
import { ShapeArt } from "../art/Shapes.jsx";
import { IconPlay, IconStar, IconLock, IconSticker, IconMoon, IconCheck } from "../art/Icons.jsx";
import { ColorThing } from "../art/Items.jsx";
import { ParentGateButton, MapButton, SpeakerButton, useMounted, speakAndWait } from "../components/ui.jsx";

// ------------------------------------------------------------------ ترحيب
export function Welcome({ onStart, onParent }) {
  return (
    <main className="screen welcome">
      <div className="top-right"><ParentGateButton onOpen={onParent} /></div>
      <div className="welcome-art">
        <NoorleenHero size="welcome" fallbackCrop="full" />
      </div>
      <h1 className="title">{GAME_TITLE}</h1>
      <button type="button" className="btn-play" onClick={onStart} aria-label="يلا نلعب">
        <IconPlay size={56} />
        <span>يلا نلعب</span>
      </button>
    </main>
  );
}

// ------------------------------------------------------------------ الخريطة
export function MapScreen({ onStage, onStickers, onParent, onTutorial }) {
  const game = useGame();
  const cur = game.currentLevel();
  const curStage = cur ? cur.stageId : "bridge";
  const doneCount = Object.keys(game.progress.completed).length;
  const stars = Object.keys(game.progress.stars).length;
  const [shake, setShake] = useState(null);
  const busy = useRef(false);

  useEffect(() => {
    return () => cancel();
  }, []);

  const open = (st, unlocked) => {
    if (busy.current) return;
    if (!unlocked) {
      sfxLock();
      setShake(st.id);
      setTimeout(() => setShake(null), 700);
      return;
    }
    busy.current = true;
    sfxTap();
    // اسم المحطة بيتقال أول ما الشاشة الجاية تفتح
    if (st.id === "letters" && !game.progress.tutorialDone) onTutorial();
    else onStage(st.id);
  };

  return (
    <main className="screen map">
      <header className="map-bar">
        <div className="star-count" aria-label={`${stars} نجمة`}>
          <IconStar size={34} />
          <b>{stars}</b>
        </div>
        <button type="button" className="btn-round stickers-btn" onClick={() => { sfxTap(); onStickers(); }} aria-label="الملصقات">
          <IconSticker size={38} />
          <span className="mini-count">{unlockedStickerCount(doneCount)}</span>
        </button>
        <span className="grow" />
        <ParentGateButton onOpen={onParent} />
      </header>
      <ol className="path">
        {STAGES.map((st, i) => {
          const lv = levelsOfStage(st.id);
          const unlocked = game.isUnlocked(lv[0]);
          const doneHere = lv.filter((l) => game.progress.completed[l.id]).length;
          const isCur = st.id === curStage && !!cur;
          const isStart = isCur && doneCount === 0;
          return (
            <li key={st.id} className={`stop ${i % 2 ? "right" : "left"}`}>
              <button
                type="button"
                className={`stop-btn ${unlocked ? "open" : "locked"} ${isCur ? "current" : ""} ${shake === st.id ? "shake" : ""}`}
                onClick={() => open(st, unlocked)}
                aria-label={`${st.name}${unlocked ? "" : " (لسه مقفولة)"}`}
              >
                <StageIcon icon={st.icon} className="stop-art" />
                {!unlocked && (
                  <span className="lock-badge">
                    <IconLock size={26} />
                  </span>
                )}
                {isCur && (
                  <span className="hero-pin">
                    <NoorleenHero size="pin" />
                  </span>
                )}
                {isStart && <span className="start-arrow" aria-hidden="true">▼</span>}
              </button>
              <div className="stop-label">
                <span className="stop-name">{st.name}</span>
                <span className="stop-dots" aria-label={`${doneHere} من ${lv.length}`}>
                  {lv.map((l) => (
                    <IconStar key={l.id} size={14} filled={!!game.progress.completed[l.id]} />
                  ))}
                </span>
              </div>
            </li>
          );
        })}
      </ol>
    </main>
  );
}

// ------------------------------------------------------------------ مراحل المحطة
function badgeFor(level) {
  const b = level.badge;
  if (b.kind === "chars")
    return (
      <span className="chars-badge">
        {b.text.split(" ").map((c, i) => (
          <span key={i} className="glyph md">{c}</span>
        ))}
      </span>
    );
  if (b.kind === "colors")
    return (
      <span className="badge-colors">
        {b.colors.map((c) => (
          <span key={c} className="swatch sm" style={{ background: COLOR_BY_ID[c].hex }} />
        ))}
      </span>
    );
  if (b.kind === "shape") return <ShapeArt shape={b.shape} className="badge-art" />;
  if (b.icon === "letters")
    return (
      <span className="badge-pair">
        <span className="glyph sm">أ</span>
        <WordArt art="lion" className="badge-mini" />
      </span>
    );
  if (b.icon === "numbers")
    return (
      <span className="badge-pair">
        <span className="glyph sm">٣</span>
        <ColorThing colorId="red" className="badge-mini" />
      </span>
    );
  return (
    <span className="badge-pair">
      <ShapeArt shape="circle" className="badge-mini" />
      <ColorThing colorId="blue" className="badge-mini" />
    </span>
  );
}

export function StageScreen({ stageId, onBack, onLevel }) {
  const game = useGame();
  const stage = STAGES.find((s) => s.id === stageId);
  const levels = levelsOfStage(stageId);
  const cur = game.currentLevel();
  useEffect(() => {
    playClips([stage.clip], { instruction: true });
    return () => cancel();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stageId]);
  const busy = useRef(false);
  const pick = (lv, unlocked) => {
    if (busy.current) return;
    if (!unlocked) {
      sfxLock();
      return;
    }
    busy.current = true;
    sfxTap();
    onLevel(lv.id);
  };
  return (
    <main className="screen stage-screen">
      <header className="lvl-header">
        <MapButton onGo={onBack} />
        <div className="stage-title">
          <StageIcon icon={stage.icon} className="stage-title-art" />
          <h1>{stage.name}</h1>
        </div>
        <SpeakerButton onClick={() => playClips([stage.clip], { instruction: true })} label="اسمعي اسم المحطة" />
      </header>
      <ol className="levels">
        {levels.map((lv, i) => {
          const unlocked = game.isUnlocked(lv);
          const done = !!game.progress.completed[lv.id];
          const isCur = cur && cur.id === lv.id;
          const inProgress = game.progress.resume && game.progress.resume.levelId === lv.id;
          return (
            <li key={lv.id}>
              <button
                type="button"
                className={`level-btn ${done ? "done" : ""} ${unlocked ? "" : "locked"} ${isCur ? "current" : ""}`}
                onClick={() => pick(lv, unlocked)}
                aria-label={`مرحلة ${i + 1}${done ? " (خلصانة)" : unlocked ? "" : " (لسه مقفولة)"}`}
              >
                <span className="level-num">{i + 1}</span>
                <span className="level-badge">{badgeFor(lv)}</span>
                <span className="level-state">
                  {done ? <IconStar size={28} /> : unlocked ? <IconPlay size={24} /> : <IconLock size={24} />}
                </span>
                {inProgress && !done && <span className="resume-dot" aria-label="كمّلي من هنا" />}
              </button>
            </li>
          );
        })}
      </ol>
    </main>
  );
}

// ------------------------------------------------------------------ المثال المحلول
export function Tutorial({ onDone, onExit }) {
  const game = useGame();
  const mounted = useMounted();
  const [done, setDone] = useState(false);
  const [nudge, setNudge] = useState(0);
  const [heroState, flashHero, heroPulse] = useHeroState("think");
  const locked = useRef(false);
  const say = () => playClips(TUTORIAL_CLIPS, { instruction: true });
  useEffect(() => {
    // أول مرة: اسم المحطة ثم التعليمات
    playClips([STAGES[0].clip, ...TUTORIAL_CLIPS], { instruction: true });
    return () => cancel();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const lion = async () => {
    if (locked.current) return;
    locked.current = true;
    setDone(true);
    sfxCorrect();
    flashHero("happy");
    await speakAndWait(playClips([game.praise().key, LETS_PLAY_KEY]), 1500);
    if (!mounted.current) return;
    game.patchProgress({ tutorialDone: true });
    onDone();
  };
  const other = () => {
    if (locked.current) return;
    setNudge((n) => n + 1);
    sfxTap();
    flashHero("encourage");
    say();
  };
  return (
    <main className="screen level">
      <header className="lvl-header">
        <MapButton onGo={onExit} />
        <span className="dots-spacer" />
        <SpeakerButton onClick={replayInstruction} />
      </header>
      <section className="stage">
        <div className="mascots">
          <NoorleenHero state={heroState} pulse={heroPulse} size="q" />
        </div>
        <p className="prompt-text">دوسي على الأسد</p>
      </section>
      <section className="options grid n2" aria-label="مثال">
        <button type="button" className={`opt tile pulse-soft ${done ? "right" : ""} ${nudge >= 2 ? "help" : ""}`} onClick={lion} aria-label="أسد">
          <WordArt art="lion" className="tile-art" />
          {done && <span className="badge-check"><IconCheck size={30} /></span>}
        </button>
        <button type="button" className="opt tile" onClick={other} aria-label="بطة">
          <WordArt art="duck" className="tile-art" />
        </button>
      </section>
    </main>
  );
}

// ------------------------------------------------------------------ احتفال
export function Celebration({ levelId, result, onMap, onRest }) {
  const game = useGame();
  const mounted = useMounted();
  const level = LEVEL_BY_ID[levelId];
  const [pr] = useState(() => game.praise());
  const starText = clipText(STAR_KEY);
  const sticker = result.newStickerIndex != null ? STICKERS[result.newStickerIndex] : null;
  const suggestRest = result.sessionCount > 0 && result.sessionCount % 2 === 0;
  const [showSticker, setShowSticker] = useState(false);
  const [heroState, flashHero, heroPulse] = useHeroState();

  useEffect(() => {
    let alive = true;
    flashHero("happy"); // فرحانة حوالي ٢ ثانية ثم idle
    if (result.newStar) sfxStar();
    else sfxCorrect();
    // مقطع تشجيع واحد بس (ما بنخلطش مقطعين تشجيع)، ثم النجمة الجديدة، ثم الاستراحة لو مقترحة
    const items = [pr.key];
    if (result.newStar) items.push(STAR_KEY);
    if (suggestRest) items.push(BREAK_KEY);
    const t = setTimeout(() => alive && sticker && setShowSticker(true), 1800);
    playClips(items);
    return () => {
      alive = false;
      clearTimeout(t);
      cancel();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <main className="screen celebrate">
      <div className="confetti" aria-hidden="true">
        {Array.from({ length: 14 }).map((_, i) => (
          <i key={i} style={{ "--i": i }} />
        ))}
      </div>
      <div className="celebrate-art">
        <NoorleenHero state={heroState} pulse={heroPulse} size="celebrate" fallbackCrop="full" />
        <div className="big-star" aria-label={result.newStar ? "نجمة جديدة" : "نجمة"}>
          <IconStar size={120} />
        </div>
      </div>
      <p className="praise-text big">{result.newStar ? starText : pr.text}</p>
      {showSticker && sticker && (
        <button type="button" className="sticker-pop" onClick={sfxTap} aria-label={`ملصق ${sticker.name}`}>
          <StickerArt index={result.newStickerIndex} className="sticker-art" />
          <span>{sticker.name}</span>
        </button>
      )}
      {suggestRest && (
        <div className="rest-card">
          <Bunny mood="sleepy" className="bunny-sm" />
          <p>ممكن ناخد استراحة صغيرة؟</p>
          <button type="button" className="btn-round big rest-btn" onClick={() => { sfxTap(); onRest(); }} aria-label="استراحة">
            <IconMoon size={44} />
          </button>
        </div>
      )}
      <MapButton onGo={onMap} className="big" />
    </main>
  );
}

// ------------------------------------------------------------------ استراحة
export function Rest({ onWake }) {
  useEffect(() => () => cancel(), []);
  return (
    <main className="screen rest">
      <div className="stars-bg" aria-hidden="true" />
      <Bunny mood="sleepy" className="bunny-rest" />
      <p className="rest-text">استراحة صغيرة</p>
      <button type="button" className="btn-big go" onClick={() => { sfxTap(); onWake(); playClips([CONTINUE_KEY]); }} aria-label="نكمّل">
        <IconPlay size={48} />
      </button>
    </main>
  );
}

// ------------------------------------------------------------------ الملصقات
export function StickersScreen({ onBack }) {
  const game = useGame();
  const count = unlockedStickerCount(Object.keys(game.progress.completed).length);
  useEffect(() => () => cancel(), []);
  return (
    <main className="screen stickers">
      <header className="lvl-header">
        <MapButton onGo={onBack} />
        <h1 className="stage-title">ملصقاتي</h1>
        <span className="dots-spacer" />
      </header>
      <ul className="sticker-grid">
        {STICKERS.map((s, i) => {
          const open = i < count;
          return (
            <li key={s.id}>
              <button
                type="button"
                className={`sticker-slot ${open ? "open" : "locked"}`}
                onClick={() => (open ? sfxTap() : sfxLock())}
                aria-label={open ? `ملصق ${s.name}` : "ملصق لسه مقفول"}
              >
                {open ? <StickerArt index={i} className="sticker-art" /> : <IconLock size={36} />}
              </button>
              {open && <span className="sticker-name">{s.name}</span>}
            </li>
          );
        })}
      </ul>
      <p className="muted small center">{count} من {STICKER_COUNT}</p>
    </main>
  );
}
