import { AgentConfig } from '@/types/agent';
import { http } from '../request';

export type ChatMessage = {
  role: 'user' | 'system' | 'assistant' | 'tool';
  content: string;
};

export interface ChatRequest {
  messages: ChatMessage[];
  model?: string;
  provider?: string;
  temperature?: number;
  max_tokens?: number;
  stream?: boolean;
}

export interface ChatResponse {
  content: string;
  model?: string;
  provider?: string;
  usage?: {
    prompt_tokens?: number;
    completion_tokens?: number;
    total_tokens?: number;
  };
}

export interface TranslateRequest {
  text: string; // 必填，待翻译文本
  toLanguage: string; // 必填，目标语言
  fromLanguage?: string; // 源语言
  model?: string;
  provider?: string;
}

export interface GenerateReplyRequest {
  userMessage: string; // 必填，用户消息
  sessionId: string | null; // 会话ID
  agentId?: string; // 智能体ID
  conversationHistory: ChatMessage[]; // 对话历史
  model?: string;
  provider?: string;
  chatConfig?: AgentConfig;
}

export interface GenerateReplyResponse {
  reply: string;
}

/**
 * 通用聊天接口
 * @description 发送聊天消息获取AI回复
 * @param data ChatRequest
 * @returns ChatResponse
 */
function chat(data: ChatRequest) {
  return http.post<ChatResponse>('/api/v1/chat', data);
}

/**
 * 翻译接口
 * @description 翻译指定文本到目标语言
 * @param data TranslateRequest
 * @returns ChatResponse
 */
function translate(data: TranslateRequest) {
  return http.post<ChatResponse>('/api/v1/chat/translate', data);
}

/**
 * 生成回复接口
 * @description 基于对话历史生成AI回复
 * @param data GenerateReplyRequest
 * @returns ChatResponse
 */
function generateReply(data: GenerateReplyRequest) {
  return http.post<GenerateReplyResponse>('/api/v1/chat/generate-reply', data);
}

export default {
  chat,
  translate,
  generateReply,
};
