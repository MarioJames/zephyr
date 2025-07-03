import { StateCreator } from 'zustand';
import modelsService, {
  GetModelConfigRequest,
  GetModelsRequest,
  ModelItem,
} from '@/services/models';
import { ModelCoreState } from './initialState';

export interface ModelCoreAction {
  // 模型列表相关操作
  fetchModelsList: (params?: GetModelsRequest) => Promise<void>;
  refreshModelsList: () => Promise<void>;
  clearModelsList: () => void;

  // 当前会话模型相关操作
  fetchModelConfig: (data: GetModelConfigRequest) => Promise<void>;
  setCurrentModelConfig: (modelInfo?: ModelItem) => void;
  clearCurrentModelConfig: () => void;
}

export const modelCoreSlice: StateCreator<
  ModelCoreState & ModelCoreAction,
  [],
  [],
  ModelCoreAction
> = (set, get) => ({
  // 模型列表相关操作
  fetchModelsList: async (params: GetModelsRequest = {}) => {
    set({
      isLoadingModelsList: true,
      modelError: undefined,
    });

    try {
      const modelsList = await modelsService.getEnabledModels({
        type: 'chat',
        enabled: true,
        groupByProvider: true,
        ...params,
      });

      set({
        modelsList,
        isLoadingModelsList: false,
        modelError: undefined,
      });
    } catch (error) {
      console.error('Failed to fetch models list:', error);
      set({
        isLoadingModelsList: false,
        modelError:
          error instanceof Error
            ? error.message
            : 'Failed to fetch models list',
      });
    }
  },

  refreshModelsList: async () => {
    const state = get();
    await state.fetchModelsList();
  },

  clearModelsList: () => {
    set({
      modelsList: undefined,
    });
  },

  // 当前会话模型相关操作
  fetchModelConfig: async (data) => {
    const { model, provider, sessionId } = data;

    if (!sessionId && !model && !provider) return;

    set({
      isLoadingModelConfigs: true,
      modelError: undefined,
    });

    const requestMethod = sessionId
      ? modelsService.getModelConfigBySession
      : modelsService.getModelConfig;

    try {
      const modelConfig = await requestMethod(data);

      set({
        currentModelConfig: modelConfig,
        isLoadingModelConfigs: false,
        modelError: undefined,
      });
    } catch (error) {
      console.error('Failed to fetch model config:', error);
      set({
        isLoadingModelConfigs: false,
        modelError:
          error instanceof Error
            ? error.message
            : 'Failed to fetch model config',
      });
    }
  },

  setCurrentModelConfig: (modelInfo?: ModelItem) => {
    set({
      currentModelConfig: modelInfo,
      modelError: undefined,
    });
  },

  clearCurrentModelConfig: () => {
    set({
      currentModelConfig: undefined,
    });
  },

  updateCurrentSessionModelInfo: (modelInfo: ModelItem) => {
    const state = get();
    if (state.currentModelConfig) {
      set({
        currentModelConfig: {
          ...state.currentModelConfig,
          ...modelInfo,
        },
      });
    }
  },
});
