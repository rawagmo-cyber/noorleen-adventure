import React, { useEffect, useMemo, useState } from "react";
import { GAME_TITLE, HERO_NAME, PRAISE_NAME } from "../config.js";
import { STAGES, LEVELS, levelsOfStage, ALL_SKILLS } from "../data/curriculum.js";
import { LETTERS } from "../data/letters.js";
import { useGame, unlockedStickerCount, STICKER_COUNT } from "../state/GameContext.jsx";
import { playClips, speakDeviceText, cancel } from "../audio/audioService.ts";
import { letterKey, wordKey } from "../audio/clips.js";
import { ConfirmDialog } from "../components/ui.jsx";
import { IconSpeaker, IconCheck } from "../art/Icons.jsx";

const TABS = [
  ["progress", "التقدّم"],
  ["voice", "أصوات الحروف"],
  ["settings", "الإعدادات"],
  ["data", "البيانات والخصوصية"],
];

function skillStatus(key, results, introduced) {
  let practiced = false;
  let help = false;
  for (const r of Object.values(results)) {
    if (r && Array.isArray(r.skills) && r.skills.includes(key)) {
      practiced = true;
      if (r.help) help = true;
    }
  }
  if (help) return "review";
  if (practiced) return "practiced";
  if (introduced[key]) return "seen";
  return "none";
}

function Toggle({ label, checked, onChange, note }) {
  return (
    <label className="toggle">
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} />
      <span className="toggle-text">
        {label}
        {note && <small>{note}</small>}
      </span>
    </label>
  );
}

