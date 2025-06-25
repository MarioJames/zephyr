export interface CitationItem {
  id?: string;
  onlyUrl?: boolean;
  title?: string;
  url: string;
}

export type MessageRoleType = 'user' | 'assistant';

export interface MessageItem {
  agentId: string | null;
  clientId: string | null;
  content: string | null;
  createdAt: Date;
  error: any | null;
  id: string;
  model: string | null;
  observationId: string | null;
  parentId: string | null;
  provider: string | null;
  quotaId: string | null;
  role: string;
  sessionId: string | null;
  threadId: string | null;
  tools: any | null;
  topicId: string | null;
  traceId: string | null;
  updatedAt: Date;
  userId: string;
}
