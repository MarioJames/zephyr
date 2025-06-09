import { request } from './index';
import { LobeAgentConfig } from '@/types/agent';

export const agentApi = {
  createAgentKnowledgeBase: (agentId: string, knowledgeBaseId: string, enabled?: boolean) =>
    request('/agent/createAgentKnowledgeBase', { agentId, knowledgeBaseId, enabled }),

  deleteAgentKnowledgeBase: (agentId: string, knowledgeBaseId: string) =>
    request('/agent/deleteAgentKnowledgeBase', { agentId, knowledgeBaseId }),

  toggleKnowledgeBase: (agentId: string, knowledgeBaseId: string, enabled?: boolean) =>
    request('/agent/toggleKnowledgeBase', { agentId, knowledgeBaseId, enabled }),

  createAgentFiles: (agentId: string, fileIds: string[], enabled?: boolean) =>
    request('/agent/createAgentFiles', { agentId, fileIds, enabled }),

  deleteAgentFile: (agentId: string, fileId: string) =>
    request('/agent/deleteAgentFile', { agentId, fileId }),

  toggleFile: (agentId: string, fileId: string, enabled?: boolean) =>
    request('/agent/toggleFile', { agentId, fileId, enabled }),

  getFilesAndKnowledgeBases: (agentId: string): Promise<LobeAgentConfig> =>
    request('/agent/getFilesAndKnowledgeBases', { agentId }),
}; 