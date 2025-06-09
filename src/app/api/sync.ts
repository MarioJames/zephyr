import { request } from './index';

export const syncApi = {
  /**
   * 启用同步
   * @param params any 同步参数
   * @returns Promise<boolean>
   */
  enabledSync: (params: any) => request('/sync/enabledSync', params),
  /**
   * 禁用同步
   * @returns Promise<boolean>
   */
  disableSync: () => request('/sync/disableSync', {}),
}; 