import {
  AgentCoreState,
  initialAgentCoreState,
} from './slices/core/initialState';

export type AgentState = AgentCoreState;

export const initialState: AgentState = {
  ...initialAgentCoreState,
};
