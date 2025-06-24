import { GlobalState } from '../initialState';

export const systemStatus = (s: GlobalState) => s.status;

const showSystemRole = (s: GlobalState) => s.status.showSystemRole;
const showChatSideBar = (s: GlobalState) => !s.status.zenMode && s.status.showChatSideBar;
const showSessionPanel = (s: GlobalState) => !s.status.zenMode && s.status.showSessionPanel;
const showTopicPanel = (s: GlobalState) => !s.status.zenMode && s.status.showTopicPanel;
const themeMode = (s: GlobalState) => s.status.themeMode || 'auto';

const showChatHeader = (s: GlobalState) => !s.status.zenMode;
const inZenMode = (s: GlobalState) => s.status.zenMode;
const sessionWidth = (s: GlobalState) => s.status.sessionsWidth;
const inputHeight = (s: GlobalState) => s.status.inputHeight;

const isDBInited = (s: GlobalState): boolean => true;

const getAgentSystemRoleExpanded =
  (agentId: string) =>
  (s: GlobalState): boolean => {
    const map = s.status.systemRoleExpandedMap || {};
    return map[agentId] !== false;
  };

const showSlotPanel = (s: GlobalState) => !s.status.zenMode && s.status.showSlotPanel;

export const systemStatusSelectors = {
  getAgentSystemRoleExpanded,
  inZenMode,
  inputHeight,
  isDBInited,
  sessionWidth,
  showChatHeader,
  showChatSideBar,
  showSessionPanel,
  showSlotPanel,
  showSystemRole,
  showTopicPanel,
  systemStatus,
  themeMode,
};
