import { subscribeWithSelector } from "zustand/middleware";
import { shallow } from "zustand/shallow";
import { createWithEqualityFn } from "zustand/traditional";
import { StateCreator } from "zustand/vanilla";

import { createDevtools } from "../middleware/createDevtools";
import {
  type GlobalGeneralAction,
  generalActionSlice,
} from "./actions/general";
import {
  type GlobalWorkspacePaneAction,
  globalWorkspaceSlice,
} from "./actions/workspacePane";
import { type GlobalState, initialState } from "./initialState";

//  ===============  聚合 createStoreFn ============ //

/**
 * 全局Store的完整类型定义
 * 通过交叉类型(&)将所有状态和操作组合在一起
 * 包含以下模块：
 * - GlobalState: 全局状态数据
 * - GlobalWorkspacePaneAction: 工作区面板相关操作
 * - GlobalGeneralAction: 通用操作
 */
export interface GlobalStore
  extends GlobalState,
    GlobalWorkspacePaneAction,
    GlobalGeneralAction {}

/**
 * 创建全局Store的工厂函数
 * 将所有slice的状态和操作合并成一个完整的store
 * @param parameters - Zustand的创建参数
 * @returns 完整的全局store对象
 */
const createStore: StateCreator<GlobalStore, [["zustand/devtools", never]]> = (
  ...parameters
) => ({
  ...initialState,
  ...globalWorkspaceSlice(...parameters),
  ...generalActionSlice(...parameters),
});

//  ===============  实装 useStore ============ //

// 创建开发工具中间件实例，用于调试全局store
const devtools = createDevtools("global");

/**
 * 全局Store的React Hook
 * 使用createWithEqualityFn创建，支持自定义比较函数
 * 使用subscribeWithSelector中间件优化性能
 * 使用shallow比较函数进行浅比较，避免不必要的重渲染
 * 集成开发工具用于调试
 */
export const useGlobalStore = createWithEqualityFn<GlobalStore>()(
  subscribeWithSelector(devtools(createStore)),
  shallow
);
