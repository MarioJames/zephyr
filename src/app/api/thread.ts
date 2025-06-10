import { request } from './index';
import threadMock from '../mock/thread';

export const threadApi = {
  /**
   * 获取主题下的所有线程
   * @param topicId string 主题ID
   * @returns Promise<any[]> 线程数组
   */
  getThreads: (topicId: string) => request('/thread/getThreads', { topicId }),
  /**
   * 创建线程并附带消息
   * @param input any 创建参数
   * @returns Promise<{threadId: string, messageId: string}> 结果
   */
  createThreadWithMessage: (input: any) => request('/thread/createThreadWithMessage', input),
  /**
   * 更新线程
   * @param id string 线程ID
   * @param data any 更新内容
   * @returns Promise<any>
   */
  updateThread: (id: string, data: any) => request('/thread/updateThread', { id, data }),
  /**
   * 删除线程
   * @param id string 线程ID
   * @returns Promise<any>
   */
  removeThread: (id: string) => request('/thread/removeThread', { id }),
}; 