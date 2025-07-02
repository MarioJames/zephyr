import { ModelState, initialModelState } from './slices/model/initialState';
import {
  AgentListState,
  initialAgentListState,
} from './slices/agent/initialState';
import { ConfigState, initialConfigState } from './slices/config/initialState';

export type AgentState = ModelState & AgentListState & ConfigState;

export const initialState: AgentState = {
  // Model state
  ...initialModelState,

  // AgentList state
  ...initialAgentListState,

  // Config state
  ...initialConfigState,
};
