import {
  AgentCoreState,
  initialAgentCoreState,
} from './slices/core/initialState';
import { ConfigState, initialConfigState } from './slices/config/initialState';

export type AgentState = AgentCoreState & ConfigState;

export const initialState: AgentState = {
  ...initialAgentCoreState,
  ...initialConfigState,
};
