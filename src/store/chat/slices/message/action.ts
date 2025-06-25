import { StateCreator } from 'zustand';
import messageService, { MessageItem, MessagesCreateRequest } from '@/services/messages';
import chatService from '@/services/chat';
import { ChatStore } from '../../store';

export interface MessageAction {
  // 消息CRUD操作
  fetchMessages: (topicId?: string) => Promise<void>;
  addMessage: (message: Partial<MessageItem>) => void;
  addAIMessage: (content: string) => void;
  updateMessage: (id: string, data: Partial<MessageItem>) => void;
  deleteMessage: (id: string) => Promise<void>;
  
  // 输入管理
  updateInputMessage: (message: string) => void;
  clearInputMessage: () => void;
  
  // AI生成相关
  startGenerating: () => void;
  stopGenerateMessage: () => void;
  finishGenerating: () => void;
  
  // 发送消息
  sendMessage: (content: string) => Promise<void>;
}

export const messageSlice: StateCreator<
  ChatStore,
  [],
  [],
  MessageAction
> = (set, get) => ({
  fetchMessages: async (topicId?: string) => {
    if (!topicId) {
      set({ messagesInit: true });
      return;
    }

    set({ isLoading: true, error: undefined });
    try {
      const messages = await messageService.queryByTopic(topicId);
      set({ 
        messages, 
        messagesInit: true, 
        isLoading: false,
        error: undefined 
      });
    } catch (error) {
      console.error('Failed to fetch messages:', error);
      set({ 
        isLoading: false, 
        error: error instanceof Error ? error.message : 'Failed to fetch messages',
        messagesInit: true 
      });
    }
  },

  addMessage: (message: Partial<MessageItem>) => {
    const newMessage: MessageItem = {
      id: message.id || Date.now().toString(),
      role: message.role || 'user',
      content: message.content || '',
      userId: message.userId || '',
      sessionId: message.sessionId,
      topicId: message.topicId,
      createdAt: new Date().toISOString(),
      ...message,
    };

    set((state) => ({
      messages: [...state.messages, newMessage],
    }));
  },

  addAIMessage: (content: string) => {
    const state = get();
    const newMessage: MessageItem = {
      id: Date.now().toString(),
      role: 'assistant',
      content,
      userId: '', // 会在实际使用时填入
      sessionId: state.activeId,
      topicId: state.activeTopicId,
      createdAt: new Date().toISOString(),
    };

    set((state) => ({
      messages: [...state.messages, newMessage],
    }));
  },

  updateMessage: (id: string, data: Partial<MessageItem>) => {
    set((state) => ({
      messages: state.messages.map(msg =>
        msg.id === id ? { ...msg, ...data } : msg
      ),
    }));
  },

  deleteMessage: async (id: string) => {
    try {
      await messageService.deleteMessage(id);
      set((state) => ({
        messages: state.messages.filter(msg => msg.id !== id),
      }));
    } catch (error) {
      console.error('Failed to delete message:', error);
      throw error;
    }
  },

  updateInputMessage: (message: string) => {
    set({ inputMessage: message });
  },

  clearInputMessage: () => {
    set({ inputMessage: '' });
  },

  startGenerating: () => {
    const abortController = new AbortController();
    set({ 
      isAIGenerating: true, 
      abortController,
      error: undefined 
    });
  },

  stopGenerateMessage: () => {
    const state = get();
    if (state.abortController) {
      state.abortController.abort();
    }
    set({ 
      isAIGenerating: false, 
      abortController: undefined 
    });
  },

  finishGenerating: () => {
    set({ 
      isAIGenerating: false, 
      abortController: undefined 
    });
  },

  sendMessage: async (content: string) => {
    const state = get();
    
    // 添加用户消息
    const userMessage: MessagesCreateRequest = {
      content,
      role: 'user',
      sessionId: state.activeId,
      topicId: state.activeTopicId,
    };

    try {
      // 创建用户消息
      const createdMessage = await messageService.createMessage(userMessage);
      get().addMessage(createdMessage);

      // 开始生成AI回复
      get().startGenerating();
      
      // 生成AI回复
      const response = await chatService.generateReply({
        userMessage: content,
        sessionId: state.activeId,
        conversationHistory: state.messages.map(msg => ({
          role: msg.role as 'user' | 'assistant' | 'system',
          content: msg.content || '',
        })),
      });

      // 添加AI回复
      if (response.content) {
        const aiMessage: MessagesCreateRequest = {
          content: response.content,
          role: 'assistant',
          sessionId: state.activeId,
          topicId: state.activeTopicId,
          model: response.model,
          provider: response.provider,
        };

        const createdAIMessage = await messageService.createMessage(aiMessage);
        get().addMessage(createdAIMessage);
      }

      // 清空输入并结束生成
      get().clearInputMessage();
      get().finishGenerating();
      
    } catch (error) {
      console.error('Failed to send message:', error);
      get().finishGenerating();
      set({ error: error instanceof Error ? error.message : 'Failed to send message' });
      throw error;
    }
  },
});