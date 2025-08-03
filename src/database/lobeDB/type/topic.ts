export interface ChatTopicMetadata {
  model?: string;
  provider?: string;
}

export interface TopicRankItem {
  count: number;
  id: string;
  sessionId: string | null;
  title: string | null;
}
