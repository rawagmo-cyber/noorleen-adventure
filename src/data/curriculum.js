// المنهج: ٥ محطات بالترتيب، وكل محطة فيها مراحل قصيرة (٣–٥ أسئلة).
// كل الأسئلة بتتولد هنا من نفس البيانات (حروف/أعداد/ألوان/أشكال) بـ seed ثابت،
// فكل سؤال ليه id ثابت، وإجابة واحدة صحيحة، وصورة مطابقة.
import { LETTERS, LETTER_BY_CHAR, LETTER_GROUPS } from "./letters.js";
import { NUMBERS, NUMBER_BY_VALUE, COUNT_ITEMS, qtyText } from "./numbers.js";
import { COLORS, COLOR_BY_ID, SHAPES, SHAPE_BY_ID } from "./colorsShapes.js";
import { makeRng, shuffle } from "./rng.js";
import { QT, STAGE_KEYS, MATCH_INSTRUCTION, letterKey, wordKey, numKey, colorKey, shapeKey, thingKey, qtyClips } from "../audio/clips.js";

export const STAGES = [
  { id: "letters", name: "حديقة الحروف", clip: STAGE_KEYS.letters, icon: "garden" },
  { id: "numbers", name: "جزيرة الأعداد", clip: STAGE_KEYS.numbers, icon: "island" },
  { id: "colors", name: "بستان الألوان", clip: STAGE_KEYS.colors, icon: "orchard" },
  { id: "shapes", name: "مدينة الأشكال", clip: STAGE_KEYS.shapes, icon: "city" },
  { id: "bridge", name: "جسر المطابقة", clip: STAGE_KEYS.bridge, icon: "bridge" },
];

// ---------- أدوات مساعدة ----------
// يحط الإجابة الصح في مكان بيتغيّر من سؤال للي بعده
function makePlacer(start = 0) {
  let counter = start;
  let last = -1;
  return (answer, distractors) => {
    const n = distractors.length + 1;
    let p = counter++ % n;
    if (p === last) p = (p + 1) % n; // الإجابة الصح ما تفضلش في نفس المكان في سؤالين ورا بعض
    last = p;
    const opts = distractors.slice();
    opts.splice(p, 0, answer);
    return opts;
  };
}
const nOptsFor = (i, poolSize) => (i === 0 ? 2 : Math.min(3, poolSize));

function pickN(cands, n, rng) {
  return shuffle(cands, rng).slice(0, n);
}

// ---------- المحطة ١: الحروف ----------
function letterOption(ch) {
  return { id: `L:${ch}`, kind: "letter", ref: ch };
}
function wordOption(ch) {
  return { id: `W:${ch}`, kind: "word", ref: ch };
}

function lettersLevel(gi) {
  const group = LETTER_GROUPS[gi];
  const id = `letters-${gi + 1}`;
  const rng = makeRng(id);
  const learned = LETTER_GROUPS.slice(0, gi + 1).flat();
  const n = group.length;
  const T = n === 2 ? 4 : 5;
  const questions = [];
  const place = makePlacer(gi);
  for (let i = 0; i < T; i++) {
    const ch = group[i % n];
    const l = LETTER_BY_CHAR[ch];
    const isFind = i < n;
    const k = nOptsFor(i, learned.length) - 1;
    let opts;
    if (isFind) {
      const cands = learned.filter((c) => c !== ch);
      const far = cands.filter((c) => LETTER_BY_CHAR[c].family !== l.family);
      const near = cands.filter((c) => LETTER_BY_CHAR[c].family === l.family);
      const chosen = [...pickN(far, k, rng), ...pickN(near, k, rng)].slice(0, k);
      opts = place(letterOption(ch), chosen.map(letterOption));
    } else {
      const cands = learned.filter((c) => c !== ch);
      const ok = cands.filter((c) => !(l.confuse && LETTER_BY_CHAR[c].confuse === l.confuse));
      const chosen = [];
      for (const c of shuffle(ok.length >= k ? ok : cands, rng)) {
        const lc = LETTER_BY_CHAR[c];
        if (chosen.some((x) => lc.confuse && LETTER_BY_CHAR[x].confuse === lc.confuse)) continue;
        chosen.push(c);
        if (chosen.length === k) break;
      }
      opts = place(wordOption(ch), chosen.map(wordOption));
    }
    questions.push({
      id: `${id}:q${i + 1}`,
      levelId: id,
      type: "pick",
      skills: [`letter:${ch}`],
      prompt: isFind
        ? { display: `فين حرف ${l.nameDef}؟`, clips: [QT.whereLetter, letterKey(ch)] }
        : { display: `فين ${l.wordDef}؟`, clips: [QT.lookFor, wordKey(ch)] },
      hint: isFind ? { model: { kind: "letterWord", ref: ch } } : { model: { kind: "wordOnly", ref: ch } },
      layout: "grid",
      options: opts,
      answerId: isFind ? `L:${ch}` : `W:${ch}`,
    });
  }
  return {
    id,
    stageId: "letters",
    title: group.join(" "),
    badge: { kind: "chars", text: group.join(" ") },
    learn: group.map((ch) => ({ kind: "letter", ref: ch })),
    questions,
  };
}

