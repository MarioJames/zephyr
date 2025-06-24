import { uniqBy } from 'lodash-es';
import { SWRResponse, mutate } from 'swr';
import { StateCreator } from 'zustand/vanilla';

import { DEFAULT_MODEL_PROVIDER_LIST } from '@/config/modelProviders';
import { isDeprecatedEdition, isUsePgliteDB } from '@/const/version';
import { useClientDataSWR } from '@/libs/swr';
import { aiProviderApi } from '@/app/api';
import { AiInfraStore } from '@/store/aiInfra/store';
import { ModelAbilities } from '@/types/aiModel';
import {
  AiProviderDetailItem,
  AiProviderListItem,
  AiProviderRuntimeState,
  AiProviderSortMap,
  AiProviderSourceEnum,
  CreateAiProviderParams,
  UpdateAiProviderConfigParams,
  UpdateAiProviderParams,
} from '@/types/aiProvider';

enum AiProviderSwrKey {
  fetchAiProviderItem = 'FETCH_AI_PROVIDER_ITEM',
  fetchAiProviderList = 'FETCH_AI_PROVIDER',
  fetchAiProviderRuntimeState = 'FETCH_AI_PROVIDER_RUNTIME_STATE',
}

export interface AiProviderAction {
  createNewAiProvider: (params: CreateAiProviderParams) => Promise<void>;
  deleteAiProvider: (id: string) => Promise<void>;
  internal_toggleAiProviderConfigUpdating: (id: string, loading: boolean) => void;
  internal_toggleAiProviderLoading: (id: string, loading: boolean) => void;
  refreshAiProviderDetail: () => Promise<void>;
  refreshAiProviderList: () => Promise<void>;
  refreshAiProviderRuntimeState: () => Promise<void>;
  removeAiProvider: (id: string) => Promise<void>;
  toggleProviderEnabled: (id: string, enabled: boolean) => Promise<void>;
  updateAiProvider: (id: string, value: UpdateAiProviderParams) => Promise<void>;
  updateAiProviderConfig: (id: string, value: UpdateAiProviderConfigParams) => Promise<void>;
  updateAiProviderSort: (items: AiProviderSortMap[]) => Promise<void>;

  useFetchAiProviderItem: (id: string) => SWRResponse<AiProviderDetailItem | undefined>;
  useFetchAiProviderList: (params?: { suspense?: boolean }) => SWRResponse<AiProviderListItem[]>;
  /**
   * fetch provider keyVaults and user enabled model list
   * @param isLoginOnInit
   */
  useFetchAiProviderRuntimeState: (
    isLoginOnInit: boolean | undefined,
  ) => SWRResponse<AiProviderRuntimeState | undefined>;
}

export const createAiProviderSlice: StateCreator<
  AiInfraStore,
  [['zustand/devtools', never]],
  [],
  AiProviderAction
