import { StateCreator } from 'zustand';
import messageService from '@/services/messages';
import { ChatStore } from '../../store';
import { useSessionStore } from '@/store/session';
import messageTranslateService from '@/services/message_translates';
import { generateMessageWithFiles } from '@/utils/message';

import {
  transformMessagesWithFileClassification,
  transformMessageWithFileClassification,
} from './helpers';
import { FileForAI } from '@/utils/file';
import { ChatMessageContent } from '@/types/message';

export interface MessageAction {
  // 消息CRUD操作
  fetchMessages: (topicId?: string) => Promise<void>;

  // 输入管理
  updateInputMessage: (message: string) => void;
  clearInputMessage: () => void;

  // 发送消息
  createMessage: (
    content: ChatMessageContent,
    role: 'user' | 'assistant',
    options: { clearInput?: boolean; files?: string[] }
  ) => Promise<void>;
  sendMessage: (role: 'user' | 'assistant') => Promise<void>;
  acceptSuggestion: (content: string) => Promise<void>;

  // 消息操作
  copyMessage: (id: string) => Promise<void>;
  translateMessage: (
    id: string,
    params: { from: string; to: string }
  ) => Promise<void>;

  // 翻译状态管理
  addTranslatingMessage: (id: string) => void;
  removeTranslatingMessage: (id: string) => void;
  autoTranslateMessage: (
    role: 'user' | 'assistant',
    messageId: string
  ) => Promise<void>;
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

