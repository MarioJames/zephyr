import { AgentState } from '../../initialState';

// 基础选择器
const currentModelDetails = (s: AgentState) => s.currentModelDetails;
const isLoadingModelDetails = (s: AgentState) => s.isLoadingModelDetails;
const modelDetailsCache = (s: AgentState) => s.modelDetailsCache;
const modelError = (s: AgentState) => s.modelError;

// 复合选择器
const hasModelDetails = (s: AgentState): boolean => !!s.currentModelDetails;

// 模型能力选择器
const currentModelCapabilities = (s: AgentState) => {
  const details = s.currentModelDetails;
  if (!details) return null;
  
  return {
    supportFiles: details.supportFiles,
    supportVision: details.supportVision,
    supportToolUse: details.supportToolUse,
    supportReasoning: details.supportReasoning,
    contextWindowTokens: details.contextWindowTokens,
    hasContextWindowToken: details.hasContextWindowToken,
  };
};

// 检查特定能力的选择器
const currentModelSupportFiles = (s: AgentState): boolean => 
  s.currentModelDetails?.supportFiles ?? false;

const currentModelSupportVision = (s: AgentState): boolean => 
  s.currentModelDetails?.supportVision ?? false;

const currentModelSupportToolUse = (s: AgentState): boolean => 
  s.currentModelDetails?.supportToolUse ?? false;

const currentModelSupportReasoning = (s: AgentState): boolean => 
  s.currentModelDetails?.supportReasoning ?? false;

const currentModelContextWindowTokens = (s: AgentState): number | undefined => 
  s.currentModelDetails?.contextWindowTokens;

// 缓存相关选择器
const getModelDetailsFromCache = (model: string, provider: string) => (s: AgentState) => {
  const cacheKey = `${provider}:${model}`;
  return s.modelDetailsCache[cacheKey];
};

export const modelSelectors = {
  // 基础选择器
  currentModelDetails,
  isLoadingModelDetails,
  modelDetailsCache,
  modelError,
  
  // 复合选择器
  hasModelDetails,
  currentModelCapabilities,
  
  // 能力检查选择器
  currentModelSupportFiles,
  currentModelSupportVision,
  currentModelSupportToolUse,
  currentModelSupportReasoning,
  currentModelContextWindowTokens,
  
  // 缓存选择器
  getModelDetailsFromCache,
};