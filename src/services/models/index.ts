import { http } from '../request';

// Response types
export interface ModelItem {
  abilities?: {
    files?: boolean;
    functionCall?: boolean;
    imageOutput?: boolean;
    reasoning?: boolean;
    search?: boolean;
    vision?: boolean;
  };
  config?: {
    deploymentName?: string;
    enabledSearch?: boolean;
  };
  contextWindowTokens?: number;
  createdAt: string;
  displayName?: string;
  enabled: boolean;
  id: string;
  settings?: {
    extendParams?: string[];
    searchImpl?: string;
    searchProvider?: string;
  };
  sort?: number;
  source: 'builtin' | 'custom' | 'remote';
  type: string;
  updatedAt: string;
}

export interface ProviderWithModels {
  modelCount: number;
  models: ModelItem[];
  providerEnabled: boolean;
  providerId: string;
  providerName?: string;
  providerSort?: number;
}

export interface GetEnabledModelsResponse {
  providers: ProviderWithModels[];
  totalModels: number;
  totalProviders: number;
}

export interface GetModelsRequest {
  type?:
    | 'chat'
    | 'embedding'
    | 'tts'
    | 'stt'
    | 'image'
    | 'text2video'
    | 'text2music'
    | 'realtime';
  enabled?: boolean;
  providerId?: string;
  page?: number;
  pageSize?: number;
  groupByProvider?: boolean; // true: 按provider分组返回, false: 返回扁平列表
}

/**
 * 获取模型列表
 * @description 获取模型列表
 * @param params GetModelsRequest
 * @returns GetEnabledModelsResponse
 */
async function getEnabledModels(params: GetModelsRequest) {
  return http.get<GetEnabledModelsResponse>(`/api/v1/models`, params);
}

/**
 * 获取模型详情
 * @description 获取模型详情
 * @param modelId string
 * @returns EnabledModelItem
 */
async function getModelConfig(provider: string, model: string) {
  return http.get<ModelItem>(`/api/v1/models/config`, {
    provider,
    model,
  });
}

export default {
  getEnabledModels,
  getModelConfig,
};
