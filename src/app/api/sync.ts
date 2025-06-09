import { request } from './index';

export const syncApi = {
  enabledSync: (params: any) => request('/sync/enabledSync', params),
  disableSync: () => request('/sync/disableSync', {}),
}; 