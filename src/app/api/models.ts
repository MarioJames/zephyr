import { request } from './index';

export const modelsApi = {
  getModels: (provider: string) => request('/models/getModels', { provider }),
}; 