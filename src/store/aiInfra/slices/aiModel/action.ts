import isEqual from 'fast-deep-equal';
import { SWRResponse, mutate } from 'swr';
import { StateCreator } from 'zustand/vanilla';

import { useClientDataSWR } from '@/libs/swr';
import { aiModelApi } from '@/app/api';
import { AiInfraStore } from '@/store/aiInfra/store';
import {
  AiModelSortMap,
  AiProviderModelListItem,
  CreateAiModelParams,
  ToggleAiModelEnableParams,
} from '@/types/aiModel';

const FETCH_AI_PROVIDER_MODEL_LIST_KEY = 'FETCH_AI_PROVIDER_MODELS';

export interface AiModelAction {
  batchToggleAiModels: (ids: string[], enabled: boolean) => Promise<void>;
  batchUpdateAiModels: (models: AiProviderModelListItem[]) => Promise<void>;
  clearModelsByProvider: (provider: string) => Promise<void>;
  clearRemoteModels: (provider: string) => Promise<void>;
  createNewAiModel: (params: CreateAiModelParams) => Promise<void>;
  fetchRemoteModelList: (providerId: string) => Promise<void>;
  internal_toggleAiModelLoading: (id: string, loading: boolean) => void;

  refreshAiModelList: () => Promise<void>;
  removeAiModel: (id: string, providerId: string) => Promise<void>;
  toggleModelEnabled: (params: Omit<ToggleAiModelEnableParams, 'providerId'>) => Promise<void>;
  updateAiModelsConfig: (
    id: string,
    providerId: string,
    data: Partial<AiProviderModelListItem>,
  ) => Promise<void>;
  updateAiModelsSort: (providerId: string, items: AiModelSortMap[]) => Promise<void>;

  useFetchAiProviderModels: (id: string) => SWRResponse<AiProviderModelListItem[]>;
}

export const createAiModelSlice: StateCreator<
  AiInfraStore,
  [['zustand/devtools', never]],
  [],
  AiModelAction
> = (set, get) => ({
  batchToggleAiModels: async (ids, enabled) => {
    const { activeAiProvider } = get();
    if (!activeAiProvider) return;

    await aiModelApi.batchToggleAiModels(activeAiProvider, ids, enabled);
    await get().refreshAiModelList();
  },
  batchUpdateAiModels: async (models) => {
    const { activeAiProvider: id } = get();
    if (!id) return;

    await aiModelApi.batchUpdateAiModels(id, models);
    await get().refreshAiModelList();
  },
  clearModelsByProvider: async (provider) => {
    await aiModelApi.clearModelsByProvider(provider);
    await get().refreshAiModelList();
  },
  clearRemoteModels: async (provider) => {
    await aiModelApi.clearRemoteModels(provider);
    await get().refreshAiModelList();
  },
  createNewAiModel: async (data) => {
    await aiModelApi.createAiModel(data);
    await get().refreshAiModelList();
  },
  fetchRemoteModelList: async (providerId) => {
    const { modelsApi } = await import('@/app/api');

    const data = await modelsApi.getModels(providerId);
    if (data) {
      await get().batchUpdateAiModels(
        data.map((model) => ({
          ...model,
          abilities: {
            files: model.files,
            functionCall: model.functionCall,
            reasoning: model.reasoning,
            vision: model.vision,
          },
          enabled: model.enabled || false,
          source: 'remote',
          type: 'chat',
        })),
      );

      await get().refreshAiModelList();
    }
  },
  internal_toggleAiModelLoading: (id, loading) => {
    set(
      (state) => {
        if (loading) return { aiModelLoadingIds: [...state.aiModelLoadingIds, id] };

        return { aiModelLoadingIds: state.aiModelLoadingIds.filter((i) => i !== id) };
      },
      false,
      'toggleAiModelLoading',
    );
  },
  refreshAiModelList: async () => {
    await mutate([FETCH_AI_PROVIDER_MODEL_LIST_KEY, get().activeAiProvider]);
    // make refresh provide runtime state async, not block
    get().refreshAiProviderRuntimeState();
  },
  removeAiModel: async (id, providerId) => {
    await aiModelApi.deleteAiModel({ id, providerId });
    await get().refreshAiModelList();
  },
  toggleModelEnabled: async (params) => {
    const { activeAiProvider } = get();
    if (!activeAiProvider) return;

    get().internal_toggleAiModelLoading(params.id, true);

    await aiModelApi.toggleModelEnabled({ ...params, providerId: activeAiProvider });
    await get().refreshAiModelList();

    get().internal_toggleAiModelLoading(params.id, false);
  },

  updateAiModelsConfig: async (id, providerId, data) => {
    await aiModelApi.updateAiModel(id, providerId, data);
    await get().refreshAiModelList();
  },
  updateAiModelsSort: async (id, items) => {
    await aiModelApi.updateAiModelOrder(id, items);
    await get().refreshAiModelList();
  },

  useFetchAiProviderModels: (id) =>
    useClientDataSWR<AiProviderModelListItem[]>(
      [FETCH_AI_PROVIDER_MODEL_LIST_KEY, id],
      ([, id]) => aiModelApi.getAiProviderModelList(id as string),
      {
        onSuccess: (data) => {
          // no need to update list if the list have been init and data is the same
          if (get().isAiModelListInit && isEqual(data, get().aiProviderModelList)) return;

          set(
            { aiProviderModelList: data, isAiModelListInit: true },
            false,
            `useFetchAiProviderModels/${id}`,
          );
        },
      },
    ),
});
