/**
 * Agent 聊天配置类型
 */
export interface AgentChatConfig {
  /** 自动创建话题的消息阈值 */
  autoCreateTopicThreshold?: number;
  /** 是否启用自动创建话题 */
  enableAutoCreateTopic?: boolean;
  /** 是否启用历史消息压缩 */
  enableCompressHistory?: boolean;
  /** 是否启用历史消息数量限制 */
  enableHistoryCount?: boolean;
  /** 是否启用最大令牌数限制 */
  enableMaxTokens?: boolean;
  /** 是否启用推理功能 */
  enableReasoning?: boolean;
  /** 历史消息保留数量 */
  historyCount?: number;
  /** 是否启用历史消息分隔符 */
  enableHistoryDivider?: boolean;
}

/**
 * Agent 搜索功能配置
 */
export interface AgentSearchConfig {
  /** 搜索模式 */
  searchMode?: string;
  /** 是否使用模型内置搜索引擎 */
  useModelBuiltinSearch?: boolean;
}

/**
 * 完整的 Agent 配置类型
 */
export interface AgentConfig extends AgentChatConfig, AgentSearchConfig {}
