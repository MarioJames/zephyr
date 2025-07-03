import { ModelCoreState } from './initialState';

// 复合选择器
const hasModelConfig = (s: ModelCoreState): boolean => !!s.currentModelConfig;

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

const currentModelSupportSearch = (s: ModelCoreState): boolean =>
  s.currentModelConfig?.abilities?.search ?? false;

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
};
