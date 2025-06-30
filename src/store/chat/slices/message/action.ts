import { StateCreator } from 'zustand';
import messageService, {
  MessageItem,
  MessagesCreateRequest,
} from '@/services/messages';
import chatService from '@/services/chat';
import agentSuggestionsService from '@/services/agent_suggestions';
import { ChatStore } from '../../store';
import { PLACEHOLDER_MESSAGE } from '@/const/message';

// 将消息转换为AI模型消费的格式
const formatMessagesForAI = (messages: MessageItem[]) => {
  return messages
    .filter(
      (msg) => msg.content && ['user', 'assistant', 'system'].includes(msg.role)
    )
    .map((msg) => ({
      role: msg.role as 'user' | 'assistant' | 'system',
      content: msg.content!,
    }));
};

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

  // 移除AI生成相关方法，因为我们的对话都是确定内容

  // 发送消息
  sendMessage: (params: {
    content: string;
    sessionId: string;
    topicId: string;
  }) => Promise<void>;

  // 消息操作
  copyMessage: (id: string, content?: string) => Promise<void>;
  translateMessage: (id: string, targetLanguage: string) => Promise<void>;

  fetchMessagesByTopic: (topicId: string) => Promise<void>;

  setEditingMessageId: (id: string | undefined) => void;
  setGeneratingMessageId: (id: string | undefined) => void;
  setArtifactMessageId: (id: string | undefined) => void;
  openArtifact: (params: { id: string }) => void;
  closeArtifact: () => void;

  clearTranslate: (id: string) => void;
  
  // 翻译状态管理
  addTranslatingMessage: (id: string) => void;
  removeTranslatingMessage: (id: string) => void;
  autoTranslateMessage: (messageId: string) => Promise<void>;
}

