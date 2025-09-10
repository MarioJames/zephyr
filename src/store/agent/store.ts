import { subscribeWithSelector } from 'zustand/middleware';
import { shallow } from 'zustand/shallow';
import { createWithEqualityFn } from 'zustand/traditional';
import { StateCreator } from 'zustand/vanilla';

import { AgentCoreAction, agentCoreSlice } from './slices/core/action';
import { AgentState, initialState } from './initialState';
import { createDevtools } from '@/utils/store';

export interface AgentStore extends AgentState, AgentCoreAction {}

const createStore: StateCreator<AgentStore, [['zustand/devtools', never]]> = (
  ...parameters
) => ({
  ...initialState,
  ...agentCoreSlice(...parameters),
});

//  ===============  实装 useStore ============ //

const devtools = createDevtools('agent');

export const useAgentStore = createWithEqualityFn<AgentStore>()(
  subscribeWithSelector(devtools(createStore)),
  shallow
);
