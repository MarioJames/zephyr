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
import { useSessionStore } from '@/store/session';
import { PLACEHOLDER_SUGGESTION } from '@/const/suggestions';
import { useCustomerStore } from '@/store/customer';

export interface AgentSuggestionsAction {
  // 基础操作
  fetchSuggestions: () => Promise<void>;
  addSuggestion: (suggestion: AgentSuggestionItem) => void;
  updateSuggestion: (
    suggestionId: string,
    suggestion: AgentSuggestionItem
  ) => void;

  // AI 生成相关
  generateAISuggestion: (
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
  fetchSuggestions: async () => {
    const { activeTopicId } = useSessionStore.getState();

    if (!activeTopicId) return;

    try {
      set({ error: undefined, suggestionsLoading: true });

      // 调用服务获取建议列表
      const suggestions = await agentSuggestionsService.getSuggestionsByTopic(
        activeTopicId
      );

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

  updateSuggestion: (suggestionId: string, suggestion: AgentSuggestionItem) => {
    set((state) => ({
      suggestions: state.suggestions.map((s) =>
        s.id === suggestionId ? suggestion : s
      ),
    }));
  },

  generateAISuggestion: async (
    parentMessageId: string
  ): Promise<AgentSuggestionItem | null> => {
    const { activeSessionId } = useSessionStore.getState();

    const { currentCustomerExtend } = useCustomerStore.getState();

    const state = get();

    try {
      set({ isGeneratingAI: true, error: undefined });

      // 先添加一个占位符
      get().addSuggestion(PLACEHOLDER_SUGGESTION);

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

      // 根据historyCount，获取最新的historyCount条消息
      const historyMessages = state.messages
        .sort(
          (a, b) =>
            new Date(a.createdAt!).getTime() - new Date(b.createdAt!).getTime()
        )
        .filter(
          (msg) => msg.content && ['user', 'assistant'].includes(msg.role)
        )
        .slice(-historyCount);

      // 调用 AI 生成服务
      const aiResponse = await chatService.generateReply({
        userMessage: '',
        model: agent?.model,
        provider: agent?.provider,
        sessionId: activeSessionId!,
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
        chatConfig: currentCustomerExtend?.chatConfig,
      });

      if (aiResponse.reply) {
        let pureReply = '';

        // 用正则表达式提取JSON内容
        const match = aiResponse.reply.match(/```json\s*\n([\s\S]*?)\n```/);
        if (match) {
          pureReply = match[1].trim().replace(/\[\d+(?:,\d+)*\]/g, '');
        }

        console.log('pureReply', pureReply);

        if (!pureReply) {
          console.warn('无法从AI响应中提取JSON内容:', aiResponse.reply);
          set({ isGeneratingAI: false });
          return null;
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
          return null;
        }

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
          get().updateSuggestion(
            PLACEHOLDER_SUGGESTION.id as string,
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
