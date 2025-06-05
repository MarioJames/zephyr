import { LocaleMode } from '@/types/locale';

import { setCookie } from './cookie';

export const switchLang = (locale: LocaleMode) => {
  const lang = locale === 'auto' ? navigator.language : locale;

  document.documentElement.lang = lang;

  setCookie('LOBE_LOCALE', locale === 'auto' ? undefined : locale, 365);
};