function Progress({ onPlayLevel }) {
  const game = useGame();
  const { results, introduced, completed, stars } = game.progress;
  const doneCount = Object.keys(completed).length;
  const groups = useMemo(() => {
    const out = { practiced: [], review: [], seen: [] };
    for (const [stageKey, list] of Object.entries(ALL_SKILLS)) {
      for (const s of list) {
        const st = skillStatus(s.key, results, introduced);
        if (st !== "none") out[st].push({ ...s, stage: stageKey });
      }
    }
    return out;
  }, [results, introduced]);
  const chips = (arr) =>
    arr.length ? (
      <ul className="chips">
        {arr.map((s) => (
          <li key={s.key} className="chip">{s.label}</li>
        ))}
      </ul>
    ) : (
      <p className="muted small">لسه مفيش.</p>
    );
  return (
    <div>
      <p>
        المراحل المكتملة: <b>{doneCount}</b> من {LEVELS.length} — النجوم: <b>{Object.keys(stars).length}</b> — الملصقات: <b>{unlockedStickerCount(doneCount)}</b> من {STICKER_COUNT}
      </p>
      <h3>اتدربت على</h3>
      {chips(groups.practiced)}
      <h3>محتاجة مراجعة</h3>
      {chips(groups.review)}
      <p className="muted small">"محتاجة مراجعة" معناها إنها احتاجت مساعدة في آخر تدريب. "اتدربت على" مش معناها إنها أتقنت المهارة — ده مجرد تدريب أولي.</p>
      <h3>اتعرضت بس (من غير تدريب لسه)</h3>
      {chips(groups.seen)}

      <h3>كل المراحل</h3>
      <p className="muted small">تقدري تفتحي أي تدريب وتعيدي لعبه في أي وقت.</p>
      <ul className="level-list">
        {STAGES.map((st) => (
          <li key={st.id}>
            <b>{st.name}</b>
            <ul>
              {levelsOfStage(st.id).map((lv, i) => (
                <li key={lv.id} className="level-row">
                  <span>
                    مرحلة {i + 1} — {lv.title} {completed[lv.id] ? "✓ مكتملة" : ""}
                  </span>
                  <button type="button" className="pbtn small" onClick={() => onPlayLevel(lv.id)}>
                    افتحي وشغّلي
                  </button>
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </div>
  );
}

function Voice() {
  const game = useGame();
  const s = game.settings;
  return (
    <div>
      <p className="muted small">
        اسم الحرف والكلمة بيتنطقوا من تسجيلات جاهزة. أما صوت الحرف المنفرد فمفيش له تسجيل، وبينطقه صوت الجهاز العربي لو موجود،
        ونطق حرف منفرد بصوت الجهاز ممكن يطلع اسم الحرف أو صوت غير مقصود. فاللعبة ما بتعلّمش صوت الحرف إلا لما إنتِ تسمعيه وتعتمديه هنا.
        لو مش معتمد: بتتقدم الحرف باسمه وكلمته بس.
      </p>
      <div className="letter-table" role="table" aria-label="مراجعة أصوات الحروف">
        {LETTERS.map((l) => (
          <div key={l.id} className="letter-row" role="row">
            <span className="glyph sm" role="cell">{l.char}</span>
            <button type="button" className="pbtn small" onClick={() => playClips([letterKey(l.char)])} aria-label={`اسم الحرف ${l.name}`}>
              اسم: {l.name}
            </button>
            <button type="button" className="pbtn small" onClick={() => speakDeviceText(l.letterSound)} aria-label={`صوت الحرف ${l.name}`}>
              صوت
            </button>
            <button type="button" className="pbtn small" onClick={() => playClips([wordKey(l.char)])} aria-label={`كلمة ${l.word}`}>
              {l.word}
            </button>
            <label className="toggle inline">
              <input
                type="checkbox"
                checked={!!s.approvedSounds[l.char]}
                onChange={(e) => game.updateSettings({ approvedSounds: { ...s.approvedSounds, [l.char]: e.target.checked } })}
              />
              <span>صوت سليم</span>
            </label>
          </div>
        ))}
      </div>
    </div>
  );
}

function Settings() {
  const game = useGame();
  const s = game.settings;
  return (
    <div>
      <Toggle label="موسيقى هادية" checked={s.music} onChange={(v) => game.updateSettings({ music: v })} note="منفصلة عن صوت التعليم، وبتخفت لما اللعبة تتكلم." />
      <Toggle label="مؤثرات صوتية" checked={s.sfx} onChange={(v) => game.updateSettings({ sfx: v })} />
      <fieldset className="field">
        <legend>تقليل الحركة</legend>
        {[["auto", "حسب إعداد الجهاز"], ["on", "تقليل الحركة (شغّال)"], ["off", "حركة عادية"]].map(([v, l]) => (
          <label key={v} className="radio">
            <input type="radio" name="motion" checked={s.reduceMotion === v} onChange={() => game.updateSettings({ reduceMotion: v })} /> {l}
          </label>
        ))}
      </fieldset>
      <Toggle label="الأرنب المساعد (التلميحات)" checked={s.bunny} onChange={(v) => game.updateSettings({ bunny: v })} />
      <Toggle label={`مناداة الطفلة باسم الدلع (${PRAISE_NAME}) في التشجيع`} checked={s.usePraiseName} onChange={(v) => game.updateSettings({ usePraiseName: v })} />
      <Toggle
        label="فتح كل المراحل"
        checked={s.unlockAll}
        onChange={(v) => game.updateSettings({ unlockAll: v })}
        note="لو فتحتي كل المراحل، المراجعة ممكن تسأل عن حاجات لسه ما اتعلمتش."
      />
      <p className="muted small">الاسم الحقيقي ({HERO_NAME}) واسم الدلع ({PRAISE_NAME}) بيتغيّروا من ملف src/config.js.</p>
    </div>
  );
}

function Data({ onAfterReset }) {
  const game = useGame();
  const [step, setStep] = useState(0);
  return (
    <div>
      <ul className="plain">
        <li>كل البيانات محفوظة على الجهاز ده بس (localStorage). مفيش حساب ولا سيرفر ولا تتبع ولا إعلانات ولا مشتريات ولا روابط خارجية.</li>
        <li>اللعبة ما بتطلبش اسم كامل ولا صورة حقيقية ولا ميكروفون ولا كاميرا ولا موقع.</li>
        <li>التقدم مش بيتزامن بين الأجهزة، وممكن يضيع لو بيانات المتصفح اتمسحت.</li>
        <li>كلام اللعبة من ملفات صوت جاهزة جوه اللعبة نفسها. صوت الحرف المنفرد (لو اعتمدتيه) بيعتمد على صوت الجهاز وممكن يحتاج إنترنت.</li>
      </ul>
      <div className={`voice-status ${game.storageOk ? "good" : "bad"}`} role="status">
        {game.storageOk ? "الحفظ شغال على الجهاز." : "الحفظ مش متاح دلوقتي — التقدم مؤقت وهيضيع لما تقفلي الصفحة."}
      </div>
      {game.recovered && <p className="muted small">لقينا بيانات تالفة قبل كده فبدأنا من جديد (اتحفظت نسخة منها على الجهاز).</p>}
      <h3>إعادة ضبط التقدم</h3>
      <p>هتمسح المراحل والنجوم والملصقات والتقدّم. الإعدادات هتفضل زي ما هي.</p>
      <button type="button" className="pbtn danger" onClick={() => setStep(1)}>
        إعادة ضبط التقدم…
      </button>
      {step === 1 && (
        <ConfirmDialog
          danger
          title="إعادة ضبط التقدم؟"
          text="ده هيمسح كل نجوم وملصقات وتقدّم الطفلة على الجهاز ده."
          yes="كمّلي"
          no="لا، ألغي"
          onYes={() => setStep(2)}
          onNo={() => setStep(0)}
        />
      )}
      {step === 2 && (
        <ConfirmDialog
          danger
          title="تأكيد أخير"
          text="مش هتقدري ترجّعي التقدم تاني. هل إنتِ متأكدة؟"
          yes="أيوه، امسحي التقدم نهائيًا"
          no="لا، سيبيه"
          onYes={() => {
            game.resetProgress();
            setStep(0);
            onAfterReset();
          }}
          onNo={() => setStep(0)}
        />
      )}
    </div>
  );
}

export default function ParentScreen({ onExit, onPlayLevel, startTab = "progress" }) {
  const [tab, setTab] = useState(startTab);
  useEffect(() => () => cancel(), []);
  return (
    <main className="screen parent-screen">
      <header className="parent-head">
        <h1>شاشة الأهل — {GAME_TITLE}</h1>
        <button type="button" className="pbtn primary" onClick={onExit}>
          رجوع للعبة
        </button>
      </header>
      <div className="tabs" role="tablist">
        {TABS.map(([id, label]) => (
          <button key={id} type="button" role="tab" aria-selected={tab === id} className={`tab ${tab === id ? "on" : ""}`} onClick={() => setTab(id)}>
            {label}
          </button>
        ))}
      </div>
      <section className="parent-body" role="tabpanel">
        {tab === "progress" && <Progress onPlayLevel={onPlayLevel} />}
        {tab === "voice" && <Voice />}
        {tab === "settings" && <Settings />}
        {tab === "data" && <Data onAfterReset={() => setTab("progress")} />}
      </section>
    </main>
  );
}
