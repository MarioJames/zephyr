import { subscribeWithSelector } from 'zustand/middleware';
import { shallow } from 'zustand/shallow';
import { createWithEqualityFn } from 'zustand/traditional';

// 定义全局状态类型
export enum SidebarTabKey {
  Chat = 'chat',
  CustomerManagement = 'CustomerManagement',
  EmployeeManagement = 'EmployeeManagement',
}

interface GlobalState {
  // 当前活动的侧边栏标签
  activeTab: SidebarTabKey;
  
  // 切换回聊天的方法
  switchBackToChat: (sessionId: string) => void;
  
  // 切换侧边栏标签的方法
  switchTab: (tab: SidebarTabKey) => void;
}

const initialState: GlobalState = {
  activeTab: SidebarTabKey.Chat,
  switchBackToChat: (sessionId: string) => {
    console.log('Switching back to chat with session ID:', sessionId);
  },
  switchTab: () => {},
};

const createStore = (set: any): GlobalState => ({
  ...initialState,
  switchTab: (tab: SidebarTabKey) => {
    set({ activeTab: tab });
  },
});

export const useGlobalStore = createWithEqualityFn<GlobalState>()(
  subscribeWithSelector(createStore),
  shallow,
);

export const getGlobalStoreState = () => useGlobalStore.getState();