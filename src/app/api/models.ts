import { request } from './index';
import modelsMock from '../mock/models';

export const modelsApi = {
  /**
   * 获取模型列表
   * @param provider string 模型提供商
   * @returns Promise<any[]> 模型数组
   */
  getModels: (provider: string) =>
    modelsMock['/models/getModels']?.({ provider }) || request('/models/getModels', { provider }),
}; 