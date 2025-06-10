import { request } from './index';
import traceMock from '../mock/trace';

export const traceApi = {
  /**
   * 埋点追踪事件
   * @param data any 事件数据
   * @returns Promise<any>
   */
  traceEvent: (data: any) =>
    traceMock['/trace/traceEvent']?.(data) || request('/trace/traceEvent', data),
}; 