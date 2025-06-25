import { useAgentStore } from '@/store/agent';
import { useChatStore } from '@/store/chat';

export const useInitAgentConfig = () => {
  const sessionId = useChatStore((s) => s.activeId);
  const agentConfig = useAgentStore((s) => s.agentConfig);
  const isAgentConfigLoading = useAgentStore((s) => s.isAgentConfigLoading);

  return { agentConfig, isLoading: isAgentConfigLoading, sessionId };
};
