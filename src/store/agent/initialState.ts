import { ModelState, initialModelState } from './slices/model/initialState';
import {
  AgentListState,
  initialAgentListState,
} from './slices/agent/initialState';
import { ConfigState, initialConfigState } from './slices/config/initialState';

export interface AgentChatConfig {
  autoCreateTopicThreshold: number;
  enableAutoCreateTopic?: boolean;
  enableCompressHistory?: boolean;
  enableHistoryCount?: boolean;
  enableMaxTokens?: boolean;
  enableReasoning?: boolean;
  historyCount?: number;
  temperature?: number;
  displayMode?: string;
  enableHistoryDivider?: boolean;
}

export type AgentState = ModelState & AgentListState & ConfigState;

export const initialState: AgentState = {
  // Model state
  ...initialModelState,

  // AgentList state
  ...initialAgentListState,

  // Config state
  ...initialConfigState,
};
