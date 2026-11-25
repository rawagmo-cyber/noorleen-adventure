// الألوان: لون واحد ثابت (hex) لكل لون، بيُستخدم في الشرح والسؤال بنفس القيمة بالظبط.
export const COLORS = [
  { id: "red", name: "أحمر", spoken: "أَحْمَر", defSpoken: "الأَحْمَر", hex: "#E53935", thing: "apple", thingName: "تفاحة", thingSpoken: "تُفَّاحَة" },
  { id: "blue", name: "أزرق", spoken: "أَزْرَق", defSpoken: "الأَزْرَق", hex: "#1E88E5", thing: "balloon", thingName: "بالونة", thingSpoken: "بَالُونَة" },
  { id: "yellow", name: "أصفر", spoken: "أَصْفَر", defSpoken: "الأَصْفَر", hex: "#FDD835", thing: "banana", thingName: "موزة", thingSpoken: "مَوْزَة" },
  { id: "green", name: "أخضر", spoken: "أَخْضَر", defSpoken: "الأَخْضَر", hex: "#43A047", thing: "leaf", thingName: "ورقة شجر", thingSpoken: "وَرَقَة شَجَر" },
  { id: "orange", name: "برتقالي", spoken: "بُرْتُقَالِي", defSpoken: "الْبُرْتُقَالِي", hex: "#FB8C00", thing: "orange", thingName: "برتقالة", thingSpoken: "بُرْتُقَالَة" },
  { id: "purple", name: "بنفسجي", spoken: "بَنَفْسَجِي", defSpoken: "الْبَنَفْسَجِي", hex: "#8E24AA", thing: "flower", thingName: "زهرة", thingSpoken: "زَهْرَة" },
];
export const COLOR_BY_ID = Object.fromEntries(COLORS.map((c) => [c.id, c]));

export const SHAPES = [
  { id: "circle", name: "دائرة", spoken: "دَائِرَة", defSpoken: "الدَّائِرَة" },
  { id: "square", name: "مربع", spoken: "مُرَبَّع", defSpoken: "الْمُرَبَّع" },
  { id: "triangle", name: "مثلث", spoken: "مُثَلَّث", defSpoken: "الْمُثَلَّث" },
  { id: "rectangle", name: "مستطيل", spoken: "مُسْتَطِيل", defSpoken: "الْمُسْتَطِيل" },
];
export const SHAPE_BY_ID = Object.fromEntries(SHAPES.map((s) => [s.id, s]));
