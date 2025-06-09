import { request } from './index';
import { LobeAgentConfig } from '@/types/agent';

export const agentApi = {
  /**
   * 创建 Agent 知识库关联
   * @param agentId string Agent ID
   * @param knowledgeBaseId string 知识库ID
   * @param enabled boolean 是否启用
   * @returns Promise<any>
   */
  createAgentKnowledgeBase: (agentId: string, knowledgeBaseId: string, enabled?: boolean) =>
    request('/agent/createAgentKnowledgeBase', { agentId, knowledgeBaseId, enabled }),

  /**
   * 删除 Agent 知识库关联
   * @param agentId string Agent ID
   * @param knowledgeBaseId string 知识库ID
   * @returns Promise<any>
   */
  deleteAgentKnowledgeBase: (agentId: string, knowledgeBaseId: string) =>
    request('/agent/deleteAgentKnowledgeBase', { agentId, knowledgeBaseId }),

  /**
   * 切换 Agent 知识库启用状态
   * @param agentId string Agent ID
   * @param knowledgeBaseId string 知识库ID
   * @param enabled boolean 是否启用
   * @returns Promise<any>
   */
  toggleKnowledgeBase: (agentId: string, knowledgeBaseId: string, enabled?: boolean) =>
    request('/agent/toggleKnowledgeBase', { agentId, knowledgeBaseId, enabled }),

  /**
   * 创建 Agent 文件关联
   * @param agentId string Agent ID
   * @param fileIds string[] 文件ID数组
   * @param enabled boolean 是否启用
   * @returns Promise<any>
   */
  createAgentFiles: (agentId: string, fileIds: string[], enabled?: boolean) =>
    request('/agent/createAgentFiles', { agentId, fileIds, enabled }),

  /**
   * 删除 Agent 文件关联
   * @param agentId string Agent ID
   * @param fileId string 文件ID
   * @returns Promise<any>
   */
  deleteAgentFile: (agentId: string, fileId: string) =>
    request('/agent/deleteAgentFile', { agentId, fileId }),

  /**
   * 切换 Agent 文件启用状态
   * @param agentId string Agent ID
   * @param fileId string 文件ID
   * @param enabled boolean 是否启用
   * @returns Promise<any>
   */
  toggleFile: (agentId: string, fileId: string, enabled?: boolean) =>
    request('/agent/toggleFile', { agentId, fileId, enabled }),

  /**
   * 获取 Agent 的文件和知识库信息
   * @param agentId string Agent ID
   * @returns Promise<LobeAgentConfig>
   */
  getFilesAndKnowledgeBases: (agentId: string): Promise<LobeAgentConfig> =>
    request('/agent/getFilesAndKnowledgeBases', { agentId }),
}; 