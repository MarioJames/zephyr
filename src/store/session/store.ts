import { subscribeWithSelector } from 'zustand/middleware';
import { shallow } from 'zustand/shallow';
import { createWithEqualityFn } from 'zustand/traditional';
import { StateCreator } from 'zustand/vanilla';

import { SessionState, initialState } from './initialState';
import { createDevtools } from '@/utils/store';
import { sessionCoreAction, SessionCoreAction } from './slices/core/action';
import {
  sessionActiveAction,
  SessionActiveAction,
} from './slices/active/action';
import { SessionCoreState } from './slices/core/initialState';
import { SessionActiveState } from './slices/active/initialState';

// 组合所有状态接口
export interface SessionStore
  extends SessionState,
    SessionCoreState,
    SessionActiveState,
    SessionCoreAction,
    SessionActiveAction {}

// 创建 store 工厂函数
const createStore: StateCreator<SessionStore, [['zustand/devtools', never]]> = (
  ...parameters
) => ({
  ...initialState,
  ...sessionCoreAction(...parameters),
  ...sessionActiveAction(...parameters),
});

//  ===============  实装 useStore ============ //

const devtools = createDevtools('session');

// 导出 useSessionStore hook
export const useSessionStore = createWithEqualityFn<SessionStore>()(
  subscribeWithSelector(devtools(createStore)),
  shallow
);
