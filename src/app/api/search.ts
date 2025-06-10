import { request } from './index';

export const searchApi = {
  search: (query: string, optionalParams?: object) =>
    request('/search/search', { query, ...optionalParams }),
  crawlPage: (url: string) =>
    request('/search/crawlPage', { url }),
  crawlPages: (urls: string[]) =>
    request('/search/crawlPages', { urls }),
}; 