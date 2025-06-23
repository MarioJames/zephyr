import { http } from '../request';

// 智能体相关类型定义
export interface AgentItem {
  id: string;
  slug: string;
  title?: string;
  description?: string;
  tags?: string[];
  avatar?: string;
  backgroundColor?: string;
  plugins?: string[];
  clientId?: string;
  userId: string;
  chatConfig?: any;
  fewShots?: any;
  model?: string;
  params?: any;
  provider?: string;
  systemRole?: string;
  tts?: any;
  openingMessage?: string;
  openingQuestions?: string[];
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateAgentRequest {
  title?: string;
  description?: string;
  tags?: string[];
  avatar?: string;
  backgroundColor?: string;
  plugins?: string[];
  chatConfig?: any;
  fewShots?: any;
  model?: string;
  params?: any;
  provider?: string;
  systemRole?: string;
  tts?: any;
  openingMessage?: string;
  openingQuestions?: string[];
}

/**
 * 获取系统中所有的 Agent 列表
 * @description 用户进入系统时，获取所有的 Agent 列表，管理系统中 Agent 将作为 「客户模板」的概念使用
 * @param null
 * @returns AgentItem[]
 */
function getAgentList() {
  return http.get<AgentItem[]>('/api/v1/agents');
}

/**
 * 创建智能体
 * @description 超级管理员在客户类型模板页面新增模板时调用
 * @param data CreateAgentRequest
 * @returns AgentItem
 */
function createAgent(data: CreateAgentRequest) {
  return http.post<AgentItem>('/api/v1/agents', data);
}

export default {
  getAgentList,
  createAgent,
};
