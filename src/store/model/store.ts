import { subscribeWithSelector } from 'zustand/middleware';
import { shallow } from 'zustand/shallow';
import { createWithEqualityFn } from 'zustand/traditional';
import { StateCreator } from 'zustand/vanilla';

import { ModelCoreAction, modelCoreSlice } from './slices/core/action';
import { ModelState, initialState } from './initialState';
import { createDevtools } from '@/utils/store';

export interface ModelStore extends ModelState, ModelCoreAction {}

const createStore: StateCreator<ModelStore, [['zustand/devtools', never]]> = (
  ...parameters
) => ({
  ...initialState,
  ...modelCoreSlice(...parameters),
});

//  ===============  实装 useStore ============ //

const devtools = createDevtools('model');

export const useModelStore = createWithEqualityFn<ModelStore>()(
  subscribeWithSelector(devtools(createStore)),
  shallow
);
