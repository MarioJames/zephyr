import { StateCreator } from 'zustand';
import agentSuggestionsService from '@/services/agent_suggestions';
import { ChatStore } from '../../store';
import { AgentSuggestion } from './initialState';

export interface AgentSuggestionsAction {
  // 基础操作
  fetchSuggestions: (topicId?: string) => Promise<void>;
  addSuggestion: (suggestion: AgentSuggestion) => void;
  updateSuggestion: (id: string, data: Partial<AgentSuggestion>) => void;
  deleteSuggestion: (id: string) => void;
  clearSuggestions: () => void;

  // AI 生成相关
  generateAISuggestion: (userMessage: string, parentMessageId: string) => Promise<AgentSuggestion | null>;

  // 状态管理
  setGeneratingAI: (loading: boolean) => void;
  setSuggestionsError: (error?: string) => void;
}

export const agentSuggestionsSlice: StateCreator<
  ChatStore,
  [],
  [],
  AgentSuggestionsAction
> = (set, get) => ({
  fetchSuggestions: async (topicId?: string) => {
    if (!topicId) {
      set({ suggestionsInit: true });
      return;
    }

    try {
      set({ error: undefined });

      // 调用服务获取建议列表
      const suggestions = await agentSuggestionsService.getSuggestionsByTopic(topicId);

      // 转换为前端格式
      const formattedSuggestions: AgentSuggestion[] = suggestions.map(item => ({
        id: item.id.toString(),
        content: item.suggestion?.content || '',
        model: item.suggestion?.model,
        provider: item.suggestion?.provider,
        usage: item.suggestion?.usage,
        parentMessageId: item.parentMessageId,
        topicId: item.topicId,
        createdAt: item.createdAt,
      }));

      set({
        suggestions: formattedSuggestions,
        suggestionsInit: true,
        error: undefined
      });
    } catch (error) {
      console.error('Failed to fetch suggestions:', error);
      set({
        error: error instanceof Error ? error.message : 'Failed to fetch suggestions',
        suggestionsInit: true
      });
    }
  },

  addSuggestion: (suggestion: AgentSuggestion) => {
    set((state) => ({
      suggestions: [...state.suggestions, suggestion],
    }));
  },

  updateSuggestion: (id: string, data: Partial<AgentSuggestion>) => {
    set((state) => ({
      suggestions: state.suggestions.map(suggestion =>
        suggestion.id === id ? { ...suggestion, ...data } : suggestion
      ),
    }));
  },

  deleteSuggestion: (id: string) => {
    set((state) => ({
      suggestions: state.suggestions.filter(suggestion => suggestion.id !== id),
    }));
  },

  clearSuggestions: () => {
    set({
      suggestions: [],
      suggestionsInit: false,
      error: undefined
    });
  },

  generateAISuggestion: async (userMessage: string, parentMessageId: string): Promise<AgentSuggestion | null> => {
    const state = get();

    try {
      set({ isGeneratingAI: true, error: undefined });

      // 使用现有的 formatMessagesForAI 函数
      const formatMessagesForAI = (messages: any[]) => {
        return messages
          .filter(msg => msg.content && ['user', 'assistant', 'system'].includes(msg.role))
          .map(msg => ({
            role: msg.role as 'user' | 'assistant' | 'system',
            content: msg.content!,
          }));
      };

      // 调用 AI 生成服务
      const response = await import('@/services/chat').then(module =>
        module.default.generateReply({
          userMessage,
          sessionId: state.activeId,
          conversationHistory: formatMessagesForAI(state.messages),
        })
      );

      if (response.content) {
        // 创建建议对象
        const suggestion: AgentSuggestion = {
          id: `suggestion_${Date.now()}`,
          content: response.content,
          model: response.model,
          provider: response.provider,
          usage: response.usage,
          parentMessageId,
          topicId: state.activeTopicId!,
          createdAt: new Date().toISOString(),
        };

        // 添加到本地状态
        get().addSuggestion(suggestion);

        // 保存到数据库
        try {
          await agentSuggestionsService.createSuggestion({
            suggestion: {
              content: response.content,
              model: response.model,
              provider: response.provider,
              usage: response.usage,
            },
            topicId: state.activeTopicId!,
            parentMessageId,
          });
        } catch (saveError) {
          console.error('Failed to save suggestion to database:', saveError);
          // 不抛出错误，只是记录日志
        }

        set({ isGeneratingAI: false });
        return suggestion;
      }

      set({ isGeneratingAI: false });
      return null;
    } catch (error) {
      console.error('Failed to generate AI suggestion:', error);
      set({
        isGeneratingAI: false,
        error: error instanceof Error ? error.message : 'Failed to generate AI suggestion'
      });
      return null;
    }
  },

  setGeneratingAI: (loading: boolean) => {
    set({ isGeneratingAI: loading });
  },

  setSuggestionsError: (error?: string) => {
    set({ error });
  },
});
