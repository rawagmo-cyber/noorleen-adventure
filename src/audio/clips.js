// بيحوّل بيانات اللعبة (حرف/رقم/لون/شكل/معدود) لمفاتيح المقاطع الصوتية في manifest.json.
// القوالب (q_*) بتتشغل الأول وبعدها الكلمة: playClips([QT.whereLetter, letterKey("ب")]).
import { LETTERS } from "../data/letters.js";
import { COLORS, SHAPES } from "../data/colorsShapes.js";
import { PRAISE_NAME, HERO_NAME } from "../config.js";

const pad = (n) => String(n).padStart(2, "0");

// ---------- قوالب الجمل
export const QT = {
  whereLetter: "q_where_letter",
  thisLetter: "q_this_letter",
  lookFor: "q_look_for",
  whereNum: "q_where_num",
  thisNum: "q_this_num",
  countWithMe: "q_count_with_me",
  whereColor: "q_where_color",
  thisColor: "q_this_color",
  whereThingColor: "q_where_thing_color",
  whereShape: "q_where_shape",
};
export const MATCH_INSTRUCTION = {
  letters: "i_match_letter",
  numbers: "i_match_num",
  colors: "i_match_color",
  shapes: "i_match_shape",
};
export const STAGE_KEYS = { letters: "s_1", numbers: "s_2", colors: "s_3", shapes: "s_4", bridge: "s_5" };

// ---------- حروف وكلمات (بنفس ترتيب الأبجدية: ١ للألف ... ٢٨ للياء)
const LETTER_INDEX = Object.fromEntries(LETTERS.map((l, i) => [l.char, i + 1]));
export const letterKey = (ch) => `letter_${pad(LETTER_INDEX[ch])}`;
export const wordKey = (ch) => `word_${pad(LETTER_INDEX[ch])}`;

// ---------- أرقام
export const numKey = (v) => `num_${pad(v)}`;

// ---------- ألوان وأشكال
const COLOR_INDEX = Object.fromEntries(COLORS.map((c, i) => [c.id, i + 1]));
export const colorKey = (id) => `color_${pad(COLOR_INDEX[id])}`;
const SHAPE_INDEX = Object.fromEntries(SHAPES.map((s, i) => [s.id, i + 1]));
export const shapeKey = (id) => `shape_${pad(SHAPE_INDEX[id])}`;

// الحاجة اللي لونها كذا (اسمها اتسجل تحت word_ أو obj_)
const THING_KEY = {
  apple: "word_03", // تفاحة
  balloon: "obj_10", // بالونة
  banana: "obj_09", // موزة
  leaf: "obj_01", // ورقة شجر
  orange: "obj_08", // برتقالة
  flower: "word_11", // زهرة
};
export const thingKey = (colorId) => THING_KEY[COLORS.find((c) => c.id === colorId).thing];

// ---------- المعدودات: مفرد / مثنى / جمع
const SINGULAR = { apple: "word_03", fish: "word_12", flower: "word_11", balloon: "obj_10", ball: "word_22" }; // مفيش مفرد للنجمة
const PLURAL = {
  apple: ["plural_tafaha2", "plural_tafahat"],
  star: ["plural_nagma2", "plural_nagmat"],
  fish: ["plural_samaka2", "plural_samakat"],
  flower: ["plural_zahra2", "plural_zahrat"],
  balloon: ["plural_balona2", "plural_balonat"],
  ball: ["plural_kora2", "plural_korat"],
};
/** الكمية ١ = الكلمة المفردة، ٢ = المثنى، ٣–١٠ = الرقم ثم الجمع. (النجمة المفردة مالهاش مقطع) */
export function qtyClips(value, itemId) {
  if (value === 1) return SINGULAR[itemId] ? [SINGULAR[itemId]] : [];
  if (value === 2) return [PLURAL[itemId][0]];
  return [numKey(value), PLURAL[itemId][1]];
}
export const hasSingular = (itemId) => !!SINGULAR[itemId];

// ---------- التشجيع والتصحيح
const NEUTRAL_PRAISE = ["p_batala", "p_helw", "p_better"];
// المقاطع المسجّلة بالأسماء. لو غيّرتي الاسم في config.js لاسم مالوش تسجيل، بنستخدم المقاطع من غير اسم بس.
const NAMED_PRAISE = {
  لولي: ["p_bravo_lola", "p_shatra_lola"],
  نورلين: ["p_bravo_noorleen", "p_shatra_noorleen"],
};
const NICK = NAMED_PRAISE[PRAISE_NAME] || [];
const REAL = HERO_NAME !== PRAISE_NAME ? NAMED_PRAISE[HERO_NAME] || [] : [];
const REAL_NAME_CHANCE = 0.2; // الاسم الحقيقي مرة من كل ٥ تقريبًا؛ الباقي اسم الدلع أو من غير اسم
if (!NICK.length && typeof console !== "undefined") {
  console.warn(`[audio] مفيش تسجيل تشجيع باسم "${PRAISE_NAME}"؛ هنستخدم المقاطع من غير اسم.`);
}

let lastPraise = null;
/** مقطع تشجيع واحد، من غير تكرار ورا بعض. useName=false: مقاطع من غير أي اسم. */
export function pickPraise(useName = true, rand = Math.random) {
  let pool;
  if (!useName) pool = NEUTRAL_PRAISE;
  else if (REAL.length && rand() < REAL_NAME_CHANCE) pool = REAL;
  else pool = [...NICK, ...NEUTRAL_PRAISE];
  const choices = pool.filter((k) => k !== lastPraise);
  const key = choices[Math.floor(rand() * choices.length)] || pool[0];
  lastPraise = key;
  return key;
}
export const ALL_PRAISE_KEYS = [...NEUTRAL_PRAISE, ...NICK, ...REAL];

const RETRY_KEYS = ["p_never_mind", "p_try_again"];
let lastRetry = null;
export function pickRetry(rand = Math.random) {
  const choices = RETRY_KEYS.filter((k) => k !== lastRetry);
  const key = choices[Math.floor(rand() * choices.length)];
  lastRetry = key;
  return key;
}
export const HELP_KEY = "p_together";
export const STAR_KEY = "p_star";
export const BREAK_KEY = "p_break";
export const CONTINUE_KEY = "p_continue";
export const WELCOME_KEY = "p_welcome";
export const LETS_PLAY_KEY = "p_lets_play";
export const COMMON_KEYS = [...ALL_PRAISE_KEYS, ...RETRY_KEYS, HELP_KEY, STAR_KEY];
