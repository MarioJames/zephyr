import { StateCreator } from 'zustand';
import { SessionStore } from '@/store/session';
import { INBOX_SESSION_ID, SESSION_CHAT_URL } from '@/const/session';
import { useAgentStore } from '@/store/agent';
import { useChatStore } from '@/store/chat';
import { useGlobalStore } from '@/store/global';

export interface NavigationAction {
  // 切换会话
  switchSession: (sessionId: string) => Promise<void>;
  // 切换到上一个会话
  switchToPreviousSession: () => Promise<void>;
  // 切换到收件箱
  switchToInbox: () => Promise<void>;
  // 添加会话到历史记录
  addToHistory: (sessionId: string) => void;
  // 清除导航历史
  clearHistory: () => void;
  // 设置当前会话
  setCurrentSession: (sessionId?: string) => void;
  // 设置切换状态
  setSwitching: (switching: boolean) => void;
  // 自动切换到最后对话的会话（当URL中没有session参数时）
  autoSwitchToLastSession: () => Promise<void>;
  // 从URL参数初始化session和topic
  initFromUrlParams: () => Promise<void>;
}

export const navigationSlice: StateCreator<
  SessionStore,
  [],
  [],
  NavigationAction
> = (set, get) => ({
  switchSession: async (sessionId: string) => {
    const currentSessionId = get().currentSessionId;

    // 如果切换到相同会话，直接返回
    if (currentSessionId === sessionId) return;

    set({ isSwitching: true });

    try {
      // 添加当前会话到历史记录
      if (currentSessionId) {
        get().addToHistory(currentSessionId);
      }

      // 设置新的当前会话
      set({
        previousSessionId: currentSessionId,
        currentSessionId: sessionId,
        isSwitching: false,
      });

      // 同步 chat store 的 activeId，并请求 topics
      try {
        const chatStore = useChatStore.getState();
        if (chatStore && chatStore.fetchTopics) {
          chatStore.activeSessionId = sessionId;
          chatStore.fetchTopics(sessionId);
        }
      } catch (e) {
        // ignore
      }

      // 获取会话详情并加载相关的智能体和模型信息
      const sessions = get().sessions;
      const existingSession = sessions.find((s) => s.id === sessionId);

      if (sessionId !== INBOX_SESSION_ID) {
        let sessionDetail = existingSession;

        // 如果会话不在缓存中，获取会话详情
        if (!existingSession) {
          sessionDetail = await get().fetchSessionDetail(sessionId);
        }

        // 如果会话有关联的智能体，加载智能体信息和模型详情
        if (sessionDetail?.agent?.id) {
          const agentStore = useAgentStore.getState();

          // 加载智能体信息
          await agentStore.loadAgentById(sessionDetail.agent?.id);

          // 获取当前智能体的模型信息
          const currentAgent = agentStore.currentAgent;
          if (currentAgent?.model && currentAgent?.provider) {
            // 获取模型详情
            await agentStore.fetchModelDetails(
              currentAgent.model,
              currentAgent.provider
            );
          }
        }
      }
    } catch (error) {
      console.error('切换会话失败:', error);
      set({ isSwitching: false });
    }
  },

  switchToPreviousSession: async () => {
    const previousSessionId = get().previousSessionId;
    if (previousSessionId) {
      await get().switchSession(previousSessionId);
    }
  },

  switchToInbox: async () => {
    await get().switchSession(INBOX_SESSION_ID);
  },

  addToHistory: (sessionId: string) => {
    const { navigationHistory, maxHistorySize } = get();

    // 移除重复项
    const filteredHistory = navigationHistory.filter((id) => id !== sessionId);

    // 添加到历史记录开头
    const newHistory = [sessionId, ...filteredHistory];

    // 限制历史记录数量
    if (newHistory.length > maxHistorySize) {
      newHistory.splice(maxHistorySize);
    }

    set({ navigationHistory: newHistory });
  },

  clearHistory: () => {
    set({ navigationHistory: [] });
  },

  setCurrentSession: (sessionId?: string) => {
    const currentSessionId = get().currentSessionId;

    set({
      previousSessionId: currentSessionId,
      currentSessionId: sessionId,
    });

    // 获取会话详情
    if (sessionId && sessionId !== INBOX_SESSION_ID) {
      get().fetchSessionDetail(sessionId);
    }
  },

  setSwitching: (switching: boolean) => {
    set({ isSwitching: switching });
  },

  autoSwitchToLastSession: async () => {
    // 只在浏览器环境中执行
    if (typeof window === 'undefined') return;

    // 检查URL中是否已经有session参数
    const urlParams = new URLSearchParams(window.location.search);
    const sessionParam = urlParams.get('session');
    
    // 如果URL中已经有session参数，不执行自动切换
    if (sessionParam) return;

    // 如果当前已经有活跃会话，不执行自动切换
    const currentSessionId = get().currentSessionId;
    if (currentSessionId) return;

    try {
      // 确保会话列表已经获取
      const { sessions, initialized } = get();
      
      // 如果会话列表未初始化，先获取会话列表
      if (!initialized) {
        await get().fetchSessions();
      }

      // 获取最新的会话列表
      const latestSessions = get().sessions;
      
      // 如果没有会话，不执行切换
      if (latestSessions.length === 0) return;

      // 获取最后对话的会话（按updatedAt排序，取第一个）
      const lastSession = [...latestSessions]
        .sort((a, b) => new Date(b.updatedAt || 0).getTime() - new Date(a.updatedAt || 0).getTime())
        [0];

      // 如果找到最后对话的会话，自动切换
      if (lastSession?.id) {
        console.log('自动切换到最后对话的会话:', lastSession.id, lastSession.title);
        await get().switchSession(lastSession.id);
      }
    } catch (error) {
      console.error('自动切换到最后对话的会话失败:', error);
    }
  },

  initFromUrlParams: async () => {
    // 只在浏览器环境中执行
    if (typeof window === 'undefined') return;

    try {
      // 获取URL参数
      const urlParams = new URLSearchParams(window.location.search);
      const sessionParam = urlParams.get('session');
      const topicParam = urlParams.get('topic');
      const openHistoryParam = urlParams.get('openHistory');

      console.log('URL参数初始化:', { session: sessionParam, topic: topicParam, openHistory: openHistoryParam });

      // 如果有session参数，初始化session
      if (sessionParam) {
        const currentSessionId = get().currentSessionId;
        
        // 如果当前session与URL参数不同，切换session
        if (currentSessionId !== sessionParam) {
          console.log('初始化切换到session:', sessionParam);
          await get().switchSession(sessionParam);
        }

        // 如果有topic参数，需要等待session切换完成后初始化topic
        if (topicParam) {
          // 获取chat store并设置activeTopicId
          const chatStore = useChatStore.getState();
          if (chatStore) {
            console.log('初始化设置topic:', topicParam);
            // 设置活跃的topic ID
            chatStore.activeTopicId = topicParam;
            
            // 确保topic存在于topics列表中
            // 如果topics还未加载，先加载topics
            if (!chatStore.topicsInit) {
              console.log('加载topics列表以验证topic存在性');
              await chatStore.fetchTopics(sessionParam);
            }
            
            // 验证topic是否存在
            const topicExists = chatStore.topics.some(t => t.id === topicParam);
            if (!topicExists) {
              console.warn('Topic不存在于当前session中:', topicParam);
              // 清除无效的topic参数
              chatStore.activeTopicId = undefined;
              // 可选：更新URL移除无效的topic参数
              const newUrl = new URL(window.location.href);
              newUrl.searchParams.delete('topic');
              window.history.replaceState(null, '', newUrl.toString());
            } else {
              console.log('Topic初始化成功:', topicParam);
            }
          }
        }
      } else {
        // 如果没有session参数，执行自动切换到最后对话的逻辑
        await get().autoSwitchToLastSession();
      }

      // 处理openHistory参数
      if (openHistoryParam === 'true') {
        console.log('检测到openHistory=true，打开历史面板');
        const globalStore = useGlobalStore.getState();
        if (globalStore) {
          // 设置面板类型为历史模式
          globalStore.setSlotPanelType('history');
          // 确保面板是打开状态
          globalStore.toggleSlotPanel(true);
        }
      }
    } catch (error) {
      console.error('URL参数初始化失败:', error);
    }
  },
});
