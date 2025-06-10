import { request } from './index';

export const aiProviderApi = {
  createAiProvider: (params: any) => request('/aiProvider/createAiProvider', params),
  deleteAiProvider: (id: string) => request('/aiProvider/deleteAiProvider', { id }),
  getAiProviderById: (id: string) => request('/aiProvider/getAiProviderById', { id }),
  getAiProviderList: () => request('/aiProvider/getAiProviderList', {}),
  getAiProviderRuntimeState: () => request('/aiProvider/getAiProviderRuntimeState', {}),
  toggleProviderEnabled: (id: string, enabled: boolean) => request('/aiProvider/toggleProviderEnabled', { id, enabled }),
  updateAiProvider: (id: string, value: any) => request('/aiProvider/updateAiProvider', { id, value }),
  updateAiProviderConfig: (id: string, value: any) => request('/aiProvider/updateAiProviderConfig', { id, value }),
  updateAiProviderOrder: (items: any[]) => request('/aiProvider/updateAiProviderOrder', { items }),
}; 