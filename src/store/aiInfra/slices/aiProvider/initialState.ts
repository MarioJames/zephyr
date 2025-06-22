import { EnabledAiModel } from '@/types/aiModel';
import {
  AiProviderDetailItem,
  AiProviderListItem,
  AiProviderRuntimeConfig,
  EnabledProvider,
  EnabledProviderWithModels,
} from '@/types/aiProvider';

/**
 * AI服务商状态接口
 * 定义了AI服务商相关的所有状态字段
 */
export interface AIProviderState {
  /**
   * 当前激活的AI服务商ID
   * 表示当前选中的AI服务商
   */
  activeAiProvider?: string;
  
  /**
   * 当前激活服务商的模型列表
   * 存储当前选中服务商下的所有模型
   */
  activeProviderModelList: any[];
  
  /**
   * 正在更新配置的AI服务商ID列表
   * 存储所有正在更新配置的AI服务商ID
   */
  aiProviderConfigUpdatingIds: string[];
  
  /**
   * 当前AI服务商详情
   * 存储当前选中AI服务商的详细信息
   */
  aiProviderDetail?: AiProviderDetailItem | null;
  
  /**
   * AI服务商列表
   * 存储所有可用的AI服务商信息
   */
  aiProviderList: AiProviderListItem[];
  
  /**
   * 正在加载的AI服务商ID列表
   * 存储所有正在加载的AI服务商ID
   */
  aiProviderLoadingIds: string[];
  
  /**
   * AI服务商运行时配置
   * 以服务商ID为键，存储每个服务商的运行时配置信息
   */
  aiProviderRuntimeConfig: Record<string, AiProviderRuntimeConfig>;
  
  /**
   * 启用的AI模型列表
   * 存储所有已启用的AI模型信息
   */
  enabledAiModels?: EnabledAiModel[];
  
  /**
   * 启用的AI服务商列表
   * 存储所有已启用的AI服务商信息
   */
  enabledAiProviders?: EnabledProvider[];
  
  /**
   * 启用的聊天模型列表（用于下拉选择）
   * 存储所有可用于聊天的AI模型及其服务商信息
   */
  enabledChatModelList?: EnabledProviderWithModels[];
  
  /**
   * AI服务商列表是否已初始化
   * 标识AI服务商数据是否已经完成首次获取
   */
  initAiProviderList: boolean;
  
  /**
   * 服务商搜索关键词
   * 当前服务商搜索使用的关键词
   */
  providerSearchKeyword: string;
}

/**
 * AI服务商状态的初始值
 * 设置所有AI服务商相关字段的默认值
 */
export const initialAIProviderState: AIProviderState = {
  activeProviderModelList: [], // 默认激活服务商模型列表为空
  aiProviderConfigUpdatingIds: [], // 默认配置更新ID列表为空
  aiProviderList: [], // 默认服务商列表为空
  aiProviderLoadingIds: [], // 默认加载ID列表为空
  aiProviderRuntimeConfig: {}, // 默认运行时配置为空
  initAiProviderList: false, // 默认服务商列表未初始化
  providerSearchKeyword: '', // 默认服务商搜索关键词为空
};
