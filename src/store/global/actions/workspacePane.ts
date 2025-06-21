import { produce } from 'immer';
import type { StateCreator } from 'zustand/vanilla';

import { INBOX_SESSION_ID } from '@/const/session';
import { SESSION_CHAT_URL } from '@/const/session';
import type { GlobalStore } from '@/store/global';
import { setNamespace } from '@/utils/storeDebug';

const n = setNamespace('w');

export interface GlobalWorkspacePaneAction {
  switchBackToChat: (sessionId?: string) => void;
  toggleAgentSystemRoleExpand: (agentId: string, expanded?: boolean) => void;
  toggleChatSideBar: (visible?: boolean) => void;
  toggleExpandSessionGroup: (id: string, expand: boolean) => void;
  toggleSystemRole: (visible?: boolean) => void;
  toggleZenMode: () => void;
  setSlotPanelType: (type: 'aiHint' | 'history') => void;
  toggleSlotPanel: (visible?: boolean) => void;
  toggleTopicPanel: (visible?: boolean) => void;
}

export const globalWorkspaceSlice: StateCreator<
  GlobalStore,
  [['zustand/devtools', never]],
  [],
  GlobalWorkspacePaneAction
> = (set, get) => ({
  switchBackToChat: (sessionId) => {
    get().router?.push(SESSION_CHAT_URL(sessionId || INBOX_SESSION_ID));
  },

  toggleAgentSystemRoleExpand: (agentId, expanded) => {
    const { status } = get();
    const systemRoleExpandedMap = status.systemRoleExpandedMap || {};
    const nextExpanded = typeof expanded === 'boolean' ? expanded : !systemRoleExpandedMap[agentId];

    get().updateSystemStatus(
      {
        systemRoleExpandedMap: {
          ...systemRoleExpandedMap,
          [agentId]: nextExpanded,
        },
      },
      n('toggleAgentSystemRoleExpand', { agentId, expanded: nextExpanded }),
    );
  },
  toggleChatSideBar: (newValue) => {
    const showChatSideBar =
      typeof newValue === 'boolean' ? newValue : !get().status.showChatSideBar;

    if (!get().isStatusInit) {
      set({ status: { ...get().status, showChatSideBar } }, false, n('toggleAgentPanel', newValue));
      return;
    }

    get().updateSystemStatus({ showChatSideBar }, n('toggleAgentPanel', newValue));
  },
  toggleExpandSessionGroup: (id, expand) => {
    const { status } = get();
    const nextExpandSessionGroup = produce(status.expandSessionGroupKeys, (draft: string[]) => {
      if (expand) {
        if (draft.includes(id)) return;
        draft.push(id);
      } else {
        const index = draft.indexOf(id);
        if (index !== -1) draft.splice(index, 1);
      }
    });
    get().updateSystemStatus({ expandSessionGroupKeys: nextExpandSessionGroup });
  },
  toggleSystemRole: (newValue) => {
    const showSystemRole = newValue;

    get().updateSystemStatus({ showSystemRole }, n('toggleMobileTopic', newValue));
  },
  toggleZenMode: () => {
    const { status } = get();
    const nextZenMode = !status.zenMode;

    get().updateSystemStatus({ zenMode: nextZenMode }, n('toggleZenMode'));
  },
  setSlotPanelType: (type) => {
    get().updateSystemStatus({ slotPanelType: type }, n('setSlotPanelType', type));
  },
  toggleSlotPanel: (newValue) => {
    const showSlotPanel =
      typeof newValue === 'boolean' ? newValue : !get().status.showSlotPanel;

    if (!get().isStatusInit) {
      set({ status: { ...get().status, showSlotPanel } }, false, n('toggleSlotPanel', newValue));
      return;
    }

    get().updateSystemStatus({ showSlotPanel }, n('toggleSlotPanel', newValue));
  },
  toggleTopicPanel: (newValue) => {
    const showTopicPanel =
      typeof newValue === 'boolean' ? newValue : !get().status.showTopicPanel;

    if (!get().isStatusInit) {
      set({ status: { ...get().status, showTopicPanel } }, false, n('toggleTopicPanel', newValue));
      return;
    }

    get().updateSystemStatus({ showTopicPanel }, n('toggleTopicPanel', newValue));
  },
});
