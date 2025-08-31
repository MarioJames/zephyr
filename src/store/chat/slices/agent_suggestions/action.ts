import { StateCreator } from 'zustand';
import agentSuggestionsService, {
  AgentSuggestionContent,
  AgentSuggestionCreate,
  AgentSuggestionItem,
} from '@/services/agent_suggestions';
import { ChatStore } from '../../store';
import { USER_SUGGESTION_PROMPT, ASSISTANT_SUGGESTION_PROMPT } from '@/const/prompt';
import chatService from '@/services/chat';
import { useSessionStore } from '@/store/session';
import { PLACEHOLDER_SUGGESTION } from '@/const/suggestions';
import { transformMessageToOpenAIFormat } from '@/utils/message';
import { useCustomerStore } from '@/store/customer';

export interface AgentSuggestionsAction {
  // 基础操作
  fetchSuggestions: (topicId?: string) => Promise<void>;
  addSuggestion: (suggestion: AgentSuggestionItem) => void;
  updateSuggestion: (
    suggestionId: number,
    suggestion: AgentSuggestionItem
  ) => void;

  // AI 生成相关
  generateAISuggestion: (
    parentMessageId: string
  ) => Promise<{ success: boolean }>;

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
    const finalTopicId = topicId || useSessionStore.getState().activeTopicId;

    if (!finalTopicId) return;

    try {
      set({ error: undefined, suggestionsLoading: true });

      // 调用服务获取建议列表
      const suggestions =
        await agentSuggestionsService.getSuggestionsByTopic(finalTopicId);

      set({
        suggestions,
        suggestionsInit: true,
        error: undefined,
        suggestionsLoading: false,
      });
    } catch (error) {
      console.error('Failed to fetch suggestions:', error);
      set({
        error:
          error instanceof Error
            ? error.message
            : 'Failed to fetch suggestions',
        suggestionsInit: true,
        suggestionsLoading: false,
      });
    }
  },

  addSuggestion: (suggestion: AgentSuggestionItem) => {
    set((state) => ({
      suggestions: [...state.suggestions, suggestion],
    }));
  },

  updateSuggestion: (suggestionId: number, suggestion: AgentSuggestionItem) => {
    set((state) => ({
      suggestions: state.suggestions.map((s) =>
        s.id === suggestionId ? suggestion : s
      ),
    }));
  },

  generateAISuggestion: async (
    parentMessageId: string
  ): Promise<{ success: boolean }> => {
    const { activeSessionId, activeTopicId, sessions } =
      useSessionStore.getState();

    // 是否打开联网搜索
    const { currentCustomerExtend } = useCustomerStore.getState();

    const enableSearch =
      currentCustomerExtend?.chatConfig?.searchMode === 'auto';

    const state = get();

    try {
      set({ isGeneratingAI: true, error: undefined });

      // 先添加一个占位符
      get().addSuggestion(PLACEHOLDER_SUGGESTION);

      const activeSession = sessions.find((s) => s.id === activeSessionId);

      const activeAgent = activeSession?.agentsToSessions[0]?.agent;

      const systemRole = activeAgent?.systemRole;

      // const historyCount = activeAgent?.chatConfig?.historyCount || 8;

      // 获取当前消息
      const currentMessage = state.messages.find(msg => msg.id === parentMessageId);
      if (!currentMessage) {
        throw new Error('未找到当前消息');
      }

      // 根据消息类型选择不同的提示词
      const prompt = currentMessage?.role === 'user' 
        ? USER_SUGGESTION_PROMPT(systemRole || '')
        : ASSISTANT_SUGGESTION_PROMPT(systemRole || '');

      // 根据historyCount，获取最新的historyCount条消息
      const historyMessages = state.messages
        .sort(
          (a, b) =>
            new Date(a.createdAt!).getTime() - new Date(b.createdAt!).getTime()
        )
        .filter(
          (msg) => msg.content && ['user', 'assistant'].includes(msg.role)
        )
        // .slice(-historyCount)
        .map(transformMessageToOpenAIFormat); // 转换为OpenAI格式

      // 调用 AI 生成服务
      const aiResponse = await chatService.generateReply({
        // 使用当前消息作为输入
        userMessage: currentMessage.content || '',
        model: activeAgent?.model,
        provider: activeAgent?.provider,
        sessionId: activeSessionId!,
        // 拼接系统提示词和历史消息作为上下文
        conversationHistory: [
          {
            role: 'system',
            content: prompt,
          },
          // 去掉最后一条消息，因为最后一条消息是当前消息
          ...historyMessages.slice(0, -1).map((msg) => ({
            role: msg.role,
            content: msg.content!,
          })),
        ],
        chatConfig: {
          ...activeAgent?.params,
          web_search_options: enableSearch ? {} : undefined,
        },
      });

      if (aiResponse.reply) {
        let pureReply = '';

        // 用正则表达式提取JSON内容
        const match = aiResponse.reply.match(/```json\s*\n([\S\s]*?)\n```/);
        if (match) {
          pureReply = match[1].trim().replaceAll(/\[\d+(?:,\d+)*]/g, '');
        }

        if (!pureReply) {
          console.warn('无法从AI响应中提取JSON内容:', aiResponse.reply);

          set({
            isGeneratingAI: false,
            suggestions: state.suggestions.filter(
              (s) => s.id !== PLACEHOLDER_SUGGESTION.id
            ),
          });
          return { success: false };
        }

        let suggestion: AgentSuggestionContent;
        try {
          suggestion = JSON.parse(pureReply) as AgentSuggestionContent;
        } catch (parseError) {
          console.error('JSON解析失败:', parseError);
          console.error('原始JSON:', pureReply);
          set({
            isGeneratingAI: false,
          });
          return { success: false };
        }

        if (!suggestion) {
          set({ isGeneratingAI: false });
          return { success: false };
        }

        // 创建建议对象
        const suggestionItem: Partial<AgentSuggestionItem> = {
          suggestion,
          parentMessageId,
          topicId: activeTopicId!,
        };

        // 保存到数据库
        try {
          const createdSuggestion =
            await agentSuggestionsService.createSuggestion(
              suggestionItem as AgentSuggestionCreate
            );

          // 添加到本地状态
          get().updateSuggestion(
            PLACEHOLDER_SUGGESTION.id as number,
            createdSuggestion
          );
        } catch (saveError) {
          console.error('Failed to save suggestion to database:', saveError);
          // 不抛出错误，只是记录日志
        }

        set({ isGeneratingAI: false });

        return { success: true };
      }

      set({ isGeneratingAI: false });

      return { success: false };
    } catch (error) {
      console.error('Failed to generate AI suggestion:', error);
      set({
        isGeneratingAI: false,
        suggestions: state.suggestions.filter(
          (s) => s.id !== PLACEHOLDER_SUGGESTION.id
        ),
        error:
          error instanceof Error
            ? error.message
            : 'Failed to generate AI suggestion',
      });
      return { success: false };
    }
  },

  setGeneratingAI: (loading: boolean) => {
    set({ isGeneratingAI: loading });
  },

  setSuggestionsError: (error?: string) => {
    set({ error });
  },
});
