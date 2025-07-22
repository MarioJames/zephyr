import { AgentItem } from '@/services/agents';

export interface AgentCoreState {
  agents: AgentItem[];
  aggregatedModels: any[];
  agentsInit: boolean;
  currentAgent?: AgentItem;
  isLoading: boolean;
  error?: string;
}

export const initialAgentCoreState: AgentCoreState = {
  agents: [],
  aggregatedModels: [],
  agentsInit: false,
  currentAgent: undefined,
  isLoading: false,
  error: undefined,
};
