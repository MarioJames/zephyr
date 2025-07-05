import { ModelCoreState } from './initialState';

// 复合选择器
const hasModelConfig = (s: ModelCoreState): boolean => !!s.currentModelConfig;

// 获取模型列表对应的模型选项
const providerModelOptions = (s: ModelCoreState) => {
  const modelsList = s.modelsList;
  if (!modelsList) return [];

  return modelsList.providers
    .filter(
      (provider) => provider.providerEnabled && provider.models.length > 0
    )
    .sort((a, b) => (a.providerSort || 0) - (b.providerSort || 0))
    .map((provider) => ({
      label: provider.providerName || provider.providerId,
      value: provider.providerId,
      options: provider.models
        .filter((model) => model.enabled)
        .sort((a, b) => (a.sort || 0) - (b.sort || 0))
        .map((model) => ({
          label: model.displayName || model.id,
          value: model.id,
        })),
    }))
    .filter((group) => group.options.length > 0);
};

// 模型能力选择器
const currentModelCapabilities = (s: ModelCoreState) => {
  const config = s.currentModelConfig;
  if (!config) return null;

  return {
    supportFiles: config.abilities?.files ?? false,
    supportVision: config.abilities?.vision ?? false,
    supportToolUse: config.abilities?.functionCall ?? false,
    supportReasoning: config.abilities?.reasoning ?? false,
    contextWindowTokens: config.contextWindowTokens,
  };
};

// 检查特定能力的选择器
const currentModelSupportFiles = (s: ModelCoreState): boolean =>
  s.currentModelConfig?.abilities?.files ?? false;

const currentModelSupportVision = (s: ModelCoreState): boolean =>
  s.currentModelConfig?.abilities?.vision ?? false;

const currentModelSupportToolUse = (s: ModelCoreState): boolean =>
  s.currentModelConfig?.abilities?.functionCall ?? false;

const currentModelSupportReasoning = (s: ModelCoreState): boolean =>
  s.currentModelConfig?.abilities?.reasoning ?? false;

// 只有模型本身支持搜索，且搜索实现方式为params时，才允许用户配置联网搜索功能
const currentModelSupportSearch = (s: ModelCoreState): boolean =>
  s.currentModelConfig?.abilities?.search &&
  s.currentModelConfig?.settings?.searchImpl === 'params'
    ? true
    : false;

const currentModelContextWindowTokens = (
  s: ModelCoreState
): number | undefined => s.currentModelConfig?.contextWindowTokens;

export const modelCoreSelectors = {
  // 复合选择器
  hasModelConfig,
  currentModelCapabilities,

  // 能力检查选择器
  currentModelSupportFiles,
  currentModelSupportVision,
  currentModelSupportToolUse,
  currentModelSupportReasoning,
  currentModelSupportSearch,
  currentModelContextWindowTokens,

  // 初始化状态选择器
  modelsInit: (s: ModelCoreState) => s.modelsInit,

  // 模型选项选择器
  providerModelOptions,
};
