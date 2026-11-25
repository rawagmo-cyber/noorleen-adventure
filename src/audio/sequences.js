// سلاسل المقاطع لكل موضع في اللعبة (كل قالب بتركيبته). بتتشغل بـ playClips.
import { QT, letterKey, wordKey, numKey, colorKey, shapeKey, thingKey, qtyClips, COMMON_KEYS, STAGE_KEYS } from "./clips.js";
import { LETTER_BY_CHAR } from "../data/letters.js";

/** كارت التقديم: "ده حرف ألف" + الكلمة، "ده اللون أحمر" + الحاجة، الشكل باسمه، "ده رقم خمسة" */
export function introClips(item) {
  switch (item.kind) {
    case "letter":
      return [QT.thisLetter, letterKey(item.ref), wordKey(item.ref)];
    case "number":
      return [QT.thisNum, numKey(item.ref)];
    case "color":
      return [QT.thisColor, colorKey(item.ref), thingKey(item.ref)];
    case "shape":
      return [shapeKey(item.ref)];
    default:
      return [];
  }
}

/** اللمس على بلاطة في كارت التقديم */
export const tapLetterClips = (ch) => [QT.thisLetter, letterKey(ch)];
export const tapWordClips = (ch) => [wordKey(ch)];
export const tapColorClips = (id) => [QT.thisColor, colorKey(id)];
export const tapThingClips = (id) => [thingKey(id)];
export const tapShapeClips = (id) => [shapeKey(id)];

/** مثال "دوسي على الأسد" */
export const TUTORIAL_CLIPS = [QT.lookFor, wordKey("أ")];

/** كل المفاتيح اللي المرحلة دي ممكن تحتاجها (للتحميل المسبق: المرحلة الحالية بس) */
export function levelClipKeys(level) {
  const keys = new Set(COMMON_KEYS);
  const add = (arr) => (arr || []).forEach((k) => k && keys.add(k));
  (level.learn || []).forEach((it) => {
    add(introClips(it));
    if (it.kind === "letter") add([wordKey(it.ref)]);
    if (it.kind === "number") {
      for (let v = 1; v <= it.ref; v++) add([numKey(v)]);
      add(qtyClips(it.ref, it.item));
    }
  });
  for (const q of level.questions) {
    add(q.prompt.clips);
    if (q.countTarget) for (let v = 1; v <= q.countTarget.value; v++) add([numKey(v)]);
    (q.pairs || []).forEach((p) => {
      add(p.keyClips);
      add(p.matchClips);
    });
  }
  return [...keys];
}

export { STAGE_KEYS, LETTER_BY_CHAR };
