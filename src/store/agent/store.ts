import { subscribeWithSelector } from 'zustand/middleware';
import { shallow } from 'zustand/shallow';
import { createWithEqualityFn } from 'zustand/traditional';
import { StateCreator } from 'zustand/vanilla';

import { AgentAction, agentSlice } from './slices/agent/action';
import { ConfigAction, configSlice } from './slices/config/action';
import { AgentState, initialState } from './initialState';
import { createDevtools } from '@/utils/store';

export interface AgentStore extends AgentState, AgentAction, ConfigAction {}

const createStore: StateCreator<AgentStore, [['zustand/devtools', never]]> = (
  ...parameters
) => ({
  ...initialState,
  ...agentSlice(...parameters),
  ...configSlice(...parameters),
});

//  ===============  实装 useStore ============ //

const devtools = createDevtools('agent');

export const useAgentStore = createWithEqualityFn<AgentStore>()(
  subscribeWithSelector(devtools(createStore)),
  shallow
);
