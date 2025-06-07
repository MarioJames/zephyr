import { ErrorResponse, ErrorType } from '@/types/fetch';
import { ChatMessageError } from '@/types/message';

// 错误类型到中文的映射
const ERROR_TYPE_MAP: Record<string, string> = {
  // 业务错误
  InvalidAccessCode: '无效的访问码',
  InvalidClerkUser: '无效的用户',
  FreePlanLimit: '免费额度已用尽',
  SubscriptionPlanLimit: '订阅额度已用尽',
  SubscriptionKeyMismatch: '订阅密钥不匹配',
  InvalidUserKey: '无效的用户密钥',
  CreateMessageError: '消息创建失败',
  NoOpenAIAPIKey: '未配置 OpenAI API Key',
  OllamaServiceUnavailable: 'Ollama 服务不可用',
  PluginFailToTransformArguments: '插件参数转换失败',
  UnknownChatFetchError: '未知聊天请求错误',
  SystemTimeNotMatchError: '系统时间不匹配',
  // 客户端错误
  400: '错误的请求',
  401: '未授权',
  403: '无权限',
  404: '未找到资源',
  405: '请求方法不被允许',
  429: '请求过于频繁',
  // 服务端错误
  500: '服务器内部错误',
  502: '网关错误',
  503: '服务不可用',
  504: '网关超时',
  // Agent Runtime 错误
  AgentRuntimeError: 'Agent 运行时错误',
  LocationNotSupportError: '不支持的地区',
  QuotaLimitReached: '配额已用尽',
  InsufficientQuota: '配额不足',
  ModelNotFound: '模型未找到',
  PermissionDenied: '无权限',
  ExceededContextWindow: '超出上下文窗口',
  InvalidProviderAPIKey: '无效的服务商 API Key',
  ProviderBizError: '服务商业务错误',
  InvalidOllamaArgs: 'Ollama 参数错误',
  OllamaBizError: 'Ollama 业务错误',
  InvalidBedrockCredentials: 'Bedrock 凭证无效',
  InvalidVertexCredentials: 'Vertex 凭证无效',
  StreamChunkError: '流式分块错误',
  InvalidGithubToken: 'Github Token 无效',
  ConnectionCheckFailed: '连接检测失败',
};

function getErrorMessageByType(type: string | number): string {
  if (typeof type === 'number') return ERROR_TYPE_MAP[type] || `错误码：${type}`;
  return ERROR_TYPE_MAP[type] || `错误类型：${type}`;
}

export const getMessageError = async (response: Response) => {
  let chatMessageError: ChatMessageError;

  // try to get the biz error
  try {
    const data = (await response.json()) as ErrorResponse;
    chatMessageError = {
      body: data.body,
      message: getErrorMessageByType(data.errorType),
      type: data.errorType,
    };
  } catch {
    // if not return, then it's a common error
    chatMessageError = {
      message: getErrorMessageByType(response.status),
      type: response.status as ErrorType,
    };
  }

  return chatMessageError;
};
