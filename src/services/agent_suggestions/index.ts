// Agent 建议内容具体类型定义
export interface AgentSuggestionContent {
  summary: string; // 用户诉求摘要
  knowledges: {
    finance?: string; // 金融知识
    psychology?: string; // 心理知识
    korea?: string; // 韩国知识
    role?: string; // 角色背景
    [key: string]: string | undefined; // 支持扩展其他知识类型
  };
  responses: Array<{
    type: string; // 回复类型，如"贴心版"、"感同身受版"等
    content: string; // 建议内容
  }>;
}

// Agent 建议相关类型定义
export interface AgentSuggestionCreate {
  suggestion: AgentSuggestionContent; // 具体化的建议内容类型
  topicId: string;
  parentMessageId: string;
}

export interface AgentSuggestionItem {
  id: number;
  suggestion: AgentSuggestionContent; // 具体化的建议内容类型
  topicId: string;
  parentMessageId: string;
  createdAt: string;
  updatedAt: string;
  accessedAt: string;
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

// 本地 API 响应格式
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  total?: number;
  page?: number;
  pageSize?: number;
}

/**
 * 创建智能体建议
 * @description 保存 AI 回复建议到数据库
 * @param data AgentSuggestionCreate
 * @returns AgentSuggestionItem
 */
async function createSuggestion(data: AgentSuggestionCreate): Promise<AgentSuggestionItem> {
  const response = await fetch('/api/agent-suggestions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  const result: ApiResponse<AgentSuggestionItem> = await response.json();
  
  if (!result.success || !result.data) {
    throw new Error(result.error || '创建建议失败');
  }
  
  return result.data;
}

/**
 * 根据话题ID获取建议列表
 * @description 获取指定话题的所有建议
 * @param topicId 话题ID
 * @returns AgentSuggestionItem[]
 */
async function getSuggestionsByTopic(topicId: string): Promise<AgentSuggestionItem[]> {
  const response = await fetch(`/api/agent-suggestions/topic/${topicId}`);
  
  const result: ApiResponse<AgentSuggestionItem[]> = await response.json();
  
  if (!result.success) {
    throw new Error(result.error || '获取话题建议失败');
  }
  
  return result.data || [];
}

/**
 * 根据父消息ID获取建议
 * @description 获取指定用户消息对应的 AI 建议
 * @param parentMessageId 父消息ID
 * @returns AgentSuggestionItem | null
 */
async function getSuggestionByParentMessage(parentMessageId: string): Promise<AgentSuggestionItem | null> {
  const response = await fetch(`/api/agent-suggestions/parent/${parentMessageId}`);
  
  const result: ApiResponse<AgentSuggestionItem> = await response.json();
  
  if (!result.success) {
    if (response.status === 404) {
      return null; // 未找到建议，返回 null
    }
    throw new Error(result.error || '获取父消息建议失败');
  }
  
  return result.data || null;
}

/**
 * 分页获取建议列表
 * @description 分页获取建议，支持筛选和排序
 * @param params AgentSuggestionListParams
 * @returns AgentSuggestionListResponse
 */
async function getSuggestionsList(params: AgentSuggestionListParams = {}): Promise<AgentSuggestionListResponse> {
  const searchParams = new URLSearchParams();
  
  if (params.page) searchParams.set('page', params.page.toString());
  if (params.pageSize) searchParams.set('pageSize', params.pageSize.toString());
  if (params.topicId) searchParams.set('topicId', params.topicId);
  if (params.parentMessageId) searchParams.set('parentMessageId', params.parentMessageId);
  if (params.sortBy) searchParams.set('sortBy', params.sortBy);
  if (params.sortOrder) searchParams.set('sortOrder', params.sortOrder);

  const response = await fetch(`/api/agent-suggestions?${searchParams.toString()}`);
  
  const result: ApiResponse<AgentSuggestionItem[]> = await response.json();
  
  if (!result.success) {
    throw new Error(result.error || '获取建议列表失败');
  }
  
  return {
    data: result.data || [],
    total: result.total || 0,
    page: result.page || 1,
    pageSize: result.pageSize || 20,
  };
}

/**
 * 更新建议
 * @description 更新指定的建议记录
 * @param id 建议ID
 * @param data 更新数据
 * @returns AgentSuggestionItem
 */
async function updateSuggestion(id: number, data: Partial<AgentSuggestionCreate>): Promise<AgentSuggestionItem> {
  const response = await fetch(`/api/agent-suggestions?id=${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  const result: ApiResponse<AgentSuggestionItem> = await response.json();
  
  if (!result.success || !result.data) {
    throw new Error(result.error || '更新建议失败');
  }
  
  return result.data;
}

/**
 * 删除建议
 * @description 删除指定的建议记录
 * @param id 建议ID
 */
async function deleteSuggestion(id: number): Promise<void> {
  const response = await fetch(`/api/agent-suggestions?id=${id}`, {
    method: 'DELETE',
  });

  const result: ApiResponse<null> = await response.json();
  
  if (!result.success) {
    throw new Error(result.error || '删除建议失败');
  }
}

/**
 * 删除话题下所有建议
 * @description 删除指定话题的所有建议
 * @param topicId 话题ID
 */
async function deleteSuggestionsByTopic(topicId: string): Promise<void> {
  const response = await fetch(`/api/agent-suggestions/topic/${topicId}`, {
    method: 'DELETE',
  });

  const result: ApiResponse<null> = await response.json();
  
  if (!result.success) {
    throw new Error(result.error || '删除话题建议失败');
  }
}

/**
 * 删除父消息的建议
 * @description 删除指定父消息的建议
 * @param parentMessageId 父消息ID
 */
async function deleteSuggestionByParentMessage(parentMessageId: string): Promise<void> {
  const response = await fetch(`/api/agent-suggestions/parent/${parentMessageId}`, {
    method: 'DELETE',
  });

  const result: ApiResponse<null> = await response.json();
  
  if (!result.success) {
    throw new Error(result.error || '删除父消息建议失败');
  }
}

export default {
  createSuggestion,
  getSuggestionsByTopic,
  getSuggestionByParentMessage,
  getSuggestionsList,
  updateSuggestion,
  deleteSuggestion,
  deleteSuggestionsByTopic,
  deleteSuggestionByParentMessage,
};