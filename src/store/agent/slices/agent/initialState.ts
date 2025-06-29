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
