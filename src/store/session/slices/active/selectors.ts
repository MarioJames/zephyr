import { SessionStore } from '../../store';

const sessions = (state: SessionStore) => state.sessions;
const activeSessionId = (s: SessionStore) => s.activeSessionId;
const activeTopicId = (s: SessionStore) => s.activeTopicId;
const targetUserId = (s: SessionStore) => s.targetUserId;
const targetUser = (s: SessionStore) => s.targetUser;
const activeSession = (s: SessionStore) =>
  s.sessions.find((session) => session.id === s.activeSessionId);
const activeSessionAgent = (s: SessionStore) =>
  activeSession(s)?.agentsToSessions[0]?.agent;
const activeAgentSystemRole = (s: SessionStore) =>
  activeSessionAgent(s)?.systemRole;
const activeAgentChatConfig = (s: SessionStore) =>
  activeSessionAgent(s)?.chatConfig;
const activeAgentHistoryCount = (s: SessionStore) =>
  activeAgentChatConfig(s)?.historyCount || 10;
const activeAgentEnableHistoryCount = (s: SessionStore) =>
  activeAgentChatConfig(s)?.enableHistoryCount || false;
const activeAgentEnableCompressHistory = (s: SessionStore) =>
  activeAgentChatConfig(s)?.enableCompressHistory || false;

export const sessionActiveSelectors = {
  sessions,
  activeSessionId,
  activeTopicId,
  targetUserId,
  targetUser,
  activeSession,
  activeSessionAgent,
  activeAgentSystemRole,
  activeAgentChatConfig,
  activeAgentHistoryCount,
  activeAgentEnableHistoryCount,
  activeAgentEnableCompressHistory,
};
