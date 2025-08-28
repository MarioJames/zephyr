import { http } from '../request';

// Agent 建议内容具体类型定义
export interface AgentSuggestionContent {
  summary?: string; // 用户诉求摘要
  knowledges?: {
    finance?: string; // 金融知识
    psychology?: string; // 心理知识
    korea?: string; // 韩国知识
    role?: string; // 角色背景
    [key: string]: string | undefined; // 支持扩展其他知识类型
  };
  responses?: Array<{
    type: string; // 回复类型，如"贴心版"、"感同身受版"等
    content: string; // 建议内容
  }>;
}

// Agent 建议相关类型定义
export interface AgentSuggestionCreate {
  suggestion: AgentSuggestionContent; // 具体化的建议内容类型
  topicId: string;
  parentMessageId: string;
  [key: string]: unknown;
}

export interface AgentSuggestionItem {
  placeholder?: boolean; // 是否是占位符
  id?: number | string;
  suggestion?: AgentSuggestionContent; // 具体化的建议内容类型
  topicId?: string;
  parentMessageId?: string;
  createdAt?: string;
  updatedAt?: string;
  accessedAt?: string;
}

export interface AgentSuggestionListParams {
  page?: number;
  pageSize?: number;
  topicId?: string;
  parentMessageId?: string;
  sortBy?: 'createdAt' | 'updatedAt';
  sortOrder?: 'asc' | 'desc';
}

export interface AgentSuggestionListResponse {
  data: AgentSuggestionItem[];
  total: number;
  page: number;
  pageSize: number;
}



/**
 * 创建智能体建议
 * @description 保存 AI 回复建议到数据库
 * @param data AgentSuggestionCreate
 * @returns AgentSuggestionItem
 */
async function createSuggestion(
  data: AgentSuggestionCreate
): Promise<AgentSuggestionItem> {
  return await http.post('/api/agent-suggestions', data);
}

/**
 * 根据话题ID获取建议列表
 * @description 获取指定话题的所有建议
 * @param topicId 话题ID
 * @returns AgentSuggestionItem[]
 */
async function getSuggestionsByTopic(
  topicId: string
): Promise<AgentSuggestionItem[]> {
  return await http.get(`/api/agent-suggestions?topic=${topicId}`);
}

/**
 * 更新智能体建议
 * @description 更新指定ID的建议内容
 * @param id 建议ID
 * @param suggestion 更新的建议内容
 * @returns AgentSuggestionItem
 */
async function updateSuggestion(
  id: number,
  suggestion: AgentSuggestionContent
): Promise<AgentSuggestionItem> {
  return await http.put(`/api/agent-suggestions/${id}`, { suggestion });
}

export default {
  createSuggestion,
  getSuggestionsByTopic,
  updateSuggestion,
};

export {
  createSuggestion,
  getSuggestionsByTopic,
  updateSuggestion,
};