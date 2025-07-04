import { StateCreator } from 'zustand';
import messageService, { MessageItem } from '@/services/messages';
import { ChatStore } from '../../store';
import { useSessionStore } from '@/store/session';
import messageTranslateService from '@/services/message_translates';
import {
  createMessageWithFiles,
  FileForAI,
} from '@/utils/fileContextFormatter';

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
  fetchMessagesByTopic: (topicId: string) => Promise<void>;

  // 输入管理
  updateInputMessage: (message: string) => void;
  clearInputMessage: () => void;

  // 发送消息
  createMessage: (
    content: string,
    role: 'user' | 'assistant',
    options: { clearInput?: boolean; files?: string[] }
  ) => Promise<void>;
  sendMessage: (role: 'user' | 'assistant') => Promise<void>;
  acceptSuggestion: (content: string) => Promise<void>;

  // 消息操作
  copyMessage: (id: string, content?: string) => Promise<void>;
  translateMessage: (
    id: string,
    params: { from: string; to: string }
  ) => Promise<void>;

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

  updateInputMessage: (message: string) => {
    set({ inputMessage: message });
  },

  clearInputMessage: () => {
    set({ inputMessage: '' });
  },

  // 内部核心发送逻辑
  createMessage: async (
    content: string,
    role: 'user' | 'assistant',
    options: { clearInput?: boolean; files?: string[] } = {}
  ) => {
    const { activeSessionId, activeTopicId } = useSessionStore.getState();

    console.log('createMessage - 参数:', {
      content: content.slice(0, 200) + '...',
      role,
      options,
    });

    if (!content || !activeSessionId || !activeTopicId) return;

    set({ isLoading: true });

    try {
      const createdMessage = await messageService.createMessage({
        role,
        content,
        sessionId: activeSessionId,
        topicId: activeTopicId,
        files: options.files, // 传递文件信息
      });

      console.log('创建消息成功:', createdMessage);

      const updateData: Partial<ChatStore> = {
        messages: [...get().messages, createdMessage],
        isLoading: false,
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

      // 🆕 自动触发翻译
      if (createdMessage.id) {
        console.log('消息发送成功，开始自动翻译:', createdMessage.id);
        get().autoTranslateMessage(createdMessage.id);
      }
    } catch (e: unknown) {
      set({ isLoading: false, error: (e as Error)?.message || '消息发送失败' });
    }
  },

  sendMessage: async (role: 'user' | 'assistant') => {
    const { inputMessage, chatUploadFileList } = get();

    set({ sendLoading: true });
    try {
      // 如果没有上传的文件，正常发送
      if (!chatUploadFileList.length) {
        await get().createMessage(inputMessage, role, { clearInput: true });
        return;
      }

      const filesForAI: FileForAI[] = [];

      // 处理上传的文件
      for (const fileItem of chatUploadFileList) {
        console.log('处理文件:', fileItem);
        if (fileItem.status !== 'success') {
          console.log('文件状态不是success，跳过:', fileItem.status);
          continue;
        }

        const fileForAI: FileForAI = {
          id: fileItem.id!,
          name: fileItem.filename!,
          type: fileItem.fileType!,
          size: fileItem.size!,
        };

        // 处理图片文件 - 直接使用已经转换好的base64
        if (fileItem.fileType?.startsWith('image/')) {
          fileForAI.base64 = fileItem.base64;
          console.log(
            '图片文件处理完成:',
            fileForAI.name,
            '有base64:',
            !!fileForAI.base64
          );
        } else {
          // 处理文档文件，获取解析后的内容
          const parsedContent = get().getParsedFileContent(fileItem.id!);
          if (parsedContent) {
            fileForAI.content = parsedContent.content;
            fileForAI.metadata = parsedContent.metadata;
          }
          console.log(
            '文档文件处理完成:',
            fileForAI.name,
            '有内容:',
            !!fileForAI.content
          );
        }

        filesForAI.push(fileForAI);
      }

      // 使用文件上下文创建消息
      const messageWithFiles = createMessageWithFiles(inputMessage, filesForAI);
      const finalContent =
        typeof messageWithFiles.content === 'string'
          ? messageWithFiles.content
          : messageWithFiles.content[0]?.text || inputMessage;

      // 收集文件ID用于数据库存储
      const fileIds = chatUploadFileList
        .filter((file) => file.status === 'success' && file.id)
        .map((file) => file.id!);

      // 发送消息，包含文件信息
      await get().createMessage(finalContent, role, {
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
      set({ sendLoading: false });
    }
  },

  acceptSuggestion: async (content: string) => {
    await get().createMessage(content, 'assistant', { clearInput: false });
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

      // 调用翻译接口，返回翻译结果
      const translationResult = await messageTranslateService.translateMessage({
        ...params,
        messageId: id,
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

  fetchMessagesByTopic: async (topicId) => {
    set({ isLoading: true });
    try {
      const messages = await messageService.queryByTopic(topicId);
      set({ messages, isLoading: false });
    } catch (e: any) {
      set({ isLoading: false, error: e?.message || '消息获取失败' });
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

      const from = isChinese ? 'zh-CN' : isKorean ? 'ko-KR' : '自动判断';
      const to = isChinese ? 'ko-KR' : isKorean ? 'zh-CN' : '自动判断';

      // 执行翻译
      await get().translateMessage(messageId, { from, to });
    } catch (error) {
      console.error('Auto translate failed:', error);
    }
  },
});
