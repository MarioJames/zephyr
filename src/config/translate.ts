export const localeOptions = [
  {
    label: "简体中文",
    value: "zh-CN",
  },
  {
    label: "한국어",
    value: "ko-KR",
  },
];

export const locales = ["ko-KR", "zh-CN"] as const;

export type Locales = (typeof locales)[number];