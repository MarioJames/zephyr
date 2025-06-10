import { request } from './index';

export const aiModelApi = {
  batchToggleAiModels: (providerId: string, ids: string[], enabled: boolean) =>
    request('/aiModel/batchToggleAiModels', { providerId, ids, enabled }),
  batchUpdateAiModels: (providerId: string, models: any[]) =>
    request('/aiModel/batchUpdateAiModels', { providerId, models }),
  clearModelsByProvider: (provider: string) =>
    request('/aiModel/clearModelsByProvider', { provider }),
  clearRemoteModels: (provider: string) =>
    request('/aiModel/clearRemoteModels', { provider }),
  createAiModel: (data: any) =>
    request('/aiModel/createAiModel', data),
  deleteAiModel: ({ id, providerId }: { id: string; providerId: string }) =>
    request('/aiModel/deleteAiModel', { id, providerId }),
  toggleModelEnabled: (params: any) =>
    request('/aiModel/toggleModelEnabled', params),
  updateAiModel: (id: string, providerId: string, data: any) =>
    request('/aiModel/updateAiModel', { id, providerId, data }),
  updateAiModelOrder: (providerId: string, items: any[]) =>
    request('/aiModel/updateAiModelOrder', { providerId, items }),
  getAiProviderModelList: (providerId: string) =>
    request('/aiModel/getAiProviderModelList', { providerId }),
}; 