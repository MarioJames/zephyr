import { LobeAgentConfig } from '@/types/agent';

import { MetaData } from '../meta';

/**
 * 会话类型枚举
 * 定义不同的会话类型
 */
export enum LobeSessionType {
  Agent = 'agent',
  Group = 'group',
}

/**
 * Lobe代理会话接口
 * 定义代理会话的完整数据结构
 */
export interface LobeAgentSession {
  config: LobeAgentConfig;
  createdAt: Date;
  id: string;
  meta: MetaData;
  model: string;
  pinned?: boolean;
  tags?: string[];
  type: LobeSessionType.Agent;
  updatedAt: Date;
}

/**
 * Lobe代理设置接口
 * 定义代理的基本设置
 */
export interface LobeAgentSettings {
  /**
   * 语言模型角色设定
   */
  config: LobeAgentConfig;
  meta: MetaData;
}

/**
 * 会话列表类型
 * 定义为代理会话数组
 */
export type LobeSessions = LobeAgentSession[];
