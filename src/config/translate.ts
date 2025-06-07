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
export const DEFAULT_LANG = "zh-CN";

export const locales = ["ko-KR", "zh-CN"] as const;

export type Locales = (typeof locales)[number];

/**
 * Check if the language is supported
 * @param locale
 */
export const isLocaleNotSupport = (locale: string) => !locales.includes(locale as Locales);
