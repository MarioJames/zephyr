import { AgentConfig } from '@/types/agent';
import axios from 'axios';
import { useAgentStore } from '@/store/agent';
import { isEmpty } from 'lodash-es';
import { useGlobalStore } from '@/store/global';
import { zephyrEnv } from '@/env/zephyr';
import { ChatMessage } from '@/types/message';
import { TRANSLATION_PROMPT, INFO_SUMMARY_PROMPT } from '@/const/prompt';

export interface ChatRequest {
  messages: ChatMessage[];
  model?: string;
  provider?: string;
  temperature?: number;
  max_tokens?: number;
  stream?: boolean;
}

export interface messageItem {
  annotations: any[];
  content: string;
  function_call: any;
  role: string;
  tool_calls: any;
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

export interface LiteLLMChatResponse {
  choices: {
    message: messageItem;
  }[];
  usage?: {
    prompt_tokens?: number;
    completion_tokens?: number;
    total_tokens?: number;
  };
  created?: number;
  id?: string;
  model?: string;
  object?: string;
  service_tier?: any;
  system_fingerprint?: string;
}

export interface TranslateRequest {
  text: string; // 必填，待翻译文本
  toLanguage: string; // 必填，目标语言
  fromLanguage?: string; // 源语言
  model?: string;
  provider?: string;
  chatConfig?: AgentConfig;
}

export interface GenerateReplyRequest {
  sessionId: string | null; // 会话ID
  agentId?: string; // 智能体ID
  messages: ChatMessage[]; // 对话历史
  model?: string;
  provider?: string;
  chatConfig?: AgentConfig;
}

export interface GenerateReplyResponse {
  reply: string;
}

export interface SummarizeContentRequest {
  content: string;
  // 可选：模型与提供商
  model?: string;
  provider?: string;
  // 其他聊天配置
  chatConfig?: AgentConfig;
}

export interface SummarizeContentResponse {
  summary: string;
  entities: { label: string; value: string }[];
}

// 获取 Authorization header
const getAuthHeader = async () => {
  const globalState = useGlobalStore.getState();
  let { virtualKey, currentUser } = globalState;

  // 如果virtualKey不存在，尝试重新加载
  if (!virtualKey && currentUser?.id && currentUser?.roles?.[0]?.id) {
    try {
      await globalState.loadVirtualKey(currentUser.id, currentUser.roles[0].id);
      // 重新获取virtualKey
      virtualKey = useGlobalStore.getState().virtualKey;
    } catch (error) {
      console.error('重新获取virtualKey失败:', error);
    }
  }

  return virtualKey ? { Authorization: `Bearer ${virtualKey}` } : undefined;
};

// 获取 fallback 模型
const getFallbackModel = () => {
  const aggregatedModels = useAgentStore.getState().aggregatedModels;
  const fallbackModels = aggregatedModels
    .filter((model) => model.fallbackModelId)
    .map((model) => model.fallbackModelId);
  return fallbackModels;
};

/**
 * 通用聊天接口
 * @description 发送聊天消息获取AI回复，使用 litellm 接口
 * @param data ChatRequest
 * @returns ChatResponse
 */

async function chat(data: ChatRequest) {
  const authorization = await getAuthHeader();
  const fallbackModels = getFallbackModel();
  const fallbacks = fallbackModels.map((model) => ({
    model,
    messages: data.messages,
  }));

  const res = await axios
    .post<LiteLLMChatResponse>(
      `${zephyrEnv.NEXT_PUBLIC_LITELLM_URL}/chat/completions`,
      {
        ...data,
        ...(isEmpty(fallbackModels) ? {} : { fallbacks }),
        drop_params: true,
      },
      {
        timeout: 300_000,
        headers: {
          ...(authorization
            ? { Authorization: authorization.Authorization }
            : {}),
          'Content-Type': 'application/json',
        },
      }
    )
    .catch((error) => {
      console.error('chat error', error);
      throw new Error(
        error?.response?.data?.error?.message ||
          'Failed to generate AI suggestion'
      );
    });

  const choices = res?.data?.choices;

  return {
    ...res.data,
    content: choices.at(0)?.message?.content,
  };
}

/**
 * 翻译接口
 * @description 基于通用聊天接口实现的翻译功能
 * @param data TranslateRequest
 * @returns ChatResponse
 */
function translate(data: TranslateRequest) {
  // 构建翻译prompt
  const systemPrompt = TRANSLATION_PROMPT(data.toLanguage, data.fromLanguage);

  // 使用通用聊天接口实现翻译
  return chat({
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: data.text },
    ],
    model: data.model,
    provider: data.provider,
    ...data.chatConfig,
  });
}
// activeSession?.agentsToSessions[0]?.agent
/**
 * 生成回复接口
 * @description 基于通用聊天接口实现的对话生成功能
 * @param data GenerateReplyRequest
 * @returns ChatResponse
 */
function generateReply(data: GenerateReplyRequest) {
  // 使用通用聊天接口生成回复
  return chat({
    messages: data.messages,
    model: data.model,
    provider: data.provider,
    ...data.chatConfig,
  }).then((response) => {
    return {
      reply: response.content,
    };
  });
}

/**
 * 文件内容摘要接口
 * @description 调用通用聊天接口，使用信息摘要提示词对传入的文件/文本内容进行一次摘要并抽取关键实体
 * @param data SummarizeContentRequest
 * @returns SummarizeContentResponse
 */
async function summarizeFileContent(
  data: SummarizeContentRequest
): Promise<SummarizeContentResponse> {
  const systemPrompt = INFO_SUMMARY_PROMPT;

  const { content, ...rest } = data;

  const response = await chat({
    messages: [
      { role: 'system', content: systemPrompt },
      {
        role: 'user',
        content: `请对下面的文件内容进行摘要并抽取实体：\n\n${content}`,
      },
    ],
    model: data.model,
    provider: data.provider,
    ...rest?.chatConfig,
  });

  let text = response?.content || '';

  if (text.startsWith('```json') && text.endsWith('```')) {
    text = text.slice(7, -3);
  }

  const parsed = JSON.parse(text);

  if (parsed && typeof parsed === 'object') {
    const summary = typeof parsed.summary === 'string' ? parsed.summary : '';
    const entities = Array.isArray(parsed.entities)
      ? parsed.entities
          .filter((e: any) => e && typeof e === 'object')
          .map((e: any) => ({
            label: String(e.label ?? ''),
            value: String(e.value ?? ''),
          }))
      : [];
    return { summary, entities };
  }

  // 兜底：如果模型未按 JSON 返回，则将全文作为摘要返回，实体为空数组
  return { summary: text, entities: [] };
}

export default {
  chat,
  translate,
  generateReply,
  summarizeFileContent,
};
