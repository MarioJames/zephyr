import { request } from './index';

export const traceApi = {
  /**
   * 埋点追踪事件
   * @param data any 事件数据
   * @returns Promise<any>
   */
  traceEvent: (data: any) => request('/trace/traceEvent', data),
}; 