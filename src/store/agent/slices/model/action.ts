import { StateCreator } from 'zustand';
import aiInfraService, { ModelDetailsResponse, ModelDetailRequest } from '@/services/ai-infra';
import { AgentStore } from '../../store';

export interface ModelAction {
  // 获取模型详情
  fetchModelDetails: (model: string, provider: string) => Promise<void>;
  
  // 清除模型详情
  clearModelDetails: () => void;
  
  // 设置当前模型详情
  setCurrentModelDetails: (details: ModelDetailsResponse) => void;
  
  // 从缓存获取模型详情
  getModelDetailsFromCache: (model: string, provider: string) => ModelDetailsResponse | undefined;
}

export const modelSlice: StateCreator<
  AgentStore,
  [],
  [],
  ModelAction
> = (set, get) => ({
  fetchModelDetails: async (model: string, provider: string) => {
    const cacheKey = `${provider}:${model}`;
    const state = get();
    
    // 检查缓存
    const cachedDetails = state.modelDetailsCache[cacheKey];
    if (cachedDetails) {
      set({ 
        currentModelDetails: cachedDetails,
        modelError: undefined 
      });
      return;
    }

    set({ 
      isLoadingModelDetails: true, 
      modelError: undefined 
    });

    try {
      const details = await aiInfraService.getModelDetails({
        model,
        provider,
      });

      // 更新缓存和当前模型详情
      set(state => ({
        currentModelDetails: details,
        isLoadingModelDetails: false,
        modelDetailsCache: {
          ...state.modelDetailsCache,
          [cacheKey]: details,
        },
        modelError: undefined,
      }));
    } catch (error) {
      console.error('Failed to fetch model details:', error);
      set({
        isLoadingModelDetails: false,
        modelError: error instanceof Error ? error.message : 'Failed to fetch model details',
      });
    }
  },

  clearModelDetails: () => {
    set({
      currentModelDetails: undefined,
      modelError: undefined,
    });
  },

  setCurrentModelDetails: (details: ModelDetailsResponse) => {
    set({
      currentModelDetails: details,
      modelError: undefined,
    });
  },

  getModelDetailsFromCache: (model: string, provider: string) => {
    const cacheKey = `${provider}:${model}`;
    return get().modelDetailsCache[cacheKey];
  },
});