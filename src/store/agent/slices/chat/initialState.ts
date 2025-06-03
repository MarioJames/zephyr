import { DeepPartial } from 'utility-types';

import { DEFAULT_AGENT_CONFIG } from '@/const/settings';
import { LobeAgentConfig } from '@/types/agent';

export interface AgentState {
  activeAgentId?: string;
  activeId: string;
  agentConfigInitMap: Record<string, boolean>;
  agentMap: Record<string, DeepPartial<LobeAgentConfig>>;
  defaultAgentConfig: LobeAgentConfig;
  isInboxAgentConfigInit: boolean;
  showAgentSetting: boolean;
  updateAgentChatConfigSignal?: AbortController;
  updateAgentConfigSignal?: AbortController;
}

export const initialAgentChatState: AgentState = {
  activeId: 'inbox',
  agentConfigInitMap: {},
  agentMap: {},
  defaultAgentConfig: DEFAULT_AGENT_CONFIG,
  isInboxAgentConfigInit: false,
  showAgentSetting: false,
};
