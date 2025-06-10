import { request } from './index';
import { LobeAgentConfig } from '@/types/agent';
import agentMock from '../mock/agent';

export const agentApi = {
  /**
   * 创建 Agent 知识库关联
   * @param agentId string Agent ID
   * @param knowledgeBaseId string 知识库ID
   * @param enabled boolean 是否启用
   * @returns Promise<any>
   */
  createAgentKnowledgeBase: (data: any) =>
    agentMock['/agent/createAgentKnowledgeBase']?.(data) || request('/agent/createAgentKnowledgeBase', data),

  /**
   * 删除 Agent 知识库关联
   * @param agentId string Agent ID
   * @param knowledgeBaseId string 知识库ID
   * @returns Promise<any>
   */
  deleteAgentKnowledgeBase: (data: any) =>
    agentMock['/agent/deleteAgentKnowledgeBase']?.(data) || request('/agent/deleteAgentKnowledgeBase', data),

  /**
   * 切换 Agent 知识库启用状态
   * @param agentId string Agent ID
   * @param knowledgeBaseId string 知识库ID
   * @param enabled boolean 是否启用
   * @returns Promise<any>
   */
  toggleKnowledgeBase: (data: any) =>
    agentMock['/agent/toggleKnowledgeBase']?.(data) || request('/agent/toggleKnowledgeBase', data),

  /**
   * 创建 Agent 文件关联
   * @param agentId string Agent ID
   * @param fileIds string[] 文件ID数组
   * @param enabled boolean 是否启用
   * @returns Promise<any>
   */
  createAgentFiles: (data: any) =>
    agentMock['/agent/createAgentFiles']?.(data) || request('/agent/createAgentFiles', data),

  /**
   * 删除 Agent 文件关联
   * @param agentId string Agent ID
   * @param fileId string 文件ID
   * @returns Promise<any>
   */
  deleteAgentFile: (data: any) =>
    agentMock['/agent/deleteAgentFile']?.(data) || request('/agent/deleteAgentFile', data),

  /**
   * 切换 Agent 文件启用状态
   * @param agentId string Agent ID
   * @param fileId string 文件ID
   * @param enabled boolean 是否启用
   * @returns Promise<any>
   */
  toggleFile: (data: any) =>
    agentMock['/agent/toggleFile']?.(data) || request('/agent/toggleFile', data),

  /**
   * 获取 Agent 的文件和知识库信息
   * @param agentId string Agent ID
   * @returns Promise<LobeAgentConfig>
   */
  getFilesAndKnowledgeBases: (data: any) =>
    agentMock['/agent/getFilesAndKnowledgeBases']?.(data) || request('/agent/getFilesAndKnowledgeBases', data),
}; 