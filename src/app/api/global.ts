import { request } from './index';
import globalMock from '../mock/global';

export const globalApi = {
  getGlobalConfig: () =>
    globalMock['/global/getGlobalConfig']?.({}) || request('/global/getGlobalConfig', {}),
  getLatestVersion: () =>
    globalMock['/global/getLatestVersion']?.({}) || request('/global/getLatestVersion', {}),
}; 