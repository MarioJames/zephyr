// ========== 权限管理状态接口 ==========
export interface PermissionsState {
  // 权限缓存：roleId -> permissions[]
  permissionsCache: Record<string, string[]>;
  // 权限加载状态：roleId -> loading
  permissionsLoading: Record<string, boolean>;
  // 权限加载错误：roleId -> error
  permissionsError: Record<string, string | null>;
}

// ========== 权限管理初始状态 ==========
export const permissionsInitialState: PermissionsState = {
  permissionsCache: {},
  permissionsLoading: {},
  permissionsError: {},
};
