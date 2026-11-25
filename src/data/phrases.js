// كل جمل التشجيع والتعليمات. أي نداء للبطلة بيستخدم PRAISE_NAME.
import { PRAISE_NAME, HERO_NAME } from "../config.js";

const call = (useName) => (useName ? ` يا ${PRAISE_NAME}` : "");

export const praiseLines = (useName = true) => [
  `برافو${call(useName)}!`,
  `شطورة${call(useName)}!`,
  "إنتي بطلة!",
];
export const retryLine = (useName = true) => `ولا يهمك${call(useName)}، نجرب تاني`;
export const helpLine = () => "تعالي نعملها سوا";
export const welcomeLine = (useName = true) => `أهلًا${call(useName)}! يلا نلعب`;
export const restLine = (useName = true) => `تعالي ناخد استراحة صغيرة${call(useName)}`;
export const starLine = (useName = true) => `نجمة جديدة${call(useName)}!`;
export const replayLine = (useName = true) => `حلو أوي${call(useName)}! كل مرة بتتعلمي أحسن`;
export const goMapLine = () => "نرجع للخريطة";
export const heroLabel = HERO_NAME;
