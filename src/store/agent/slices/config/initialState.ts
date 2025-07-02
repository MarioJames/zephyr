import { AgentConfig } from '@/types/agent';

export interface ConfigState {
  agentChatConfig: AgentConfig;
  isAgentConfigLoading: boolean;
}

export const initialConfigState: ConfigState = {
  agentChatConfig: {
    autoCreateTopicThreshold: 4,
    enableAutoCreateTopic: true,
    enableCompressHistory: true,
    enableHistoryCount: false,
    enableMaxTokens: false,
    enableReasoning: false,
    historyCount: 10,
    enableHistoryDivider: true,
    useModelBuiltinSearch: false,
  },
  isAgentConfigLoading: false,
};
