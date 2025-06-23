import { http } from "../request";

// 消息相关类型定义
export interface MessageItem {
  id: string;
  role: "user" | "system" | "assistant" | "tool";
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
  topicId: string; // 翻译内容关联的消息ID
}

export interface MessagesCreateRequest {
  content: string; // 消息内容
  role: "user" | "assistant" | "system"; // 添加的信息来源
  topicId: string; // 话题ID
  sessionId?: string; // 会话ID
  model?: string; // 对话使用的模型
  provider?: string; // 使用的模型的提供商
  files?: string[]; // 用户上传的文件ID
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

/**
 * 获取指定 Topic 的信息列表
 * @description 进入与客户对话界面时查询
 * @param params MessagesQueryByTopicRequest
 * @returns MessageItem[]
 */
function queryByTopic(params: MessagesQueryByTopicRequest) {
  return http.get<MessageItem[]>("/api/v1/messages/queryByTopic", params);
}

/**
 * 获取示例数据
 * @description 获取消息示例数据
 * @param null
 * @returns MessageItem[]
 */
function getMessages() {
  return http.get<MessageItem[]>('/api/v1/messages');
}

/**
 * 根据话题统计消息数量
 * @description 统计指定话题列表的消息数量
 * @param data MessageCountByTopicsRequest
 * @returns MessageCountResponse
 */
function countByTopics(data: MessageCountByTopicsRequest) {
  return http.post<MessageCountResponse>('/api/v1/messages/count/by-topics', data);
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

export default {
  getMessages,
  queryByTopic,
  countByTopics,
  countByUser,
  createMessage,
  createMessageWithReply,
}; 