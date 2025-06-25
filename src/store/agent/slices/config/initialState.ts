export interface AgentChatConfig {
  autoCreateTopicThreshold: number;
  enableAutoCreateTopic?: boolean;
  enableCompressHistory?: boolean;
  enableHistoryCount?: boolean;
  enableMaxTokens?: boolean;
  enableReasoning?: boolean;
  historyCount?: number;
  temperature?: number;
  displayMode?: 'chat' | 'docs';
  enableHistoryDivider?: boolean;
}

export interface ConfigState {
  agentConfig: AgentChatConfig;
  isAgentConfigLoading: boolean;
}

export const initialConfigState: ConfigState = {
  agentConfig: {
    autoCreateTopicThreshold: 4,
    enableAutoCreateTopic: true,
    enableCompressHistory: true,
    enableHistoryCount: false,
    enableMaxTokens: false,
    enableReasoning: false,
    historyCount: 10,
    temperature: 0.7,
    displayMode: 'chat',
    enableHistoryDivider: true,
  },
  isAgentConfigLoading: false,
};