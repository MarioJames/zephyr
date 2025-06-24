// 智能体 API 桥接 - 重定向到 services
import { agentsAPI } from '@/services';

export const agentApi = {
  // 重定向所有方法到新的 services API
  ...agentsAPI,
  
  // 保持旧的方法名兼容性
  getAgents: agentsAPI.getAgentList || (() => Promise.resolve([])),
  createAgent: agentsAPI.createAgent || (() => Promise.resolve('')),
  updateAgent: agentsAPI.updateAgent || (() => Promise.resolve()),
  deleteAgent: agentsAPI.deleteAgent || (() => Promise.resolve()),
  getAgentDetail: agentsAPI.getAgentDetail || (() => Promise.resolve({})),
  
  // 文件和知识库相关（临时空实现）
  createAgentKnowledgeBase: () => Promise.resolve(),
  deleteAgentKnowledgeBase: () => Promise.resolve(),
  toggleKnowledgeBase: () => Promise.resolve(),
  createAgentFiles: () => Promise.resolve(),
  deleteAgentFile: () => Promise.resolve(),
  toggleFile: () => Promise.resolve(),
  getFilesAndKnowledgeBases: () => Promise.resolve({}),
};

export default agentApi;