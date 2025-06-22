import { shallow } from 'zustand/shallow';
import { createWithEqualityFn } from 'zustand/traditional';
import { StateCreator } from 'zustand/vanilla';

import { createDevtools } from '../middleware/createDevtools';
import { AIProviderStoreState, initialState } from './initialState';
import { AiModelAction, createAiModelSlice } from './slices/aiModel';
import { AiProviderAction, createAiProviderSlice } from './slices/aiProvider';

//  ===============  聚合 createStoreFn ============ //

/**
 * AI基础设施Store的完整类型定义
 * 通过交叉类型(&)将所有状态和操作组合在一起
 * 包含以下模块：
 * - AIProviderStoreState: AI服务商和模型相关状态
 * - AiProviderAction: AI服务商相关操作
 * - AiModelAction: AI模型相关操作
 */
export interface AiInfraStore extends AIProviderStoreState, AiProviderAction, AiModelAction {
  /* empty */
}

/**
 * 创建AI基础设施Store的工厂函数
 * 将所有slice的状态和操作合并成一个完整的store
 * @param parameters - Zustand的创建参数
 * @returns 完整的AI基础设施store对象
 */
const createStore: StateCreator<AiInfraStore, [['zustand/devtools', never]]> = (...parameters) => ({
  ...initialState,
  ...createAiModelSlice(...parameters),
  ...createAiProviderSlice(...parameters),
});

//  ===============  实装 useStore ============ //
const devtools = createDevtools('aiInfra');

export const useAiInfraStore = createWithEqualityFn<AiInfraStore>()(devtools(createStore), shallow);

export const getAiInfraStoreState = () => useAiInfraStore.getState();
