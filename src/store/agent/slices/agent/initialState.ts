import { AgentItem } from '@/services/agents';

export interface AgentListState {
  agents: AgentItem[];
  agentsInit: boolean;
  currentAgent?: AgentItem;
  isLoading: boolean;
  error?: string;
}

export const initialAgentListState: AgentListState = {
  agents: [],
  agentsInit: false,
  currentAgent: undefined,
  isLoading: false,
  error: undefined,
};

export const agentFormDefault = {
  title: '',
  description: '',
  model: 'claude-3.5-sonnet',
  params: {
    temperature: 1.0,
    maxTokens: 2048,
    topP: 1.0,
    presencePenalty: 0,
    frequencyPenalty: 0.0,
  },
  prompt: '',
  avatar: undefined,
};
