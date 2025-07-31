import { StateCreator } from 'zustand';
import { AgentStore } from '../../store';
import { AgentChatConfig } from '@/types/agent';

export interface ConfigAction {
  // 配置管理
  updateAgentConfig: (config: Partial<AgentChatConfig>) => void;
  resetAgentConfig: () => void;
  setConfigLoading: (loading: boolean) => void;

  // 特定配置更新
  updateDisplayMode: (mode: 'chat' | 'docs') => void;
  updateHistoryCount: (count: number) => void;
  updateTemperature: (temp: number) => void;
  toggleHistoryCount: () => void;
  toggleAutoCreateTopic: () => void;
  toggleCompressHistory: () => void;
  toggleHistoryDivider: () => void;
}

export const configSlice: StateCreator<AgentStore, [], [], ConfigAction> = (
  set
) => ({
  updateAgentConfig: (config: Partial<AgentChatConfig>) => {
    set((state) => ({
      agentChatConfig: {
        ...state.agentChatConfig,
        ...config,
      },
    }));
  },

  resetAgentConfig: () => {
    const { initialState } = require('../../initialState');
    set({ agentChatConfig: initialState.agentChatConfig });
  },

  setConfigLoading: (loading: boolean) => {
    set({ isAgentConfigLoading: loading });
  },

  updateDisplayMode: (mode: 'chat' | 'docs') => {
    set((state) => ({
      agentChatConfig: {
        ...state.agentChatConfig,
        displayMode: mode,
      },
    }));
  },

  updateHistoryCount: (count: number) => {
    set((state) => ({
      agentChatConfig: {
        ...state.agentChatConfig,
        historyCount: count,
      },
    }));
  },

  updateTemperature: (temp: number) => {
    set((state) => ({
      agentChatConfig: {
        ...state.agentChatConfig,
        temperature: temp,
      },
    }));
  },

  toggleHistoryCount: () => {
    set((state) => ({
      agentChatConfig: {
        ...state.agentChatConfig,
        enableHistoryCount: !state.agentChatConfig.enableHistoryCount,
      },
    }));
  },

  toggleAutoCreateTopic: () => {
    set((state) => ({
      agentChatConfig: {
        ...state.agentChatConfig,
        enableAutoCreateTopic: !state.agentChatConfig.enableAutoCreateTopic,
      },
    }));
  },

  toggleCompressHistory: () => {
    set((state) => ({
      agentChatConfig: {
        ...state.agentChatConfig,
        enableCompressHistory: !state.agentChatConfig.enableCompressHistory,
      },
    }));
  },

  toggleHistoryDivider: () => {
    set((state) => ({
      agentChatConfig: {
        ...state.agentChatConfig,
        enableHistoryDivider: !state.agentChatConfig.enableHistoryDivider,
      },
    }));
  },
});
