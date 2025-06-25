import { AgentItem } from '@/services/agents';

export interface AgentListState {
  agents: AgentItem[];
  agentsInit: boolean;
  currentAgentId?: string;
  currentAgent?: AgentItem;
  isLoading: boolean;
  error?: string;
}

export const initialAgentListState: AgentListState = {
  agents: [],
  agentsInit: false,
  currentAgentId: undefined,
  currentAgent: undefined,
  isLoading: false,
  error: undefined,
};