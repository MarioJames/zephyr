import { request } from './index';

export const threadApi = {
  getThreads: (topicId: string) => request('/thread/getThreads', { topicId }),
  createThreadWithMessage: (input: any) => request('/thread/createThreadWithMessage', input),
  updateThread: (id: string, data: any) => request('/thread/updateThread', { id, data }),
  removeThread: (id: string) => request('/thread/removeThread', { id }),
}; 