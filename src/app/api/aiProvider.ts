import { request } from './index';
import aiProviderMock from '../mock/aiProvider';

export const aiProviderApi = {
  createAiProvider: (params: any) =>
    aiProviderMock['/aiProvider/createAiProvider']?.(params) || request('/aiProvider/createAiProvider', params),
  deleteAiProvider: (id: string) =>
    aiProviderMock['/aiProvider/deleteAiProvider']?.({ id }) || request('/aiProvider/deleteAiProvider', { id }),
  getAiProviderById: (id: string) =>
    aiProviderMock['/aiProvider/getAiProviderById']?.({ id }) || request('/aiProvider/getAiProviderById', { id }),
  getAiProviderList: () =>
    aiProviderMock['/aiProvider/getAiProviderList']?.({}) || request('/aiProvider/getAiProviderList', {}),
  getAiProviderRuntimeState: () =>
    aiProviderMock['/aiProvider/getAiProviderRuntimeState']?.({}) || request('/aiProvider/getAiProviderRuntimeState', {}),
  toggleProviderEnabled: (id: string, enabled: boolean) =>
    aiProviderMock['/aiProvider/toggleProviderEnabled']?.({ id, enabled }) || request('/aiProvider/toggleProviderEnabled', { id, enabled }),
  updateAiProvider: (id: string, value: any) =>
    aiProviderMock['/aiProvider/updateAiProvider']?.({ id, value }) || request('/aiProvider/updateAiProvider', { id, value }),
  updateAiProviderConfig: (id: string, value: any) =>
    aiProviderMock['/aiProvider/updateAiProviderConfig']?.({ id, value }) || request('/aiProvider/updateAiProviderConfig', { id, value }),
  updateAiProviderOrder: (items: any[]) =>
    aiProviderMock['/aiProvider/updateAiProviderOrder']?.({ items }) || request('/aiProvider/updateAiProviderOrder', { items }),
}; 