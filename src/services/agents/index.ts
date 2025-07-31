import { http } from '../request';
import { AgentChatConfig } from '@/types/agent';

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
  chatConfig?: AgentChatConfig;
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
  title: string; // 必填，智能体标题
  description?: string;
  tags?: string[];
  avatar?: string;
  backgroundColor?: string;
  plugins?: string[];
  chatConfig?: {
    // 聊天配置
    autoCreateTopicThreshold: number;
    enableAutoCreateTopic?: boolean;
    enableCompressHistory?: boolean;
    enableHistoryCount?: boolean;
    enableMaxTokens?: boolean;
    enableReasoning?: boolean;
    historyCount?: number;
    temperature?: number;
  };
  fewShots?: any;
  model?: string;
  params?: Record<string, unknown>; // 自定义参数
  provider?: string;
  systemRole?: string;
  tts?: any;
  openingMessage?: string;
  openingQuestions?: string[];
  [key: string]: unknown;
}

export interface UpdateAgentRequest extends CreateAgentRequest {
  id: string;
  [key: string]: unknown;
}

export interface AgentDetailResponse {
  // 智能体基本信息
  id: string;
  title: string;
  avatar?: string;
  description?: string;
  model?: string;
  provider?: string;
  systemRole?: string;

  // 关联信息
  agentsFiles?: Array<{
    file: {
      id: string;
      name: string;
      fileType: string;
      size: number;
    };
  }>;
  agentsKnowledgeBases?: Array<{
    knowledgeBase: {
      id: string;
      name: string;
      description?: string;
    };
  }>;
  agentsToSessions?: Array<{
    session: {
      id: string;
      title?: string;
      avatar?: string;
      description?: string;
      updatedAt: Date;
    };
  }>;
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

/**
 * 更新智能体
 * @description 更新指定智能体的信息
 * @param id string
 * @param data UpdateAgentRequest
 * @returns AgentItem
 */
function updateAgent(id: string, data: UpdateAgentRequest) {
  return http.put<AgentItem>(`/api/v1/agents/${id}`, data);
}

/**
 * 删除智能体
 * @description 删除指定的智能体
 * @param id string
 * @returns void
 */
function deleteAgent(id: string) {
  return http.delete<void>(`/api/v1/agents/${id}`);
}

/**
 * 获取智能体详情
 * @description 根据ID获取智能体详细信息，包含关联的文件、知识库和会话信息
 * @param id string
 * @returns AgentDetailResponse
 */
function getAgentDetail(id: string) {
  return http.get<AgentDetailResponse>(`/api/v1/agents/${id}`);
}

/**
 * 根据会话ID获取智能体
 * @description 根据会话ID获取智能体
 * @param sessionId string
 * @returns AgentItem
 */
function getAgentBySessionId(sessionId: string) {
  return http.get<AgentItem>(`/api/v1/agents/session/${sessionId}`);
}

export default {
  getAgentList,
  createAgent,
  updateAgent,
  deleteAgent,
  getAgentDetail,
  getAgentBySessionId,
};
