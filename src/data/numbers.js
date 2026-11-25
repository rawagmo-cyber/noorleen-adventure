// الأعداد ١–١٠. القيمة value رقم حقيقي، والرمز العربي numeral للعرض فقط.
const AR_DIGITS = ["٠", "١", "٢", "٣", "٤", "٥", "٦", "٧", "٨", "٩"];
export const toArabicDigits = (n) => String(n).replace(/\d/g, (d) => AR_DIGITS[d]);

const N = (value, name, nameSpoken, femSpoken) => ({
  value,
  numeral: toArabicDigits(value),
  name,
  nameSpoken, // لما الصوت يعد
  femSpoken, // مع المعدود المؤنث (ثلاث تفاحات)
});

export const NUMBERS = [
  N(1, "واحد", "وَاحِد", "وَاحِدَة"),
  N(2, "اثنان", "اثْنَان", "اثْنَتَيْن"),
  N(3, "ثلاثة", "ثَلَاثَة", "ثَلَاث"),
  N(4, "أربعة", "أَرْبَعَة", "أَرْبَع"),
  N(5, "خمسة", "خَمْسَة", "خَمْس"),
  N(6, "ستة", "سِتَّة", "سِتّ"),
  N(7, "سبعة", "سَبْعَة", "سَبْع"),
  N(8, "ثمانية", "ثَمَانِيَة", "ثَمَانِي"),
  N(9, "تسعة", "تِسْعَة", "تِسْع"),
  N(10, "عشرة", "عَشَرَة", "عَشْر"),
];
export const NUMBER_BY_VALUE = Object.fromEntries(NUMBERS.map((n) => [n.value, n]));

// معدودات متطابقة وسهلة العد (كلها مؤنثة). art = اسم الرسمة.
export const COUNT_ITEMS = [
  { id: "apple", art: "apple", one: "تفاحة", dual: "تفاحتين", plural: "تفاحات", oneS: "تُفَّاحَة", dualS: "تُفَّاحَتَيْن", pluralS: "تُفَّاحَات" },
  { id: "star", art: "star", one: "نجمة", dual: "نجمتين", plural: "نجمات", oneS: "نَجْمَة", dualS: "نَجْمَتَيْن", pluralS: "نَجْمَات" },
  { id: "fish", art: "fish", one: "سمكة", dual: "سمكتين", plural: "سمكات", oneS: "سَمَكَة", dualS: "سَمَكَتَيْن", pluralS: "سَمَكَات" },
  { id: "flower", art: "flower", one: "زهرة", dual: "زهرتين", plural: "زهرات", oneS: "زَهْرَة", dualS: "زَهْرَتَيْن", pluralS: "زَهْرَات" },
  { id: "balloon", art: "balloon", one: "بالونة", dual: "بالونتين", plural: "بالونات", oneS: "بَالُونَة", dualS: "بَالُونَتَيْن", pluralS: "بَالُونَات" },
  { id: "ball", art: "ball", one: "كرة", dual: "كرتين", plural: "كرات", oneS: "كُرَة", dualS: "كُرَتَيْن", pluralS: "كُرَات" },
];
export const ITEM_BY_ID = Object.fromEntries(COUNT_ITEMS.map((i) => [i.id, i]));

// "٣ تفاحات" / "تفاحة واحدة" / "تفاحتين"
export function qtyText(value, item) {
  const n = NUMBER_BY_VALUE[value];
  if (value === 1) return { display: `${item.one} واحدة`, spoken: `${item.oneS} وَاحِدَة` };
  if (value === 2) return { display: item.dual, spoken: item.dualS };
  return { display: `${n.numeral} ${item.plural}`, spoken: `${n.femSpoken} ${item.pluralS}` };
}
