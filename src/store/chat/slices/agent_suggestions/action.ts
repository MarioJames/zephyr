import { StateCreator } from 'zustand';
import agentSuggestionsService, {
  AgentSuggestionContent,
  AgentSuggestionCreate,
  AgentSuggestionItem,
} from '@/services/agent_suggestions';
import { ChatStore } from '../../store';
import { agentSelectors, useAgentStore } from '@/store/agent';
import { AI_SUGGESTION_PROMPT } from '@/const/prompt';
import chatService from '@/services/chat';

export interface AgentSuggestionsAction {
  // 基础操作
  fetchSuggestions: (topicId?: string) => Promise<void>;
  addSuggestion: (suggestion: AgentSuggestionItem) => void;
  updateSuggestion: (id: number, data: Partial<AgentSuggestionItem>) => void;
  deleteSuggestion: (id: number) => void;
  clearSuggestions: () => void;

  // AI 生成相关
  generateAISuggestion: (
    userMessage: string,
    parentMessageId: string
  ) => Promise<AgentSuggestionItem | null>;

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
      const suggestions = await agentSuggestionsService.getSuggestionsByTopic(
        topicId
      );

      set({
        suggestions,
        suggestionsInit: true,
        error: undefined,
      });
    } catch (error) {
      console.error('Failed to fetch suggestions:', error);
      set({
        error:
          error instanceof Error
            ? error.message
            : 'Failed to fetch suggestions',
        suggestionsInit: true,
      });
    }
  },

  addSuggestion: (suggestion: AgentSuggestionItem) => {
    set((state) => ({
      suggestions: [...state.suggestions, suggestion],
    }));
  },

  updateSuggestion: (id: number, data: Partial<AgentSuggestionItem>) => {
    set((state) => ({
      suggestions: state.suggestions.map((suggestion) =>
        suggestion.id === id ? { ...suggestion, ...data } : suggestion
      ),
    }));
  },

  deleteSuggestion: (id: number) => {
    set((state) => ({
      suggestions: state.suggestions.filter(
        (suggestion) => suggestion.id !== id
      ),
    }));
  },

  clearSuggestions: () => {
    set({
      suggestions: [],
      suggestionsInit: false,
      error: undefined,
    });
  },

  generateAISuggestion: async (
    userMessage: string,
    parentMessageId: string
  ): Promise<AgentSuggestionItem | null> => {
    const state = get();

    try {
      set({ isGeneratingAI: true, error: undefined });

      // 获取现在激活的会话对应的agent
      const agent = agentSelectors.currentAgent(useAgentStore.getState());

      // 拿到agent的system prompt
      const systemPrompt = agent?.systemRole;

      // 拿到agent的chatConfig
      const chatConfig = agent?.chatConfig;

      // 拿到agent的historyCount
      const historyCount = chatConfig?.historyCount ?? 8;

      // 使用AI_SUGGESTION_PROMPT生成提示词
      const prompt = AI_SUGGESTION_PROMPT(systemPrompt || '');

      // 根据historyCount，获取历史消息
      const historyMessages = state.messages
        .sort(
          (a, b) =>
            new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime()
        )
        .filter(
          (msg) => msg.content && ['user', 'assistant'].includes(msg.role)
        )
        .slice(-historyCount);

      // 调用 AI 生成服务
      const aiResponse = await chatService.generateReply({
        userMessage,
        model: agent?.model,
        provider: agent?.provider,
        sessionId: state.activeId,
        // 拼接系统提示词和用户消息作为上下文
        conversationHistory: [
          {
            role: 'system',
            content: prompt,
          },
          ...historyMessages.map((msg) => ({
            role: msg.role,
            content: msg.content!,
          })),
        ],
      });

      if (aiResponse.reply) {
        const pureReply = aiResponse.reply.replace(/```json\n|```/g, '');

        const suggestion = JSON.parse(pureReply) as AgentSuggestionContent;

        if (!suggestion) {
          set({ isGeneratingAI: false });
          return null;
        }

        // 创建建议对象
        const suggestionItem: Partial<AgentSuggestionItem> = {
          suggestion,
          parentMessageId,
          topicId: state.activeTopicId!,
        };

        // 保存到数据库
        try {
          const createdSuggestion =
            await agentSuggestionsService.createSuggestion(
              suggestionItem as AgentSuggestionCreate
            );

          // 添加到本地状态
          get().addSuggestion(createdSuggestion);

          // 更新本地状态
          get().updateSuggestion(
            createdSuggestion.id,
            createdSuggestion
          );
        } catch (saveError) {
          console.error('Failed to save suggestion to database:', saveError);
          // 不抛出错误，只是记录日志
        }

        set({ isGeneratingAI: false });
        return null;
      }

      set({ isGeneratingAI: false });
      return null;
    } catch (error) {
      console.error('Failed to generate AI suggestion:', error);
      set({
        isGeneratingAI: false,
        error:
          error instanceof Error
            ? error.message
            : 'Failed to generate AI suggestion',
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
