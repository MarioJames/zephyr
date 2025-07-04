import {
  AgentListState,
  initialAgentListState,
} from './slices/core/initialState';
import { ConfigState, initialConfigState } from './slices/config/initialState';

export type AgentState = AgentListState & ConfigState;

export const initialState: AgentState = {
  // AgentList state
  ...initialAgentListState,

  // Config state
  ...initialConfigState,
};
