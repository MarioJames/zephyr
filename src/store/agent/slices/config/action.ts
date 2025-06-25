import { StateCreator } from 'zustand';
import { AgentStore } from '../../store';
import { AgentChatConfig } from './initialState';

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

export const configSlice: StateCreator<
  AgentStore,
  [],
  [],
  ConfigAction
> = (set, get) => ({
  updateAgentConfig: (config: Partial<AgentChatConfig>) => {
    set((state) => ({
      agentConfig: {
        ...state.agentConfig,
        ...config,
      },
    }));
  },

  resetAgentConfig: () => {
    const { initialState } = require('../../initialState');
    set({ agentConfig: initialState.agentConfig });
  },

  setConfigLoading: (loading: boolean) => {
    set({ isAgentConfigLoading: loading });
  },

  updateDisplayMode: (mode: 'chat' | 'docs') => {
    set((state) => ({
      agentConfig: {
        ...state.agentConfig,
        displayMode: mode,
      },
    }));
  },

  updateHistoryCount: (count: number) => {
    set((state) => ({
      agentConfig: {
        ...state.agentConfig,
        historyCount: count,
      },
    }));
  },

  updateTemperature: (temp: number) => {
    set((state) => ({
      agentConfig: {
        ...state.agentConfig,
        temperature: temp,
      },
    }));
  },

  toggleHistoryCount: () => {
    set((state) => ({
      agentConfig: {
        ...state.agentConfig,
        enableHistoryCount: !state.agentConfig.enableHistoryCount,
      },
    }));
  },

  toggleAutoCreateTopic: () => {
    set((state) => ({
      agentConfig: {
        ...state.agentConfig,
        enableAutoCreateTopic: !state.agentConfig.enableAutoCreateTopic,
      },
    }));
  },

  toggleCompressHistory: () => {
    set((state) => ({
      agentConfig: {
        ...state.agentConfig,
        enableCompressHistory: !state.agentConfig.enableCompressHistory,
      },
    }));
  },

  toggleHistoryDivider: () => {
    set((state) => ({
      agentConfig: {
        ...state.agentConfig,
        enableHistoryDivider: !state.agentConfig.enableHistoryDivider,
      },
    }));
  },
});