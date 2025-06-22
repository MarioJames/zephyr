import { LobeSessions } from '@/types/session/agentSession';

export * from './agentSession';

export interface ChatSessionList {
  sessions: LobeSessions;
}

export interface UpdateSessionParams {
  meta?: any;
  pinned?: boolean;
  updatedAt: Date;
}

export interface SessionRankItem {
  avatar: string | null;
  backgroundColor: string | null;
  count: number;
  id: string;
  title: string | null;
}
