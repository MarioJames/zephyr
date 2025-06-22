import { DEFAULT_MODEL_PROVIDER_LIST } from '@/config/modelProviders';
import { ModelProviderCard } from '@/types/llm';
import { ServerLanguageModel } from '@/types/serverConfig';

/**
 * 模型列表状态接口
 * 定义了模型列表相关的状态字段
 */
export interface ModelListState {
  /**
   * 默认模型提供商列表
   * 系统预设的模型提供商列表
   */
  defaultModelProviderList: ModelProviderCard[];
  
  /**
   * 正在编辑的自定义卡片模型
   * 存储当前正在编辑的自定义模型信息
   */
  editingCustomCardModel?: { id: string; provider: string } | undefined;
  
  /**
   * 模型提供商列表
   * 当前可用的模型提供商列表
   */
  modelProviderList: ModelProviderCard[];
  
  /**
   * 服务器语言模型配置
   * 来自服务器的语言模型配置信息
   */
  serverLanguageModel?: ServerLanguageModel;
}

/**
 * 模型列表状态的初始值
 * 设置所有模型列表相关字段的默认值
 */
export const initialModelListState: ModelListState = {
  defaultModelProviderList: DEFAULT_MODEL_PROVIDER_LIST,
  modelProviderList: DEFAULT_MODEL_PROVIDER_LIST,
};
