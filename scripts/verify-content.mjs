// فحص المحتوى: يغطي الحروف ٢٨ والأعداد ١–١٠ والألوان والأشكال، وإجابة واحدة صحيحة لكل سؤال.
import { LETTERS } from "../src/data/letters.js";
import { NUMBERS } from "../src/data/numbers.js";
import { COLORS, SHAPES } from "../src/data/colorsShapes.js";
import { LEVELS } from "../src/data/curriculum.js";
import { WORD_ART_KEYS } from "./art-keys.mjs";

let errors = 0;
const fail = (m) => { errors++; console.error("✗", m); };
const ok = (m) => console.log("✓", m);

const expectedWords = "أسد بطة تفاحة ثعلب جمل حصان خيار دب ذرة رمان زهرة سمكة شمس صقر ضفدع طائرة ظرف عنب غزال فراشة قمر كرة ليمون موز نحلة هلال وردة يد".split(" ");
const expectedChars = "أبتثجحخدذرزسشصضطظعغفقكلمنهوي".split("");
if (LETTERS.length !== 28) fail("عدد الحروف " + LETTERS.length);
LETTERS.forEach((l, i) => {
  if (l.char !== expectedChars[i]) fail(`الحرف ${i}: ${l.char} بدل ${expectedChars[i]}`);
  if (l.word !== expectedWords[i]) fail(`كلمة ${l.char}: ${l.word} بدل ${expectedWords[i]}`);
  if (!WORD_ART_KEYS.includes(l.art)) fail(`مفيش رسمة للكلمة ${l.word} (${l.art})`);
  if (!l.nameSpoken || !l.nameDefSpoken || !l.wordSpoken || !l.wordDefSpoken || !l.letterName || !l.letterSound) fail(`بيانات ناقصة للحرف ${l.char}`);
  if (l.letterName === l.letterSound) fail(`اسم الحرف = صوته: ${l.char}`);
});
if (new Set(LETTERS.map((l) => l.art)).size !== 28) fail("رسمات مكررة بين الكلمات");
if (LETTERS.find((l) => l.id === "hha").char !== "ه") fail("الهاء لازم تتخزن ه");
ok("الحروف ٢٨ بالكلمات والرسومات المطابقة");

if (NUMBERS.map((n) => n.value).join() !== "1,2,3,4,5,6,7,8,9,10") fail("الأعداد");
if (NUMBERS.some((n) => typeof n.value !== "number")) fail("قيم الأعداد لازم أرقام");
ok("الأعداد ١–١٠ مخزّنة كأرقام");
if (COLORS.length !== 6 || SHAPES.length !== 4) fail("ألوان/أشكال ناقصة");

// تغطية المراحل
const introduced = new Set();
LEVELS.forEach((lv) => lv.learn.forEach((it) => introduced.add(`${it.kind}:${it.ref}`)));
for (const l of LETTERS) if (!introduced.has(`letter:${l.char}`)) fail("حرف مش متقدّم: " + l.char);
for (const n of NUMBERS) if (!introduced.has(`number:${n.value}`)) fail("رقم مش متقدّم: " + n.value);
for (const c of COLORS) if (!introduced.has(`color:${c.id}`)) fail("لون مش متقدّم: " + c.id);
for (const s of SHAPES) if (!introduced.has(`shape:${s.id}`)) fail("شكل مش متقدّم: " + s.id);
ok("كل الحروف والأرقام والألوان والأشكال بتتقدّم بكارت قبل التدريب");

