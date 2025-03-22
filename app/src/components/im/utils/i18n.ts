import en from "../locale/en";
import zh from "../locale/zh-Hans";
export const messages = {
  en,
  zh,
};
export const localeMap = {
  "zh-Hans": "zh",
  "zh-Hant": "zh",
  en: "en",
};

export const t = (key) => {
  return zh[key];
};
