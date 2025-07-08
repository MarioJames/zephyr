import { StateCreator } from 'zustand';
import agentService, {
  AgentItem,
  CreateAgentRequest,
  UpdateAgentRequest,
} from '@/services/agents';
import { AgentStore } from '../../store';
import filesService from '@/services/files';
import sessionsService from '@/services/sessions';

export interface AgentCoreAction {
  // 智能体CRUD操作
  fetchAgents: () => Promise<void>;
  createAgent: (data: CreateAgentRequest) => Promise<AgentItem>;
  updateAgent: (id: string, data: UpdateAgentRequest) => Promise<void>;
  deleteAgent: (id: string) => Promise<void>;

  // 状态管理
  setAgentsLoading: (loading: boolean) => void;
  setAgentsError: (error?: string) => void;
  isDeleting: boolean;

  /**
   * 上传智能体头像（公共图片）
   * @param file File
   * @returns Promise<string> 图片URL
   */
  uploadAvatar: (file: File) => Promise<string>;

  /**
   * 转移客户类型下所有会话到新类型
   * @param fromAgentId 当前要删除的 agentId
   * @param toAgentId 目标 agentId
   */
  transferSessionsToAgent: (
    fromAgentId: string,
    toAgentId: string
  ) => Promise<void>;
}

export const agentCoreSlice: StateCreator<
  AgentStore,
  [],
  [],
  AgentCoreAction
> = (set, get) => ({
  isDeleting: false,
  fetchAgents: async () => {
    set({ isLoading: true, error: undefined });
    try {
      const agents = await agentService.getAgentList();
      set({
        agents,
        agentsInit: true,
        isLoading: false,
        error: undefined,
      });
    } catch (error) {
      console.error('Failed to fetch agents:', error);
      set({
        isLoading: false,
        error:
          error instanceof Error ? error.message : 'Failed to fetch agents',
        agentsInit: true,
      });
    }
  },

  createAgent: async (data: CreateAgentRequest) => {
    set({ isLoading: true, error: undefined });
    try {
      const newAgent = await agentService.createAgent(data);
      set((state) => ({
        agents: [newAgent, ...state.agents],
        isLoading: false,
        error: undefined,
      }));
      return newAgent;
    } catch (error) {
      console.error('Failed to create agent:', error);
      set({
        isLoading: false,
        error:
          error instanceof Error ? error.message : 'Failed to create agent',
      });
      throw error;
    }
  },

  updateAgent: async (id: string, data: UpdateAgentRequest) => {
    set({ isLoading: true, error: undefined });
    try {
      const updatedAgent = await agentService.updateAgent(id, data);
      set((state) => ({
        agents: state.agents.map((agent) =>
          agent.id === id ? updatedAgent : agent
        ),
        currentAgent:
          state.currentAgent?.id === id ? updatedAgent : state.currentAgent,
        isLoading: false,
        error: undefined,
      }));
    } catch (error) {
      console.error('Failed to update agent:', error);
      set({
        isLoading: false,
        error:
          error instanceof Error ? error.message : 'Failed to update agent',
      });
      throw error;
    }
  },

  deleteAgent: async (id: string) => {
    set({ isLoading: true, error: undefined });
    try {
      await agentService.deleteAgent(id);
      set((state) => ({
        agents: state.agents.filter((agent) => agent.id !== id),
        currentAgent:
          state.currentAgent?.id === id ? undefined : state.currentAgent,
        isLoading: false,
        error: undefined,
      }));
    } catch (error) {
      console.error('Failed to delete agent:', error);
      set({
        isLoading: false,
        error:
          error instanceof Error ? error.message : 'Failed to delete agent',
      });
      throw error;
    }
  },

  setAgentsLoading: (loading: boolean) => {
    set({ isLoading: loading });
  },

  setAgentsError: (error?: string) => {
    set({ error });
  },

  /**
   * 上传智能体头像（公共图片）
   * @param file File
   * @returns Promise<string> 图片URL
   */
  uploadAvatar: async (file: File) => {
    try {
      const res = await filesService.uploadPublic({
        file,
        directory: 'avatar',
      });
      return res.url;
    } catch (e: any) {
      throw new Error(e?.message || '头像上传失败');
    }
  },

  /**
   * 转移客户类型下所有会话到新类型
   * @param fromAgentId 当前要删除的 agentId
   * @param toAgentId 目标 agentId
   */
  transferSessionsToAgent: async (fromAgentId: string, toAgentId: string) => {
    console.log('transferSessionsToAgent agent slice action');
    set({ isDeleting: true });
    
    try {
      // 1. 查找当前 agent 下所有 session
      const res = await sessionsService.getSessionList({
        agentId: fromAgentId,
        page: 1,
        pageSize: 100,
      });
      const sessionIds = res.sessions.map((s: any) => s.id);
      if (!sessionIds.length) {
        await get().deleteAgent(fromAgentId);
        set({ isDeleting: false });
        return;
      }
      // 2. 批量更新 session 的 agentId
      const updateList = sessionIds.map((id: string) => ({
        id,
        agentId: toAgentId,
      }));
      await sessionsService.batchUpdateSessions(updateList);
      await get().deleteAgent(fromAgentId);
    } catch (error) {
      console.error('Failed to transfer sessions:', error);
      throw error;
    } finally {
      set({ isDeleting: false });
    }
  },
});
