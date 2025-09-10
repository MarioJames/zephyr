import { CustomerState } from '../../initialState';

// ========== 核心功能选择器 ==========
export const coreSelectors = {
  // 获取所有客户
  customers: (state: CustomerState) => state.customers,

  // 获取加载状态
  loading: (state: CustomerState) => state.loading,

  // 获取错误信息
  error: (state: CustomerState) => state.error,

  // 获取客户总数
  total: (state: CustomerState) => state.total,

  // 根据sessionId获取客户
  getCustomerBySessionId: (state: CustomerState) => (sessionId: string) =>
    state.customers.find((customer) => customer.session.id === sessionId),

  // 根据agentId获取客户列表
  getCustomersByAgentId: (state: CustomerState) => (agentId: string) =>
    state.customers.filter(
      (customer) => customer.session.agent?.id === agentId
    ),

  // 获取客户总数
  customerCount: (state: CustomerState) => state.customers.length,

  // 检查是否有错误
  hasError: (state: CustomerState) => Boolean(state.error),

  // 检查是否正在加载
  isLoading: (state: CustomerState) => state.loading,

  // 检查是否有客户数据
  hasCustomers: (state: CustomerState) => state.customers.length > 0,

  // 获取用户自定义的对话配置
  currentCustomerChatConfig: (state: CustomerState) =>
    state.currentCustomerExtend?.chatConfig,

  // 获取用户自定义的对话配置中的搜索模式
  currentCustomerChatConfigSearchMode: (state: CustomerState) =>
    state.currentCustomerExtend?.chatConfig?.searchMode,

  // 获取用户自定义的对话配置中的历史消息数量
  currentCustomerChatConfigHistoryCount: (state: CustomerState) =>
    state.currentCustomerExtend?.chatConfig?.historyCount ?? 10,

  // 是否开启模型内置搜索引擎
  isModelBuiltinSearch: (state: CustomerState) =>
    state.currentCustomerExtend?.chatConfig?.useModelBuiltinSearch,
};
