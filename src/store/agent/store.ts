import { create } from 'zustand';
import { StateCreator } from 'zustand/vanilla';

import { AgentAction, agentSlice } from './slices/agent/action';
import { ConfigAction, configSlice } from './slices/config/action';
import { AgentState, initialState } from './initialState';

export interface AgentStore extends AgentState, AgentAction, ConfigAction {}

const createStore: StateCreator<AgentStore> = (...parameters) => ({
  ...initialState,
  ...agentSlice(...parameters),
  ...configSlice(...parameters),
});

export const useAgentStore = create<AgentStore>()(createStore);