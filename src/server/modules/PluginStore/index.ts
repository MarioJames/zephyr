import urlJoin from 'url-join';

import { appEnv } from '@/config/app';
import { DEFAULT_LANG, isLocaleNotSupport, Locales } from '@/config/translate';

export class PluginStore {
  private readonly baseUrl: string;

  constructor(baseUrl?: string) {
    this.baseUrl = baseUrl || appEnv.PLUGINS_INDEX_URL;
  }

  getPluginIndexUrl = (lang: Locales = DEFAULT_LANG) => {
    if (isLocaleNotSupport(lang)) return this.baseUrl;

    return urlJoin(this.baseUrl, `index.${lang}.json`);
  };
}
