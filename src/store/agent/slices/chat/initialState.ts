import { DeepPartial } from 'utility-types';

import { DEFAULT_AGENT_CONFIG } from '@/const/settings';
import { LobeAgentConfig } from '@/types/agent';

/**
 * 代理状态接口
 * 定义了代理相关的所有状态字段
 */
export interface AgentState {
  /**
   * 当前活动的代理ID
   * 表示当前选中的代理
   */
  activeAgentId?: string;
  
  /**
   * 当前活动的会话ID
   * 表示当前正在使用的会话
   */
  activeId: string;
  
  /**
   * 代理配置初始化状态映射
   * 记录每个代理的配置是否已经初始化
   * 格式：{ agentId: boolean }
   */
  agentConfigInitMap: Record<string, boolean>;
  
  /**
   * 代理配置映射表
   * 以代理ID为键，存储每个代理的配置信息
   * 使用DeepPartial类型，允许部分更新配置
   * 格式：{ agentId: DeepPartial<LobeAgentConfig> }
   */
  agentMap: Record<string, DeepPartial<LobeAgentConfig>>;
  
  /**
   * 默认代理配置
   * 作为新代理的默认配置模板
   */
  defaultAgentConfig: LobeAgentConfig;
  
  /**
   * 收件箱代理配置是否已初始化
   * 标识收件箱的代理配置是否已经完成初始化
   */
  isInboxAgentConfigInit: boolean;
  
  /**
   * 是否显示代理设置面板
   * 控制代理设置界面的显示状态
   */
  showAgentSetting: boolean;
  
  /**
   * 更新代理聊天配置的信号控制器
   * 用于取消正在进行的代理聊天配置更新操作
   */
  updateAgentChatConfigSignal?: AbortController;
  
  /**
   * 更新代理配置的信号控制器
   * 用于取消正在进行的代理配置更新操作
   */
  updateAgentConfigSignal?: AbortController;
}

/**
 * 代理聊天状态的初始值
 * 设置所有代理相关字段的默认值
 */
export const initialAgentChatState: AgentState = {
  activeId: 'inbox', // 默认活动会话为收件箱
  agentConfigInitMap: {}, // 默认代理配置初始化映射为空
  agentMap: {}, // 默认代理配置映射表为空
  defaultAgentConfig: DEFAULT_AGENT_CONFIG, // 使用默认代理配置
  isInboxAgentConfigInit: false, // 默认收件箱代理配置未初始化
  showAgentSetting: false, // 默认不显示代理设置面板
};