> = (set, get) => ({
  createNewAiProvider: async (params) => {
    await aiProviderApi.createAiProvider({ ...params, source: AiProviderSourceEnum.Custom });
    await get().refreshAiProviderList();
  },
  deleteAiProvider: async (id: string) => {
    await aiProviderApi.deleteAiProvider(id);

    await get().refreshAiProviderList();
  },
  internal_toggleAiProviderConfigUpdating: (id, loading) => {
    set(
      (state) => {
        if (loading)
          return { aiProviderConfigUpdatingIds: [...state.aiProviderConfigUpdatingIds, id] };

        return {
          aiProviderConfigUpdatingIds: state.aiProviderConfigUpdatingIds.filter((i) => i !== id),
        };
      },
      false,
      'toggleAiProviderLoading',
    );
  },
  internal_toggleAiProviderLoading: (id, loading) => {
    set(
      (state) => {
        if (loading) return { aiProviderLoadingIds: [...state.aiProviderLoadingIds, id] };

        return { aiProviderLoadingIds: state.aiProviderLoadingIds.filter((i) => i !== id) };
      },
      false,
      'toggleAiProviderLoading',
    );
  },
  refreshAiProviderDetail: async () => {
    await mutate([AiProviderSwrKey.fetchAiProviderItem, get().activeAiProvider]);
    await get().refreshAiProviderRuntimeState();
  },
  refreshAiProviderList: async () => {
    await mutate(AiProviderSwrKey.fetchAiProviderList);
    await get().refreshAiProviderRuntimeState();
  },
  refreshAiProviderRuntimeState: async () => {
    await mutate([AiProviderSwrKey.fetchAiProviderRuntimeState, true]);
  },
  removeAiProvider: async (id) => {
    await aiProviderApi.deleteAiProvider(id);
    await get().refreshAiProviderList();
  },

  toggleProviderEnabled: async (id: string, enabled: boolean) => {
    get().internal_toggleAiProviderLoading(id, true);
    await aiProviderApi.toggleProviderEnabled(id, enabled);
    await get().refreshAiProviderList();

    get().internal_toggleAiProviderLoading(id, false);
  },

  updateAiProvider: async (id, value) => {
    get().internal_toggleAiProviderLoading(id, true);
    await aiProviderApi.updateAiProvider(id, value);
    await get().refreshAiProviderList();
    await get().refreshAiProviderDetail();

    get().internal_toggleAiProviderLoading(id, false);
  },

  updateAiProviderConfig: async (id, value) => {
    get().internal_toggleAiProviderConfigUpdating(id, true);
    await aiProviderApi.updateAiProviderConfig(id, value);
    await get().refreshAiProviderDetail();

    get().internal_toggleAiProviderConfigUpdating(id, false);
  },

  updateAiProviderSort: async (items) => {
    await aiProviderApi.updateAiProviderOrder(items);
    await get().refreshAiProviderList();
  },
  useFetchAiProviderItem: (id) =>
    useClientDataSWR<AiProviderDetailItem | undefined>(
      [AiProviderSwrKey.fetchAiProviderItem, id],
      () => aiProviderApi.getAiProviderById(id),
      {
        onSuccess: (data) => {
          if (!data) return;

          set({ activeAiProvider: id, aiProviderDetail: data }, false, 'useFetchAiProviderItem');
        },
      },
    ),
  useFetchAiProviderList: () =>
    useClientDataSWR<AiProviderListItem[]>(
      AiProviderSwrKey.fetchAiProviderList,
      () => aiProviderApi.getAiProviderList(),
      {
        fallbackData: [],
        onSuccess: (data) => {
          if (!get().initAiProviderList) {
            set(
              { aiProviderList: data, initAiProviderList: true },
              false,
              'useFetchAiProviderList/init',
            );
            return;
          }

          set({ aiProviderList: data }, false, 'useFetchAiProviderList/refresh');
        },
      },
    ),

  useFetchAiProviderRuntimeState: (isLogin) =>
    useClientDataSWR<AiProviderRuntimeState | undefined>(
      !isDeprecatedEdition ? [AiProviderSwrKey.fetchAiProviderRuntimeState, isLogin] : null,
      async ([, isLogin]) => {
        if (isLogin) return aiProviderApi.getAiProviderRuntimeState();

        const { LOBE_DEFAULT_MODEL_LIST } = await import('@/config/aiModels');
        return {
          enabledAiModels: LOBE_DEFAULT_MODEL_LIST.filter((m) => m.enabled),
          enabledAiProviders: DEFAULT_MODEL_PROVIDER_LIST.filter(
            (provider) => provider.enabled,
          ).map((item) => ({ id: item.id, name: item.name, source: 'builtin' })),
          runtimeConfig: {},
        };
      },
      {
        focusThrottleInterval: isUsePgliteDB ? 100 : undefined,
        onSuccess: async (data) => {
          if (!data) return;

          const getModelListByType = (providerId: string, type: string) => {
            const models = data.enabledAiModels
              .filter((model) => model.providerId === providerId && model.type === type)
              .map((model) => ({
                abilities: (model.abilities || {}) as ModelAbilities,
                contextWindowTokens: model.contextWindowTokens,
                displayName: model.displayName ?? '',
                id: model.id,
              }));

            return uniqBy(models, 'id');
          };

          // 3. 组装最终数据结构
          const enabledChatModelList = data.enabledAiProviders.map((provider) => ({
            ...provider,
            children: getModelListByType(provider.id, 'chat'),
            name: provider.name || provider.id,
          }));
          const { LOBE_DEFAULT_MODEL_LIST } = await import('@/config/aiModels');

          set(
            {
              aiProviderRuntimeConfig: data.runtimeConfig,
              builtinAiModelList: LOBE_DEFAULT_MODEL_LIST,
              enabledAiModels: data.enabledAiModels,
              enabledAiProviders: data.enabledAiProviders,
              enabledChatModelList,
            },
            false,
            'useFetchAiProviderRuntimeState',
          );
        },
      },
    ),
});
