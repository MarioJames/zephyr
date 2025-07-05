import { ChatStore } from '../../store';

// 基础选择器
export const suggestionsSelectors = {
  // 获取当前话题的所有建议
  suggestions: (s: ChatStore) => s.suggestions,

  // 获取建议初始化状态
  suggestionsInit: (s: ChatStore) => s.suggestionsInit,

  // 获取 AI 生成状态
  isGeneratingAI: (s: ChatStore) => s.isGeneratingAI,

  // 获取错误信息
  suggestionsError: (s: ChatStore) => s.error,

  // 根据父消息ID获取对应的建议
  getSuggestionByParentMessageId: (parentMessageId: string) => (s: ChatStore) => {
    return s.suggestions.find(suggestion => suggestion.parentMessageId === parentMessageId);
  },

  // 获取建议总数
  suggestionsCount: (s: ChatStore) => s.suggestions.length,

  // 获取最新的建议
  latestSuggestion: (s: ChatStore) => {
    if (s.suggestions.length === 0) return null;
    return s.suggestions.reduce((latest, current) => {
      return new Date(current.createdAt!) > new Date(latest.createdAt!) ? current : latest;
    });
  },

  // 按创建时间排序的建议列表
  suggestionsSortedByTime: (s: ChatStore) => {
    return [...s.suggestions].sort((a, b) =>
      new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime()
    );
  },

  // 检查是否有建议正在生成
  hasGeneratingAI: (s: ChatStore) => s.isGeneratingAI,

  // 检查指定父消息是否有建议
  hasSuggestionForMessage: (parentMessageId: string) => (s: ChatStore) => {
    return s.suggestions.some(suggestion => suggestion.parentMessageId === parentMessageId);
  },
};
