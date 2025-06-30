import type { StateCreator } from 'zustand/vanilla';

import type { GlobalStore } from '@/store/global';

/**
 * 全局工作区面板操作接口
 * 定义了工作区面板相关的操作方法
 */
export interface GlobalWorkspacePaneAction {
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
   * 切换会话面板显示状态
   * @param visible 是否显示，不传则切换当前状态
   */
  toggleSessionPanel: (visible?: boolean) => void;
}

/**
 * 创建全局工作区面板操作slice的工厂函数
 * 返回包含所有工作区面板相关操作的对象
 */
export const globalWorkspaceSlice: StateCreator<
  GlobalStore,
  [],
  [],
  GlobalWorkspacePaneAction
> = (set, get) => ({
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
   * 切换会话面板显示状态
   * 处理状态未初始化的情况
   */
  toggleSessionPanel: (newValue) => {
    const showSessionPanel =
      typeof newValue === 'boolean' ? newValue : !get().status.showSessionPanel;

    // 如果状态未初始化，直接更新状态
    if (!get().isStatusInit) {
      set({ status: { ...get().status, showSessionPanel } }, false);
      return;
    }

    // 否则使用updateSystemStatus更新
    get().updateSystemStatus({ showSessionPanel });
  },
});
