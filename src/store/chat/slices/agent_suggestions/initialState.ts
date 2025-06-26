// Agent 建议的接口类型
export interface AgentSuggestion {
  id: string;
  content: string;
  model?: string;
  provider?: string;
  usage?: {
    prompt_tokens?: number;
    completion_tokens?: number;
    total_tokens?: number;
  };
  parentMessageId: string;
  topicId: string;
  createdAt: string;
}

// Agent 建议状态接口
export interface AgentSuggestionsState {
  // 当前话题下的建议列表
  suggestions: AgentSuggestion[];
  
  // 建议是否已初始化
  suggestionsInit: boolean;
  
  // AI 建议生成中的 loading 状态
  isGeneratingAI: boolean;
  
  // 错误信息
  error?: string;
}

// 初始状态
export const initialAgentSuggestionsState: AgentSuggestionsState = {
  suggestions: [],
  suggestionsInit: false,
  isGeneratingAI: false,
  error: undefined,
};