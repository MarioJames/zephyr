/**
 * AI聊天状态接口
 * 定义了AI聊天相关的所有状态字段
 */
export interface ChatAIChatState {
  /**
   * AI消息生成中的会话ID列表
   * 存储所有正在生成AI回复的会话ID
   */
  chatLoadingIds: string[];
  
  /**
   * 聊天加载的中止控制器
   * 用于取消正在进行的AI消息生成操作
   */
  chatLoadingIdsAbortController?: AbortController;
  
  /**
   * 输入文件列表
   * 用户上传的文件，用于文件处理功能
   */
  inputFiles: File[];
  
  /**
   * 输入消息内容
   * 用户当前输入的消息文本
   */
  inputMessage: string;
  
  /**
   * RAG流程中的消息ID列表
   * 存储所有正在进行RAG（检索增强生成）的消息ID
   */
  messageRAGLoadingIds: string[];
  
  /**
   * 插件API加载中的消息ID列表
   * 存储所有正在调用插件API的消息ID
   */
  pluginApiLoadingIds: string[];
  
  /**
   * AI推理中的消息ID列表
   * 存储所有正在进行AI推理的消息ID
   */
  reasoningLoadingIds: string[];
  
  /**
   * 搜索工作流加载中的消息ID列表
   * 存储所有正在进行搜索工作流的消息ID
   */
  searchWorkflowLoadingIds: string[];
  
  /**
   * 工具调用流ID映射
   * 记录每个会话中工具调用的流状态
   * 格式：{ sessionId: boolean[] }
   */
  toolCallingStreamIds: Record<string, boolean[]>;
}

/**
 * AI聊天状态的初始值
 * 设置所有AI聊天相关字段的默认值
 */
export const initialAiChatState: ChatAIChatState = {
  chatLoadingIds: [], // 默认AI生成列表为空
  inputFiles: [], // 默认输入文件为空
  inputMessage: '', // 默认输入消息为空
  messageRAGLoadingIds: [], // 默认RAG加载列表为空
  pluginApiLoadingIds: [], // 默认插件API加载列表为空
  reasoningLoadingIds: [], // 默认推理加载列表为空
  searchWorkflowLoadingIds: [], // 默认搜索工作流加载列表为空
  toolCallingStreamIds: {}, // 默认工具调用流映射为空
};
