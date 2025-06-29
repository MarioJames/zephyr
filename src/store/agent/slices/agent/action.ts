import { StateCreator } from 'zustand';
import agentService, {
  AgentItem,
  CreateAgentRequest,
  UpdateAgentRequest,
} from '@/services/agents';
import { AgentStore } from '../../store';
import filesService from '@/services/files';

export interface AgentAction {
  // 智能体CRUD操作
  fetchAgents: () => Promise<void>;
  createAgent: (data: CreateAgentRequest) => Promise<AgentItem>;
  updateAgent: (id: string, data: UpdateAgentRequest) => Promise<void>;
  deleteAgent: (id: string) => Promise<void>;

  // 智能体管理
  setCurrentAgent: (agentId?: string) => void;
  loadAgentById: (id: string) => Promise<void>;

  // 状态管理
  setAgentsLoading: (loading: boolean) => void;
  setAgentsError: (error?: string) => void;

  /**
   * 上传智能体头像（公共图片）
   * @param file File
   * @returns Promise<string> 图片URL
   */
  uploadAvatar: (file: File) => Promise<string>;
}

export const agentSlice: StateCreator<AgentStore, [], [], AgentAction> = (
  set,
  get
) => ({
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

  createAgent: async (data: any) => {
    set({ isLoading: true, error: undefined });
    try {
      // 组装为 CreateAgentRequest
      const req: CreateAgentRequest = {
        title: data.title,
        description: data.description,
        avatar: data.avatar,
        model: data.model,
        // prompt 字段映射到 systemRole
        systemRole: data.prompt,
        // 组装 chatConfig
        chatConfig: {
          temperature: data.temperature,
          autoCreateTopicThreshold: 4, // 可根据需要调整
        },
        params: {
          maxTokens: data.maxTokens,
        },
      };
      const newAgent = await agentService.createAgent(req);
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

  updateAgent: async (id: string, data: any) => {
    set({ isLoading: true, error: undefined });
    try {
      // 组装为 UpdateAgentRequest
      const req: UpdateAgentRequest = {
        id,
        title: data.title,
        description: data.description,
        avatar: data.avatar,
        model: data.model,
        systemRole: data.prompt,
        chatConfig: {
          temperature: data.temperature,
          autoCreateTopicThreshold: 4, // 可根据需要调整
        },
        params: {
          maxTokens: data.maxTokens,
        },
      };
      const updatedAgent = await agentService.updateAgent(id, req);
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

  setCurrentAgent: (agentId?: string) => {
    const state = get();
    const agent = agentId
      ? state.agents.find((a) => a.id === agentId)
      : undefined;

    set({
      currentAgent: agent,
    });

    // 如果设置了智能体但没有加载配置，则加载配置
    if (agent?.chatConfig) {
      set({
        agentChatConfig: {
          ...state.agentChatConfig,
          ...agent.chatConfig,
        },
      });
    }
  },

  loadAgentById: async (id: string) => {
    set({ isAgentConfigLoading: true, error: undefined });
    try {
      const agentDetail = await agentService.getAgentDetail(id);

      // 更新智能体信息
      set((state) => ({
        currentAgentId: id,
        currentAgent: {
          ...agentDetail,
          id: agentDetail.id,
          title: agentDetail.title,
          avatar: agentDetail.avatar,
          description: agentDetail.description,
          model: agentDetail.model,
          provider: agentDetail.provider,
          systemRole: agentDetail.systemRole,
        } as AgentItem,
        isAgentConfigLoading: false,
        error: undefined,
      }));
    } catch (error) {
      console.error('Failed to load agent:', error);
      set({
        isAgentConfigLoading: false,
        error: error instanceof Error ? error.message : 'Failed to load agent',
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
      const res = await filesService.uploadPublic({ file, directory: 'avatar' });
      return res.url;
    } catch (e: any) {
      throw new Error(e?.message || '头像上传失败');
    }
  },
});
