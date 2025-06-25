import { SessionItem } from '@/services/sessions';

export interface SessionState {
  // 会话列表缓存
  sessions: SessionItem[];
  // 当前活跃会话ID
  currentSessionId?: string;
  // 当前会话详情
  currentSession?: SessionItem;
  // 加载状态
  isLoading: boolean;
  // 错误信息
  error?: string;
  // 最后更新时间
  lastUpdated?: number;
  // 是否已初始化
  initialized: boolean;
}

export const initialState: SessionState = {
  sessions: [],
  currentSessionId: undefined,
  currentSession: undefined,
  isLoading: false,
  error: undefined,
  lastUpdated: undefined,
  initialized: false,
};
