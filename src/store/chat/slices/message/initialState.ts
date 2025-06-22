import { ChatMessage } from '@/types/message';

/**
 * 聊天消息状态接口
 * 定义了聊天消息相关的所有状态字段
 */
export interface ChatMessageState {
  /**
   * 当前活动的会话ID
   * 表示当前正在编辑或查看的会话
   * 默认值为'inbox'，表示收件箱
   */
  activeId: string;

  /**
   * 是否正在创建消息
   * 标识当前是否处于消息创建状态
   */
  isCreatingMessage: boolean;
  
  /**
   * 正在编辑的消息ID列表
   * 存储所有当前正在编辑的消息ID
   */
  messageEditingIds: string[];
  
  /**
   * 正在加载的消息ID列表
   * 存储所有正在创建或更新中的消息ID
   * 用于显示加载状态和防止重复操作
   */
  messageLoadingIds: string[];
  
  /**
   * 消息是否已初始化
   * 标识消息数据是否已经完成首次获取
   */
  messagesInit: boolean;
  
  /**
   * 消息映射表
   * 以会话ID为键，存储每个会话的消息列表
   * 格式：{ sessionId: ChatMessage[] }
   */
  messagesMap: Record<string, ChatMessage[]>;
}

/**
 * 聊天消息状态的初始值
 * 设置所有消息相关字段的默认值
 */
export const initialMessageState: ChatMessageState = {
  activeId: 'inbox', // 默认活动会话为收件箱
  isCreatingMessage: false, // 默认不在创建消息状态
  messageEditingIds: [], // 默认编辑消息列表为空
  messageLoadingIds: [], // 默认加载消息列表为空
  messagesInit: false, // 默认消息未初始化
  messagesMap: {}, // 默认消息映射表为空
};
