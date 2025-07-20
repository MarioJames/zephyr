import { AgentConfig } from "@/types/agent";
import { http } from "../request";
import { useOIDCStore } from "@/store/oidc";
import { LITELLM_URL } from "@/const/base";
import axios from "axios";

export type ChatMessage = {
  role: "user" | "system" | "assistant" | "tool";
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

// 获取 Authorization header
const getAuthHeader = () => {
  const virtualKey = useOIDCStore.getState().virtualKey;
  return virtualKey ? { Authorization: `Bearer ${virtualKey}` } : undefined;
};

/**
 * 通用聊天接口
 * @description 发送聊天消息获取AI回复，使用 litellm 接口
 * @param data ChatRequest
 * @returns ChatResponse
 */

async function chat(data: ChatRequest) {
  const authorization = getAuthHeader();
  const res = await axios.post<ChatResponse>(
    `${LITELLM_URL}/chat/completions`,
    { ...data, stream: false, model: "openai-test" },
    {
      timeout: 300000,
      headers: {
        ...(authorization
          ? { Authorization: authorization.Authorization }
          : {}),
        "Content-Type": "application/json",
      },
    }
  );
  return res.data;
}

/**
 * 翻译接口
 * @description 基于通用聊天接口实现的翻译功能
 * @param data TranslateRequest
 * @returns ChatResponse
 */
function translate(data: TranslateRequest) {
  // 构建翻译提示词
  const systemPrompt = `You are a professional translator. Translate the following text ${
    data.fromLanguage ? `from ${data.fromLanguage}` : ""
  } to ${data.toLanguage}. Only provide the translation, no explanations.`;

  // 使用通用聊天接口实现翻译
  return chat({
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: data.text },
    ],
    model: data.model,
    provider: data.provider,
  });
}

/**
 * 生成回复接口
 * @description 基于通用聊天接口实现的对话生成功能
 * @param data GenerateReplyRequest
 * @returns ChatResponse
 */
function generateReply(data: GenerateReplyRequest) {
  // 构建完整的对话历史
  const messages: ChatMessage[] = [
    ...data.conversationHistory,
    { role: "user", content: data.userMessage },
  ];

  // 使用通用聊天接口生成回复
  return chat({
    messages,
    model: data.model,
    provider: data.provider,
  }).then((response) => ({
    reply: response.content,
  }));
}

export default {
  chat,
  translate,
  generateReply,
};
