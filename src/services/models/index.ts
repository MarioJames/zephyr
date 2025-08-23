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
    // params: 模型本身支持搜索，internal: lobechat内部搜索，但在Zephyr中不支持
    searchImpl?: 'params' | 'internal';
    searchProvider?: string;
  };
  sort?: number;
  source: 'builtin' | 'custom' | 'remote';
  type: string;
  updatedAt: string;
}

export interface AggregatedModelItem {
  abilities: {
    search: boolean;
    vision: boolean;
    reasoning: boolean;
    imageOutput: boolean;
    functionCall: boolean;
  };
  settings: {
    searchImpl: 'params' | 'internal';
    searchProvider: string;
  };
  contextWindowTokens: number;
  createdAt: string;
  createdBy: string;
  description: string;
  displayName: string;
  enabled: boolean;
  fallbackModelId: string;
  id: string;
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

export interface GetAggregatedModelsResponse {
  data: AggregatedModelItem[];
  total: number;
  success: boolean;
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
  provider?: string;
  page?: number;
  pageSize?: number;
  groupByProvider?: boolean; // true: 按provider分组返回, false: 返回扁平列表
  [key: string]: unknown;
}

export interface GetModelConfigRequest {
  model?: string;
  provider?: string;
  sessionId?: string;
}

/**
 * 获取聚合模型列表
 * @description 获取所有启用的聚合模型列表
 * @returns GetAggregatedModelsResponse
 */
async function getAggregatedModels() {
  return http.get<GetAggregatedModelsResponse>('/api/aggregated-model');
}

async function getAggregatedModelConfig(modelId: string) {
  return http.get<AggregatedModelItem>(`/api/aggregated-model/${modelId}`);
}

export default {
  getAggregatedModels,
  getAggregatedModelConfig,
};
