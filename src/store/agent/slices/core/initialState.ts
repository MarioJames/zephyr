import { AgentItem } from '@/services/agents';

export interface AgentCoreState {
  agents: AgentItem[];
  agentsInit: boolean;
  currentAgent?: AgentItem;
  isLoading: boolean;
  error?: string;
}

export const initialAgentCoreState: AgentCoreState = {
  agents: [],
  agentsInit: false,
  currentAgent: undefined,
  isLoading: false,
  error: undefined,
};
