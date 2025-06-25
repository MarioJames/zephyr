export interface NavigationState {
  // 当前活跃会话ID
  currentSessionId?: string;
  // 上一个会话ID（用于返回）
  previousSessionId?: string;
  // 导航历史记录
  navigationHistory: string[];
  // 是否正在切换会话
  isSwitching: boolean;
  // 最大历史记录数量
  maxHistorySize: number;
}

export const navigationInitialState: NavigationState = {
  currentSessionId: undefined,
  previousSessionId: undefined,
  navigationHistory: [],
  isSwitching: false,
  maxHistorySize: 10,
};