export const messageSlice: StateCreator<ChatStore, [], [], MessageAction> = (
  set,
  get
) => ({
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
        error: undefined,
      });
    } catch (error) {
      console.error('Failed to fetch messages:', error);
      set({
        isLoading: false,
        error:
          error instanceof Error ? error.message : 'Failed to fetch messages',
        messagesInit: true,
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
      sessionId: state.activeSessionId,
      topicId: state.activeTopicId,
      createdAt: new Date().toISOString(),
    };

    set((state) => ({
      messages: [...state.messages, newMessage],
    }));
  },

  updateMessage: (id: string, data: Partial<MessageItem>) => {
    set((state) => ({
      messages: state.messages.map((msg) =>
        msg.id === id ? { ...msg, ...data } : msg
      ),
    }));
  },

  deleteMessage: async (id: string) => {
    try {
      await messageService.deleteMessage(id);
      set((state) => ({
        messages: state.messages.filter((msg) => msg.id !== id),
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

  sendMessage: async ({ content, sessionId, topicId }) => {
    set({ isLoading: true });
    try {
      // 新增一条占位消息
      set((state) => ({
        messages: [...state.messages, PLACEHOLDER_MESSAGE],
      }));

      const createdMessage = await messageService.createMessage({
        content,
        role: 'user',
        sessionId,
        topicId,
      });

      // 更新占位消息
      set((state) => ({
        messages: state.messages.map((msg) =>
          msg.id === PLACEHOLDER_MESSAGE.id ? createdMessage : msg
        ),
      }));

      // 发送后自动刷新
      set({ isLoading: false });

      // 🆕 自动触发翻译
      if (createdMessage.id) {
        console.log('消息发送成功，开始自动翻译:', createdMessage.id);
        get().autoTranslateMessage(createdMessage.id);
      }
    } catch (e: any) {
      set({ isLoading: false, error: e?.message || '消息发送失败' });
    }
  },

  copyMessage: async (id: string, content?: string) => {
    try {
      const state = get();
      const message = state.messages.find((msg) => msg.id === id);
      const textToCopy = content || message?.content || '';

      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(textToCopy);
      } else {
        // 降级处理：使用传统方法
        const textArea = document.createElement('textarea');
        textArea.value = textToCopy;
        textArea.style.position = 'absolute';
        textArea.style.left = '-999999px';
        document.body.prepend(textArea);
        textArea.select();
        document.execCommand('copy');
        textArea.remove();
      }
    } catch (error) {
      console.error('Failed to copy message:', error);
      throw error;
    }
  },

  translateMessage: async (id: string, targetLanguage: string) => {
    try {
      // 添加到翻译中状态
      get().addTranslatingMessage(id);
      
      const state = get();
      const message = state.messages.find((msg) => msg.id === id);

      if (!message?.content) {
        throw new Error('Message content not found');
      }

      // 调用翻译接口
      const response = await chatService.translate({
        text: message.content,
        toLanguage: targetLanguage,
        fromLanguage: 'auto', // 自动检测源语言
      });

      const translated = (response as any).translatedText || response.content;
      if (translated) {
        // 自动推断 from 语言
        let fromLang = 'zh-CN';
        if (targetLanguage === 'zh-CN') fromLang = 'ko-KR';
        if (targetLanguage === 'ko-KR') fromLang = 'zh-CN';
        get().updateMessage(id, {
          metadata: {
            ...message.metadata,
            translate: {
              content: translated,
              from: fromLang,
              to: targetLanguage,
            },
          },
        });
      }
    } catch (error) {
      console.error('Failed to translate message:', error);
      set({
        error:
          error instanceof Error
            ? error.message
            : 'Failed to translate message',
      });
      throw error;
    } finally {
      // 无论成功还是失败都移除翻译状态
      get().removeTranslatingMessage(id);
    }
  },

  fetchMessagesByTopic: async (topicId) => {
    set({ isLoading: true });
    try {
      const messages = await messageService.queryByTopic(topicId);
      set({ messages, isLoading: false });
    } catch (e: any) {
      set({ isLoading: false, error: e?.message || '消息获取失败' });
    }
  },

  setEditingMessageId: (id) => set({ editingMessageId: id }),
  setGeneratingMessageId: (id) => set({ generatingMessageId: id }),
  setArtifactMessageId: (id) => set({ artifactMessageId: id }),
  openArtifact: ({ id }) => set({ artifactMessageId: id }),
  closeArtifact: () => set({ artifactMessageId: undefined }),

  clearTranslate: (id: string) => {
    set((state) => ({
      messages: state.messages.map((msg) =>
        msg.id === id
          ? {
              ...msg,
              metadata: {
                ...msg.metadata,
                translate: undefined,
              },
            }
          : msg
      ),
    }));
  },

  // 翻译状态管理
  addTranslatingMessage: (id: string) => {
    set((state) => ({
      translatingMessageIds: [...state.translatingMessageIds, id],
    }));
  },

  removeTranslatingMessage: (id: string) => {
    set((state) => ({
      translatingMessageIds: state.translatingMessageIds.filter((msgId) => msgId !== id),
    }));
  },

  autoTranslateMessage: async (messageId: string) => {
    try {
      const state = get();
      const message = state.messages.find((msg) => msg.id === messageId);
      
      if (!message?.content) {
        console.warn('Message not found or has no content:', messageId);
        return;
      }

      // 检测消息语言并选择目标翻译语言
      const isKorean = /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/.test(message.content);
      const isChinese = /[\u4e00-\u9fff]/.test(message.content);
      
      let targetLanguage = 'ko-KR'; // 默认翻译为韩语
      
      // 根据消息角色和内容确定翻译方向
      if (message.role === 'assistant' || isKorean) {
        targetLanguage = 'zh-CN'; // AI消息或韩文内容翻译为中文
      } else if (message.role === 'user' || isChinese) {
        targetLanguage = 'ko-KR'; // 用户消息或中文内容翻译为韩语
      }

      // 执行翻译
      await get().translateMessage(messageId, targetLanguage);
    } catch (error) {
      console.error('Auto translate failed:', error);
    }
  },
});
