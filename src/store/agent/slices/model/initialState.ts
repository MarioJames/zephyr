import { ModelDetailsResponse } from '@/services/ai-infra';

export interface ModelState {
  // 当前模型详情
  currentModelDetails?: ModelDetailsResponse;
  // 模型详情加载状态
  isLoadingModelDetails: boolean;
  // 模型详情缓存，以 "provider:model" 为key
  modelDetailsCache: Record<string, ModelDetailsResponse>;
  // 错误信息
  modelError?: string;
}

export const initialModelState: ModelState = {
  currentModelDetails: undefined,
  isLoadingModelDetails: false,
  modelDetailsCache: {},
  modelError: undefined,
};