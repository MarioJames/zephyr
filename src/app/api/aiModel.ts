import { request } from './index';
import aiModelMock from '../mock/aiModel';

export const aiModelApi = {
  batchToggleAiModels: (providerId: string, ids: string[], enabled: boolean) =>
    aiModelMock['/aiModel/batchToggleAiModels']?.({ providerId, ids, enabled }) || request('/aiModel/batchToggleAiModels', { providerId, ids, enabled }),
  batchUpdateAiModels: (providerId: string, models: any[]) =>
    aiModelMock['/aiModel/batchUpdateAiModels']?.({ providerId, models }) || request('/aiModel/batchUpdateAiModels', { providerId, models }),
  clearModelsByProvider: (provider: string) =>
    aiModelMock['/aiModel/clearModelsByProvider']?.({ provider }) || request('/aiModel/clearModelsByProvider', { provider }),
  clearRemoteModels: (provider: string) =>
    aiModelMock['/aiModel/clearRemoteModels']?.({ provider }) || request('/aiModel/clearRemoteModels', { provider }),
  createAiModel: (data: any) =>
    aiModelMock['/aiModel/createAiModel']?.(data) || request('/aiModel/createAiModel', data),
  deleteAiModel: ({ id, providerId }: { id: string; providerId: string }) =>
    aiModelMock['/aiModel/deleteAiModel']?.({ id, providerId }) || request('/aiModel/deleteAiModel', { id, providerId }),
  toggleModelEnabled: (params: any) =>
    aiModelMock['/aiModel/toggleModelEnabled']?.(params) || request('/aiModel/toggleModelEnabled', params),
  updateAiModel: (id: string, providerId: string, data: any) =>
    aiModelMock['/aiModel/updateAiModel']?.({ id, providerId, data }) || request('/aiModel/updateAiModel', { id, providerId, data }),
  updateAiModelOrder: (providerId: string, items: any[]) =>
    aiModelMock['/aiModel/updateAiModelOrder']?.({ providerId, items }) || request('/aiModel/updateAiModelOrder', { providerId, items }),
  getAiProviderModelList: (providerId: string) =>
    aiModelMock['/aiModel/getAiProviderModelList']?.({ providerId }) || request('/aiModel/getAiProviderModelList', { providerId }),
}; 