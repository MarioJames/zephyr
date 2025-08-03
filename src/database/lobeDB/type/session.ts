export enum LobeSessionType {
  Agent = "agent",
  Group = "group",
}

export interface SessionRankItem {
  avatar: string | null;
  backgroundColor: string | null;
  count: number;
  id: string;
  title: string | null;
}

export interface ChatSessionList {
  sessions: LobeSessions;
}


/**
 * Lobe Agent
 */
export interface LobeAgentSession {
  config: any;
  createdAt: Date;
  id: string;
  meta: any;
  model: string;
  pinned?: boolean;
  tags?: string[];
  type: LobeSessionType.Agent;
  updatedAt: Date;
}

export type LobeSessions = LobeAgentSession[];
