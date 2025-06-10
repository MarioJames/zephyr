import { request } from './index';
import searchMock from '../mock/search';

export const searchApi = {
  search: (query: string, optionalParams?: object) =>
    searchMock['/search/search']?.({ query, ...optionalParams }) || request('/search/search', { query, ...optionalParams }),
  crawlPage: (url: string) =>
    searchMock['/search/crawlPage']?.({ url }) || request('/search/crawlPage', { url }),
  crawlPages: (urls: string[]) =>
    searchMock['/search/crawlPages']?.({ urls }) || request('/search/crawlPages', { urls }),
}; 