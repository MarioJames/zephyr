import type { ThemeMode } from 'antd-style';
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';

import {
  DatabaseLoadingState,
  MigrationSQL,
  MigrationTableItem,
} from '@/types/clientDB';
import { AsyncLocalStorage } from '@/utils/localStorage';

/**
 * 侧边栏标签页枚举
 * 定义侧边栏中可用的标签页类型
 */
export enum SidebarTabKey {
  Chat = 'chat',
  File = 'file',
  CustomerManagement = 'customer-management',
  EmployeeManagement = 'employee-management',
}

/**
 * 系统状态接口
 * 定义了应用的整体系统状态，包括UI布局、功能开关等
 */
export interface SystemStatus {
  /**
   * 输入框高度
   * 聊天输入框的高度（像素）
   */
  inputHeight: number;

  /**
   * 是否显示会话面板
   * 控制会话列表面板的显示状态
   */
  showSessionPanel?: boolean;

  /**
   * 是否显示插槽面板
   * 控制插槽面板的显示状态
   */
  showSlotPanel?: boolean;

  /**
   * 系统角色展开状态映射
   * 记录每个系统角色的展开/折叠状态
   */
  systemRoleExpandedMap: Record<string, boolean>;

  /**
   * 主题模式
   * 应用的主题模式（亮色/暗色/自动）
   */
  themeMode?: ThemeMode;

  /**
   * 禅模式
   * 是否启用禅模式（简化界面）
   */
  zenMode?: boolean;

  /**
   * 插槽面板当前展示类型
   * 控制插槽面板显示的内容类型
   */
  slotPanelType?: 'aiHint' | 'history';
}

/**
 * General Slice 状态接口
 */
export interface GeneralState {
  /**
   * 客户端数据库初始化错误
   * 存储客户端数据库初始化过程中的错误信息
   */
  initClientDBError?: Error;

  /**
   * 客户端数据库迁移信息
   * 存储数据库迁移的SQL语句和表记录信息
   */
  initClientDBMigrations?: {
    sqls: MigrationSQL[];
    tableRecords: MigrationTableItem[];
  };

  /**
   * 客户端数据库初始化进度
   * 记录数据库初始化的进度信息
   */
  initClientDBProcess?: {
    costTime?: number;
    phase: 'wasm' | 'dependencies';
    progress: number;
  };

  /**
   * 客户端数据库初始化状态
   * 启动时为Idle，完成为Ready，报错为Error
   */
  initClientDBStage: DatabaseLoadingState;

  /**
   * 状态是否已初始化
   * 标识系统状态是否已经完成初始化
   */
  isStatusInit?: boolean;

  /**
   * 路由实例
   * Next.js应用的路由实例
   */
  router?: AppRouterInstance;

  /**
   * 侧边栏当前标签页
   * 当前选中的侧边栏标签页
   */
  sidebarKey: SidebarTabKey;

  /**
   * 系统状态
   * 应用的整体系统状态
   */
  status: SystemStatus;

  /**
   * 状态存储
   * 用于持久化存储系统状态的异步本地存储实例
   */
  statusStorage: AsyncLocalStorage<SystemStatus>;
}

/**
 * 初始系统状态
 * 定义系统状态的默认值
 */
export const INITIAL_STATUS = {
  inputHeight: 160,
  showSessionPanel: true,
  showSlotPanel: true,
  systemRoleExpandedMap: {},
  themeMode: 'auto',
  zenMode: false,
  slotPanelType: 'aiHint',
} satisfies SystemStatus;

export const generalInitialState: GeneralState = {
  initClientDBStage: DatabaseLoadingState.Idle,
  isStatusInit: false,
  sidebarKey: SidebarTabKey.Chat,
  status: INITIAL_STATUS,
  statusStorage: new AsyncLocalStorage('LOBE_SYSTEM_STATUS'),
};