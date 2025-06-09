import { request } from './index';

export const globalApi = {
  getGlobalConfig: () => request('/global/getGlobalConfig', {}),
  getLatestVersion: () => request('/global/getLatestVersion', {}),
}; 