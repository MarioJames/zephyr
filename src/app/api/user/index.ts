import { request } from '../index';

const API = {
  /**
   * 创建 Agent 知识库关联
   * @param agentId string Agent ID
   * @param knowledgeBaseId string 知识库ID
   * @param enabled boolean 是否启用
   * @returns Promise<any>
   */
  createAgentKnowledgeBase: (data: any) =>
    request('/agent/createAgentKnowledgeBase', data),

  /**
   * 删除 Agent 知识库关联
   * @param agentId string Agent ID
   * @param knowledgeBaseId string 知识库ID
   * @returns Promise<any>
   */
  deleteAgentKnowledgeBase: (data: any) =>
    request('/agent/deleteAgentKnowledgeBase', data),

  /**
   * 切换 Agent 知识库启用状态
   * @param agentId string Agent ID
   * @param knowledgeBaseId string 知识库ID
   * @param enabled boolean 是否启用
   * @returns Promise<any>
   */
  toggleKnowledgeBase: (data: any) =>
     request('/agent/toggleKnowledgeBase', data),

  /**
   * 创建 Agent 文件关联
   * @param agentId string Agent ID
   * @param fileIds string[] 文件ID数组
   * @param enabled boolean 是否启用
   * @returns Promise<any>
   */
  createAgentFiles: (data: any) =>
    request('/agent/createAgentFiles', data),

  /**
   * 删除 Agent 文件关联
   * @param agentId string Agent ID
   * @param fileId string 文件ID
   * @returns Promise<any>
   */
  deleteAgentFile: (data: any) =>
    request('/agent/deleteAgentFile', data),

  /**
   * 切换 Agent 文件启用状态
   * @param agentId string Agent ID
   * @param fileId string 文件ID
   * @param enabled boolean 是否启用
   * @returns Promise<any>
   */
  toggleFile: (data: any) =>
    request('/agent/toggleFile', data),

  /**
   * 获取 Agent 的文件和知识库信息
   * @param agentId string Agent ID
   * @returns Promise<LobeAgentConfig>
   */
  getFilesAndKnowledgeBases: (data: any) =>
    request('/agent/getFilesAndKnowledgeBases', data),
}; 

export default API;