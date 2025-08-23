import { http } from '../request';
import { SessionItem } from '../sessions';
import { TopicItem } from '../topics';
import { UserItem } from '../user';
import { MessageTranslateItem } from '../message_translates';
import { FileItem } from '../files';

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
  topic?: TopicItem;
  user?: UserItem;
  files?: FileItem[];
  imageList?: FileItem[];
  fileList?: FileItem[];
  session?: SessionItem;
  translation?: MessageTranslateItem;
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
  [key: string]: unknown;
}

export interface MessageCountByTopicsRequest {
  topicIds: string[]; // 话题ID数组
  [key: string]: unknown;
}

export interface MessageCountByUserRequest {
  userId: string; // 用户ID
  [key: string]: unknown;
}

export interface MessageCountResponse {
  [topicId: string]: number;
}

export interface MessagesSearchRequest {
  keyword: string; // 搜索关键词
  limit?: number; // 结果限制
  sessionId: string; // 会话ID
  [key: string]: unknown;
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
 * 新增一条消息
 * @description 创建新的消息
 * @param data MessagesCreateRequest
 * @returns MessageItem
 */
function createMessage(data: MessagesCreateRequest) {
  return http.post<MessageItem>('/api/v1/messages', data);
}

/**
 * 获取消息
 * @description 获取指定消息的信息
 * @param id string
 * @returns MessageItem
 */
function queryMessage(messageId: string) {
  return http.get<MessageItem>(`/api/v1/messages/${messageId}`);
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
  createMessage,
  searchMessages,
  queryMessage,
};
