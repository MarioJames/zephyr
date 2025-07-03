import { GetEnabledModelsResponse, ModelItem } from '@/services/models';

export interface ModelCoreState {
  // 模型列表是否已初始化
  modelsInit: boolean;
  // 错误信息
  modelError?: string;
  // 模型列表
  modelsList?: GetEnabledModelsResponse;
  // 模型列表加载状态
  isLoadingModelsList: boolean;
  // 当前会话使用的模型信息
  currentModelConfig?: ModelItem;
  // 模型配置加载状态
  isLoadingModelConfigs: boolean;
}

export const initialModelCoreState: ModelCoreState = {
  modelsList: undefined,
  isLoadingModelsList: false,
  modelsInit: false,
  currentModelConfig: undefined,
  isLoadingModelConfigs: false,
  modelError: undefined,
};
