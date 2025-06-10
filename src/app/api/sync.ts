import { request } from './index';
import syncMock from '../mock/sync';

export const syncApi = {
  /**
   * 启用同步
   * @param params any 同步参数
   * @returns Promise<boolean>
   */
  enabledSync: (data: any) =>
    syncMock['/sync/enabledSync']?.(data) || request('/sync/enabledSync', data),
  /**
   * 禁用同步
   * @returns Promise<boolean>
   */
  disableSync: (data: any) =>
    syncMock['/sync/disableSync']?.(data) || request('/sync/disableSync', data),
}; 