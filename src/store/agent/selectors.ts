import { AgentState } from './initialState';
import { AgentItem } from '@/services/agents';

// 基础选择器
const agents = (s: AgentState) => s.agents;
const agentsInit = (s: AgentState) => s.agentsInit;
const currentAgent = (s: AgentState) => s.currentAgent;
const currentAgentModelProvider = (s: AgentState) => s.currentAgent?.provider;
const isLoading = (s: AgentState) => s.isLoading;
const error = (s: AgentState) => s.error;

// 智能体相关选择器
const getAgentById =
  (id: string) =>
  (s: AgentState): AgentItem | undefined =>
    s.agents.find((agent) => agent.id === id);

const currentAgentSystemRole = (s: AgentState): string | undefined =>
  s.currentAgent?.systemRole;

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
  currentAgent,
  currentAgentModelProvider,
  isLoading,
  error,
  getAgentById,
  currentAgentSystemRole,
  agentMeta,
};

// 聊天配置相关选择器
const agentChatConfig = (s: AgentState) => s.agentChatConfig;
const useModelBuiltinSearch = (s: AgentState) =>
  s.agentChatConfig?.useModelBuiltinSearch;

// 聊天配置选择器导出
export const agentChatConfigSelectors = {
  agentChatConfig,
  useModelBuiltinSearch,
};
