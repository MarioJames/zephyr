import { isServerMode, isUsePgliteDB } from '@/const/version';
import { DatabaseLoadingState } from '@/types/database';

import { GlobalState, INITIAL_STATUS } from '../initialState';

export const systemStatus = (s: GlobalState) => s.status;

const showSystemRole = (s: GlobalState) => s.status.showSystemRole;
const showChatSideBar = (s: GlobalState) => !s.status.zenMode && s.status.showChatSideBar;
const showSessionPanel = (s: GlobalState) => !s.status.zenMode && s.status.showSessionPanel;
const showFilePanel = (s: GlobalState) => s.status.showFilePanel;
const showTopicPanel = (s: GlobalState) => !s.status.zenMode && s.status.showTopicPanel;
const hidePWAInstaller = (s: GlobalState) => s.status.hidePWAInstaller;
const isShowCredit = (s: GlobalState) => s.status.isShowCredit;
const themeMode = (s: GlobalState) => s.status.themeMode || 'auto';
const language = (s: GlobalState) => s.status.language || 'auto';

const showChatHeader = (s: GlobalState) => !s.status.zenMode;
const inZenMode = (s: GlobalState) => s.status.zenMode;
const sessionWidth = (s: GlobalState) => s.status.sessionsWidth;
const portalWidth = (s: GlobalState) => s.status.portalWidth || 400;
const filePanelWidth = (s: GlobalState) => s.status.filePanelWidth;
const inputHeight = (s: GlobalState) => s.status.inputHeight;
const threadInputHeight = (s: GlobalState) => s.status.threadInputHeight;

const isPgliteNotEnabled = (s: GlobalState) =>
  isUsePgliteDB && !isServerMode && s.isStatusInit && !s.status.isEnablePglite;

const isPgliteNotInited = (s: GlobalState) =>
  isUsePgliteDB &&
  s.isStatusInit &&
  s.status.isEnablePglite &&
  s.initClientDBStage !== DatabaseLoadingState.Ready;

const isPgliteInited = (s: GlobalState): boolean =>
  (s.isStatusInit &&
    s.status.isEnablePglite &&
    s.initClientDBStage === DatabaseLoadingState.Ready) ||
  false;

const isDBInited = (s: GlobalState): boolean => (isUsePgliteDB ? isPgliteInited(s) : true);

const getAgentSystemRoleExpanded =
  (agentId: string) =>
  (s: GlobalState): boolean => {
    const map = s.status.systemRoleExpandedMap || {};
    return map[agentId] !== false;
  };

const showSlotPanel = (s: GlobalState) => !s.status.zenMode && s.status.showSlotPanel;

export const systemStatusSelectors = {
  filePanelWidth,
  getAgentSystemRoleExpanded,
  hidePWAInstaller,
  inZenMode,
  inputHeight,
  isDBInited,
  isPgliteInited,
  isPgliteNotEnabled,
  isPgliteNotInited,
  isShowCredit,
  language,
  portalWidth,
  sessionWidth,
  showChatHeader,
  showChatSideBar,
  showFilePanel,
  showSessionPanel,
  showSlotPanel,
  showSystemRole,
  showTopicPanel,
  systemStatus,
  themeMode,
  threadInputHeight,
};
