import { AgentState } from './initialState';
import { AgentItem } from '@/services/agents';
import { modelSelectors } from './slices/model/selectors';

// 基础选择器
const agents = (s: AgentState) => s.agents;
const agentsInit = (s: AgentState) => s.agentsInit;
const currentAgentId = (s: AgentState) => s.currentAgentId;
const currentAgent = (s: AgentState) => s.currentAgent;
const isLoading = (s: AgentState) => s.isLoading;
const isAgentConfigLoading = (s: AgentState) => s.isAgentConfigLoading;
const error = (s: AgentState) => s.error;

// 智能体相关选择器
const getAgentById = (id: string) => (s: AgentState): AgentItem | undefined =>
  s.agents.find(agent => agent.id === id);

const currentAgentModel = (s: AgentState): string | undefined =>
  s.currentAgent?.model;

const currentAgentProvider = (s: AgentState): string | undefined =>
  s.currentAgent?.provider;

const openingMessage = (s: AgentState): string | undefined =>
  s.currentAgent?.openingMessage;

const openingQuestions = (s: AgentState): string[] =>
  s.currentAgent?.openingQuestions || [];

const systemRole = (s: AgentState): string | undefined =>
  s.currentAgent?.systemRole;

// 为了兼容组件中的使用，添加以下别名选择器
const currentAgentSystemRole = (s: AgentState): string | undefined =>
  s.currentAgent?.systemRole;

const currentAgentModelProvider = (s: AgentState): string | undefined =>
  s.currentAgent?.provider;

const agentMeta = (s: AgentState) => ({
  id: s.currentAgent?.id,
  title: s.currentAgent?.title,
  description: s.currentAgent?.description,
  avatar: s.currentAgent?.avatar,
  backgroundColor: s.currentAgent?.backgroundColor,
  tags: s.currentAgent?.tags,
});

// 智能体选择器导出
export const agentSelectors = {
  agents,
  agentsInit,
  currentAgentId,
  currentAgent,
  isLoading,
  isAgentConfigLoading,
  error,
  getAgentById,
  currentAgentModel,
  currentAgentProvider,
  openingMessage,
  openingQuestions,
  systemRole,
  // 别名选择器，用于兼容组件中的使用
  currentAgentSystemRole,
  currentAgentModelProvider,
  agentMeta,
};

// 聊天配置相关选择器
const agentConfig = (s: AgentState) => s.agentConfig;

const displayMode = (s: AgentState) => s.agentConfig.displayMode || 'chat';

const enableHistoryCount = (s: AgentState) => 
  s.agentConfig.enableHistoryCount ?? false;

const historyCount = (s: AgentState) => 
  s.agentConfig.historyCount ?? 10;

const enableAutoCreateTopic = (s: AgentState) =>
  s.agentConfig.enableAutoCreateTopic ?? true;

const autoCreateTopicThreshold = (s: AgentState) =>
  s.agentConfig.autoCreateTopicThreshold ?? 4;

const enableCompressHistory = (s: AgentState) =>
  s.agentConfig.enableCompressHistory ?? true;

const enableMaxTokens = (s: AgentState) =>
  s.agentConfig.enableMaxTokens ?? false;

const enableReasoning = (s: AgentState) =>
  s.agentConfig.enableReasoning ?? false;

const temperature = (s: AgentState) =>
  s.agentConfig.temperature ?? 0.7;

const enableHistoryDivider = (historyLength: number, index: number) => (s: AgentState) => {
  const enabled = s.agentConfig.enableHistoryDivider ?? true;
  const threshold = s.agentConfig.historyCount ?? 10;
  
  if (!enabled) return false;
  
  // 在历史记录阈值位置显示分隔符
  return historyLength > threshold && index === historyLength - threshold;
};

// 聊天配置选择器导出
export const agentChatConfigSelectors = {
  agentConfig,
  displayMode,
  enableHistoryCount,
  historyCount,
  enableAutoCreateTopic,
  autoCreateTopicThreshold,
  enableCompressHistory,
  enableMaxTokens,
  enableReasoning,
  temperature,
  enableHistoryDivider,
};

// 模型选择器导出
export const agentModelSelectors = modelSelectors;