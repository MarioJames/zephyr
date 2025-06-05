import type { LobeAgentSettings } from '@/types/session';

import { UserGeneralConfig } from './general';
import { UserKeyVaults } from './keyVaults';
import { UserSyncSettings } from './sync';
import { UserSystemAgentConfig } from './systemAgent';
import { UserModelProviderConfig } from './modelProvider';
import { UserToolConfig } from './tool';

export type UserDefaultAgent = LobeAgentSettings;

export * from './general';
export * from './keyVaults';
export * from './modelProvider';
export * from './sync';
export * from './systemAgent';

/**
 * 配置设置
 */
export interface UserSettings {
  defaultAgent: UserDefaultAgent;
  general: UserGeneralConfig;
  keyVaults: UserKeyVaults;
  sync?: UserSyncSettings;
  languageModel: UserModelProviderConfig;
  systemAgent: UserSystemAgentConfig;
  tool: UserToolConfig;
}
