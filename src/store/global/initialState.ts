import { DatabaseLoadingState, MigrationSQL, MigrationTableItem } from '@/types/database';
import { AsyncLocalStorage } from '@/utils/storage';
import { LocaleMode, ThemeMode } from '@/types/locale';
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';

/**
 * 侧边栏标签页枚举
 * 定义侧边栏中可用的标签页类型
 */
export enum SidebarTabKey {
  Chat = 'chat',
  CustomerManagement = 'customer-management',
  EmployeeManagement = 'employee-management',
}

/**
 * 聊天设置标签页枚举
 * 定义聊天设置面板中的标签页类型
 */
export enum ChatSettingsTabs {
  Chat = 'chat',
  Meta = 'meta',
  Modal = 'modal',
  Opening = 'opening',
  Plugin = 'plugin',
  Prompt = 'prompt',
  TTS = 'tts',
}

/**
 * 设置标签页枚举
 * 定义主设置面板中的标签页类型
 */
export enum SettingsTabs {
  About = 'about',
  Agent = 'agent',
  Common = 'common',
  Hotkey = 'hotkey',
  LLM = 'llm',
  Provider = 'provider',
  Storage = 'storage',
  Sync = 'sync',
  SystemAgent = 'system-agent',
  TTS = 'tts',
}

/**
 * 个人资料标签页枚举
 * 定义个人资料面板中的标签页类型
 */
export enum ProfileTabs {
  Profile = 'profile',
  Security = 'security',
  Stats = 'stats',
}

/**
 * 系统状态接口
 * 定义了应用的整体系统状态，包括UI布局、功能开关等
 */
export interface SystemStatus {
  /**
   * 文件面板宽度
   * 文件管理面板的宽度（像素）
   */
  filePanelWidth: number;
  
  /**
   * 是否隐藏PWA安装器
   * 控制是否显示渐进式Web应用安装提示
   */
  hidePWAInstaller?: boolean;
  
  /**
   * 是否隐藏线程限制警告
   * 控制是否显示线程数量限制的警告信息
   */
  hideThreadLimitAlert?: boolean;
  
  /**
   * 输入框高度
   * 聊天输入框的高度（像素）
   */
  inputHeight: number;
  
  /**
   * 是否启用PGLite
   * 应用初始化时不启用PGLite，只有当用户手动开启时才启用
   */
  isEnablePglite?: boolean;
  
  /**
   * 是否显示积分信息
   * 控制是否显示用户积分相关信息
   */
  isShowCredit?: boolean;
  
  /**
   * 语言设置
   * 应用的当前语言模式
   */
  language?: LocaleMode;
  
  /**
   * 最新更新日志ID
   * 记录用户已查看的最新更新日志ID
   */
  latestChangelogId?: string;
  
  /**
   * 门户面板宽度
   * 门户面板的宽度（像素）
   */
  portalWidth: number;
  
  /**
   * 会话面板宽度
   * 会话列表面板的宽度（像素）
   */
  sessionsWidth: number;
  
  /**
   * 是否显示聊天侧边栏
   * 控制聊天侧边栏的显示状态
   */
  showChatSideBar?: boolean;
  
  /**
   * 是否显示文件面板
   * 控制文件管理面板的显示状态
   */
  showFilePanel?: boolean;
  
  /**
   * 是否显示快捷键帮助
   * 控制快捷键帮助信息的显示状态
   */
  showHotkeyHelper?: boolean;
  
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
   * 是否显示系统角色
   * 控制系统角色信息的显示状态
   */
  showSystemRole?: boolean;
  
  /**
   * 话题面板显示状态
   * 控制话题面板的显示状态
   */
  showTopicPanel?: boolean;
  
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
   * 线程输入框高度
   * 线程输入框的高度（像素）
   */
  threadInputHeight: number;
  
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
 * 全局状态接口
 * 定义了应用的整体全局状态
 */
export interface GlobalState {
  /**
   * 是否有新版本
   * 标识是否有可用的新版本更新
   */
  hasNewVersion?: boolean;
  
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
   * 最新版本号
   * 记录最新的应用版本号
   */
  latestVersion?: string;
  
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
  filePanelWidth: 320,
  hidePWAInstaller: false,
  hideThreadLimitAlert: false,
  inputHeight: 200,
  portalWidth: 400,
  sessionsWidth: 320,
  showChatSideBar: true,
  showFilePanel: true,
  showHotkeyHelper: false,
  showSessionPanel: true,
  showSlotPanel: true,
  showSystemRole: false,
  showTopicPanel: true,
  systemRoleExpandedMap: {},
  themeMode: 'auto',
  threadInputHeight: 200,
  zenMode: false,
  slotPanelType: 'aiHint',
} satisfies SystemStatus;

export const initialState: GlobalState = {
  initClientDBStage: DatabaseLoadingState.Idle,
  isStatusInit: false,
  sidebarKey: SidebarTabKey.Chat,
  status: INITIAL_STATUS,
  statusStorage: new AsyncLocalStorage('LOBE_SYSTEM_STATUS'),
};
