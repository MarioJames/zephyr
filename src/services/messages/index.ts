import { http } from '../request';

// 消息相关类型定义
export interface MessageItem {
  id: string;
  role: 'user' | 'system' | 'assistant' | 'tool';
  content?: string;
  reasoning?: any;
  search?: any;
  metadata?: any;
  model?: string;
  provider?: string;
  favorite?: boolean;
  error?: any;
  tools?: any;
  traceId?: string;
  observationId?: string;
  clientId?: string;
  userId: string;
  sessionId?: string;
  topicId?: string;
  threadId?: string;
  parentId?: string;
  quotaId?: string;
  agentId?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface MessagesQueryByTopicRequest {
  topicId: string; // 话题ID
}

export interface MessagesCreateRequest {
  content: string; // 消息内容，必需，不能为空
  role: 'user' | 'system' | 'assistant' | 'tool'; // 必需，user|system|assistant|tool
  model?: string; // 可选，AI模型
  provider?: string; // 可选，AI提供商
  sessionId?: string; // 可选，会话ID
  topicId?: string; // 可选，话题ID
  threadId?: string; // 可选，线程ID
  parentId?: string; // 可选，父消息ID
  quotaId?: string; // 可选，配额ID
  agentId?: string; // 可选，智能体ID
  clientId?: string; // 可选，客户端ID
  metadata?: any; // 可选，元数据
  reasoning?: any; // 可选，推理信息
  search?: any; // 可选，搜索信息
  tools?: any; // 可选，工具信息
  traceId?: string; // 可选，追踪ID
  observationId?: string; // 可选，观察ID
  files?: string[]; // 可选，文件ID数组
  favorite?: boolean; // 可选，是否收藏，默认false
}

export interface MessageCountByTopicsRequest {
  topicIds: string[]; // 话题ID数组
}

export interface MessageCountByUserRequest {
  userId: string; // 用户ID
}

export interface MessageCountResponse {
  [topicId: string]: number;
}

export interface MessagesSearchRequest {
  keyword: string; // 搜索关键词
  limit?: number; // 结果限制
}

/**
 * 获取指定 Topic 的信息列表
 * @description 进入与客户对话界面时查询
 * @param topicId string 话题ID
 * @returns MessageItem[]
 */
function queryByTopic(topicId: string) {
  return http.get<MessageItem[]>(`/api/v1/messages/queryByTopic/${topicId}`);
}

/**
 * 根据话题统计消息数量
 * @description 统计指定话题列表的消息数量
 * @param data MessageCountByTopicsRequest
 * @returns MessageCountResponse
 */
function countByTopics(data: MessageCountByTopicsRequest) {
  return http.post<MessageCountResponse>(
    '/api/v1/messages/count/by-topics',
    data
  );
}

/**
 * 根据用户统计消息数量
 * @description 统计指定用户的消息数量
 * @param data MessageCountByUserRequest
 * @returns number
 */
function countByUser(data: MessageCountByUserRequest) {
  return http.post<number>('/api/v1/messages/count/by-user', data);
}

/**
 * 新增一条消息
 * @description 创建新的消息
 * @param data MessagesCreateRequest
 * @returns MessageItem
 */
function createMessage(data: MessagesCreateRequest) {
  return http.post<MessageItem>('/api/v1/messages', data);
}

/**
 * 创建消息并生成AI回复
 * @description 创建消息并自动生成AI回复
 * @param data MessagesCreateRequest
 * @returns MessageItem
 */
function createMessageWithReply(data: MessagesCreateRequest) {
  return http.post<MessageItem>('/api/v1/messages/reply', data);
}

/**
 * 更新消息
 * @description 更新指定消息的信息
 * @param id string
 * @param data Partial<MessagesCreateRequest>
 * @returns MessageItem
 */
function updateMessage(id: string, data: Partial<MessagesCreateRequest>) {
  return http.put<MessageItem>(`/api/v1/messages/${id}`, data);
}

/**
 * 删除消息
 * @description 删除指定的消息
 * @param id string
 * @returns void
 */
function deleteMessage(id: string) {
  return http.delete<void>(`/api/v1/messages/${id}`);
}

/**
 * 根据关键字搜索消息
 * @description 根据关键字搜索消息
 * @param data MessagesSearchRequest
 * @returns MessageItem[]
 */
function searchMessages(data: MessagesSearchRequest) {
  return http.get<MessageItem[]>(`/api/v1/messages/search`, data);
}

export default {
  queryByTopic,
  countByTopics,
  countByUser,
  createMessage,
  createMessageWithReply,
  updateMessage,
  deleteMessage,
  searchMessages,
};
