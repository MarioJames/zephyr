import { AgentItem } from '@/services/agents';
import { ModelState, initialModelState } from './slices/model/initialState';

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

export interface AgentState extends ModelState {
  // 智能体列表
  agents: AgentItem[];
  agentsInit: boolean;
  
  // 当前活跃的智能体
  currentAgentId?: string;
  currentAgent?: AgentItem;
  
  // 智能体配置
  agentConfig: AgentChatConfig;
  
  // 加载状态
  isLoading: boolean;
  isAgentConfigLoading: boolean;
  error?: string;
}

export const initialState: AgentState = {
  // Model state
  ...initialModelState,
  
  // Agent state
  agents: [],
  agentsInit: false,
  
  currentAgentId: undefined,
  currentAgent: undefined,
  
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
  
  isLoading: false,
  isAgentConfigLoading: false,
  error: undefined,
};