// ---------- المحطة ٢: الأعداد ----------
const NUM_GROUPS = [[1, 2, 3], [4, 5], [6, 7, 8], [9, 10]];

function numericOption(v) {
  return { id: `N:${v}`, kind: "numeral", ref: v };
}
function qtyOption(v, itemId) {
  return { id: `Q:${v}`, kind: "qty", ref: v, item: itemId };
}

function numbersLevel(gi) {
  const group = NUM_GROUPS[gi];
  const id = `numbers-${gi + 1}`;
  const rng = makeRng(id);
  const learned = NUM_GROUPS.slice(0, gi + 1).flat();
  const n = group.length;
  const T = n === 2 ? 4 : 5;
  const types = ["numeral", "qty", "count", "numeral", "qty"];
  const questions = [];
  const place = makePlacer(gi + 1);
  for (let i = 0; i < T; i++) {
    const v = group[i % n];
    const type = types[i];
    const item = COUNT_ITEMS[(gi * 2 + i) % COUNT_ITEMS.length];
    const k = nOptsFor(i, learned.length) - 1;
    const cands = learned.filter((x) => x !== v);
    const chosen = pickN(cands, k, rng);
    const num = NUMBER_BY_VALUE[v];
    const q = { id: `${id}:q${i + 1}`, levelId: id, type: "pick", skills: [`number:${v}`], answerId: null };
    if (type === "numeral") {
      q.prompt = { display: `فين الرقم ${num.numeral}؟`, clips: [QT.whereNum, numKey(v)] };
      q.hint = { model: { kind: "numberItems", ref: v, item: item.id } };
      q.options = place(numericOption(v), chosen.map(numericOption));
      q.answerId = `N:${v}`;
      q.layout = "grid";
    } else if (type === "qty") {
      const t = qtyText(v, item);
      // مفيش قالب "فين" للكميات، فبنستخدم "دوري على" + الكمية (مثلًا: دوري على تلاتة تفاحات)
      q.prompt = { display: `فين ${t.display}؟`, clips: [QT.lookFor, ...qtyClips(v, item.id)] };
      q.hint = { model: { kind: "countHint", ref: v, item: item.id } };
      q.options = place(qtyOption(v, item.id), chosen.map((c) => qtyOption(c, item.id)));
      q.answerId = `Q:${v}`;
      q.layout = "stack";
    } else {
      q.prompt = { display: `عدّي معايا. كام ${item.one}؟`, clips: [QT.countWithMe] };
      q.hint = { model: { kind: "countHint", ref: v, item: item.id } };
      q.options = place(numericOption(v), chosen.map(numericOption));
      q.answerId = `N:${v}`;
      q.layout = "grid";
      q.countTarget = { value: v, item: item.id };
    }
    questions.push(q);
  }
  return {
    id,
    stageId: "numbers",
    title: group.map((v) => NUMBER_BY_VALUE[v].numeral).join(" "),
    badge: { kind: "chars", text: group.map((v) => NUMBER_BY_VALUE[v].numeral).join(" ") },
    learn: group.map((v) => ({ kind: "number", ref: v, item: COUNT_ITEMS[v % COUNT_ITEMS.length].id })),
    questions,
  };
}

// ---------- المحطة ٣: الألوان ----------
const COLOR_GROUPS = [["red", "blue"], ["yellow"], ["green", "orange"], ["purple"]];
const swatchOption = (c) => ({ id: `S:${c}`, kind: "swatch", ref: c });
const thingOption = (c) => ({ id: `T:${c}`, kind: "thing", ref: c });

