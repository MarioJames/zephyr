import { request } from './index';
import { LobeAgentConfig } from '@/types/agent';

export const sessionApi = {
  getSessionConfig: (id: string): Promise<LobeAgentConfig> =>
    request('/session/getSessionConfig', { id }),
  updateSessionConfig: (id: string, data: Partial<LobeAgentConfig>, signal?: AbortSignal) =>
    request('/session/updateSessionConfig', { id, data }, { signal }),
}; 