    set({ fetchMessageLoading: true, error: undefined });
    try {
      const messages = await messageService.queryByTopic(topicId);
      // 对消息进行文件分类处理并按照 createdAt 排序
      const transformedMessages = transformMessagesWithFileClassification(
        messages
      ).sort((a, b) => {
        const aTime = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const bTime = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return aTime - bTime;
      });

      set({
        messages: transformedMessages,
        messagesInit: true,
        fetchMessageLoading: false,
        error: undefined,
      });
    } catch (error) {
      console.error('Failed to fetch messages:', error);
      set({
        fetchMessageLoading: false,
        error:
          error instanceof Error ? error.message : 'Failed to fetch messages',
        messagesInit: true,
      });
    }
  },

  updateInputMessage: (message: string) => {
    set({ inputMessage: message });
  },

  clearInputMessage: () => {
    set({ inputMessage: '' });
  },

  // 内部核心发送逻辑
  createMessage: async (
    content: ChatMessageContent,
    role: 'user' | 'assistant',
    options: { clearInput?: boolean; files?: string[] } = {}
  ) => {
    const { activeSessionId, activeTopicId } = useSessionStore.getState();

    if (!content || !activeSessionId || !activeTopicId) return;

    set({ fetchMessageLoading: true });

    try {
      const createdMessage = await messageService.createMessage({
        role,
        content:
          typeof content === 'string' ? content : (content[0]?.text ?? ''),
        sessionId: activeSessionId,
        topicId: activeTopicId,
        files: options.files, // 传递文件信息
      });

      // 对创建的消息进行文件分类处理
      const transformedMessage =
        transformMessageWithFileClassification(createdMessage);

      const updateData: Partial<ChatStore> = {
        messages: [...get().messages, transformedMessage],
        fetchMessageLoading: false,
      };

      // 如果需要清空输入框（sendMessage 时清空，acceptSuggestion 时不清空）
      if (options.clearInput) {
        updateData.inputMessage = '';
      }

      set(updateData);

      // 如果是用户输入的内容，则生成建议
      if (role === 'user') {
        get().generateAISuggestion(createdMessage.id);
      }

      // 自动触发翻译
      if (createdMessage.id) {
        get().autoTranslateMessage(role, createdMessage.id);
      }
    } catch (e: unknown) {
      set({
        fetchMessageLoading: false,
        error: (e as Error)?.message || '消息发送失败',
      });
    }
  },

  sendMessage: async (role: 'user' | 'assistant') => {
    const { inputMessage, chatUploadFileList } = get();

    set({ sendMessageLoading: true });

    try {
      // 如果没有上传的文件，正常发送
      if (!chatUploadFileList.length) {
        await get().createMessage(inputMessage, role, { clearInput: true });
        return;
      }

      const filesForAI: FileForAI[] = [];

      // 处理上传的文件
      for (const fileItem of chatUploadFileList) {
        if (fileItem.status !== 'success') {
          continue;
        }

        const fileForAI: FileForAI = fileItem;

        // 如果不是图片，添加解析后的内容
        if (!fileItem.fileType?.startsWith('image/')) {
          const parsedContent = get().getParsedFileContent(fileItem.id!);
          fileForAI.content = parsedContent?.content;
        }

        filesForAI.push(fileForAI);
      }

      // 结合文件生成带有文件内容上下文的消息
      const messageWithFiles = generateMessageWithFiles(
        inputMessage,
        filesForAI
      );

      // 收集文件ID用于数据库存储
      const fileIds = chatUploadFileList
        .filter((file) => file.status === 'success' && file.id)
        .map((file) => file.id!);

      // 发送消息，包含文件信息
      await get().createMessage(messageWithFiles, role, {
        clearInput: true,
        files: fileIds,
      });

      // 清理上传的文件列表
      get().clearChatUploadFileList();
    } catch (error) {
      console.error('发送带文件上下文的消息失败:', error);
      // 降级处理：正常发送消息
      await get().createMessage(inputMessage, role, { clearInput: true });
    } finally {
      set({ sendMessageLoading: false });
    }
  },

  acceptSuggestion: async (content: string) => {
    await get().createMessage(content, 'assistant', { clearInput: false });
  },

  copyMessage: async (id: string) => {
    try {
      const state = get();
      const message = state.messages.find((msg) => msg.id === id);

      const textToCopy = message?.content || '';

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

  translateMessage: async (
    id: string,
    params: { from: string; to: string }
  ) => {
    try {
      // 添加到翻译中状态
      get().addTranslatingMessage(id);

      const state = get();
      const message = state.messages.find((msg) => msg.id === id);

      if (!message?.content) {
        throw new Error('Message content not found');
      }
      const { activeSessionId, sessions } = useSessionStore.getState();

      const activeSession = sessions.find((s) => s.id === activeSessionId);
      const activeAgent = activeSession?.agentsToSessions[0]?.agent;

      // 调用翻译接口，返回翻译结果
      const translationResult = await messageTranslateService.translateMessage({
        ...params,
        messageId: id,
        model: activeAgent?.model,
        provider: activeAgent?.provider,
        chatConfig: activeAgent?.params,
      });

      // 更新消息的 translation 字段
      set((state) => ({
        messages: state.messages.map((msg) =>
          msg.id === id ? { ...msg, translation: translationResult } : msg
        ),
      }));
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

  // 翻译状态管理
  addTranslatingMessage: (id: string) => {
    set((state) => ({
      translatingMessageIds: [...state.translatingMessageIds, id],
    }));
  },

  removeTranslatingMessage: (id: string) => {
    set((state) => ({
      translatingMessageIds: state.translatingMessageIds.filter(
        (msgId) => msgId !== id
      ),
    }));
  },

  autoTranslateMessage: async (
    role: 'user' | 'assistant',
    messageId: string
  ) => {
    try {
      const state = get();
      const message = state.messages.find((msg) => msg.id === messageId);

      if (!message?.content) {
        console.warn('Message not found or has no content:', messageId);
        return;
      }

      // 检测消息发送方指定翻译语言
      const to = role === 'user' ? 'zh-CN' : 'ko-KR';

      // 执行翻译
      await get().translateMessage(messageId, { from: '自动识别', to });
    } catch (error) {
      console.error('Auto translate failed:', error);
    }
  },
});