function colorsLevel(gi) {
  const group = COLOR_GROUPS[gi];
  const id = `colors-${gi + 1}`;
  const rng = makeRng(id);
  const learned = COLOR_GROUPS.slice(0, gi + 1).flat();
  const earlier = learned.filter((c) => !group.includes(c));
  const T = group.length === 2 ? 4 : 3;
  const seq = [...group.map((c) => ["swatch", c]), ...group.map((c) => ["thing", c])];
  let r = 0;
  while (seq.length < T) {
    const pool = earlier.length ? earlier : group;
    seq.push(["thing", pool[r++ % pool.length]]);
  }
  seq.length = T;
  const questions = [];
  const place = makePlacer(gi);
  seq.forEach(([type, c], i) => {
    const col = COLOR_BY_ID[c];
    const k = nOptsFor(i, learned.length) - 1;
    const chosen = pickN(learned.filter((x) => x !== c), k, rng);
    const q = { id: `${id}:q${i + 1}`, levelId: id, type: "pick", skills: [`color:${c}`], layout: "grid" };
    if (type === "swatch") {
      q.prompt = { display: `فين اللون ${"ال" + col.name}؟`, clips: [QT.whereColor, colorKey(c)] };
      q.hint = { model: { kind: "colorThing", ref: c } };
      q.options = place(swatchOption(c), chosen.map(swatchOption));
      q.answerId = `S:${c}`;
    } else {
      q.prompt = { display: `فين حاجة لونها ${col.name}؟`, clips: [QT.whereThingColor, colorKey(c)] };
      q.hint = { model: { kind: "swatchOnly", ref: c } };
      q.options = place(thingOption(c), chosen.map(thingOption));
      q.answerId = `T:${c}`;
    }
    questions.push(q);
  });
  return {
    id,
    stageId: "colors",
    title: group.map((c) => COLOR_BY_ID[c].name).join(" و"),
    badge: { kind: "colors", colors: group },
    learn: group.map((c) => ({ kind: "color", ref: c })),
    questions,
  };
}

// ---------- المحطة ٤: الأشكال ----------
const SHAPE_GROUPS = [["circle"], ["square"], ["triangle"], ["rectangle"]];
const shapeOption = (s) => ({ id: `H:${s}`, kind: "shape", ref: s });

function shapesLevel(gi) {
  const s = SHAPE_GROUPS[gi][0];
  const id = `shapes-${gi + 1}`;
  const rng = makeRng(id);
  const learned = SHAPE_GROUPS.slice(0, gi + 1).flat();
  const seq = [["find", s], ["match", s], ["find", s], ["match", gi === 0 ? s : learned[Math.floor(rng() * learned.length)]]];
  const questions = [];
  const place = makePlacer(gi);
  seq.forEach(([type, t], i) => {
    const sh = SHAPE_BY_ID[t];
    let pool = learned.slice();
    if (pool.length < 2) pool.push("triangle"); // مجرد اختيار تاني للمقارنة، مش بنسأل عنه
    // المربع والمستطيل ما يتحطوش مع بعض في أول سؤالين من مرحلة المستطيل
    if (s === "rectangle" && i < 2) pool = pool.filter((x) => x !== "square");
    const k = nOptsFor(i, pool.length) - 1;
    const chosen = pickN(pool.filter((x) => x !== t), k, rng);
    const q = { id: `${id}:q${i + 1}`, levelId: id, type: "pick", skills: [`shape:${t}`], layout: "grid" };
    q.options = place(shapeOption(t), chosen.map(shapeOption));
    q.answerId = `H:${t}`;
    if (type === "find") {
      q.prompt = { display: `فين ${sh.defSpoken.replace(/[ً-ْ]/g, "")}؟`, clips: [QT.whereShape, shapeKey(t)] };
      q.hint = { model: { kind: "shapeCard", ref: t } };
    } else {
      q.prompt = { display: "فين شكل زي ده؟", clips: [QT.whereShape] };
      q.hint = { model: { kind: "shapeCard", ref: t } };
      q.target = { kind: "shape", ref: t };
    }
    questions.push(q);
  });
  const sh0 = SHAPE_BY_ID[s];
  return {
    id,
    stageId: "shapes",
    title: sh0.name,
    badge: { kind: "shape", shape: s },
    learn: [{ kind: "shape", ref: s }],
    questions,
  };
}

// ---------- المحطة ٥: جسر المطابقة ----------
function derange(arr, rng) {
  if (arr.length < 2) return arr.slice();
  for (let t = 0; t < 20; t++) {
    const s = shuffle(arr, rng);
    if (s.every((x, i) => x !== arr[i])) return s;
  }
  return arr.slice(1).concat(arr[0]);
}

function boardQuestion(levelId, i, prompt, pairs, skills, rng) {
  const ids = pairs.map((p) => p.id);
  return {
    id: `${levelId}:q${i + 1}`,
    levelId,
    type: "pairs",
    skills,
    prompt,
    hint: { model: null },
    pairs,
    keysOrder: ids,
    matchesOrder: derange(ids, rng),
  };
}

const BRIDGE_LETTERS = [["أ", "ب"], ["ت", "ج", "د"], ["ر", "س", "ش"], ["ع", "ف", "م"], ["ك", "ن", "و"]];
const BRIDGE_NUMS = [[1, 3], [2, 4, 5], [6, 7, 8], [9, 10, 5]];

