/**
 * 特性开关配置
 * 用于控制新旧接口的使用，支持渐进式重构
 */

/**
 * 特性开关枚举
 */
export enum FeatureFlag {
  // 全局开关
  USE_NEW_API_ADAPTER = 'USE_NEW_API_ADAPTER',

  // 模块级开关
  USER_MODULE_REFACTOR = 'USER_MODULE_REFACTOR',
  SESSION_MODULE_REFACTOR = 'SESSION_MODULE_REFACTOR',
  CHAT_MODULE_REFACTOR = 'CHAT_MODULE_REFACTOR',
  AGENT_MODULE_REFACTOR = 'AGENT_MODULE_REFACTOR',

  // 功能级开关
  USER_AUTH_REFACTOR = 'USER_AUTH_REFACTOR',
  USER_SETTINGS_REFACTOR = 'USER_SETTINGS_REFACTOR',
  SESSION_CRUD_REFACTOR = 'SESSION_CRUD_REFACTOR',
  SESSION_SEARCH_REFACTOR = 'SESSION_SEARCH_REFACTOR',
  MESSAGE_MANAGEMENT_REFACTOR = 'MESSAGE_MANAGEMENT_REFACTOR',
  AI_CHAT_REFACTOR = 'AI_CHAT_REFACTOR',
  TOPIC_MANAGEMENT_REFACTOR = 'TOPIC_MANAGEMENT_REFACTOR',
  AGENT_CONFIG_REFACTOR = 'AGENT_CONFIG_REFACTOR',
}

/**
 * 特性开关配置对象
 */
export const FEATURE_FLAGS: Record<FeatureFlag, boolean> = {
  // 全局开关 - 开发环境默认开启，生产环境默认关闭
  [FeatureFlag.USE_NEW_API_ADAPTER]: process.env.NODE_ENV === 'development',

  // 模块级开关 - 按重构进度逐步开启
  [FeatureFlag.USER_MODULE_REFACTOR]: false,
  [FeatureFlag.SESSION_MODULE_REFACTOR]: false,
  [FeatureFlag.CHAT_MODULE_REFACTOR]: false,
  [FeatureFlag.AGENT_MODULE_REFACTOR]: false,

  // 功能级开关 - 更细粒度的控制
  [FeatureFlag.USER_AUTH_REFACTOR]: false,
  [FeatureFlag.USER_SETTINGS_REFACTOR]: false,
  [FeatureFlag.SESSION_CRUD_REFACTOR]: false,
  [FeatureFlag.SESSION_SEARCH_REFACTOR]: false,
  [FeatureFlag.MESSAGE_MANAGEMENT_REFACTOR]: false,
  [FeatureFlag.AI_CHAT_REFACTOR]: false,
  [FeatureFlag.TOPIC_MANAGEMENT_REFACTOR]: false,
  [FeatureFlag.AGENT_CONFIG_REFACTOR]: false,
};

/**
 * 检查特性开关是否启用
 * @param flag 特性开关标识
 * @returns 是否启用
 */
export function isFeatureEnabled(flag: FeatureFlag): boolean {
  // 优先检查环境变量
  const envValue = process.env[`FEATURE_${flag}`];
  if (envValue !== undefined) {
    return envValue === 'true' || envValue === '1';
  }

  // 检查全局开关
  if (flag !== FeatureFlag.USE_NEW_API_ADAPTER && !FEATURE_FLAGS[FeatureFlag.USE_NEW_API_ADAPTER]) {
    return false;
  }

  // 返回配置值
  return FEATURE_FLAGS[flag];
}

/**
 * 动态设置特性开关
 * @param flag 特性开关标识
 * @param enabled 是否启用
 */
export function setFeatureFlag(flag: FeatureFlag, enabled: boolean): void {
  FEATURE_FLAGS[flag] = enabled;

  // 记录开关变更
  console.info(`[FeatureFlag] ${flag} set to ${enabled}`);
}

/**
 * 获取所有特性开关状态
 * @returns 特性开关状态对象
 */
export function getAllFeatureFlags(): Record<FeatureFlag, boolean> {
  const result: Partial<Record<FeatureFlag, boolean>> = {};

  Object.values(FeatureFlag).forEach(flag => {
    result[flag] = isFeatureEnabled(flag);
  });

  return result as Record<FeatureFlag, boolean>;
}

/**
 * 重置所有特性开关到默认状态
 */
export function resetFeatureFlags(): void {
  Object.keys(FEATURE_FLAGS).forEach(key => {
    const flag = key as FeatureFlag;
    FEATURE_FLAGS[flag] = flag === FeatureFlag.USE_NEW_API_ADAPTER
      ? process.env.NODE_ENV === 'development'
      : false;
  });

  console.info('[FeatureFlag] All flags reset to default values');
}

/**
 * 特性开关装饰器
 * 用于方法级别的特性控制
 */
export function withFeatureFlag(flag: FeatureFlag) {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;

    descriptor.value = function (...args: any[]) {
      if (!isFeatureEnabled(flag)) {
        console.warn(`[FeatureFlag] Method ${propertyKey} is disabled by feature flag ${flag}`);
        return;
      }

      return originalMethod.apply(this, args);
    };

    return descriptor;
  };
}

/**
 * 条件执行工具函数
 * @param flag 特性开关标识
 * @param newImplementation 新实现
 * @param oldImplementation 旧实现
 * @returns 根据特性开关选择的实现结果
 */
export function conditionalImplementation<T>(
  flag: FeatureFlag,
  newImplementation: () => T,
  oldImplementation: () => T
): T {
  if (isFeatureEnabled(flag)) {
    try {
      return newImplementation();
    } catch (error) {
      console.error(`[FeatureFlag] New implementation failed for ${flag}, falling back to old implementation:`, error);
      return oldImplementation();
    }
  }

  return oldImplementation();
}

/**
 * 异步条件执行工具函数
 * @param flag 特性开关标识
 * @param newImplementation 新实现
 * @param oldImplementation 旧实现
 * @returns 根据特性开关选择的实现结果
 */
export async function conditionalImplementationAsync<T>(
  flag: FeatureFlag,
  newImplementation: () => Promise<T>,
  oldImplementation: () => Promise<T>
): Promise<T> {
  if (isFeatureEnabled(flag)) {
    try {
      return await newImplementation();
    } catch (error) {
      console.error(`[FeatureFlag] New implementation failed for ${flag}, falling back to old implementation:`, error);
      return await oldImplementation();
    }
  }

  return await oldImplementation();
}
