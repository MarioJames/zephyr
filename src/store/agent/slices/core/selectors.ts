import { AgentItem } from '@/services';
import { AgentStore } from '@/store/agent';

const agents = (s: AgentStore) => s.agents;
const agentsInit = (s: AgentStore) => s.agentsInit;
const currentAgent = (s: AgentStore) => s.currentAgent;
const currentAgentModelProvider = (s: AgentStore) => s.currentAgent?.provider;
const isLoading = (s: AgentStore) => s.isLoading;
const error = (s: AgentStore) => s.error;

const getAgentById =
  (id: string) =>
  (s: AgentStore): AgentItem | undefined =>
    s.agents.find((agent) => agent.id === id);

const currentAgentSystemRole = (s: AgentStore): string | undefined =>
  s.currentAgent?.systemRole;

const agentMeta = (s: AgentStore) => ({
  id: s.currentAgent?.id,
  title: s.currentAgent?.title,
  description: s.currentAgent?.description,
  avatar: s.currentAgent?.avatar,
  backgroundColor: s.currentAgent?.backgroundColor,
  tags: s.currentAgent?.tags,
});

export const agentCoreSelectors = {
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
