/**
 * Workspace Slice 状态接口
 * 工作区面板相关的状态为空，因为所有工作区状态都存储在系统状态中
 */
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface WorkspaceState {
  // 工作区面板相关的状态都存储在 SystemStatus 中
}

export const workspaceInitialState: WorkspaceState = {};
