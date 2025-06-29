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
  temperature: 0.5,
  maxTokens: 2048,
  prompt: '',
  avatar: '',
};