// الأسئلة
const seenIds = new Set();
let qCount = 0;
const seenSoFar = new Set();
LEVELS.forEach((lv) => {
  lv.learn.forEach((it) => seenSoFar.add(`${it.kind}:${it.ref}`));
  if (lv.questions.length < 3 || lv.questions.length > 5) fail(`${lv.id}: عدد الأسئلة ${lv.questions.length}`);
  lv.questions.forEach((q, qi) => {
    qCount++;
    if (seenIds.has(q.id)) fail("id مكرر " + q.id);
    seenIds.add(q.id);
    if (!q.prompt.spoken || !q.prompt.display) fail(q.id + " بدون نص");
    if (!q.hint || !q.hint.spoken) fail(q.id + " بدون تلميح");
    if (!q.skills.length) fail(q.id + " بدون مهارة");
    if (lv.stageId !== "bridge") {
      // السؤال لازم يكون عن حاجة اتعرضت قبل كده
      q.skills.forEach((s) => { if (!seenSoFar.has(s) && !/^(letter|number|color|shape):/.test(s)) fail(q.id + " مهارة غريبة " + s); });
    }
    if (q.type === "pick") {
      const ids = q.options.map((o) => o.id);
      if (new Set(ids).size !== ids.length) fail(q.id + " اختيارات مكررة");
      if (ids.filter((x) => x === q.answerId).length !== 1) fail(q.id + " لازم إجابة صحيحة واحدة");
      const exp = qi === 0 ? 2 : 3;
      if (ids.length < 2 || ids.length > 3) fail(q.id + " عدد الاختيارات " + ids.length);
      if (qi === 0 && ids.length !== 2 && lv.options !== undefined) fail(q.id + " أول سؤال لازم اتنين");
      if (q.options[0].kind === "qty") {
        const vals = q.options.map((o) => o.ref);
        if (new Set(vals).size !== vals.length) fail(q.id + " كميات مكررة");
        if (q.options.find((o) => o.id === q.answerId).ref !== q.skills[0].split(":")[1] * 1) fail(q.id + " الكمية مش مطابقة للإجابة");
      }
      if (q.options[0].kind === "word") {
        // صورتين لنفس الحرف ممنوع + مفيش صور ممكن تتلخبط
        const chars = q.options.map((o) => o.ref);
        const confs = chars.map((c) => LETTERS.find((l) => l.char === c).confuse).filter(Boolean);
        if (new Set(confs).size !== confs.length) fail(q.id + " صور ممكن تتلخبط في نفس السؤال");
      }
      if (q.countTarget) {
        const ans = q.options.find((o) => o.id === q.answerId);
        if (ans.ref !== q.countTarget.value) fail(q.id + " الإجابة مش بتطابق عدد العناصر المرسومة");
      }
    } else {
      const ids = q.pairs.map((p) => p.id);
      if (new Set(ids).size !== ids.length) fail(q.id + " أزواج مكررة");
      if (q.pairs.length < 2 || q.pairs.length > 3) fail(q.id + " عدد الأزواج");
      if (q.keysOrder.join() === q.matchesOrder.join()) fail(q.id + " ترتيب المفاتيح = ترتيب الإجابات");
      const matchRefs = q.pairs.map((p) => p.match.kind + p.match.ref);
      if (new Set(matchRefs).size !== matchRefs.length) fail(q.id + " إجابات مكررة");
    }
  });
});
ok(`${LEVELS.length} مرحلة و${qCount} سؤال، كل سؤال له id ثابت وإجابة صحيحة واحدة`);

// تغيير مكان الإجابة الصحيحة بين الأسئلة المتتالية
let sameRun = 0;
LEVELS.forEach((lv) => {
  const pos = lv.questions.filter((q) => q.type === "pick").map((q) => q.options.findIndex((o) => o.id === q.answerId));
  for (let i = 1; i < pos.length; i++) if (pos[i] === pos[i - 1]) sameRun++;
});
if (sameRun > 0) fail("إجابات صحيحة في نفس المكان في أسئلة متتالية: " + sameRun);
else ok("مكان الإجابة الصحيحة بيتغيّر بين الأسئلة");

// ثبات الـ ids بين تشغيلين
console.log(errors ? `\n${errors} مشكلة` : "\nكل الفحوصات نجحت ✔");
process.exit(errors ? 1 : 0);
