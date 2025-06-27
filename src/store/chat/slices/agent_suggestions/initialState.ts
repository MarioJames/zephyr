import { AgentSuggestionItem } from '@/services/agent_suggestions';

// Agent 建议状态接口
export interface AgentSuggestionsState {
  // 当前话题下的建议列表
  suggestions: AgentSuggestionItem[];

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
