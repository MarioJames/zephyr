import { request } from './index';

export const traceApi = {
  traceEvent: (data: any) => request('/trace/traceEvent', data),
}; 