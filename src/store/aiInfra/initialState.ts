// 导入AI模型和服务商相关的状态类型和初始状态
import { AIModelsState, initialAIModelState } from './slices/aiModel'; // AI模型状态
import { AIProviderState, initialAIProviderState } from './slices/aiProvider'; // AI服务商状态

/**
 * AI基础设施Store状态的完整类型定义
 * 通过交叉类型(&)将AI服务商和AI模型的状态组合在一起
 */
export interface AIProviderStoreState extends AIProviderState, AIModelsState {
  /* empty */
}

/**
 * AI基础设施Store的初始状态
 * 通过展开操作符(...)将所有子模块的初始状态合并
 * 为整个AI基础设施store提供一个完整的初始状态对象
 */
export const initialState: AIProviderStoreState = {
  ...initialAIProviderState, // AI服务商相关初始状态
  ...initialAIModelState, // AI模型相关初始状态
};
