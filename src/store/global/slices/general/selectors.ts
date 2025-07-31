import { GeneralState } from './initialState';

export const systemStatus = (s: GeneralState) => s.status;

const showSessionPanel = (s: GeneralState) =>
  !s.status.zenMode && s.status.showSessionPanel;
const themeMode = (s: GeneralState) => s.status.themeMode || 'auto';

const inputHeight = (s: GeneralState) => s.status.inputHeight;

const getAgentSystemRoleExpanded =
  (agentId: string) =>
  (s: GeneralState): boolean => {
    const map = s.status.systemRoleExpandedMap || {};
    return map[agentId] !== false;
  };

const showSlotPanel = (s: GeneralState) =>
  !s.status.zenMode && s.status.showSlotPanel;

export const generalSelectors = {
  getAgentSystemRoleExpanded,
  inputHeight,
  showSessionPanel,
  showSlotPanel,
  systemStatus,
  themeMode,
};