function bridgeLevel(bi) {
  const id = `bridge-${bi + 1}`;
  const rng = makeRng(id);
  const questions = [];
  if (bi === 0) {
    BRIDGE_LETTERS.forEach((set, i) => {
      const pairs = set.map((ch) => {
        const l = LETTER_BY_CHAR[ch];
        return {
          id: `p${ch}`,
          key: { kind: "letter", ref: ch },
          match: { kind: "word", ref: ch },
          keyClips: [letterKey(ch)],
          matchClips: [wordKey(ch)],
        };
      });
      questions.push(
        boardQuestion(
          id,
          i,
          { display: "وصّلي كل حرف بصورته", clips: [MATCH_INSTRUCTION.letters] },
          pairs,
          set.map((c) => `letter:${c}`),
          rng
        )
      );
    });
    return { id, stageId: "bridge", title: "حرف وصورة", badge: { kind: "bridge", icon: "letters" }, learn: [], questions };
  }
  if (bi === 1) {
    BRIDGE_NUMS.forEach((set, i) => {
      const item = COUNT_ITEMS[(i + 1) % COUNT_ITEMS.length];
      const pairs = set.map((v) => ({
        id: `p${v}`,
        key: { kind: "numeral", ref: v },
        match: { kind: "qty", ref: v, item: item.id },
        keyClips: [numKey(v)],
        matchClips: qtyClips(v, item.id),
      }));
      questions.push(
        boardQuestion(
          id,
          i,
          { display: "وصّلي كل رقم بعدده", clips: [MATCH_INSTRUCTION.numbers] },
          pairs,
          set.map((v) => `number:${v}`),
          rng
        )
      );
    });
    return { id, stageId: "bridge", title: "رقم وكمية", badge: { kind: "bridge", icon: "numbers" }, learn: [], questions };
  }
  // bi === 2: ألوان وأشكال
  const colorBoards = [["red", "blue", "yellow"], ["green", "orange", "purple"]];
  colorBoards.forEach((set, i) => {
    const pairs = set.map((c) => ({
      id: `p${c}`,
      key: { kind: "swatch", ref: c },
      match: { kind: "thing", ref: c },
      keyClips: [colorKey(c)],
      matchClips: [thingKey(c)],
    }));
    questions.push(
      boardQuestion(
        id,
        i,
        { display: "وصّلي كل لون بحاجة لونها زيه", clips: [MATCH_INSTRUCTION.colors] },
        pairs,
        set.map((c) => `color:${c}`),
        rng
      )
    );
  });
  const shapeBoards = [["circle", "square", "triangle"], ["rectangle", "circle", "triangle"]];
  shapeBoards.forEach((set, j) => {
    const pairs = set.map((s) => ({
      id: `p${s}`,
      key: { kind: "shapeOutline", ref: s },
      match: { kind: "shape", ref: s },
      keyClips: [shapeKey(s)],
      matchClips: [shapeKey(s)],
    }));
    questions.push(
      boardQuestion(
        id,
        colorBoards.length + j,
        { display: "وصّلي كل شكل بالشكل اللي زيه", clips: [MATCH_INSTRUCTION.shapes] },
        pairs,
        set.map((s) => `shape:${s}`),
        rng
      )
    );
  });
  return { id, stageId: "bridge", title: "لون وشكل", badge: { kind: "bridge", icon: "colorshape" }, learn: [], questions };
}

// ---------- تجميع المراحل ----------
export const LEVELS = [
  ...LETTER_GROUPS.map((_, i) => lettersLevel(i)),
  ...NUM_GROUPS.map((_, i) => numbersLevel(i)),
  ...COLOR_GROUPS.map((_, i) => colorsLevel(i)),
  ...SHAPE_GROUPS.map((_, i) => shapesLevel(i)),
  ...[0, 1, 2].map((i) => bridgeLevel(i)),
].map((lv, index) => ({ ...lv, index }));

export const LEVEL_BY_ID = Object.fromEntries(LEVELS.map((l) => [l.id, l]));
export const levelsOfStage = (stageId) => LEVELS.filter((l) => l.stageId === stageId);
export const stageOf = (id) => STAGES.find((s) => s.id === id);

export const introKey = (item) => `${item.kind}:${item.ref}`;

// كل المهارات اللي ممكن تظهر في شاشة الأهل
export const ALL_SKILLS = {
  letters: LETTERS.map((l) => ({ key: `letter:${l.char}`, label: l.char, kind: "letter", ref: l.char })),
  numbers: NUMBERS.map((n) => ({ key: `number:${n.value}`, label: n.numeral, kind: "number", ref: n.value })),
  colors: COLORS.map((c) => ({ key: `color:${c.id}`, label: c.name, kind: "color", ref: c.id })),
  shapes: SHAPES.map((s) => ({ key: `shape:${s.id}`, label: s.name, kind: "shape", ref: s.id })),
};
