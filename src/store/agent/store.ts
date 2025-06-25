import { create } from 'zustand';
import { StateCreator } from 'zustand/vanilla';

import { AgentAction, agentSlice } from './slices/agent/action';
import { ConfigAction, configSlice } from './slices/config/action';
import { ModelAction, modelSlice } from './slices/model/action';
import { AgentState, initialState } from './initialState';

export interface AgentStore extends AgentState, AgentAction, ConfigAction, ModelAction {}

const createStore: StateCreator<AgentStore> = (...parameters) => ({
  ...initialState,
  ...agentSlice(...parameters),
  ...configSlice(...parameters),
  ...modelSlice(...parameters),
});

export const useAgentStore = create<AgentStore>()(createStore);