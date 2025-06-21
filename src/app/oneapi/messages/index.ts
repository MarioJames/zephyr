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
  role: "assistant" | "user"; // 添加的信息来源，用户/助手（AI）
  sessionId: string; // 会话ID
  topic: string; // 话题ID
  fromModel: string; // 对话使用的模型
  fromProvider: string; // 使用的模型的提供商
  files?: string[]; // 用户上传的文件ID
}

const API = {
  /**
   * 获取指定 Topic 的信息列表
   * @description 进入与客户对话界面时查询
   * @param params MessagesQueryByTopicRequest
   * @returns MessageItem[]
   */
  queryByTopic: (params: MessagesQueryByTopicRequest) => http.get<MessageItem[]>("/api/v1/messages/queryByTopic", params),

  /**
   * 新增一条消息
   * @description 进入与客户对话界面时查询
   * @param data MessagesCreateRequest
   * @returns string - 返回创建的消息 ID
   */
  createMessage: (data: MessagesCreateRequest) => http.post<string>("/api/v1/messages/create", data),
};

export default API; 