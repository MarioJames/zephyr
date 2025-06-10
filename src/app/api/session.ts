import { request } from './index';
import { LobeAgentConfig } from '@/types/agent';
import sessionMock from '../mock/session';

export const sessionApi = {
  /**
   * 获取会话配置
   * @param id string 会话ID
   * @returns Promise<LobeAgentConfig> 会话配置
   */
  getSessionConfig: (id: string): Promise<LobeAgentConfig> =>
    sessionMock['/session/getSessionConfig']?.({ id }) || request('/session/getSessionConfig', { id }),
  /**
   * 更新会话配置
   * @param id string 会话ID
   * @param data Partial<LobeAgentConfig> 配置内容
   * @param signal AbortSignal 可选中断信号
   * @returns Promise<any>
   */
  updateSessionConfig: (id: string, data: Partial<LobeAgentConfig>, signal?: AbortSignal) =>
    sessionMock['/session/updateSessionConfig']?.(data) || request('/session/updateSessionConfig', { id, data }, { signal }),
}; 