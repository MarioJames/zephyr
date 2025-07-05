import { AgentStore } from '../../store';

// 聊天配置相关选择器
const agentChatConfig = (s: AgentStore) => s.agentChatConfig;
const useModelBuiltinSearch = (s: AgentStore) =>
  s.agentChatConfig?.useModelBuiltinSearch;

export const agentConfigSelectors = {
  agentChatConfig,
  useModelBuiltinSearch,
};
