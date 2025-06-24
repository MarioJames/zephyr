import type { StateCreator } from 'zustand/vanilla';

import { INBOX_SESSION_ID } from '@/const/session';
import { SESSION_CHAT_URL } from '@/const/session';
import type { GlobalStore } from '@/store/global';

/**
 * 全局工作区面板操作接口
 * 定义了工作区面板相关的操作方法
 */
export interface GlobalWorkspacePaneAction {
  /**
   * 切换回聊天界面
   * @param sessionId 目标会话ID，默认为收件箱
   */
  switchBackToChat: (sessionId?: string) => void;
  
  /**
   * 切换代理系统角色展开状态
   * @param agentId 代理ID
   * @param expanded 是否展开，不传则切换当前状态
   */
  toggleAgentSystemRoleExpand: (agentId: string, expanded?: boolean) => void;
  
  /**
   * 切换聊天侧边栏显示状态
   * @param visible 是否显示，不传则切换当前状态
   */
  toggleChatSideBar: (visible?: boolean) => void;
  
  /**
   * 切换系统角色显示状态
   * @param visible 是否显示
   */
  toggleSystemRole: (visible?: boolean) => void;
  
  /**
   * 切换禅模式
   * 在禅模式和普通模式之间切换
   */
  toggleZenMode: () => void;
  
  /**
   * 设置插槽面板类型
   * @param type 面板类型：'aiHint' | 'history'
   */
  setSlotPanelType: (type: 'aiHint' | 'history') => void;
  
  /**
   * 切换插槽面板显示状态
   * @param visible 是否显示，不传则切换当前状态
   */
  toggleSlotPanel: (visible?: boolean) => void;
  
  /**
   * 切换话题面板显示状态
   * @param visible 是否显示，不传则切换当前状态
   */
  toggleTopicPanel: (visible?: boolean) => void;
}

/**
 * 创建全局工作区面板操作slice的工厂函数
 * 返回包含所有工作区面板相关操作的对象
 */
export const globalWorkspaceSlice: StateCreator<
  GlobalStore,
  [['zustand/devtools', never]],
  [],
  GlobalWorkspacePaneAction
> = (set, get) => ({
  /**
   * 切换回聊天界面
   * 使用路由导航到指定的会话聊天页面
   */
  switchBackToChat: (sessionId) => {
    get().router?.push(SESSION_CHAT_URL(sessionId || INBOX_SESSION_ID));
  },

  /**
   * 切换代理系统角色展开状态
   * 更新系统角色展开状态映射
   */
  toggleAgentSystemRoleExpand: (agentId, expanded) => {
    const { status } = get();
    const systemRoleExpandedMap = status.systemRoleExpandedMap || {};
    // 如果未指定展开状态，则切换当前状态
    const nextExpanded = typeof expanded === 'boolean' ? expanded : !systemRoleExpandedMap[agentId];

    get().updateSystemStatus(
      {
        systemRoleExpandedMap: {
          ...systemRoleExpandedMap,
          [agentId]: nextExpanded,
        },
      }
    );
  },
  
  /**
   * 切换聊天侧边栏显示状态
   * 处理状态未初始化的情况
   */
  toggleChatSideBar: (newValue) => {
    const showChatSideBar =
      typeof newValue === 'boolean' ? newValue : !get().status.showChatSideBar;

    // 如果状态未初始化，直接更新状态
    if (!get().isStatusInit) {
      set({ status: { ...get().status, showChatSideBar } }, false);
      return;
    }

    // 否则使用updateSystemStatus更新
    get().updateSystemStatus({ showChatSideBar });
  },
  
  /**
   * 切换系统角色显示状态
   */
  toggleSystemRole: (newValue) => {
    const showSystemRole = newValue;

    get().updateSystemStatus({ showSystemRole });
  },
  
  /**
   * 切换禅模式
   * 在禅模式和普通模式之间切换
   */
  toggleZenMode: () => {
    const { status } = get();
    const nextZenMode = !status.zenMode;

    get().updateSystemStatus({ zenMode: nextZenMode });
  },
  
  /**
   * 设置插槽面板类型
   */
  setSlotPanelType: (type) => {
    get().updateSystemStatus({ slotPanelType: type });
  },
  
  /**
   * 切换插槽面板显示状态
   * 处理状态未初始化的情况
   */
  toggleSlotPanel: (newValue) => {
    const showSlotPanel =
      typeof newValue === 'boolean' ? newValue : !get().status.showSlotPanel;

    // 如果状态未初始化，直接更新状态
    if (!get().isStatusInit) {
      set({ status: { ...get().status, showSlotPanel } }, false);
      return;
    }

    // 否则使用updateSystemStatus更新
    get().updateSystemStatus({ showSlotPanel });
  },
  
  /**
   * 切换话题面板显示状态
   * 处理状态未初始化的情况
   */
  toggleTopicPanel: (newValue) => {
    const showTopicPanel =
      typeof newValue === 'boolean' ? newValue : !get().status.showTopicPanel;

    // 如果状态未初始化，直接更新状态
    if (!get().isStatusInit) {
      set({ status: { ...get().status, showTopicPanel } }, false);
      return;
    }

    // 否则使用updateSystemStatus更新
    get().updateSystemStatus({ showTopicPanel });
  },
});
